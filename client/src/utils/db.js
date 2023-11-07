const querystring = require('querystring');

const dbURI = 'http://localhost:5566';

const headers = {
    'Content-Type': 'application/json',
};

export const getUesrs = async(query) => {
    let url = `${dbURI}/v1/users?${querystring.stringify(query)}`;
    let ret = '';
    await fetch(url).then((res) => ret = res.json());
    return ret;
}

export const createUser = async(user) => {
    let url = `${dbURI}/v1/users`;
    let payload = {
        'spotify_id': user.id, 
        'display_name': user.display_name, 
        'profile_img': user.images[0].url, 
        'login_status': true
    };

    let ret = '';
    await fetch(url, {
        method:'POST',
        headers:headers, 
        body: JSON.stringify(payload)
    }).then((res) => ret = res.json());

    return ret;
}

export const updateUser = async(id, user) => {
    let url = `${dbURI}/v1/users/${id}`;
    let payload = {
        'display_name': user.display_name, 
        'profile_img': user.images[0].url, 
        'login_status': true
    };

    await fetch(url, {
        method:'PUT',
        headers:headers, 
        body: JSON.stringify(payload)
    });

    return true;
}