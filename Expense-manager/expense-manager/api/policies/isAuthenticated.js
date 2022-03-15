const rescode = sails.config.constants.httpStatusCode;
const msg = sails.config.messages.Authorization;
const jwt = require('jsonwebtoken');
module.exports = async (req, res, proceed) => {
  try {
    //get token from hedars with 1st part that splitted with whitespace
    const token = req.headers.authorization.split(' ')[1];

    //verify token
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;

    //finds user by id got from token
    let result = await Users.findOne({ id: req.userData.userId });

    //stores token from user's databse
    const tokendb = result.token;

    //matching both token
    if (token !== tokendb) {
      //if token mismatches
      return res.status(rescode.BAD_REQUEST).json({
        message: msg.TokenMismatched,
      });
    } else {
      return proceed();
    }
  } catch (err) {
    //if token expired
    if (err instanceof jwt.TokenExpiredError) {
      return res.send(msg.TokenExpired);
    } else {
      return res.status(rescode.UNAUTHORIZED).json({
        message: msg.AuthError,
      });
    }
  }
};
