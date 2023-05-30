const express = require('express');
const axios = require('axios');
const path = require('path');
const url = require('url');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/test', (req, res) => {
    res.send('sending test data...');
})

app.listen(PORT, ()=> {
    console.log(`api listening on port ${PORT}`);
});

