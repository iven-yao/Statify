require('dotenv').config();

const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const app = express();
const PORT = process.env.PORT || 5566;
app.use(cors());
app.use(express.json());

app.use('/v1', routes);
app.get('/', (req, res) => { res.send('Hello Database');});

app.listen(PORT, () => {
    console.log(`database api is listening on port ${PORT}`);
});