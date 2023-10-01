import Friend from "../../../../Model/friendsModel";
import dbConnect from "../../../../lib/dbConnect";
import { responseHandler } from "../../../../utils/responseHandler";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { cloudinaryUpload } from "../../../../config/cloudinary";
import { formatBufferTo64 } from "../../../../lib/dataUri";
import { v2 as cloudinary } from "cloudinary";

import nc from "next-connect";
import upload from "../../../../config/multer";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = nc({
  onError: (err, req, res, next) => {
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
})
  .use(upload.single("file"))
  .post(async (req, res) => {
    const session = await getServerSession(req, res, authOptions);
    const { body, file } = req;

    const file64 = formatBufferTo64(file);
    // connect to database
    await dbConnect();

    try {
      // file upload

      const { url } = await cloudinaryUpload(file64.content);
      // Transform

      // create new friend
      const newFriend = new Friend({
        ...body,
        image: {
          url,
        },
        user_id: session?.user?.user_id,
      });
      await newFriend.save();

      responseHandler({
        res,
        message: "Successfully Create a Friend",
        code: 200,
      });
    } catch (err) {
      // console.log(err);
      responseHandler({
        res,
        message: "Friend Created Failed",
        code: 500,
      });
    }
  });
export default handler;
