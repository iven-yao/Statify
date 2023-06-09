require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cookies = require('cookie-parser');
const querystring = require('querystring');
const request = require('request');
const app = express();
const PORT = process.env.PORT;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const FRONTEND_URI = process.env.FRONTEND_URI;
const scope = 'user-read-private user-read-email playlist-read-private user-top-read user-follow-read user-read-recently-played';


app.use(cors());
app.use(cookies());

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
let access_token;
let refresh_token;
let expire_time;

const getTimestampInSeconds = () => {
    return Math.floor(Date.now() / 1000);
}

const spotifyAPI = 'https://api.spotify.com/v1';

const refreshAccessToken = async () => {
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
            access_token = body.access_token;
            expire_time = getTimestampInSeconds()+body.expires_in;
        }
    });
};

const getHeaders = () => {
    if(getTimestampInSeconds() >= expire_time) {
        console.log('EXPIRED!!!');
        refreshAccessToken();
    }

    const headers = {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
    };

    return headers;
}

const getProfile = async () => {
    const headers = getHeaders();
    let url =  `${spotifyAPI}/me`;
    const response = await axios.get(url, {headers})
        .catch(err=> {
            console.log(err);
        });
    return response;
}

const getTop = async (type, time_range) => {
    const headers = getHeaders();
    let url = `${spotifyAPI}/me/top/${type}?${querystring.stringify({
        time_range: time_range,
        limit: 50
    })}`;
    const response = await axios.get(url, {headers})
        .catch(err=> {
            console.log(err);
        });
    return response;
}

app.get('/', (req, res) => {
    res.send(`SPOTIFY API IS LISTENING ON PORT${PORT}`);
});

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
                access_token = body.access_token;
                refresh_token = body.refresh_token;
                expire_time = getTimestampInSeconds()+body.expires_in;

                res.redirect(`${FRONTEND_URI}/#${querystring.stringify({login: 'success'})}`);
            } else {
                res.redirect(`/#${querystring.stringify({error: 'invalid_token'})}`);
            }
        });
    }
});

app.get('/profile', async (req, res) => {
    const response = await getProfile();
    if(response.data != undefined) {
        res.send(response.data);
    } else {
        res.redirect(`${FRONTEND_URI}`);
    }
}); 

app.get('/top/:type/:time_range', async (req, res) => {
    const type = req.params.type;
    const time_range = req.params.time_range;
    const response = await getTop(type, time_range);
    if(response.data != undefined) {
        res.send(response.data);
    } else {
        res.redirect(`${FRONTEND_URI}`);
    }
});

app.listen(PORT, ()=> {
    console.log(`api listening on port ${PORT}`);
});

