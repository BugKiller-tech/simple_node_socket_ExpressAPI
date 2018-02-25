var express = require('express');
var router = express.Router();





var User = require('../models/User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/new', async function(req, res, next) {
  try {

    const foundUser = await User.findOne({ phoneNumber: req.body.phoneNumber });

    if (foundUser) {
      console.log(foundUser);
      const newUser = await User.findOneAndUpdate({_id: foundUser._id}, req.body, { new: true });
      global.io.sockets.emit('update user', newUser);
      return res.json({
        success: true,
        user: newUser
      })
    } else {
      const user = await User.create(req.body);
      if (user) {
        global.io.sockets.emit('new user', user);
        return res.json({
          success: true,
          user: user
        })
      } else {
        return res.status(400).json({
          success: false,
          errors: 'Something went wrong'
        })
      }
    }
  } catch(err) {
    return res.status(400).json({
      success: false,
      errors: 'Something went wrong catch block'
    })
  }
});
router.post('/delete', async function(req, res, next) {
  if (!req.body._id) {
    return res.status(400).json({
      success: false,
      message: 'Please provide the id'
    })
  }
  try {
    ///////
    // const deletedUser = await User.findByIdAndRemove(req.body._id);  // this will not return anything
    const deletedUser = await User.findOneAndRemove({ _id: req.body._id}); // this function will return deleted document.

    global.io.sockets.emit('delete user', deletedUser);
    return res.json({
      success: true,
      message: 'Successfully deleted',
      user: deletedUser
    })
    
  } catch(err) {
    return res.status(400).json({
      success: false,
      errors: 'Something went wrong catch block'
    })
  }
})

router.get('/all', async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.json({
      success: true,
      users: users
    })
  }catch(err) {
    return res.status(400).json({
      success: false,
      errors: 'Something went wrong catch block'
    })
  }
})

router.get('/noty', async (req, res, next) => {
  global.io.emit('new user', {
    firstname: 'abc',
    lastname: 'qwe',
    phoneNumber: "123123123",
    lat: 0.000001,
    lng: 0.000001
  });
  res.json({
    success: true,
    message: 'sent noty'
  })
});

module.exports = router;
