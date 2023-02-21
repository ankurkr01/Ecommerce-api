const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

// Register
router.post("/register", async (req, res) => {
  try{
  const newUser = new User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    seller: req.body.seller,
  });

  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);
    const savedUser = await newUser.save();

    res.status(201).send(savedUser);

  }catch(err){
    res.status.send(err);
  }

});

// Login 
router.post('/login', async(req, res)=>{
  try{
    const user = await User.findOne({username: req.body.username});
    if (!user) return res.status(400).send('Invalid username or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid username or password.');

    const accesToken = jwt.sign({id: user._id, seller: user.isAdmin}, process.env.SECRET_KEY, {expiresIn: "3d"});

    const {password, ...others} = user._doc;

    res.status(200).send({...others, accesToken});
 
  }catch(err){
    res.status(500).send(err.message);
  }

})

module.exports = router;
