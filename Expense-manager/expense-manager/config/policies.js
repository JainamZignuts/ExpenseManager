/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  // '*': 'isAuthenticated',
  UserController: {
    'userLogout' : 'isAuthenticated'
  },
  // 'user/userSignup' : true,
  // 'user/userLogin' : true,
  // 'member/DeleteMembers':['isAuthenticated','isAccountuser']
  MemberController: {
    '*': ['isAuthenticated','isAccountuser']
  },
  AccountController: {
    '*': 'isAuthenticated',
    'getParticularAccount': ['isAuthenticated', 'isAccountuser'],
    'updateAccount': ['isAuthenticated', 'isAccountuser'],
    'deleteAccount': ['isAuthenticated', 'isAccountuser']
  },
  TransactionsController: {
    'GetTransactions': ['isAuthenticated', 'isAccountuser'],
    'CreateTransaction': ['isAuthenticated', 'isAccountuser'],
    'UpdateTransaction': ['isAuthenticated', 'isTransactionowner'],
    'DeleteTransaction' : ['isAuthenticated', 'isTransactionowner'],
  }
};
