import dbConnect from "../../../../lib/dbConnect";
import { sendResetLink } from "../../../../lib/sendResetLink";
import { responseHandler } from "../../../../utils/responseHandler";
import User from "../../../../Model/userModel";
import generateToken from "../../../../lib/generateToken";

export default async function handler(req, res) {
  const { method, body } = req;

  // connect to database
  await dbConnect();

  if (method === "PATCH") {
    const { email } = body;

    try {
      //  => verification stuff
      if (!email) {
        return responseHandler({
          res,
          message: "Please fill first required input fields!",
          code: 500,
        });
      }

      // find user
      const isExistUser = await User.findOne({ email });
      if (!isExistUser) {
        return responseHandler({
          res,
          message: "User not found!",
          code: 500,
        });
      }
      // create reset code number
      const resetcode = generateToken(20);

      // update user with reset code
      await User.updateOne(
        { email },
        {
          resetcode,
        }
      );
      const linkUrl = `${process.env.SITE_URL}/reset/${resetcode}?email=${email}`;

      await sendResetLink({ linkUrl, email });
      // finally response
      responseHandler({
        res,
        message: `Check your email we sent a reset passoword link`,
        code: 200,
      });
    } catch (err) {
      console.log(err);
      responseHandler({
        res,
        message: "Sending Reset Code Has been failed",
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
