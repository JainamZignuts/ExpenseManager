const rescode = sails.config.constants.httpStatusCode;
const msg = sails.config.messages.Authorization;

module.exports = async (req, res, proceed) => {
  try {
    const id = req.params.id;
    //finds transaction from the id from url
    let result = await Transactions.findOne({ id: id });
    if(result){
    //finds account details with owners details associated with the transaction
      let record = await Account.findOne({ id: result.owneraccount }).populate(
      'owners'
      );
      let uid = false;
      //loops through owners
      for (data of record.owners) {
        console.log(data.id);
        //matches owner ids with logged in user
        if (data.id === req.userData.userId) {
          uid = true;
          break;
        }
        console.log(uid);
      }
      if (uid) {
      //if logged in user is one of the owner of the account
      //give access to him
        return proceed();
      } else {
      //deny access to him
        return res.status(rescode.FORBIDDEN).json({
          message: msg.AccessDenied,
        });
      }
    } else {
      return res.status(rescode.NOT_FOUND).json({
        error: msg.TransactionNotFound
      });
    }
  } catch (error) {
    return res.status(rescode.UNAUTHORIZED).json({
      message: msg.AuthError,
    });
  }
};
