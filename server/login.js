const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const router = express.Router();

const {
  LETTERBOXD_CLIENT_ID,
  LETTERBOXD_CLIENT_SECRET,
  LETTERBOXD_REDIRECT_URI,
  JWT_SECRET,
} = process.env;

router.get('/login', (req, res) => {
  const scopes = 'profile:modify content:modify oauth:refresh openid email';
  const redirect = `https://api.letterboxd.com/api/v0/auth/authorize?response_type=code&client_id=${LETTERBOXD_CLIENT_ID}&redirect_uri=${encodeURIComponent(LETTERBOXD_REDIRECT_URI)}&scope=${encodeURIComponent(scopes)}`;
  res.redirect(redirect);
});

router.get('/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const tokenRes = await axios.post('https://api.letterboxd.com/api/v0/auth/token', new URLSearchParams({
      code,
      client_id: LETTERBOXD_CLIENT_ID,
      client_secret: LETTERBOXD_CLIENT_SECRET,
      redirect_uri: LETTERBOXD_REDIRECT_URI,
      grant_type: 'authorization_code',
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
    });

    const { access_token, refresh_token, expires_in } = tokenRes.data;

    const token = jwt.sign({ access_token, refresh_token }, JWT_SECRET, { expiresIn: expires_in });

    res.cookie('session_token', token, {
      httpOnly: true,
      secure: false, // set to true in production with HTTPS
    });

    res.redirect('/home');
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Auth failed');
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('session_token');
  res.sendStatus(200);
});

module.exports = router;
