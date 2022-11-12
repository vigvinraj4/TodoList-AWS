const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const AWS = require('aws-sdk');


const poolData = {    
  UserPoolId : process.env.user_pool_id,
  ClientId :process.env.client_id 
}; 

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
module.exports.lambdaFunction = async (event) => {
  const {email, password, name} = JSON.parse(event.body);

    console.log(email);
    console.log(password)

  
    var attributeList = [];
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"email",Value:email}));

    try{
     

      let results = () => {
        return new Promise((resolve, reject) =>
      userPool.signUp(email, password, attributeList, null, (err, result) => {
        console.log(err)
        if (err) {
          reject(err);
        } else {
          resolve({
          data: JSON.stringify(result.userSub)
        });
        }
        
      })
    );
    }
    results()
    .then((data)=>{
      
     
      var userName=data.data;
        const dynamoDb =new AWS.DynamoDB();

      dynamoDb.putItem({

        "TableName":"userTable",
        "Item": {
          "userName": {S:`${userName}`},
          "SK": {S:"profileData"},
          "fullName": {S:`${name}`},
          "email":{S:`${email}`}
        }

      }).promise();

    });

      return {
        statusCode: 200,
        body: JSON.stringify("data has been inserted"),
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
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
