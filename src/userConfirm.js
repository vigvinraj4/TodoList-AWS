const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const AWS = require('aws-sdk');


var poolData = {    
    UserPoolId : process.env.user_pool_id,
    ClientId :process.env.client_id 
  }; 
  
  const cognitoUserPool = () => ( new AmazonCognitoIdentity.CognitoUserPool(poolData));


module.exports.lambdaFunction = async (event) => {
  const {email, cofirmationCode} = JSON.parse(event.body);
    const userPool= cognitoUserPool();
  const userData = {
    Username: email,
    Pool: userPool
  };
var cognitoUsers = new AmazonCognitoIdentity.CognitoUser(userData);
    console.log(email);
    console.log(cofirmationCode)

      return new Promise((resolve, reject) => 
      cognitoUsers.confirmRegistration(cofirmationCode, true, function (err, result) {
        if (err) {
            resolve({
                statusCode: err.statusCode,
                body: JSON.stringify("account could not be confirmed"),
                 headers: {
                 'Access-Control-Allow-Origin': '*',
                }
              });
        } else {
            resolve({
                statusCode: 200,
                body: JSON.stringify("user has account has been confirmed "),
                 headers: {
                 'Access-Control-Allow-Origin': '*',
                }
              });
        }
         })
       
          );
     
   }
