const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const AWS = require('aws-sdk');


var poolData = {    
    UserPoolId : process.env.user_pool_id,
    ClientId :process.env.client_id 
  }; 
  
  const cognitoUserPool = () => ( new AmazonCognitoIdentity.CognitoUserPool(poolData));


module.exports.lambdaFunction = async (event) => {
  const {email} = JSON.parse(event.body);
    const userPool= cognitoUserPool();
  const userData = {
    Username: email,
    Pool: userPool
  };
var cognitoUsers = new AmazonCognitoIdentity.CognitoUser(userData);
    console.log(email);


      return new Promise((resolve, reject) => 
      cognitoUsers.resendConfirmationCode(function (err, result) {
        if (err) {
            resolve({
                statusCode: err.statusCode,
                body: JSON.stringify("account could not be found for the Given id"),
                 headers: {
                 'Access-Control-Allow-Origin': '*',
                }
              });
        } else {
            resolve({
                statusCode: 200,
                body: JSON.stringify("cofirmation code has been sent to specified email"),
                 headers: {
                 'Access-Control-Allow-Origin': '*',
                }
              });
        }
         })
       
          );
     
   }
