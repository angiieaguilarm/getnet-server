const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const LOGIN = '7ffbb7bf1f7361b1200b2e8d74e1d76f';
const TRANKEY = 'SnZP3D63n3I9dH9O';
const ENDPOINT = 'https://checkout.test.getnet.cl';

function generateTranKey(seed) {
  const concatenated = seed + TRANKEY;
  const sha1 = crypto.createHash('sha1');
  sha1.update(concatenated, 'utf8');
  return sha1.digest('base64');
}

app.post('/getnet/crear-sesion', async (req, res) => {
  // seed sin milisegundos para evitar rechazo de Getnet
  const seed = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  const tranKey = generateTranKey(seed);

