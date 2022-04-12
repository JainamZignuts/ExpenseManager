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

  '*': 'getLang',
  UserController: {
    'userLogout' : ['getLang','isAuthenticated'],
  },
  MemberController: {
    '*': ['getLang','isAuthenticated','isAccountuser']
  },
  AccountController: {
    '*': ['getLang','isAuthenticated'],
    'getParticularAccount': ['getLang','isAuthenticated', 'isAccountuser'],
    'updateAccount': ['getLang','isAuthenticated', 'isAccountuser'],
    'deleteAccount': ['getLang','isAuthenticated', 'isAccountuser']
  },
  TransactionsController: {
    'GetTransactions': ['getLang','isAuthenticated', 'isAccountuser'],
    'CreateTransaction': ['getLang','isAuthenticated', 'isAccountuser'],
    'UpdateTransaction': ['getLang','isAuthenticated', 'isTransactionowner'],
    'DeleteTransaction' : ['getLang','isAuthenticated', 'isTransactionowner'],
  }
};
