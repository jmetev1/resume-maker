const dotenv = require('dotenv');

dotenv.load();

// export const url = "http://pglebapp.mqhhuyuruj.us-east-2.elasticbeanstalk.com/"


// export const url = 'https://goldfish-app-2-kbthc.ondigitalocean.app/'
export const url = 'http://localhost:3001/api/'
// export const url = '/api/'

// export const url = process.env.REACT_APP.local_host === 'true' ?
// '/api/'
// export const url = process.env.REACT_APP_PROD_DATA ? '/' : "http://localhost:3001/"
export const getMyClinics = () =>
  fetch(url + 'clinic', { method: 'GET' }).then(r => r.json());
// export const automatic = true;
export const automatic = false;
