import { forwardRef, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import classNames from "classnames";
import { useTheme } from "../hooks/useTheme";

const Input = forwardRef(
  ({ label, name, type, placeholder, isError, errorMessage, ...rest }, ref) => {
    const [passwordType, setPasswordType] = useState(true);
    const { isLightTheme } = useTheme();

    const handleTypeSelection = (inputType) => {
      if (inputType === "password") {
        if (passwordType) {
          return "password";
        }
        return "text";
      }
      return inputType;
    };

    return (
      <div>
        <label
          className={classNames(
            "block mb-2 font-bold",
            { "text-black": isLightTheme },
            { "text-white": !isLightTheme }
          )}
          htmlFor={name}
        >
          {label} :
        </label>
        <div className="relative">
          <input
            className={classNames(
              "border w-full focus:outline-none bg-transparent focus:border-emerald-300 min-h-[50px] px-4 rounded-md placeholder:select-none font-semibold ",
              { "text-white": !isLightTheme }
            )}
            placeholder={placeholder}
            type={handleTypeSelection(type)}
            id={name}
            name={name}
            {...rest}
            ref={ref}
          />
          {type === "password" && (
            <div
              onClick={() => setPasswordType(!passwordType)}
              className="absolute text-2xl right-2 top-0 bottom-0 flex items-center cursor-pointer"
            >
              {passwordType ? (
                <AiOutlineEyeInvisible className="text-gray-500" />
              ) : (
                <AiOutlineEye className="text-gray-500" />
              )}
            </div>
          )}
        </div>
        {isError && (
          <span className="text-red-500 text-sm">{errorMessage}</span>
        )}
      </div>
    );
  }
);
Input.displayName = "CustomComponent";
export default Input;
