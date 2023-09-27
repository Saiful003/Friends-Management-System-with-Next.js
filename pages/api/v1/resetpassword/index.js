import dbConnect from "../../../../lib/dbConnect";
import { responseHandler } from "../../../../utils/responseHandler";
import bcrypt from "bcrypt";
import User from "../../../../Model/userModel";

export default async function handler(req, res) {
  const { method, body } = req;

  // connect to database
  await dbConnect();

  if (method === "PATCH") {
    const { email, passwordResetCode, newPassword, confirmNewPassword } = body;

    try {
      //  => Validation First
      // => Workflow Last
      if (!email || !passwordResetCode || !newPassword || !confirmNewPassword) {
        return responseHandler({
          res,
          message: "Please fill first required input fields!",
          code: 500,
        });
      }
      if (newPassword !== confirmNewPassword) {
        return responseHandler({
          res,
          message: "new password and confirm new password does not match",
          code: 500,
        });
      }

      // => Password Reset Code Validation
      const { resetcode } = await User.findOne({ email });

      if (passwordResetCode !== resetcode) {
        return responseHandler({
          res,
          message: "passoword reset code doesn't match",
          code: 500,
        });
      }

      // => Error free area start
      // hashed this new password
      const saltRound = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRound);
      // update user with this hashed password
      await User.updateOne({ email }, { password: hashedNewPassword });

      // finally response
      responseHandler({
        res,
        message: "Password Uppdated!",
        code: 200,
      });
      // => Error free area end
    } catch (err) {
      responseHandler({
        res,
        message: "Password Update failed!!",
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
