require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookies = require('cookie-parser');
const querystring = require('querystring');
const request = require('request');
const routes = require('./routes');
const app = express();
const PORT = process.env.PORT;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const FRONTEND_URI = process.env.FRONTEND_URI;
const scope = 'user-read-private user-read-email playlist-read-private user-top-read user-follow-read user-read-recently-played';


app.use(cors());
app.use(cookies());
app.use(express.json());

// for generating optional state query parameter, in order to prevent csrf
const generateCodeVerifier = (len) => {
    let text = '';
    const possibles = '0123456789QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm';
    for(var i = 0; i < len; i++) {
        text += possibles.charAt(Math.floor(Math.random()*possibles.length));
    }

    return text;
}

const spotifyVerifier = 'spotify_state';

app.get('/', (req, res) => {
    res.send(`SPOTIFY API IS LISTENING ON PORT ${PORT}`);
});

app.use('/v1', routes);

app.get('/login', (req, res) => {
    var state = generateCodeVerifier(128);
    res.cookie(spotifyVerifier, state);
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
    var state = req.query.state || null;
    var verifier = req.cookies ? req.cookies[spotifyVerifier] : null;

    if(state === null || verifier !== state) {
        res.redirect('/#' + 
            querystring.stringify({
                error: 'state_mismatch'
            })
        );
    } else {
        res.clearCookie(spotifyVerifier);
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

        request.post(authOptions, (error, response, body) => {
            if(!error && response.statusCode === 200) {
                const access_token = body.access_token;
                const refresh_token = body.refresh_token;

                res.redirect(`${FRONTEND_URI}/#${querystring.stringify({access_token, refresh_token})}`);
            } else {
                res.redirect(`/#${querystring.stringify({error: 'invalid_token'})}`);
            }
        });
    }
});

app.get('/refresh_token', (req, res) => {
    const refresh_token = req.query.refresh_token;

    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };
    
    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            const access_token = body.access_token;
            res.send(access_token);
        }
    });
});

app.listen(PORT, ()=> {
    console.log(`api listening on port ${PORT}`);
});

