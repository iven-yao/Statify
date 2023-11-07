const express = require('express');
const userModel = require('../models/user');

const route = express.Router();

route.get('/', userModel.getUsers);
route.get('/:id', userModel.getUserByID);
route.post('/', userModel.createUser);
route.put('/:id', userModel.updateUser);

module.exports = route;