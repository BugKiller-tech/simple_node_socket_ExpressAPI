var express = require('express');
var router = express.Router();





var User = require('../models/User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/new', async function(req, res, next) {
  try {
    console.log(req.body);
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

      const lastUser = await User.findOne().sort({ order: -1 });
      console.log('Last User', lastUser);
      var order = 1;
      if (lastUser && lastUser.order) { order = lastUser.order + 1 };

      var data = req.body;
      data.order = order;

      const user = await User.create(data);
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

router.post('/update', async function(req, res) {
  try {
    const foundUser = await User.findOne({_id: req.body._id})
    if (foundUser) {
      const data = req.body;
      delete data._id;

      const newUser = await User.findOneAndUpdate({_id: foundUser._id}, data, { new: true });
      global.io.sockets.emit('update user', newUser);
      return res.json({
        success: true,
        user: newUser
      })
    } else {
      return res.status(400).json({
        success: false,
        errors: 'Something went wrong'
      })
    }
  } catch(err) {
    return res.status(400).json({
      success: false,
      errors: 'Something went wrong catch block'
    })
  }
})

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

router.post('/all', async (req, res, next) => {

  try {
    var users = {};
    if (req.body.uniqueId) {
      users = await User.find({uniqueId: req.body.uniqueId}).sort({ order: 1 });
    } else {
      users = await User.find({}).sort({ order: 1 });
    }
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

router.post('/moveOrder', async (req, res, next) => {
  try {
    if (!req.body.fromOrder) {
      return res.status(400).json({
        success: false,
        errors: 'Please provide fromOrder to move..'
      })
    }
    if (!req.body.toOrder) {
      return res.status(400).json({
        success: false,
        errors: 'Please provide toOrder to move..'
      })
    }

    const moveUser = await User.findOne({ order: req.body.fromOrder});
    
    if (req.body.fromOrder > req.body.toOrder) {
      await User.updateMany({ order: { $gte: req.body.toOrder, $lt: req.body.fromOrder } }, { $inc: { order: 1 } });
    } else {
      await User.updateMany({ order: { $gt: req.body.fromOrder, $lte: req.body.toOrder } }, { $inc: { order: -1 } });
    }
    moveUser.order = req.body.toOrder; 
    await moveUser.save();




    return res.json({
      success: true,
      message: 'Successfully moved'
    })

  } catch (err) {
    return res.status(400).json({
      success: false,
      errors: 'Something went wrong catch block'
    })
  }

});





// This route is only for test purpose of soccet emit
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

router.get('/lastOrder', async(req, res) => {
  try {
    const lastUser = await User.findOne().sort({ order : -1 });
    res.json({
      order: lastUser      
    })
  } catch (err) {
  }
})




module.exports = router;
