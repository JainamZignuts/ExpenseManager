/**
 * TransactionsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const rescode = sails.config.constants.httpStatusCode;
const msg = sails.config.messages.Transaction;

/**
 * Display all transactions for a particular account
 *
 * (GET /home/account/:accid/transactions)
 */
getTransactions = async (req, res) => {
  try {
    id = req.params.id;
    //finds transactions and sort by date descending
    let result = await Transactions.find({ where: { owneraccount: id }, sort: 'createdAt DESC' })
    .populate('user');
    //if transaction found
    if(result.length > 0) {
      res.status(rescode.OK).json({
        Transactions: result
      });
    } else {
      //if there isn't any transaction yet
      res.status(rescode.NOT_FOUND).json({
        message: msg.TransactionNotFound
      });
    }
  } catch (error) {
    console.log(error);
    res.status(rescode.SERVER_ERROR).json({
      error: error
    });
  }
};

/**
 * Creates a transaction and update balance in account accordingly
 *
 * (POST /home/transaction/create/:accid)
 */
createTransaction = async (req, res) => {
  try {
    //gets account details
    let accountData = await Account.findOne({ id: req.params.id });
    //gets account's current balance
    let balance = accountData.balance;
    let { description, amount } = req.body;
    const type = req.body.type.toLowerCase();
    //checks for input amount
    if(amount > 0){
      amount = amount;
    } else {
      //if amount is negative sends error
      return res.status(rescode.BAD_REQUEST).json({
        error: msg.InvalidAmount
      });
    }
    //checks the type of transaction
    if (type === 'income') {
      balance += Number(amount);
    } else if (type === 'expense') {
      balance -= Number(amount);
    } else {
      //if type is other than income or expense
      return res.status(rescode.BAD_REQUEST).json({
        error: msg.InvalidType
      });
    }
    //creates the transaction
    let result = await Transactions.create({
      type: type,
      description: description,
      amount: amount,
      owneraccount: accountData.id,
      user: req.userData.userId
    }).fetch();
    console.log(result);
    //updates balance in account
    let upd = await Account.updateOne({ id: req.params.id })
    .set({ balance: balance });
    console.log(upd);
    res.status(rescode.OK).json({
      message: msg.TransactionCreated,
      result: result,
      account: upd,
    });
  } catch (error) {
    res.status(rescode.SERVER_ERROR).json({
      error: error,
    });
  }
};

/**
 * Updates a transaction and update balance in account accordingly
 *
 * (PATCH /home/transaction/update/:transid)
 */
updateTransaction = async (req, res) => {
  try {
    const id = req.params.id;
    let result = await Transactions.findOne({ id: id });
    let data = await Account.findOne({ id: result.owneraccount });
    //gets current balance from account
    let balance = data.balance;
    let { description, amount } = req.body;
    let type = req.body.type.toLowerCase();
    //checks for input amount
    if(amount >= 0){
      amount = amount;
    } else {
      //if amount is negative sends error
      return res.status(rescode.BAD_REQUEST).json({
        error: msg.InvalidAmount
      });
    }
    //checks the type of transaction from input
    if(type === 'income' || type === 'expense') {
      type = type;
    } else {
      //if type is other than income or expense
      return res.status(rescode.BAD_REQUEST).json({
        error: msg.InvalidType
      });
    }
    //gets existing transaction's type
    if (result.type === 'income') {
      //check for updating transaction's type
      if (type === 'income'){
        balance -= result.amount;
        balance += amount;
      } else if (type === 'expense') {
        balance -= result.amount;
        balance -= amount;
      }
    } else if (result.type === 'expense') {
      if (type === 'income') {
        balance += result.amount;
        balance += amount;
      } else if (type === 'expense') {
        balance += result.amount;
        balance -= amount;
      }
    }
    //updates the transaction
    let record = await Transactions.updateOne({ id: id })
    .set({
      type: type,
      description: description,
      amount: amount,
      user: req.userData.userId
    });
    console.log(record);
    //updates balance in account
    let upd = await Account.updateOne({ id: result.owneraccount })
    .set({ balance: balance });
    console.log(upd);
    res.status(rescode.OK).json({
      message: msg.TransactionUpdate,
      record: record,
      upd: upd
    });
  } catch (error) {
    console.log(error);
    res.status(rescode.SERVER_ERROR).json({
      error: error
    });
  }
};

/**
 * Deletes a particular transaction and update balance in account
 *
 * (DELETE /home/transaction/delete/:transid)
 */
deleteTransaction = async (req, res) => {
  try {
    let id = req.params.id;
    let result = await Transactions.findOne({ id: id });
    let data = await Account.findOne({ id: result.owneraccount });
    //gets current balance from account
    let balance = data.balance;
    //checks for transaction type
    if (result.type === 'income') {
      balance -= result.amount;
    } else if (result.type === 'expense') {
      balance += result.amount;
    }
    //updates balance in account
    let record = await Account.updateOne({ id: result.owneraccount })
    .set({ balance: balance });
    console.log(record);
    //deletes the transaction
    let del = await Transactions.destroyOne({ id: id });
    console.log(del);
    res.status(rescode.OK).json({
      message: msg.TransactionDeleted,
      account:record,
      DeletedTransaction: del
    });
  } catch (error) {
    res.status(rescode.SERVER_ERROR).json({
      error: error
    });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
