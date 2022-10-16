import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Form from "../../components/Form";
import Input from "../../components/Input";
import customAxios from "../../config/axios";
import { useTheme } from "../../hooks/useTheme";
import { showToast } from "../../utils/showToast";

function FriendDetail({ friend }) {
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUpload, setImageUpload] = useState(false);
  const { isLightTheme } = useTheme();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };
  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      name: friend.name,
      age: friend.age,
      introduceBy: friend.introduceBy,
      profession: friend.profession,
    },
  });
  const { errors } = formState;
  const { name, age, introduceBy, profession } = errors;
  const router = useRouter();

  // onSubmit function
  const onSubmit = async (data) => {
    if (!imageUpload) {
      await customAxios.put(`/friends/${router.query.id}`, data);
      showToast({
        text: "Successfully Updated!",
        type: "success",
      });
      router.replace("/");
      return;
    }

    if (!imageFile) {
      return setError("Please insert your friend image");
    }

    // enable loading state
    setError(null);
    setLoading(true);

    const form = new FormData();
    form.append("name", data.name);
    form.append("age", data.age);
    form.append("introduceBy", data.introduceBy);
    form.append("profession", data.profession);
    form.append("file", imageFile);
    await customAxios.put(`/friends/imageUpdate/${router.query.id}`, form);

    // disable loading state
    setLoading(false);
    showToast({
      text: "Successfully Image Updated!",
      type: "success",
    });
    router.replace("/");
  };

  return (
    <>
      <Head>
        <title>Update Friend</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Form>
        <h2
          className={`text-center font-medium text-2xl mt-2 mb-4 ${
            !isLightTheme && "text-white"
          } `}
        >
          Update Existing Friend
        </h2>
        <form
          encType="multipart/form-data"
          className="flex flex-col gap-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            isError={name?.type === "required"}
            errorMessage={name?.message}
            type="text"
            placeholder="Enter Your Friend Name"
            label="Friend Name"
            {...register("name", {
              required: "This friend name field is required.",
            })}
          />
          <Input
            isError={profession?.type === "required"}
            errorMessage={profession?.message}
            type="text"
            placeholder="Enter Your Friend Profession"
            label="Profession"
            {...register("profession", {
              required: "This sector field is required.",
            })}
          />
          <Input
            isError={introduceBy?.type === "required"}
            errorMessage={introduceBy?.message}
            type="text"
            placeholder="How introduce your friend ?"
            label="Introduce"
            {...register("introduceBy", {
              required: "This introduce field is required.",
            })}
          />
          <Input
            isError={age?.type === "required"}
            errorMessage={age?.message}
            type="number"
            placeholder="Enter your friend age"
            label="Age"
            {...register("age", {
              required: "This age field is required.",
            })}
          />
          <select {...register("gender")}>
            <option selected={friend.gender === "male"} value="male">
              male
            </option>
            <option selected={friend.gender === "female"} value="female">
              female
            </option>
          </select>
          <p
            className={`${!isLightTheme && "text-white"} `}
            onClick={() => {
              setImageUpload(true);
            }}
          >
            Click for update image
          </p>
          {error && <span className="text-red-500 text-sm">{error}</span>}
          {imageUpload && (
            <input onChange={handleImage} type="file" name="file" />
          )}
          <p
            className={` ${!imageUpload && "hidden"} ${
              !isLightTheme && "text-white"
            } `}
            onClick={() => {
              setImageUpload(false);
              setError(null);
            }}
          >
            Cancel update image
          </p>

          <button
            type="submit"
            className="px-3 py-2 mt-2 rounded-sm bg-emerald-500 hover:bg-emerald-600 text-white font-medium"
          >
            {loading ? "Updating..." : " Update"}
          </button>
        </form>
      </Form>
    </>
  );
}

// run build time

export async function getServerSideProps({ params }) {
  const { data } = await customAxios.get(`/friends/${params.id}`);
  return {
    props: { friend: data.message },
  };
}

export default FriendDetail;
