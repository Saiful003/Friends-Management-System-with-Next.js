import classNames from "classnames";
import React from "react";
import { useTheme } from "../hooks/useTheme";

function IconButton({ icon, isRightIcon, text, deleteFlavour, onClick }) {
  const { isLightTheme } = useTheme();

  return (
    <a
      onClick={onClick}
      className={classNames(
        "w-max border flex select-none items-center gap-2 px-4 py-2 rounded-md cursor-pointer",
        { "flex-row-reverse": isRightIcon },
        { "bg-red-100 text-red-600 hover:bg-red-200": deleteFlavour },
        { " hover:bg-gray-200": !deleteFlavour },
        { "border bg-white": !isLightTheme }
      )}
    >
      <div
        className={classNames(
          {
            "text-red-500": deleteFlavour,
          },
          { "text-gray-500": !deleteFlavour }
        )}
      >
        {icon}
      </div>
      <p className="font-medium">{text}</p>
    </a>
  );
}

export default IconButton;
