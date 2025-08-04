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
  const seed = new Date().toISOString();
  const tranKey = generateTranKey(seed);

  try {
    const response = await axios.post(`${ENDPOINT}/api/session`, {
      auth: {
        login: LOGIN,
        tranKey,
        seed
      },
      payment: {
        reference: `orden-${Date.now()}`,
        amount: {
          currency: 'CLP',
          total: 9990
        }
      },
      expiration: new Date(Date.now() + 15 * 60000).toISOString(),
      returnUrl: 'https://loudaccesorios.com/pages/confirmacion-pago',
      ipAddress: '127.0.0.1',
      userAgent: 'Shopify Integration'
    });

    return res.json({ redirect_url: response.data.redirect });
  } catch (error) {
    const detalle = error.response?.data || error.message;
    console.error('Error en Getnet:', detalle);
    return res.status(500).json({ error: 'Error al crear sesión con Getnet', detalle });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
