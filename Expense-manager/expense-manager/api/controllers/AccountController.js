/**
 * AccountController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


GetAccounts = (req, res) => {
  Users.find({
    where: { id: req.userData.userId },
    select: ['email', 'firstname', 'lastname'],
  })
    .populate('accounts')
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

GetParticularAccount = (req, res) => {
  Account.findOne({ id: req.params.id })
    .populate('owners', { select: ['firstname', 'lastname', 'email'] })
    .populate('transactions')
    .then((result) => {
      let uid = false;
      //getting all owner Ids and checking it with logged in user
      result.owners.forEach((data) => {
        console.log(data.id);
        if (data.id === req.userData.userId) {
          uid = true;
        }
        console.log(uid);
      });
      if (uid) {
        return res.status(200).json(result);
      } else {
        return res.status(403).json({
          message: 'Access Denied',
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

CreateAccount = (req, res) => {
  Account.create({
    accountname: req.body.accountname,
    owners: req.userData.userId,
  })
    .fetch()
    .then((result) => {
      console.log(result);
      res.json({
        message: 'Account Created',
        result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

UpdateAccount = (req, res) => {
  const id = req.params.id;
  Account.findOne({ id: id })
    .populate('owners')
    .then((rec) => {
      let uid = false;
      rec.owners.forEach((data) => {
        console.log(data.id);
        if (data.id === req.userData.userId) {
          uid = true;
        }
        console.log(uid);
      });
      if (uid) {
        Account.updateOne({ id: id })
          .set({
            accountname: req.body.accountname,
          })
          .then((result) => {
            console.log(result);
            res.status(200).json({
              message: 'Account updated',
              result,
            });
          });
      } else {
        return res.status(403).json({
          message: 'Access Denied',
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

DeleteAccount = (req, res) => {
  const id = req.params.id;
  Account.findOne({ id: id })
    .populate('owners')
    .then((rec) => {
      let uid = false;
      rec.owners.forEach((data) => {
        console.log(data.id);
        if (data.id === req.userData.userId) {
          uid = true;
        }
        console.log(uid);
      });
      if (uid) {
        Transactions.find({ owneraccount: id }).then((rec) => {
          console.log(rec);
          Transactions.destroy({ owneraccount: id })
            .fetch()
            .then((record) => {
              console.log(record);
              Account.destroyOne({ id: id }).then((result) => {
                console.log(result);
                res.status(200).json({
                  message: 'Account deleted',
                });
              });
            });
        });
      } else {
        return res.status(403).json({
          message: 'Access Denied',
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

module.exports = {
  GetAccounts,
  GetParticularAccount,
  CreateAccount,
  UpdateAccount,
  DeleteAccount,
};
