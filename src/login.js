
const AWS = require('aws-sdk');

   
   const UserPoolId =process.env.user_pool_id;
    const ClientId =process.env.client_id;

  
    const cognito = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });


module.exports.lambdaFunction = async (event) => {
  const {email, password} = JSON.parse(event.body);
  const params = {
    UserPoolId,
    ClientId,
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    AuthParameters: { USERNAME: email, PASSWORD: password },
  };
   

return new Promise((resolve) => 
cognito.adminInitiateAuth(params, function (err, result) {
  if (err) {
      resolve({
          statusCode: err.statusCode,
          body: JSON.stringify(err),
           headers: {
           'Access-Control-Allow-Origin': '*',
          }
        });
  } else {
      resolve({
          statusCode: 200,
          body: JSON.stringify(result),
           headers: {
           'Access-Control-Allow-Origin': '*',
          }
        });
  }
   })
 
    );
}


