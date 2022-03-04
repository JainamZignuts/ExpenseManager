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
  'POST /signup' : 'UserController.UserSignup',
  'POST /login' : 'UserController.UserLogin',

  'GET /home' : 'AccountController.GetAccounts',
  'GET /home/account/:id' : 'AccountController.GetParticularAccount',
  'POST /home' : 'AccountController.CreateAccount',
  'PATCH /home/update/:id' : 'AccountController.UpdateAccount',
  'DELETE /home/delete/:id' : 'AccountController.DeleteAccount',

  'GET /home/account/:id/transactions' : 'TransactionsController.GetTransactions',
  'POST /home/transaction/create/:id' : 'TransactionsController.CreateTransaction',
  'PATCH /home/transaction/update/:id' : 'TransactionsController.UpdateTransaction',
  'DELETE /home/transaction/delete/:id' : 'TransactionsController.DeleteTransaction',

  'POST /home/addmember/:id' : 'MemberController.AddMembers',
  'POST /home/deletemember/:id' : 'MemberController.DeleteMembers'
};
