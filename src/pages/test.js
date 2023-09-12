import React, { useState } from "react";

const Test = () => {
  const [name, setName] = useState("Not working");
  return (
    <div className="mx-auto w-fit p-8 space-y-8">
      <InputFiled
        name={name}
        setName={setName}
        placeholder={"Enter your Name"}
      />
    </div>
  );
};

export default Test;

const InputFiled = ({ name, setName, placeholder }) => {
  return (
    <div>
      <p>{name}</p>
      <button onClick={() => setName("working")}>Click me</button>
      <button onClick={() => setName("Working good")}>Click me</button>
      <input name="First Name" placeholder={placeholder} />
    </div>
  );
};
