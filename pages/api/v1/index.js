import dbConnect from "../../../lib/dbConnect";
import Friend from "../../../Model/friendsModel";
import { responseHandler } from "../../../utils/responseHandler";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  const { method, query } = req;
  // connect to database
  await dbConnect();

  if (method === "GET") {
    try {
      const allFriends = await Friend.find({
        user_id: session.user.user_id,
        gender: query.gender,
      });

      responseHandler({
        res,
        message: allFriends,
        code: 200,
      });
    } catch (err) {
      // console.log(err);
      responseHandler({
        res,
        message: "Failed to get all friends",
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
