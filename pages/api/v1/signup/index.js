import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../Model/userModel";
import { responseHandler } from "../../../../utils/responseHandler";
import bcrypt from "bcrypt";
import { generateOtp } from "../../../../utils/generateOtp";
import { sendOtpViaMail } from "../../../../lib/sendOtpMail";

export default async function handler(req, res) {
  const { method, body } = req;

  // connect to database
  await dbConnect();

  if (method === "POST") {
    const { name, email, password, confirmPassword } = body;
    const saltRound = 10;

    try {
      // ====> validation start
      if (!name || !email || !password || !confirmPassword) {
        return responseHandler({
          res,
          message: "Please fill first required input fields!",
          code: 500,
        });
      }

      if (password !== confirmPassword)
        return responseHandler({
          res,
          message: "Password and Confirm Did not match!",
          code: 500,
        });
      const isExistUser = await User.findOne({ email });

      if (isExistUser && isExistUser.isVerifiedUser) {
        return responseHandler({
          res,
          message: "You are already a verified user",
          code: 500,
        });
      }

      // when user is not verified
      if (isExistUser && !isExistUser.isVerifiedUser) {
        // only user verification process
        // create otp number
        const otp = generateOtp();
        const hashedOtp = await bcrypt.hash(otp.toString(), saltRound);
        // compare passowrd
        const isValidPassword = await bcrypt.compare(
          password,
          isExistUser.password
        );
        if (!isValidPassword) {
          return responseHandler({
            res,
            message: "Wrong Password!",
            code: 500,
          });
        }
        await User.updateOne(
          { email },
          { $set: { otp: { otpcode: hashedOtp }, name } }
        );

        // send otp to user email
        await sendOtpViaMail(email, otp);

        return responseHandler({
          res,
          message: `Check your email we sent a verification code ${otp}`,
          code: 200,
        });
      }
      // ====> validation end

      //===> Basic sign up workflow start

      // create otp number
      const otp = generateOtp();

      // // hashed password
      const hashedPassword = await bcrypt.hash(password, saltRound);
      // // hashed otp
      const hashedOtp = await bcrypt.hash(otp.toString(), saltRound);

      // // save user
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        otp: {
          otpcode: hashedOtp,
          expiresIn: Date.now() + 60000,
        },
      });
      await newUser.save();

      // send otp to user email
      await sendOtpViaMail(email, otp);

      responseHandler({
        res,
        message: `User (unverified) Created Successfully Otp is ${otp} `,
        code: 200,
      });

      //===> Basic sign up workflow end
    } catch (err) {
      console.log(err);
      responseHandler({
        res,
        message: "User Created Failed",
        code: 500,
      });
    }
  } else {
    responseHandler({
      res,
      message: "Incorrect HTTTP Request",
      code: 500,
    });
  }
}
