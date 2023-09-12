import React from "react";
import { AiOutlineCheck } from "react-icons/ai";

export const SuccessBox = () => {
  return (
    <div className="flex flex-wrap h-[100svh] justify-center items-center">
      <div>
        <AiOutlineCheck className="text-[14rem] text-green-500" />
        <p className="text-xl">Successfully Checked In</p>
      </div>
    </div>
  );
};
