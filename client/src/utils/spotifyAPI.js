import axios from 'axios';
const {getHashParams, getTimestampInSeconds, serverURI, delay} = require('./utils');
const querystring = require('querystring');

let expire_time = 3600;
let data_expire_time = 3600 * 12;

// acess token
const storeAccessToken = token => window.localStorage.setItem('spotifyAccessToken', token);
const storeRefreshToken = token => window.localStorage.setItem('spotifyRefreshToken', token);
const storeTokenTime = () => window.localStorage.setItem('spotifyTokenTime', getTimestampInSeconds());

const getLocalAccessToken = () => window.localStorage.getItem('spotifyAccessToken');
const getRefreshToken = () => window.localStorage.getItem('spotifyRefreshToken');
const getTokenTime = () => parseInt(window.localStorage.getItem('spotifyTokenTime'));

// artists-data
const storeLongTermArtists = data => window.localStorage.setItem('long_term_artists', JSON.stringify(data));
const storeMidTermArtists = data => window.localStorage.setItem('mid_term_artists', JSON.stringify(data));
const storeShortTermArtists = data => window.localStorage.setItem('short_term_artists', JSON.stringify(data));
const storeArtistsTime = () => window.localStorage.setItem('store_artists_time', getTimestampInSeconds());

const getLongTermArtists = () => window.localStorage.getItem('long_term_artists');
const getMidTermArtists = () => window.localStorage.getItem('mid_term_artists');
const getShortTermArtists = () => window.localStorage.getItem('short_term_artists');
const getArtistsTime = () => parseInt(window.localStorage.getItem('store_artists_time'))||0;

// tracks-data
const storeLongTermTracks = data => window.localStorage.setItem('long_term_tracks', JSON.stringify(data));
const storeMidTermTracks = data => window.localStorage.setItem('mid_term_tracks', JSON.stringify(data));
const storeShortTermTracks = data => window.localStorage.setItem('short_term_tracks', JSON.stringify(data));
const storeTracksTime = () => window.localStorage.setItem('store_tracks_time', getTimestampInSeconds());

const getLongTermTracks = () => window.localStorage.getItem('long_term_tracks');
const getMidTermTracks = () => window.localStorage.getItem('mid_term_tracks');
const getShortTermTracks = () => window.localStorage.getItem('short_term_tracks');
const getTracksTime = () => parseInt(window.localStorage.getItem('store_tracks_time'))||0;


const spotifyAPI = 'https://api.spotify.com/v1';
const refreshAccessToken = async () => {
    try {
        await axios.get(`${serverURI}/refresh_token?refresh_token=${getRefreshToken()}`).then((res) => {
            console.log('new access token > ',res.data);
            storeAccessToken(res.data);
            storeTokenTime();
            // window.location.href = 'http://localhost:3000';
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
    }

    if(getTimestampInSeconds() >= getTokenTime() + expire_time) {
        console.log('EXPIRED!!!');
        refreshAccessToken();
    }

    return getLocalAccessToken();
}

export const logout = () => {
    console.log('LOGOUT');
    window.localStorage.clear();
    window.location.href = 'http://localhost:3000';
}

export const getHeaders = () => ({
        Authorization: `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json',
    });

export const getProfile = async (headers) => {
    // const headers = getHeaders();
    let url =  `${spotifyAPI}/me`;
    return await axios.get(url, {headers});
}

const getTop = async (type, time_range, headers, limit=50) => {
    let url = `${spotifyAPI}/me/top/${type}?${querystring.stringify({
        time_range: time_range,
        limit: limit
    })}`;
    return await axios.get(url, {headers})
        .catch(err=> {
            console.log(err);
        });
}

export const getTopArtists = async(headers, limit=50) => {
    if(getTimestampInSeconds() > getArtistsTime() + data_expire_time) {
        console.log("fetching artists...");
        await Promise.all([getTop('artists','long_term',headers, limit), getTop('artists','medium_term',headers, limit), getTop('artists','short_term',headers, limit)])
        .then( axios.spread((long, mid, short) => {
                storeLongTermArtists(long.data);
                storeMidTermArtists(mid.data);
                storeShortTermArtists(short.data);
                storeArtistsTime(getTimestampInSeconds());
            })
        );
    } else {
        await delay(500);
    }

    console.log({
        long_term: JSON.parse(getLongTermArtists()),
        medium_term: JSON.parse(getMidTermArtists()),
        short_term: JSON.parse(getShortTermArtists())
    });

    return ({
        long_term: JSON.parse(getLongTermArtists()),
        medium_term: JSON.parse(getMidTermArtists()),
        short_term: JSON.parse(getShortTermArtists())
    });
}

export const getTopTracks = async(headers, limit=50) => {
    if(getTimestampInSeconds() > getTracksTime() + data_expire_time) {
        console.log("fetching tracks...");
        await Promise.all([getTop('tracks','long_term',headers, limit), getTop('tracks','medium_term',headers, limit), getTop('tracks','short_term',headers, limit)])
        .then( axios.spread((long, mid, short) => {
                storeLongTermTracks(long.data);
                storeMidTermTracks(mid.data);
                storeShortTermTracks(short.data);
                storeTracksTime(getTimestampInSeconds());
            })
        );
    } else {
        await delay(500);
    }

    return ({
        long_term: JSON.parse(getLongTermTracks()),
        medium_term: JSON.parse(getMidTermTracks()),
        short_term: JSON.parse(getShortTermTracks())
    });
}
