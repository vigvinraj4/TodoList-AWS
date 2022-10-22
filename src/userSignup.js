const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const AWS = require('aws-sdk');


const poolData = {    
  UserPoolId : process.env.user_pool_id,
  ClientId :process.env.client_id 
}; 

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
module.exports.lambdaFunction = async (event) => {
  const {email, password, phone} = JSON.parse(event.body);

    console.log(email);
    console.log(password)

  
    var attributeList = [];
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"email",Value:email}));
var result;
    try{
      return new Promise((resolve, reject) =>
      userPool.signUp(email, password, attributeList, null, (err, result) => {
        console.log(err)
        if (err) {
          reject(err);
        } else {
          resolve({
          statusCode: 200,
          body: JSON.stringify("user has been created sucessfully "+ result),
           headers: {
           'Access-Control-Allow-Origin': '*',
          }
        });
        }
      })
    );
     
    }
    
    catch (err){
      // Log errors
      console.error(`[${err.name}] ${err.message}`);
      // Return no error messages to keep the internals of the system private
      return {
        statusCode: 500,
        body: JSON.stringify(err),
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
    };
  }
    
};
