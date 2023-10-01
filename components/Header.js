import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import Button from "./Button";
import Container from "./Container";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import IconButton from "./IconButton";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useTheme } from "../hooks/useTheme";
import classNames from "classnames";
import { showToast } from "../utils/showToast";

function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isLightTheme, handleSwitchTheme } = useTheme();
  console.log(session);

  return (
    <header
      className={classNames(
        "shadow-sm",
        {
          "border-b ": isLightTheme,
        },
        { "bg-slate-800 border-b border-b-slate-700": !isLightTheme }
      )}
    >
      <Container>
        <div className="flex flex-col lg:flex-row md:justify-between gap-y-4 items-center min-h-[80px] py-3 lg:py-0">
          <Link href="/">
            <h2 className="mr-4 cursor-pointer text-2xl font-medium text-emerald-500">
              FMS
            </h2>
          </Link>
          <div className="flex  flex-wrap items-center gap-4">
            {status === "authenticated" && (
              <>
                <p className=" bg-emerald-500 text-white font-medium px-4 py-2 rounded-md">
                  {session?.user?.name}
                </p>
                <Link href="/create">
                  <Button fill>Create new friend</Button>
                </Link>
                <Button
                  onClick={() => {
                    signOut({ redirect: false });
                    // success logout toast
                    showToast({
                      text: "Logout successfull",
                      type: "success",
                    });
                    router.replace("/login");
                  }}
                  outline
                >
                  Logout
                </Button>
              </>
            )}
            {status === "unauthenticated" && (
              <>
                <Link href="/signup">
                  <Button fill>Sign up</Button>
                </Link>
                <Link href="/login">
                  <Button outline>Login</Button>
                </Link>
              </>
            )}
            <IconButton
              icon={isLightTheme ? <MdLightMode /> : <MdDarkMode />}
              text={isLightTheme ? "Light" : "Dark"}
              isRightIcon
              isNoTextInMobile
              onClick={handleSwitchTheme}
            />
          </div>
        </div>
      </Container>
    </header>
  );
}

export default Header;
