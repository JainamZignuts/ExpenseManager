module.exports = {
  friendlyName: 'Send welcome email',

  description: '',

  inputs: {
    to: {
      type: 'string',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  fn: async function (inputs) {
    const nodemailer = require('nodemailer');
    var transport = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: 'cfff83165f9b0f',
        pass: '33f74670c14b0a',
      },
    });
    var data = {
      from: 'expensemanager@gmail.com',
      to: inputs.to,
      subject: 'Welcome email',
      text: 'Welcome to expense manager application',
    };
    console.log(data);
    transport.sendMail(data, (err) => {
      if (err) {
        console.log('Error occured : ' + err);
      } else {
        console.log('Email sent');
      }
    });
  },
};
