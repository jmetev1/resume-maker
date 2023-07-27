import axios from 'axios'

const COGNITO_URL = `https://cognito-idp.us-east-2.amazonaws.com/`;

const authentication = async (accessToken) => {
  try {
    // console.log({ accessToken })
    const { data } = await axios.post(
      COGNITO_URL,
      {
        AccessToken: accessToken
      },
      {
        headers: {
          "Content-Type": "application/x-amz-json-1.1",
          "X-Amz-Target": "AWSCognitoIdentityProviderService.GetUser"
        }
      }
    )

    // req.user = data;
    const { UserAttributes } = data
    console.log({ UserAttributes })
    // console.log(      UserAttributes)
    // next();
  } catch (error) {
    console.log({ error })
    throw error;
    // return res.status(401).json({
    //     message: 'Auth failed'
    // });
  }
};

export default authentication;