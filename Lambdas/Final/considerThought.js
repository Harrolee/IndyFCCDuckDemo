const ssmClient = new (require("aws-sdk/clients/ssm"))();
const dynamodb = require("aws-sdk/clients/dynamodb");
const docClient = new dynamodb.DocumentClient();

const possibleAdvice = [
  "So kind!",
  "Say more; you're holding back",
  "You shouldn't say that to anyone",
];

exports.handler = async (event) => {
  const parsedBody = JSON.parse(event.body);
  const { userId, thought } = parsedBody;

  if (!userId || !thought) {
    console.log(`userId: ${userId}` + `\nthought:${thought}`);
    const errorResp = {
      statusCode: 400,
      body: JSON.stringify({
        error: `Please supply userId and thought as keys in the request body. We found these keys: ${Object.keys(
          parsedBody
        )}`,
      }),
      headers: { "Content-Type": "application/json" },
    };
    return errorResp;
  }

  const tableName = await getTableName();

  // get advice
  const randomInt = Math.floor(Math.random() * possibleAdvice.length);
  const advice = possibleAdvice[randomInt];

  // store advice in dynamoDb
  const params = {
    TableName: tableName,
    Item: { userId, thought, advice },
  };
  await docClient.put(params).promise();

  const body = JSON.stringify({
    thought: thought,
    advice: advice,
  });

  const response = {
    statusCode: 200,
    body: body,
    headers: { "Content-Type": "application/json" },
  };
  return response;
};

async function getTableName() {
  const params = await ssmClient
    .getParameters({
      Names: ["duckApp-dev-tableName"],
    })
    .promise();
  return params.Parameters[0].Value;
}
