const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
router.get('/',verifyToken, async (req, res) => {
    try { 
    var authData = await jwt.verify(req.token,'secretkey');
    res.send('Welcome');
    }catch{
        res.status(401).json({ message:'Please login again' });
    }
});
router.post('/register', async (req, res) => {
  const data = req.body;
  try {
    if (await isUserAlreadyExist(data.username)) {
      res.status(409).json({message: 'Username already exists'});
      return;
    }
    const salt = await bcrypt.genSalt();
    const encpassword = await bcrypt.hash(data.password, salt);
    const profile = new UserProfile({
      username: data.username,
      password: encpassword,
      created_at: new Date().getTime()+"",
    });
    await profile.save();
    res.status(200).json({status: 'Success'});
  } catch (err) {
    console.log(err);
    res.status(500).json({status: 'Error, Something went wrong'});
  }
});
router.post('/login', async (req, res) => {
  const data = req.body;
  try {
    const username = data.username;
    const password = data.password;
    const userdetails = await findUser(data.username);
    if (userdetails.length <= 0) {
      res.status(400).json({message: 'Invalid User'});
    }
    if (await bcrypt.compare(password, userdetails[0].password)) {
      const token = jwt.sign({username: username}, 'secretkey');
      res.status(200).json({message: 'Successfully logged in ', token: token});
    } else {
      res.status(400).json({message: 'Username or password is invalid'});
    }
  } catch (err) {
    res.sendStatus(400);
  }
});
async function findUser(username) {
  return await UserProfile.find({username: username});
}
async function isUserAlreadyExist(username) {
  try {
    const userprofile = await findUser(username);
    if (userprofile.length >= 0) {
      return true;
    }
    return false;
  } catch (err) {
    console.log('Error while fetching user' + err);
    throw err;
  }
}
function verifyToken(req,res,next){
    const bearerHeader = req.headers['authorization'];
    console.log(bearerHeader);
    if(typeof bearerHeader != 'undefined'){
        const token = bearerHeader.split(' ')[1]
        req.token = token;
        next();
    }else{
        res.send(401);
    }
}
async function updateTokenForCurrentUser(token) {}
module.exports = router;
