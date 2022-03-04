const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

UserSignup = (req, res) => {
  Users.find({ email: req.body.email }).then((user) => {
    //check for an existing email and password's length
    if (user.length >= 1) {
      return res.status(409).json({
        message: 'This email already exists!',
      });
    } else if (req.body.password.length < 8) {
      return res.status(400).json({
        message: 'Password must have min 8 character',
      });
    } else {
      //hashing password
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        } else {
          //creating user
          Users.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hash,
          })
            .fetch()
            .then((result) => {
              console.log(result);
              res.send(
                'User created \n Welcome email sent \n Default account created'
              );
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                error: err,
              });
            });
        }
      });
    }
  });
};

UserLogin = (req, res) => {
  Users.find({ email: req.body.email })
    .then((users) => {
      if (users.length < 1) {
        return res.status(401).json({
          message: 'Auth failed',
        });
      }
      //comparing password
      bcrypt.compare(req.body.password, users[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth failed',
          });
        }
        if (result) {
          //generating token
          const token = jwt.sign(
            {
              email: users[0].email,
              userId: users[0].id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: '2h',
            }
          );
          return res.status(200).json({
            message: 'Auth successful',
            token: token,
          });
        }
        res.status(401).json({
          message: 'Auth failed',
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

module.exports = {
  UserSignup,
  UserLogin,
};
