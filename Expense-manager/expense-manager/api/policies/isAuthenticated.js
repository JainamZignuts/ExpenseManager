const jwt = require('jsonwebtoken');
module.exports = (req, res, proceed) => {
  try {
    //get token from hedars with 1st part that splitted with whitespace
    const token = req.headers.authorization.split(' ')[1];
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    // console.log(req.userData.userId);
    return proceed();
  } catch (err) {
    return res.status(401).json({
      message: 'Auth failed',
    });
  }
};
