import mongoose from 'mongoose';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import fs from 'fs';
dotenv.load();
import { models } from './models';
import type { Provider } from './models';
const {
  ReceiptModel,
  VisitModel,
  ProviderModel,
  ClinicModel,
  UserModel } = models;
mongoose
  .connect(
    // `mongodb://${process.env.DBusername}:${process.env.DBPW}@ds127783.mlab.com:27783/poolmap`,
    `mongodb+srv://${process.env.DBusername}:${process.env.DBPW}@poolmap.ppvei.mongodb.net/poolmap?retryWrites=true&w=majority`,
    { connectTimeoutMS: 1000, useUnifiedTopology: true, useNewUrlParser: true }
  )
  .then(
    () => {
      console.log('db success');
    },
    (err) => {
      console.log('real database connection error', err);
    }
  );
const db = mongoose.connection;
db.on('error', (e) => {
  // databaseError = e;
  console.log('db error', e);
});

export const sign = async (region, status, id) => {
  const user = (await UserModel.find({ region }))[0];
  const attest = await user.attests.id(id);
  attest.signed = status;
  await user.save();
  return user.attests;
};

// const getLastMonth = (today) => {
//   const thisMonth = today.getMonth();
//   let lastMonth;
//   if (thisMonth === 0) {
//     lastMonth = `11/${today.getFullYear() - 1}`;
//   } else {
//     lastMonth = `${today.getMonth() - 1}/${today.getFullYear()}`;
//   }
//   return lastMonth;
// };

// export const getUser = async (region) => {
//   // const users = await UserModel.find({ region });
//   // let user;
//   throw new Error('repeat users');
//   // if (users.length > 1)
//   // else if (users.length === 0) user = await UserModel.create({ region });
//   // else [user] = users;
//   // const attests = [{ signed: 'failed', date: 'failed' }];
//   // try {
//   //   const lastMonth = getLastMonth(new Date());
//   //   const copyAttests = [...user.attests];
//   //   const alreadyExists = copyAttests.some(
//   //     (attest) => attest.date === lastMonth
//   //   );
//   //   if (!alreadyExists) {
//   //     const attestToAdd = await AttestModel.create({
//   //       date: lastMonth,
//   //       signed: false,
//   //     });
//   //     user.attests.addToSet(attestToAdd);
//   //     await user.save();
//   //   }
//   // } catch (e) {
//   //   user.attests = attests;
//   // }
//   // return user;
// };

export const addProvider = async (req) => ProviderModel.create(req);

// returns an object mapping clinics to providers.
export const providersByRep = async (rep) => {
  const allProviders = await ProviderModel.find({ rep });
  return allProviders.reduce((acc, c) => {
    const { clinic } = c;
    if (acc[clinic]) acc[clinic].push(c);
    else acc[clinic] = [c];
    return acc;
  }, {});
};

export const getClinic = async (rep) =>
  ClinicModel.find(rep === 'admin' ? {} : { rep });

// const allProvidersForRep = (rep) => ProviderModel.find({ rep });

export const getTotalsByRep = async (rep) => {
  const query: { rep?: string } = {};
  if (rep !== 'admin') query.rep = rep;

  const [repsProviders, repsClinics] = await Promise.all([
    ProviderModel.find(query),
    ClinicModel.find(query),
  ]);

  const clinicIDtoName = repsClinics.reduce((acc, { id, name }) => {
    acc[id] = name;
    return acc;
  }, {});

  const providersIDs = repsProviders.map((p) => p._id);
  const totals = await totalsForProviders(providersIDs, clinicIDtoName);

  const desiredReps = new Set(
    rep === 'admin' ? ['las', 'lan', 'msn', 'mss'] : [rep]
  );

  return Object.values(totals).filter((total: { rep: string }) => desiredReps.has(total.rep));
};

export const totalsForProviders = async function (providers, clinicIDtoName?): Promise<{
  [key: string]: Provider & { amount: number, clinicName?: string }
}> {
  const year = new Date().getFullYear();
  const min = `${year}-01-01`;
  const max = `${year}-12-31`;
  const visits = await VisitModel.find({
    date: { $gte: min, $lte: max },
    providers: {
      $in: providers,
    },
  });

  const spendingByDoctor = visits.reduce((acc, c) => {
    c.providers.forEach((p) => {
      acc[p] = (acc[p] || 0) + (c.amountSpent / c.providers.length);
    });
    return acc;
  }, {});

  const myProviders = await ProviderModel.find();
  myProviders.forEach(({ name: providerName, _id, rep, clinic }) => {
    const amount = spendingByDoctor[_id];
    if (amount != null) {
      spendingByDoctor[_id] = {
        amount,
        name: providerName,
        _id,
        rep,
        ...(clinicIDtoName && { clinicName: clinicIDtoName[clinic] }),
      };
    }
  });
  return spendingByDoctor;
};

export const addPhoto = (name) =>
  ReceiptModel.create({
    name,
    img: {
      data: fs.readFileSync(`./receipts/${name}.png`),
      contentType: 'image/png',
    },
  });

export const receipt = (_id) =>
  ReceiptModel.find({ _id }).then(([doc]) => {
    if (doc) {
      return {
        ContentType: doc.img.contentType,
        Body: doc.img.data,
      };
    }
    return Promise.reject(new Error('no mongo receipt found here'));
  });

export const addClinic = async (req) => ClinicModel.create(req);

