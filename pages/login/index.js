import Input from "../../components/Input";
import { useForm } from "react-hook-form";
import Form from "../../components/Form";
import Link from "next/link";
import { useRouter } from "next/router";
import Alert from "../../components/Alert";
import Button from "../../components/Button";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { showToast } from "../../utils/showToast";

function Login() {
  const { register, handleSubmit, formState } = useForm();
  const [error, setError] = useState(null);
  const { errors } = formState;
  const { email, password } = errors;
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const router = useRouter();
  const { isLightTheme } = useTheme();

  // onSubmit function
  const onSubmit = async (data) => {
    // enable loading state
    setLoading(true);
    setUserEmail(data.email);
    setError(null);

    // // actual login process goes to here
    const result = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    if (!result.ok) {
      // do your stuff...
      setError("Authentication Failed!");
      setLoading(false);
      return;
    }
    // normal stuff.../
    setLoading(false);
    // show success toast
    showToast({
      text: "Login Successfull",
      type: "success",
    });
    router.push("/");
  };
  return (
    <Form>
      <h2
        className={`text-center font-medium text-2xl mt-2 mb-4 ${
          !isLightTheme && "text-white"
        }`}
      >
        <span className="text-emerald-500">Login </span> Please
      </h2>
      {error && <Alert danger errorMessage={error} />}
      <div className="text-center">
        <Button
          onClick={() => {
            signIn("google", {
              callbackUrl: "https://friends-management.vercel.app/",
            });
          }}
          type="submit"
          fill
        >
          Sign in with Google
        </Button>
      </div>
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
        <Input
          isError={password?.type === "required"}
          errorMessage={password?.message}
          type="password"
          placeholder="Enter Your Password"
          label="Password"
          {...register("password", {
            required: "This password field is required.",
          })}
        />
        <Button type="submit" fill>
          {loading ? "Processing..." : "Login"}
        </Button>
        <p className={`${!isLightTheme && "text-white"}`}>
          Don&apos;t have an account ?
          <strong>
            <Link href="/signup">
              <a className="hover:underline text-emerald-500"> Sign up </a>
            </Link>
          </strong>
          please.
        </p>{" "}
        {/* {error === "Authentication failed" && ( */}
        <strong>
          <Link href={{ pathname: "/forget", query: { email: userEmail } }}>
            <a className="hover:underline text-emerald-500">
              Forget your passowrd?
            </a>
          </Link>
        </strong>
        {/* )} */}
      </form>
    </Form>
  );
}

export default Login;
