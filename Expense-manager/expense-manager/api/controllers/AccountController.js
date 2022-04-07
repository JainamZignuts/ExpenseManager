/**
 * AccountController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const rescode = sails.config.constants.httpStatusCode;
const msg = sails.config.messages.Account;

/**
 * Display logged in user's all accounts
 *
 * (GET /home)
 */
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

/**
 * Display particular account's details along with user and transaction details.
 *
 * (GET /home/account/:accid)
 */
getParticularAccount = async (req, res) => {
  try {
    //get particular account's details along with its transactions and owners.
    let result = await Account.findOne({ id: req.params.accid })
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

/**
 * Create an account for logged in user
 *
 * (POST /home)
 */
createAccount = async (req, res) => {
  try {
    let name = req.body.accountname;
    let accname = name.trim();
    //checks for empty input value
    if(accname.length > 0){
      accname = accname;
    } else {
      return res.send(msg.EmptyAccountName);
    }
    //creates an account
    let result = await Account.create({
      accountname: accname,
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

/**
 * Updates the accountname of an account
 *
 * (PATCH /home/update/:accid)
 */
updateAccount = async (req, res) => {
  try {
    const id = req.params.accid;
    //checks for empty input value
    if(req.body.accountname.trim().length <= 0){
      return res.send(msg.EmptyAccountName);
    }
    //updates accountname
    let result = await Account.updateOne({ id: id }).set({
      accountname: req.body.accountname.trim(),
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

/**
 * Delete a particular account and also deletes all transactions related to it
 *
 * (DELETE /home/delete/:accid)
 */
deleteAccount = async (req, res) => {
  try {
    const id = req.params.accid;
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
