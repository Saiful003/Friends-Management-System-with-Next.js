import nodemailer from "nodemailer";
import otpTempplate from "../emailTemplates/otpTemplate";
export const sendOtpViaMail = (email, otp) => {
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
    from: `"FMS 👻" <${process.env.MAIL_PASSWORD}>`,
    to: email,
    subject: "Email Verification With OTP",
    html: otpTempplate(otp),
  };

  // send mail
  return transporter.sendMail(mailOptions);
};
