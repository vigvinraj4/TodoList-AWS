
const AWS = require('aws-sdk');


module.exports.lambdaFunction = async (event) => {
    //const {title} = event.pathParameters;
    try{
     
        return new Promise((resolve) => {
            //
           // console.log(event.pathParameters.title)
        const documentClient = new AWS.DynamoDB.DocumentClient();
        documentClient
        .query({
          TableName: "listTable",
          ExpressionAttributeNames: {
            "#id": "userId",
            "#title": "title"
          },
          ExpressionAttributeValues: {
            ":idValue": event.requestContext.authorizer.principalId,
            ":titleValue": event.queryStringParameters.title,
          },
          KeyConditionExpression: "#id = :idValue and #title = :titleValue",

        })
        .promise()
        .then((data)=>{
            console.log(data)
            resolve( {
                statusCode: 200,
                body: JSON.stringify(data),
                headers: {
                  'Access-Control-Allow-Origin': '*',
                }
              });
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
