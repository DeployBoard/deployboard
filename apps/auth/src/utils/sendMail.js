import nodemailer from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
const sendMail = async (email, uuid) => {
  // create our html body
  const htmlBody = `
  <h1>DeployBoard Registration</h1>
  <p>
    Visit the following address to complete your registration:
    <a href="https://app.deployboard.io/complete-registration/${uuid}">
      Complete Registration
    </a>
  </p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT === "456" ? true : false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"DeployBoard" <support@deployboard.io>', // sender address
    to: email, // list of receivers
    subject: "DeployBoard Registration", // Subject line
    text: `Visit the following address to complete your registration: https://app.deployboard.io/complete-registration/${uuid}`, // plain text body
    html: htmlBody, // html body
  });

  // Log the message id of the mail that was sent
  console.log("Message sent: %s", info.messageId);
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
    and let us know at <a href="mailto:support@deployboard.io?subject=DeployBoard Security Alert&body=Someone that is not me is attempting to login to my DeployBoard account: ${email}">support@deployboard.io</a>
  </p>
  `;
  const textBody =
    "Due to excessive failed login attempts, your DeployBoard account has been locked for 30 minutes. " +
    "Please contact your administrator to unlock your account, or wait for the lock time to expire. " +
    "If this was not you, please contact your administrator immediately, and let us know at support@deployboard.io";

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT === "456" ? true : false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"DeployBoard" <support@deployboard.io>', // sender address
    to: email, // list of receivers
    subject: "DeployBoard Registration", // Subject line
    text: textBody, // plain text body
    html: htmlBody, // html body
  });

  // Log the message id of the mail that was sent
  console.log("Message sent: %s", info.messageId);
};

export { sendMail, sendLockedMail };
