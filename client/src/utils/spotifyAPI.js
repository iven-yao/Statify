import axios from 'axios';
const {getHashParams, getTimestampInSeconds, serverURI} = require('./utils');
const querystring = require('querystring');

let expire_time = 3600;

const storeAccessToken = token => window.localStorage.setItem('spotifyAccessToken', token);
const storeRefreshToken = token => window.localStorage.setItem('spotifyRefreshToken', token);
const storeTokenTime = () => window.localStorage.setItem('spotifyTokenTime', getTimestampInSeconds()); 

const getLocalAccessToken = () => window.localStorage.getItem('spotifyAccessToken');
const getRefreshToken = () => window.localStorage.getItem('spotifyRefreshToken');
const getTokenTime = () => parseInt(window.localStorage.getItem('spotifyTokenTime'));

const spotifyAPI = 'https://api.spotify.com/v1';
const refreshAccessToken = async () => {
    try {
        await axios.get(`${serverURI}/refresh_token?refresh_token=${getRefreshToken()}`).then((res) => {
            console.log('new access token > ',res.data);
            storeAccessToken(res.data);
            storeTokenTime();
            window.location.reload();
        });
    } catch(err) {
        console.error(err);
    } 
};

export const getAccessToken = () => {
    const {error, access_token, refresh_token} = getHashParams();

    if(error) {
        console.log('ERROR!!!');
        console.error(error);
        refreshAccessToken();
    }

    let token = getLocalAccessToken();

    if((token === 'undefined' || token === null)  && access_token) {
        console.log('STORE ACCESS TOKEN');
        storeAccessToken(access_token);
        storeTokenTime();
        storeRefreshToken(refresh_token);

        console.log('access token > ', access_token);
        console.log('token time > ', getTokenTime());
        console.log('refresh token > ', refresh_token);
    }


    // console.log(getTimestampInSeconds() >= getTokenTime() + expire_time);
    // console.log(getTimestampInSeconds());
    // console.log(getTokenTime() + expire_time);

    if(getTimestampInSeconds() >= getTokenTime() + expire_time) {
        console.log('EXPIRED!!!');
        refreshAccessToken();
    }

    return getLocalAccessToken();
}

export const logout = () => {
    window.localStorage.clear();
    window.location.reload();
}

const getHeaders = () => ({
        Authorization: `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json',
    });

export const getProfile = async () => {
    const headers = getHeaders();
    let url =  `${spotifyAPI}/me`;
    return await axios.get(url, {headers});
}

const getTop = async (type, time_range) => {
    const headers = getHeaders();
    let url = `${spotifyAPI}/me/top/${type}?${querystring.stringify({
        time_range: time_range,
        limit: 50
    })}`;
    return await axios.get(url, {headers})
        .catch(err=> {
            console.log(err);
        });
}

export const getTopArtists = async() => (
    axios.all([getTop('artists','long_term'), getTop('artists','medium_term'), getTop('artists','short_term')])
    .then( axios.spread((long, mid, short) => ({
                long_term: long.data,
                medium_term: mid.data,
                short_term: short.data
            })
        )
    )
);

export const getTopTracks = async() => (
    axios.all([getTop('tracks','long_term'), getTop('tracks','medium_term'), getTop('tracks','short_term')])
    .then( axios.spread((long, mid, short) => ({
                long_term: long.data,
                medium_term: mid.data,
                short_term: short.data
            })
        )
    )
);
