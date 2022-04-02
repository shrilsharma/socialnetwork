const express = require('express')
const User = require('../models/User')

const router = express.Router();

router.get('/', async (req, res) => {
  const users = await User.findAll();
  if (users.length == 0) return res.json('No User found!!');
  res.send(users);
})

router.get('/:id', async (req, res) => {
  const user = await User.findAll({ where: { id: req.params.id } });
  if (user.length == 0) return res.json('No User found!!');
  res.send(user);
})

router.post('/create', async (req, res) => {
  //validate params
  if (!req.body.firstname) {
    return res.status(400).json('First name is mandatory');
  }
  if (!req.body.lastname) {
    return res.status(400).json('Last name is mandatory');
  }
  if (!/^([a-z])/.test(req.body.firstname)) {
    return res.status(400).json('First name should be string');
  }
  if (!/^([a-z])/.test(req.body.lastname)) {
    return res.status(400).json('Last name should be string');
  }

  //if user exist return error
  const user = await User.findAll({ where: { firstname: req.body.firstname, lastname: req.body.lastname } });
  if (user.length !== 0) return res.status(400).json('User already exist')

  //create user
  const newUser = await User.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname
  }).catch(err => {
    console.log('error ', err)
  })

  //response
  res.send(newUser);
})

router.put('/update/:id', async (req, res) => {
  //validation
  if (!req.body.firstname && !req.body.lastname) {
    return res.status(400).json('Pass firstname or lastname to update');
  }
  if (req.body.firstname && !/^([a-z])/.test(req.body.firstname)) {
    return res.status(400).json('First name should be string');
  }
  if (req.body.lastname && !(/^([a-z])/.test(req.body.lastname))) {
    return res.status(400).json('Last name should be string');
  }

  try {
    //check user
    const user = await User.findAll({ where: { id: req.params.id } });
    if (user.length === 0) return res.status(400).json('User not Exist!!');

    //update
    const updateduser = await User.update(
      { ...req.body },
      { where: { id: req.params.id } }
    )

    //response
    res.json('User updated successfully');
  } catch (error) {
    return res.status(500).json(error);
  }
})

router.delete('/remove/:id', async (req, res) => {
  try {
    //check user
    const user = await User.findAll({ where: { id: req.params.id } });
    if (user.length == 0) return res.status(400).json('User not Exist!!');

    //update
    const deleteUser = await User.destroy({ where: { id: req.params.id } });

    //response
    res.json("User Deleted successfully");
  } catch (error) {
    return res.status(500).json(error);
  }
})

module.exports = router;