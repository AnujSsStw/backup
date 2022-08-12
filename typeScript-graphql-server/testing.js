const http = require("http");

const options = {
  method: "POST",
  hostname: "localhost",
  port: "4000",
  path: "/graphql",
  headers: {},
};

const req = http.request(options, function (res) {
  const chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    const body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.write(
  JSON.stringify({
    query:
      "mutation Login($password: String!, $emailORuserName: String!) {  login(password: $password, EmailORuserName: $emailORuserName) {    user {      userName      id      email      verified    }  }}",
    variables: { password: "bob", emailORuserName: '"bob"' },
  })
);
req.end();
