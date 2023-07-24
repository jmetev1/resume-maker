const dotenv = require('dotenv');

dotenv.load();

// export const url = "http://pglebapp.mqhhuyuruj.us-east-2.elasticbeanstalk.com/"

const dev = process.env.NODE_ENV === 'development';
export const url = dev ? 'http://localhost:3000/api/' : 'https://goldfish-app-2-kbthc.ondigitalocean.app/api/'
console.log({ url })

// export const url = process.env.REACT_APP.local_host === 'true' ?
// '/api/'
// export const url = process.env.REACT_APP_PROD_DATA ? '/' : "http://localhost:3001/"
export const getMyClinics = () =>
  fetch(url + 'clinic', { method: 'GET' }).then(r => r.json());
// export const automatic = true;
export const automatic = false;
