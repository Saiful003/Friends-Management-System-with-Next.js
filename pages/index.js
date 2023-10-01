import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import Card from "../components/Card";
import Container from "../components/Container";
import customAxios from "../config/axios";
import Button from "../components/Button";
import classNames from "classnames";
import { useTheme } from "../hooks/useTheme";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import CardSkeleton from "../components/CardSkeleton";

const Home = () => {
  const [totalFriends, setTotalFriends] = useState([]);
  const [filteredBy, setFilteredBy] = useState("male");
  const [loading, setLoading] = useState(false);
  const { isLightTheme } = useTheme();

  useEffect(() => {
    // start with enable loading
    setLoading(true);
    const getFriends = async () => {
      try {
        const {
          data: { message: friends },
        } = await customAxios.get(`/?gender=${filteredBy}`);
        setTotalFriends(friends);
        // disable loading after 500ms
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (err) {
        // enable loading
        setLoading(true);
        // print error message
        console.log(err.message);
      }
    };
    getFriends();
  }, [filteredBy]);

  const deleteFriend = async (id) => {
    await customAxios.delete(`/friends/${id}`);
    setTotalFriends((prevFriends) =>
      prevFriends.filter((friend) => friend._id !== id)
    );
  };

  return (
    <>
      <Head>
        <title>FMS</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <div className="pt-12 pb-8 flex gap-3">
          <Button
            fill={filteredBy === "male"}
            onClick={() => setFilteredBy("male")}
          >
            Male
          </Button>
          <Button
            fill={filteredBy === "female"}
            onClick={() => setFilteredBy("female")}
          >
            Female
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {loading ? (
            <CardSkeleton cardCount={4} />
          ) : (
            totalFriends.map((singleFriend) => (
              <Card
                key={singleFriend._id}
                name={singleFriend.name}
                age={singleFriend.age}
                id={singleFriend._id}
                introduceBy={singleFriend.introduceBy}
                profession={singleFriend.profession}
                image={singleFriend.image}
                gender={singleFriend.gender}
                onClick={deleteFriend}
              />
            ))
          )}

          <div
            className={`p-3  ${
              totalFriends.length && "flex items-center justify-center"
            } `}
          >
            {totalFriends.length === 0 && !loading && (
              <div className="text-center">
                <h2
                  className={classNames("text-xl font-medium mb-4", {
                    "text-white": !isLightTheme,
                  })}
                >
                  You have no {filteredBy} friend list yet now! Please Create
                  new {filteredBy} friend.
                </h2>
              </div>
            )}
            <Link href="/create">
              <div className="w-12 aspect-square rounded-full flex items-center justify-center mx-auto cursor-pointer bg-emerald-400 hover:bg-emerald-500 shadow-lg">
                <BiPlus className="text-4xl text-white" />
              </div>
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
};

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default Home;
