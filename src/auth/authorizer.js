
const AWS = require('aws-sdk');

// Create Cognito instance
const cognito = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });

module.exports.lambdaFunction = async (event) => {
  const methodArn = event.methodArn;
  const token = event.authorizationToken;

  // Verify token
  return new Promise ((resolve) => {
    cognito.getUser({ AccessToken: token }, (err, data) => {
      // Generate policy document
      if (err) resolve(generateAuthResponse('unknownUser', 'Deny', methodArn));
      else resolve(generateAuthResponse(data.Username, 'Allow', methodArn));
    });
  });
};

function generateAuthResponse(principalId, effect , methodArn ) {
  const policyDocument = generatePolicyDocument(effect, methodArn);

  return {
    principalId,
    policyDocument,
  };
}

function generatePolicyDocument(effect , methodArn) {
  if (!effect || !methodArn) return null;

  const policyDocument = {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: methodArn,
      },
    ],
  };

  return policyDocument;
}
