/**
 * TransactionsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

GetTransactions = (req, res) => {
  id = req.params.id;
  Transactions.find({ where: { owneraccount: id }, sort: 'createdAt DESC' })
    .then((result) => {
      console.log(result);
      res.status(200).json({
        Transactions: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

CreateTransaction = (req, res) => {
  Account.findOne({ id: req.params.id })
    .populate('owners')
    .then((accountData) => {
      let uid = false;
      accountData.owners.forEach((data) => {
        console.log(data.id);
        console.log(req.userData.userId);
        if (data.id === req.userData.userId) {
          uid = true;
        }
        console.log(uid);
      });
      if (uid) {
        let balance = accountData.balance;
        const { type, description, amount } = req.body;
        if (type === 'income') {
          balance = balance + Number(amount);
        } else if (type === 'expense') {
          if (balance >= amount) {
            balance = balance - Number(amount);
          } else {
            return res.status(500).json({
              message: 'Insufficient balance',
            });
          }
        }
        Transactions.create({
          type: type,
          description: description,
          amount: amount,
          owneraccount: accountData.id,
        })
          .fetch()
          .then((result) => {
            console.log(result);
            Account.updateOne({ id: req.params.id })
              .set({ balance: balance })
              .then((upd) => {
                console.log(upd);
                res.status(200).json({
                  message: 'Transaction created and Balance updated in account',
                  result: result,
                  account: upd,
                });
              });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        return res.status(403).json({
          message: 'Access Denied',
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

UpdateTransaction = (req, res) => {
  const id = req.params.id;
  Transactions.findOne({ id: id })
    .then((result) => {
      Account.findOne({ id: result.owneraccount })
        .populate('owners')
        .then((data) => {
          let uid = false;
          data.owners.forEach((data) => {
            console.log(data.id);
            console.log(req.userData.userId);
            if (data.id === req.userData.userId) {
              uid = true;
            }
            console.log(uid);
          });
          if (uid) {
            let balance = data.balance;
            console.log(balance);
            const { type, description, amount } = req.body;
            if (result.type === 'income') {
              if (type === 'income') {
                balance = balance - result.amount;
                balance = balance + amount;
              } else if (type === 'expense') {
                balance = balance - result.amount;
                balance = balance - amount;
                if (balance < 0) {
                  return res.status(401).json({
                    error: 'Can not update transaction, Insufficient balance',
                  });
                } else {
                  balance = balance;
                }
              }
            } else if (result.type === 'expense') {
              if (type === 'income') {
                balance = balance + result.amount;
                balance = balance + amount;
              } else if (type === 'expense') {
                balance = balance + result.amount;
                balance = balance - amount;
                if (balance < 0) {
                  return res.status(401).json({
                    error: 'Can not update transaction, Insufficient balance',
                  });
                } else {
                  balance = balance;
                }
              }
            }
            Transactions.updateOne({ id: id })
              .set({
                type: type,
                description: description,
                amount: amount,
              })
              .then((record) => {
                console.log(record);
                Account.updateOne({ id: result.owneraccount })
                  .set({ balance: balance })
                  .then((upd) => {
                    console.log(upd);
                    res.status(200).json({
                      message: 'Transaction Updated',
                      record: record,
                      upd: upd,
                    });
                  });
              });
          } else {
            return res.status(403).json({
              message: 'Access Denied',
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

DeleteTransaction = (req, res) => {
  let id = req.params.id;
  Transactions.findOne({ id: id })
    .then((result) => {
      Account.findOne({ id: result.owneraccount })
        .populate('owners')
        .then((rec) => {
          let uid = false;
          rec.owners.forEach((data) => {
            if (data.id === req.userData.userId) {
              uid = true;
            }
            console.log(uid);
          });
          if (uid) {
            Account.findOne({ id: result.owneraccount }).then((data) => {
              let balance = data.balance;
              if (result.type === 'income') {
                balance = balance - result.amount;
              } else if (result.type === 'expense') {
                balance = balance + result.amount;
              }
              Account.updateOne({ id: result.owneraccount })
                .set({ balance: balance })
                .then((record) => {
                  console.log(record);
                  Transactions.destroyOne({ id: id }).then((del) => {
                    console.log(del);
                    res.status(200).json({
                      message: 'Transaction Deleted',
                      account:record,
                      DeletedTransaction: del
                    });
                  });
                });
            });
          } else {
            return res.status(403).json({
              message: 'Access Denied',
            });
          }
        });
    })
    .catch((err) => {
      res.badRequest(err);
    });
};

module.exports = {
  GetTransactions,
  CreateTransaction,
  UpdateTransaction,
  DeleteTransaction,
};
