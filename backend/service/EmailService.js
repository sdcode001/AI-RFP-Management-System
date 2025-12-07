const path = require("path");
const sgMail = require("@sendgrid/mail");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendRfpEmail = async ({ toEmail, subject, html, plainText}) => {
  try{
    const msg = {
      to: toEmail,
      from: process.env.EMAIL_FROM,
      subject,
      text: plainText,
      html,
      replyTo: process.env.INBOUND_REPLY_TO
    };
    return sgMail.send(msg);
  }
  catch(err){
    throw err;
  }
};

module.exports={
    sendRfpEmail
}
