
const AWS = require('aws-sdk');


module.exports.lambdaFunction = async (event) => {

    try{
     
        return new Promise((resolve) => {
            const {title, list} = JSON.parse(event.body);

        const documentClient = new AWS.DynamoDB.DocumentClient();
        documentClient.update({
            "TableName":"listTable",
            Key: { userId: event.requestContext.authorizer.principalId, title: title },
            AttributeUpdates: {
              'Itemlists': {
                Action: 'ADD',
                Value: documentClient.createSet([`${list}` ])
              },
            },
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
