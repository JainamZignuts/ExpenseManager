const rescode = sails.config.constants.httpStatusCode;
const msg = sails.config.messages.Authorization;

module.exports = async (req, res, proceed) => {
  try {
    const id = req.params.id;
    //finds account details with owners
    let rec = await Account.findOne({ id: id }).populate('owners');
    if(rec){
      let uid = false;
      //loops through owners of accounts
      for (data of rec.owners) {
      //gets owners ids
        console.log(data.id);
        //matches it with logged in user
        if (data.id === req.userData.userId) {
        //if any id matches the loop breaks
          uid = true;
          break;
        }
        console.log(uid);
      }
      if (uid) {
      //if logged in user is one of owner of account
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
        error: msg.AccountNotFound
      });
    }
  } catch (err) {
    return res.status(rescode.UNAUTHORIZED).json({
      message: msg.AuthError,
    });
  }
};
