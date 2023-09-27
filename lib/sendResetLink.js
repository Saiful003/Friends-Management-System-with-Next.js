import nodemailer from "nodemailer";
import passwordResetTemplate from "../emailTemplates/passwordResetTemplate";

export const sendResetLink = ({ linkUrl, email }) => {
  // create transporter
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  // mail options
  let mailOptions = {
    from: `"FMS" <${process.env.MAIL_PASSWORD}>`,
    to: email,
    subject: "Reset Password",
    html: passwordResetTemplate(linkUrl),
  };

  // send mail
  return transporter.sendMail(mailOptions);
};
