const http = require("http");

const express = require("express");

const app = express();
const qrcode = require("qrcode");
const speakeasy = require("speakeasy");
const secret = speakeasy.generateSecret({
  length: 20,
  name: "Two Factor Authentication",
});

const base32secret = secret.base32;

app.get("/", async (req, res) => {
  const url = speakeasy.otpauthURL({
    secret: secret.base32,
    label: "Two Factor Authentication",
    algorithm: "sha512",
  });
  const data_url = await qrcode.toDataURL(secret.otpauth_url);
  console.log({ secret: secret.base32 });
  res.send('<img src="' + data_url + '">');
});

app.get("/:token", (req, res) => {
  const token = req.params.token;
  var verified = speakeasy.totp.verify({
    secret: base32secret,
    encoding: "base32",
    token: token,
  });
  res.json({ verified });
});

const server = http.createServer(app);

server.listen(3000, () => {
  console.log(`App listening on ${3000}`);
});
