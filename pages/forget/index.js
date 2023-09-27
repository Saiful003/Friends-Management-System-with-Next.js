import Input from "../../components/Input";
import { useForm } from "react-hook-form";
import Form from "../../components/Form";
import { useRouter } from "next/router";
import Button from "../../components/Button";
import { useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import customAxios from "../../config/axios";
import { showToast } from "../../utils/showToast";
import Alert from "../../components/Alert";

function ForgetPassword() {
  const { query } = useRouter();
  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: { email: query?.email },
  });
  const { errors } = formState;
  const { email } = errors;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isLightTheme } = useTheme();

  // onSubmit function
  const onSubmit = async (data) => {
    try {
      setError(null);
      // enable loading state
      setLoading(true);
      // api call
      await customAxios.patch("/passwordresetcode", data);

      // disable loading state
      setLoading(false);
      // show success toast
      showToast({
        type: "success",
        text: "Reset passoword code send. Please check Gmail",
      });

      reset({ email: "" });
    } catch (err) {
      // disable loading state
      setLoading(false);
      setError(err.response?.data?.message);
    }
  };
  return (
    <Form>
      <h2
        className={`text-center font-medium text-2xl mt-2 mb-4 ${
          !isLightTheme && "text-white"
        }`}
      >
        <span className="text-emerald-500">Forget </span> Password
      </h2>
      {error && <Alert danger errorMessage={error} />}
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <Input
          isError={email?.type === "required"}
          errorMessage={email?.message}
          type="email"
          placeholder="Enter Your Email"
          label="Email"
          {...register("email", {
            required: "This email field is required.",
          })}
        />
        <Button type="submit" fill>
          {loading ? "Sending..." : "Send reset code"}
        </Button>
      </form>
    </Form>
  );
}

export default ForgetPassword;
