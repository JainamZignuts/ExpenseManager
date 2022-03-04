module.exports = {
  attributes: {
    firstname: {
      type: 'string',
      required: true,
    },
    lastname: {
      type: 'string',
      required: true,
    },
    email: {
      type: 'string',
      required: true,
      isEmail: true,
    },
    password: {
      type: 'string',
      required: true,
      minLength: 8,
    },

    // Add a reference to account
    accounts: {
      collection: 'account',
      via: 'owners',
      through: 'accountuser',
    },
  },

  afterCreate: async function (users, proceed) {
    try {
      await sails.helpers.sendWelcomeEmail.with({
        to: users.email,
      });
      let acc = await Account.create({
        accountname: users.firstname + ' default',
        owners: users.id,
      }).fetch();
      console.log(acc);
    } catch (err) {
      console.log(err);
    }
    proceed();
  },
};
