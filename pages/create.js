import Input from "../components/Input";
import { useForm } from "react-hook-form";
import Form from "../components/Form";
import { useRouter } from "next/router";
import customAxios from "../config/axios";
import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import classNames from "classnames";
import { showToast } from "../utils/showToast";
import { useSession } from "next-auth/react";

function CreateNewFriend() {
  const { register, handleSubmit, formState } = useForm();
  const { errors } = formState;
  const { name, age, introduceBy, profession } = errors;
  const router = useRouter();
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isLightTheme } = useTheme();

  const { status } = useSession();

  if (status === "unauthenticated") {
    router.push("/login");
  }

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  // onSubmit function
  const onSubmit = async (data) => {
    //validation first
    if (!imageFile) {
      return setError("Please insert your friend image");
    }

    // enable loading state
    setLoading(true);

    const form = new FormData();
    form.append("name", data.name);
    form.append("age", data.age);
    form.append("introduceBy", data.introduceBy);
    form.append("profession", data.profession);
    form.append("gender", data.gender);
    form.append("file", imageFile);
    await customAxios.post("/create", form);
    // disable loading state
    setLoading(false);
    // show success toast
    showToast({
      text: "Successfully Created!",
      type: "success",
    });
    router.replace("/");
  };

  return (
    <Form>
      <h2
        className={classNames("text-center font-medium text-2xl mt-2 mb-4", {
          "text-white": !isLightTheme,
        })}
      >
        Create new friend
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
            required: "Please enter your friend name",
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
        <select className="border min-h-[50px] px-6" {...register("gender")}>
          <option selected value="male">
            male
          </option>
          <option value="female">female</option>
        </select>
        {error && <span className="text-red-500 text-sm">{error}</span>}
        <input onChange={handleImage} type="file" name="file" />
        <button
          type="submit"
          className="px-3 py-2 mt-2 rounded-sm bg-emerald-500 hover:bg-emerald-600 text-white font-medium"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </Form>
  );
}

export default CreateNewFriend;
