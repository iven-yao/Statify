const {db} = require('../db');
const _tablename = 'user';

const getUserByID = async(req, res) => {
    const id = parseInt(req.params.id);
    const user = await db(_tablename).where({id:id});
    res.json({user});
}

const getUsers = async(req, res) => {
    const query = req.query;
    const user = await db(_tablename).where(query);
    res.json({user});
}

const createUser = async(req, res) => {
    await db(_tablename).insert(req.body, 'id')
    .then((ret) => {
        const id = ret[0].id
        console.log(`User ${id} is created`);
        res.status(201).json({id});
    }).catch((e) => {
        console.log('Error >>> \n',e);
        res.status(400).send(e);
    });
}

const updateUser = async(req, res) => {
    const id = parseInt(req.params.id);
    await db(_tablename).where({id:id}).update(
        req.body
    ).then(() => {
        console.log(`User ${id} is updated`);
        res.status(200);
    }).catch((e) => {
        console.log('Error >>> \n',e);
        res.status(400).send(e);
    });
}

module.exports = {
    getUsers,
    getUserByID,
    createUser,
    updateUser
}