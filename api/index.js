require('dotenv').config();

const express = require('express');
const axios = require('axios');
const path = require('path');
const url = require('url');
const cors = require('cors');
const querystring = require('querystring');
const request = require('request');
const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// for generating optional state query parameter, in order to prevent csrf
const generateRandomString = (len) => {
    let string = '';
    const chars = '0123456789QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm';
    for(var i = 0; i < len; i++) {
        string += chars.charAt(Math.floor(Math.random()*chars.length));
    }

    return string;
}

const corsOptions ={
    origin:'http://localhost:3000'
}

app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send('Spotify API is up');
});

app.get('/login', (req, res) => {
    var state = generateRandomString(16);
    var scope = 'user-read-private user-read-email';
    res.cookie('spotify_state', state);

    res.redirect('https://accounts.spotify.com/authorize?'+
        querystring.stringify({
            response_type: 'code',
            client_id: CLIENT_ID,
            scope: scope,
            redirect_uri: REDIRECT_URI,
            state: state 
        })
    );
});

app.get('/callback', (req, res) => {
    var code = req.query.code || null;
    var state = req.query.code || null;
    var verifyState = req.cookies ? req.cookies['spotify_state'] : null;

    if(state === null || state !== verifyState) {
        res.redirect('/#' + 
            querystring.stringify({
                error: 'state_mismatch'
            })
        );
    } else {
        res.clearCookie('spotify_state');
        var authOptions = {
            url:'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization' : 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, (err, res, body) => {
            if(!err && res.statusCode === 200) {
                const access_token = body.access_token;
                const refresh_token = body.refresh_token;

                res.send(`${access_token},${refresh_token}`);
            }
        });
    }
});

app.get('/test', (req, res) => {
    res.send('sending test data...');
});

app.listen(PORT, ()=> {
    console.log(`api listening on port ${PORT}`);
});

