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
  'GET /home/account/:id' : 'AccountController.getParticularAccount',
  'POST /home' : 'AccountController.createAccount',
  'PATCH /home/update/:id' : 'AccountController.updateAccount',
  'DELETE /home/delete/:id' : 'AccountController.deleteAccount',

  'GET /home/account/:id/transactions' : 'TransactionsController.getTransactions',
  'POST /home/transaction/create/:id' : 'TransactionsController.createTransaction',
  'PATCH /home/transaction/update/:id' : 'TransactionsController.updateTransaction',
  'DELETE /home/transaction/delete/:id' : 'TransactionsController.deleteTransaction',

  'POST /home/addmember/:id' : 'MemberController.addMembers',
  'POST /home/deletemember/:id' : 'MemberController.deleteMembers'
};
