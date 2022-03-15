/**
 * AccountController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const rescode = sails.config.constants.httpStatusCode;
const msg = sails.config.messages.Account;

getAccounts = async (req, res) => {
  try {
    //get all account's details associated with logged in user.
    let result = await Users.find({
      where: { id: req.userData.userId },
      select: ['email', 'firstname', 'lastname'],
    }).populate('accounts');
    res.status(rescode.OK).json(result);
  } catch (error) {
    console.log(error);
    res.status(rescode.SERVER_ERROR).json({
      error: error,
    });
  }
};

getParticularAccount = async (req, res) => {
  try {
    //get particular account's details along with its transactions and owners.
    let result = await Account.findOne({ id: req.params.id })
      .populate('owners', { select: ['firstname', 'lastname', 'email'] })
      .populate('transactions');
    res.status(rescode.OK).json(result);
  } catch (error) {
    console.log(error);
    res.status(rescode.SERVER_ERROR).json({
      error: error,
    });
  }
};

createAccount = async (req, res) => {
  try {
    //creates an account
    let result = await Account.create({
      accountname: req.body.accountname,
      owners: req.userData.userId,
    }).fetch();
    console.log(result);
    res.status(rescode.CREATED).json({
      message: msg.AccountCreated,
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(rescode.SERVER_ERROR).json({
      error: error,
    });
  }
};

updateAccount = async (req, res) => {
  try {
    const id = req.params.id;
    //updates accountname
    let result = await Account.updateOne({ id: id }).set({
      accountname: req.body.accountname,
    });
    console.log(result);
    res.status(rescode.OK).json({
      message: msg.AccountUpdated,
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(rescode.SERVER_ERROR).json({
      error: error,
    });
  }
};

deleteAccount = async (req, res) => {
  try {
    const id = req.params.id;
    //deletes transactions from database associated with the account that is going to be deleted.
    let record = await Transactions.destroy({ owneraccount: id }).fetch();
    console.log(record);
    //deletes the requested account
    let result = await Account.destroyOne({ id: id });
    console.log(result);
    res.status(rescode.OK).json({
      message: msg.AccountDeleted,
    });
  } catch (error) {
    console.log(error);
    res.status(rescode.SERVER_ERROR).json({
      error: error,
    });
  }
};

module.exports = {
  getAccounts,
  getParticularAccount,
  createAccount,
  updateAccount,
  deleteAccount,
};
