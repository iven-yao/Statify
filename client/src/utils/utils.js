export const serverURI = 'http://localhost:9000';

export const explaination = "Position changed mark is relative to your own six-month data.";

export const getHashParams = () => {
    const hashParams = {};
    let e;
    const r = /([^&;=]+)=?([^&;]*)/g;
    const q = window.location.hash.substring(1);
    window.location.hash = '';
    while ((e = r.exec(q))) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    
    return hashParams;
};

export const getTimestampInSeconds = () => {
    return Math.floor(Date.now() / 1000);
}

export const delay = (milliseconds) => {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}