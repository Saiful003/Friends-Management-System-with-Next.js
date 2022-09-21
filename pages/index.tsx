import Head from "next/head";
import { IFriend } from "../types";
import supabase from "../config/supabase";
import Card from "../components/Card";
import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { useRouter } from "next/router";
import Container from "../components/Container";
import { useAuth } from "../context/authContext";
import { useProtectPage } from "../hooks/useProtectPage";

const Home = () => {
  const [myFriends, setMyFriends] = useState<IFriend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [orderBy, setOrderBy] = useState<string>("created_at");
  const router = useRouter();
  const { user } = useAuth();

  // protect this page
  useProtectPage();

  // fetch friends
  const getFriends = async () => {
    const { data: friends, error } = await supabase
      .from("friends")
      .select("*")
      .order(orderBy, { ascending: false });
    if (friends) {
      setLoading(false);
      setError(null);
      setMyFriends(friends);
    }
    if (error) {
      setLoading(true);
      setError("There was an error occured!");
    }
  };

  useEffect(() => {
    getFriends();
  }, [orderBy]);

  // delete friend
  const deleteFriend = async (id: number) => {
    const { error } = await supabase.from("friends").delete().match({ id });
    const remainFriend = myFriends.filter((friend) => friend.id !== id);
    if (!error) {
      setMyFriends(remainFriend);
    }
  };
  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <Container>
        <h2 className="text-xl font-medium mt-3"> Loading... </h2>
      </Container>
    );
  }

  return (
    <>
      <Head>
        <title>Learn Supabase - An alternative of firebase</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mt-6">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {myFriends.map(({ age, id, introduceBy, name, profession }) => (
              <Card
                key={id}
                age={age}
                id={id}
                introduceBy={introduceBy}
                profession={profession}
                name={name}
                deleteFriend={deleteFriend}
              />
            ))}
            <div
              className={`border border-emerald-200 p-3  ${
                myFriends.length && "flex items-center justify-center"
              } `}
            >
              {!myFriends.length && (
                <div className="text-center">
                  <h2 className="text-xl font-medium mb-4">
                    You have no friend list yet now! Please Create new friend.
                  </h2>
                </div>
              )}
              <div
                onClick={() => router.push("/create")}
                className="w-12 aspect-square rounded-full flex items-center justify-center mx-auto cursor-pointer bg-emerald-400 hover:bg-emerald-500 shadow-lg"
              >
                <BiPlus className="text-4xl text-white" />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

// export const getServerSideProps: GetServerSideProps = async () => {
//   const { data: friends } = await supabase
//     .from("friends")
//     .select("*")
//     .order("created_at", { ascending: false });

//   return {
//     props: { friends }, // will be passed to the page component as props
//   };
// };

export default Home;