export const spendingByDoctor = async (rep, clinic) => {
  const query = rep === 'admin' ? {} : { rep };
  const year = new Date().getFullYear();
  const min = `${year}-01-01`;
  const max = `${year}-12-31`;
  const myVisitsThisYear = await VisitModel.find({
    ...query,
    date: { $gte: min, $lte: max },
    clinic: clinic || null,
  });
  const spendingByDoctor = myVisitsThisYear.reduce((acc, c) => {
    const { providers, amountSpent } = c;
    providers.forEach((p) => {
      acc[p] = (acc[p] || 0) + amountSpent / providers.length;
    });
    return acc;
  }, {});
  const myProviders = await ProviderModel.find(query);
  myProviders.forEach(({ name, _id }) => {
    const amount = spendingByDoctor[_id];
    if (amount !== undefined) {
      spendingByDoctor[_id] = {
        amount,
        name,
      };
    }
  });
  return spendingByDoctor;
};

export const addVisit = async (body) => {
  const { _id, providers } = await VisitModel.create(body);
  if (_id) {
    let emailRes;
    totalsForProviders(providers)
      .then(totals => {
        checkMaxAndEmail(body.rep, totals, body)
          .then(res => { emailRes = res; });
      });
    console.log(emailRes);

    return { _id };
  }
  return 'db create failed';
};

const emailByRep = {
  mss: 'sizdepski@physiciansgrouplaboratories.com',
  msn: 'jbarre@physiciansgrouplaboratories.com',
  lan: 'hbroussard@getpgl.com',
  las: 'bbauder@physiciansgrouplaboratories.com',
  andrewtest: 'ayeates@physiciansgrouplaboratories.com',
  elyse: 'Ealford@providerschoicelab.com',
  // awiggin: 'a.wiggin+pglapp@icloud.com',
  test: '',
  jack: ''
};

const realReps = ['mss', 'msn', 'lan', 'las', 'awiggin', 'elyse'];

const j = 'a.wiggin+pglapp@icloud.com';
emailByRep.test = j;
emailByRep.jack = j;

const sendEmail = msg => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  sgMail
    .send(msg)
    .then(
      res => console.log(`Message sent with ${res}`),
      error => console.log(`Failed to send sendgrid email with ${error}`, error.response ? error.response.body : ''));
};

const setupEmail = (providers, rep, { clinicName, amountSpent }) =>
  providers.map(async (ar) => {
    const { amount: totalForYear, name } = Array.isArray(ar) && ar[1];

    const addresses = [emailByRep[rep] || 'j.metevier+pglapp@gmail.com'];
    const msg = {
      to: addresses,
      from: 'PGL_Monitoring_app@marypmatthews.net',
      subject: 'Approaching provider spending limit',
      html: `<div>Rep ${rep} just spent $${amountSpent} on ${name} at ${clinicName}. This brings total spending for ${name} to $${totalForYear}. </div>`,
    };
    console.log('sending msg', msg);
    if (totalForYear > 399 && realReps.includes(rep)) {
      msg.subject = 'Exceeded provider spending limit';
      msg.to.push('ayeates@physiciansgrouplaboratories.com');
    }
    await sendEmail(msg);
    return msg;
  });

export const checkMaxAndEmail = async (rep, spendingByDoctor, newVisit) => {
  const maxSpend = 350;
  const overLimit = [];
  Object.entries(spendingByDoctor).forEach(function (spending: [string, { amount: number }]) {
    const [key, value] = spending;
    if (value.amount > maxSpend) {
      overLimit.push([key, value]);
    }
  });
  return overLimit.length
    ? setupEmail(overLimit, rep, newVisit)
    : 'no email sent';
};

/* we stopped searching by rep so that we can return all for admin view. i think we sort it out on
 front end
*/
export const getVisits = async () =>
  // const repToUse = rep === 'admin' ? {} : { rep };
  // console.log({ rep }, 'ronald');
  // return VisitModel.find(repToUse);
  VisitModel.find({});

export const getVisitsThisYear = async (rep) => {
  const year = new Date().getFullYear();
  const query: {
    date: {
      $gte: string, $lte: string
    }
    rep?: string
  } = {
    date: { $gte: `${year}-01-01`, $lte: `${year}-12-31` },
  };
  if (rep !== 'admin') query.rep = rep;
  return VisitModel.find(query);
};

// (async () => {
//   const year = new Date().getFullYear();
//   const min = `${year}-01-01`;
//   const max = `${year}-12-31`;
//   const visits = await VisitModel.find({
//     // date: { $gte: min, $lte: max }
//   });
//   const reps = visits.reduce((acc, cur) => {
//     const { rep } = cur;
//     if (!rep) {
//       acc.none = (acc.none || 0) + 1;
//     } else if (acc[rep]) {
//       acc[rep] += 1;
//     } else {
//       acc[rep] = 1;
//     }
//     return acc;
//   }, {});
//   console.log(reps);
//   // // console.log(providers);
//   // const totalsForProvidersArray = Object.values(await exports.totalsForProviders(providers));
//   // // console.log(totalsForProvidersArray);
//   // console.log(totalsForProvidersArray.sort((a, b) => b.amount - a.amount));
//   // // exports.checkMaxAndEmail('test', totalsForProviders, )
// })();
// (async () => {
//   const providers = (await allProvidersForRep('lan')).map(obj => obj._id);
//   // console.log(providers);
//   const totalsForProvidersArray = Object.values(await exports.totalsForProviders(providers));
//   // console.log(totalsForProvidersArray);
//   console.log(totalsForProvidersArray.sort((a, b) => b.amount - a.amount));
//   // exports.checkMaxAndEmail('test', totalsForProviders, )
// })();
/*
las
24 visits this year
94 all time
max 211 this year.

lan
no data for this year

mss no overages

msn
no overages

{
  nm: 16,
  null: 2,
  jacktest: 15,
  test: 117,
  las: 94,
  mss: 53,
  lan: 37,
  msn: 195,
  jpm: 18,
  jack: 1,
  awiggin: 16
}
*/
