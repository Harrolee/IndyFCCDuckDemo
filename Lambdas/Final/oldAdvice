// Create references and objects outsuserIde of the handler
const ssmClient = new (require("aws-sdk/clients/ssm"))();

// create a DocumentClient that represents the query to get the item.
const dynamodb = require("aws-sdk/clients/dynamodb");
const docClient = new dynamodb.DocumentClient();

exports.handler = async (event) => {
  const { userId } = JSON.parse(event.body);

  if (!userId) {
    return {
      statusCode: 400,
      error:
        "userId must contain a string" +
        "\nYour fields: " +
        `\nuserId:${userId}`,
    };
  }

  const tableName = await getTableName();

  const params = {
    TableName: tableName,
    KeyConditionExpression: `userId = :u_id`,
    ExpressionAttributeValues: {
      ":u_id": userId,
    },
    ProjectionExpression: "thought, advice",
  };

  let items;
  try {
    items = await docClient.query(params).promise();
  } catch (e) {
    console.log("error getting data: " + e);
    return {
      statusCode: 501,
      body: {
        error: "Unable to retrieve data. " + `Error from call: ${e}`,
      },
    };
  }

  const allAdvice = items.Items;

  // return all messages to consumer

  const body = JSON.stringify({
    userId: userId,
    allAdvice: allAdvice,
  });

  const response = {
    statusCode: 200,
    body: body,
  };
  return response;
};

async function getTableName() {
  const params = await ssmClient
    .getParameters({
      Names: ["duckPrep-dev-tableName"],
    })
    .promise();
  return params.Parameters[0].Value;
}
