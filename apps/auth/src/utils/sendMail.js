import nodemailer from "nodemailer";

// TODO: remove the testAccount and use a real mailer in production

// async..await is not allowed in global scope, must use a wrapper
const sendMail = async (email, uuid) => {
  // create our html body
  const htmlBody = `
  <h1>DeployBoard Registration</h1>
  <p>
    Visit the following address to complete your registration:
    <a href="https://localhost:3000/complete-registration/${uuid}">
      Complete Registration
    </a>
  </p>
  `;

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"DeployBoard" <info@deployboard.io>', // sender address
    to: email, // list of receivers
    subject: "DeployBoard Registration", // Subject line
    text: `Visit the following address to complete your registration: https://localhost:3000/complete-registration/${uuid}`, // plain text body
    html: htmlBody, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};

const sendLockedMail = async (email) => {
  // create our html body
  const htmlBody = `
  <h1>Your DeployBoard Account is now locked</h1>
  <p>
    Due to excessive failed login attempts, your account has been locked for 30 minutes.
    <br />
    Please contact your administrator to unlock your account, or wait for the lock time to expire.
    <br />
    <br />
    If this was not you, please contact your administrator immediately,
    and let us know at <a href="mailto:info@deployboard.io?subject=DeployBoard Security Alert&body=Someone that is not me is attempting to login to my DeployBoard account: ${email}">info@deployboard.io</a>
  </p>
  `;
  const textBody =
    "Due to excessive failed login attempts, your DeployBoard account has been locked for 30 minutes. " +
    "Please contact your administrator to unlock your account, or wait for the lock time to expire. " +
    "If this was not you, please contact your administrator immediately, and let us know at info@deployboard.io";

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"DeployBoard" <info@deployboard.io>', // sender address
    to: email, // list of receivers
    subject: "DeployBoard Registration", // Subject line
    text: textBody, // plain text body
    html: htmlBody, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};

export { sendMail, sendLockedMail };
