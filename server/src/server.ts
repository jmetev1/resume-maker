import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
const app = express();
dotenv.load();
const development = process.env.NODE_ENV === 'development';
const reload = development ? require('reload') : 'n';
import http from 'http';
import bodyParser from 'body-parser';
import session from 'express-session';
import MongoSession from 'connect-mongodb-session'
const MongoDBStore = MongoSession(session);
import fileupload from 'express-fileupload';
import { getSignedUrl, receipt } from './aws';
import { addClinic, addProvider, addVisit, getClinic, getTotalsByRep, getVisits, providersByRep, sign, spendingByDoctor } from './db';
import authentication from './cognito';

const store = new MongoDBStore({
  uri: `mongodb+srv://${process.env.DBusername}:${process.env.DBPW}@poolmap.ppvei.mongodb.net/poolmap?retryWrites=true&w=majority`,
  databaseName: 'poolmap',
  collection: 'mySessions',
},
  (err) => {
    console.log(' session store err', err);
  }
);

store.on('error', (error) => {
  console.log('error other', error);
});

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'https://expensehawk.com',
  optionsSuccessStatus: 200,
  credentials: true,
  preflightContinue: true,
};

app.set('port', process.env.PORT || 3000);
app.set("trust proxy", 1); // trust first proxy

app.use(
  cors(corsOptions),
  session({
    name: 'server-session-cookie-id',
    secret: process.env.SESSION_SECRET,
    store,
    cookie: {
      secure: false,
      httpOnly: false,
      // sameSite: 'strict'// no browser works
      sameSite: 'lax'
    },
    saveUninitialized: true,
    proxy: true, // if you do SSL outside of node.
    resave: false,
  }),
  fileupload(),
  bodyParser.json()
);
app.get('/api/logout', (req, res) => {
  req.session.rep = null;
  res.send(JSON.stringify('ok'));
});

/* in past we used usernames for everything in database. now
that we're using cognito, we have these ids. but for old
users we need to map to old region or rep name
*/
const idToOldUsername = (id): string => ({
  jmetevier: 'jpm',
  mss: 'mss'
}[id] || id);

app.post('/api/login', (req, res, _next) => {
  const oldUsername = idToOldUsername(req.body.username);
  const { jwtToken } = req.body;
  authentication(jwtToken).then(() => {

    req.session.rep = oldUsername;
    res.json(true);
  }).catch((err) => {
    console.log('err', err);
    res.status(401).json(false);
  });
})

app.use(
  function autho(req, res, next) {
    const rep = req?.session?.rep;
    if (req.method === 'OPTIONS') {
      return next()
    }
    else if (rep) {
      return next()
    } else {
      console.log(67, 'no rep!')
      return res.status(401).send({ message: 'Unauthorized' });
    }
  }
);

process.on('uncaughtException', (err) => {
  console.error('global exception:', err.message);
});

app.get('/api/totalsForProviders', async (req, res) => {
  const totals = await getTotalsByRep(req.session.rep);
  res.json(totals.sort(({ amount }, b) => b.amount - amount));
});

app.post('/api/sign', async (req, res) => {
  const { id, status } = req.body;
  res.json(await sign(req.session.rep, status, id));
});


app.get('/api/visits', async (_req, res) => {
  const allVisits = await getVisits();
  res.json(allVisits);
});

app.get('/api/getproviders', async (req, res) => {
  res.json(await providersByRep(req.session.rep));
});

app.get('/api/getSpendingByDoctor/:clinicID', async (req, res) => {
  res.json(await spendingByDoctor(req.session.rep, req.params.clinicID));
});

app.post('/api/provider', async ({ body, ...rest }, res) => {
  res.json(
    await addProvider({
      ...body,
      rep: rest.session.rep,
    })
  );
});

app.post('/api/getUploadURL', async ({ body }, res, _next) => {
  // console.log({ body });
  getSignedUrl(body.filename).then((url) => {
    res.json({ url });
  });
});

app.get('/api/error', () => {
  throw new Error('This is an error and it should be logged to the console');
});

app.get('/api/crash/sync',
  () => {
    // plain synchronous error
    console.log('before throwing sync error');
    throw new Error('This is a test error from middleware (crasher)');
  }
);

function crash(): Error {
  console.log('before async crash');
  throw new Error('This is a test async error (crasher)');
}
// not catching
app.get('/crash/async',
  () => {
    setTimeout(crash, 500);
  });

// app.get('/crash/promise', require('crasher/promise'))
// app.get('/api/crash-async', (req, res) => {
//   console.log('async crashing');
//   setTimeout(() => {
//     throw new Error('Async error');
//   }, 100);
//   // this code runs fine
//   res.send('after async crash\n');
// });

app.get('/api/receipt/:receiptID', async (req, res, next) => {
  const { receiptID } = req.params;
  receipt(receiptID)
    .then(({ ContentType, Body }) => {
      res.contentType(ContentType);
      res.send(Body);
    })
    .catch(next);
});

app.post('/api/visit', async (req, res) => {
  const addVisitResult = await addVisit({
    ...req.body,
    rep: req.session.rep,
    photoLocation: 's3',
  });
  res.json(addVisitResult);
});

app.post('/api/clinic', async (req, res) =>
  res.json(
    await addClinic({
      ...req.body,
      rep: req.session.rep,
    })
  )
);

app.get('/api/clinic', async (req, res) => {
  const allClinics = await getClinic(req.session.rep);
  // console.log({ allClinics });
  res.send(JSON.stringify(allClinics));
});

// don't take the next out!!
// eslint-disable-next-line
app.use((err, _, res, _next) => {
  if (err) {
    console.log('middleware', err);

    res.status(err.status || 500);
    res.json(err.message);
  }
});
const server = http.createServer(app);

if (development) {
  console.log('dev env');
  reload(app)
    .then(() => {
      server.listen(app.get('port'), () => {
        console.log(`Web server listening on port ${app.get('port')}`);
      });
    })
    .catch((err) => {
      console.error(
        'Reload could not start, could not start server/sample app',
        err
      );
    });
} else {
  console.log('NOT dev env');

  app.get('*', (_, res) => {
    res.send('def an html page');
  });
  server.listen(app.get('port'), () => {
    console.log(`Web server listening on port ${app.get('port')}`);
  });
}
// adminGetUser()
module.exports = app;
