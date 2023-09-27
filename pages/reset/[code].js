import Input from "../../components/Input";
import { useForm } from "react-hook-form";
import Form from "../../components/Form";
import { useRouter } from "next/router";
import Alert from "../../components/Alert";
import { useState } from "react";
import Button from "../../components/Button";
import customAxios from "../../config/axios";
import { useTheme } from "../../hooks/useTheme";
import { showToast } from "../../utils/showToast";

function ResetPassword() {
  const { register, handleSubmit, formState } = useForm();
  const { errors } = formState;
  const { newPassword, confirmNewPassword } = errors;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isLightTheme } = useTheme();
  const router = useRouter();
  const { code: passwordResetCode, email } = router.query;

  // onSubmit function
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      // api call
      await customAxios.patch("/resetpassword", {
        email,
        passwordResetCode,
        ...data,
      });
      setLoading(false);
      router.push("/login");
      showToast({ text: "Password reset succesfully done!", type: "success" });
    } catch (err) {
      setError(err.response?.data?.message);
      setLoading(false);
    }
  };

  return (
    <Form>
      <h2
        className={`text-center font-medium text-2xl mt-2 mb-4 ${
          !isLightTheme && "text-white"
        }`}
      >
        <span className="text-emerald-500"> Reset </span> Password
      </h2>
      {error && <Alert danger errorMessage={error} />}

      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <Input
          isError={newPassword?.type === "required"}
          errorMessage={newPassword?.message}
          type="password"
          placeholder="Enter Your New Password"
          label="New password"
          {...register("newPassword", {
            required: "This password field is required.",
          })}
        />
        <Input
          isError={confirmNewPassword?.type === "required"}
          errorMessage={confirmNewPassword?.message}
          type="password"
          placeholder="Enter Your Confirm Password"
          label="Confirm Password"
          {...register("confirmNewPassword", {
            required: "This confirm password field is required.",
          })}
        />
        <Button style="mt-2" type="submit" fill>
          {loading ? "Processing..." : "Reset Password"}
        </Button>
      </form>
    </Form>
  );
}

export default ResetPassword;
