import React from "react";

type Props = {
  message: string;
};

const AlertBox = (props: Props) => {
  return (
    <>
      <div
        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2"
        role="alert"
      >
        <p className="font-bold">Error !</p>
        <p>{props.message}</p>
      </div>
    </>
  );
};

export default AlertBox;
