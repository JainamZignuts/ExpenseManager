/**
 * MembercontrollerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

AddMembers = (req, res) => {
  Account.findOne({ id: req.params.id })
    .then(() => {
      Users.findOne({ email: req.body.email }).then((record) => {
        if (record) {
          AccountUser.findOne({
            account: req.params.id,
            owners: record.id,
          }).then((data) => {
            console.log(data);
            if (data) {
              res.status(400).json({
                message: 'Member already exists',
              });
            } else {
              Account.addToCollection(req.params.id, 'owners')
                .members([record.id])
                .then(() => {
                  res.ok({ message: 'Member Added' });
                });
            }
          });
        } else {
          return res.status(401).json({
            error: 'User does not exist',
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

DeleteMembers = (req, res) => {
  Account.findOne({ id: req.params.id })
    .then(() => {
      Users.findOne({ email: req.body.email }).then((record) => {
        if (record) {
          AccountUser.find({ account: req.params.id, owners: record.id }).then(
            (data) => {
              if (data.length >= 1) {
                Account.removeFromCollection(req.params.id, 'owners')
                  .members([record.id])
                  .then(() => {
                    res.ok({ message: 'Member Deleted' });
                  });
              } else {
                res.status(400).json({
                  message: 'Member not found',
                });
              }
            }
          );
        } else {
          return res.status(401).json({
            error: 'User does not exist',
          });
        }
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
  AddMembers,
  DeleteMembers,
};
