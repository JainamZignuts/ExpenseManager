/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  'POST /signup' : 'UserController.userSignup',
  'POST /login' : 'UserController.userLogin',
  'POST /logout' : 'UserController.userLogout',

  'GET /home' : 'AccountController.getAccounts',
  'GET /home/account/:accid' : 'AccountController.getParticularAccount',
  'POST /home' : 'AccountController.createAccount',
  'PATCH /home/update/:accid' : 'AccountController.updateAccount',
  'DELETE /home/delete/:accid' : 'AccountController.deleteAccount',

  'GET /home/account/:accid/transactions' : 'TransactionsController.getTransactions',
  'POST /home/transaction/create/:accid' : 'TransactionsController.createTransaction',
  'PATCH /home/transaction/update/:transid' : 'TransactionsController.updateTransaction',
  'DELETE /home/transaction/delete/:transid' : 'TransactionsController.deleteTransaction',

  'POST /home/addmember/:accid' : 'MemberController.addMembers',
  'POST /home/deletemember/:accid' : 'MemberController.deleteMembers'
};
