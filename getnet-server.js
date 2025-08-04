const axios = require('axios');
const crypto = require('crypto');

const login = "7ffbb7bf1f7361b1200b2e8d74e1d76f";
const secretKey = "SnZP3D63n3I9dH9O";

function generateTranKey(secretKey, seed) {
  const sha1 = crypto.createHash('sha1');
  sha1.update(seed + secretKey);
  return sha1.digest('base64');
}

async function createGetnetSession() {
  const seed = new Date().toISOString();
  const tranKey = generateTranKey(secretKey, seed);

  const authPayload = {
    auth: {
      login,
      seed,
      tranKey,
    }
  };

  try {
    const response = await axios.post('https://checkout.test.getnet.cl/api/session', authPayload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log("Respuesta Getnet:", response.data);
  } catch (error) {
    if (error.response) {
      console.error("Error en respuesta:", error.response.data);
    } else {
      console.error("Error general:", error.message);
    }
  }
}

createGetnetSession();
