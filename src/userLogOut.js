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
    console.log(cognitoUsers)

      return new Promise((resolve, reject) => {
      
         if (cognitoUsers !=null) {

          cognitoUsers.signOut();
            resolve({
                statusCode: 200,
                body: JSON.stringify("user has signed out of the account sucessfully"),
                 headers: {
                 'Access-Control-Allow-Origin': '*',
                }
              });
        } else {
            resolve({
                statusCode: 404,
                body: JSON.stringify("user account could not be found"),
                 headers: {
                 'Access-Control-Allow-Origin': '*',
                }
              });
        }
         });
       
         
     
   }
