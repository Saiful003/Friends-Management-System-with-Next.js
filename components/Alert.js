import React from "react";
import { BsFillExclamationTriangleFill } from "react-icons/bs";
import classNames from "classnames";

function Alert({ errorMessage, successMessage, danger, success }) {
  return (
    <div className="flex">
      <div
        className={classNames(
          "flex items-center justify-center rounded-sm gap-4 mx-auto my-4 py-3 px-6",
          { "bg-red-200": danger },
          { "bg-green-200": success }
        )}
      >
        <div>
          <BsFillExclamationTriangleFill
            className={classNames(
              "text-xl",
              { "text-red-500": danger },
              { "text-green-500": success }
            )}
          />
        </div>
        <p
          className={classNames(
            "font-medium text-center",
            { "text-red-600": danger },
            { "text-green-600": success }
          )}
        >
          {errorMessage || successMessage}
        </p>
      </div>
    </div>
  );
}

export default Alert;
