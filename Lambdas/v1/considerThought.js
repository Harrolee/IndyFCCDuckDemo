const possibleAdvice = [
  "So kind!",
  "Say more; you're holding back",
  "You shouldn't say that to anyone",
];

exports.handler = async (event) => {
  // get thought
  const { userId, thought } = event;

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

  // form advice based on thought
  const randomInt = Math.floor(Math.random() * possibleAdvice.length);
  const advice = possibleAdvice[randomInt];

  const body = JSON.stringify({
    thought: thought,
    advice: advice,
  });

  const response = {
    statusCode: 200,
    body: body,
  };
  return response;
};
