
const AWS = require('aws-sdk');


module.exports.lambdaFunction = async (event) => {
  const {title} = JSON.parse(event.body);


  
    try{
     
        return new Promise((resolve) => {
        const dynamoDb =new AWS.DynamoDB();

      dynamoDb.putItem({

        "TableName":"listTable",
        "Item": {
          "userId": {S:`${event.requestContext.authorizer.principalId}`},
          "title": {S:`${title}`}
        }

      }).promise();
      resolve( {
        statusCode: 200,
        body: JSON.stringify("data has been inserted"),
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      });
      
   
    })
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
