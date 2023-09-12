import React, { useEffect, useState } from "react";
import axios from "axios";
import { SuccessBox } from "@/components/successbox";
import { Typeahead } from "@/components/typeahead";

const Home = () => {
  const [showSuccessBox, setShowSuccessBox] = useState(false);
  const [hostList, setHostList] = useState([]);
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    purpose: "",
  });
  const [hostName, setHostName] = useState("");

  const handleChange = (e) => {
    setGuestInfo({ ...guestInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/dbOperation", {
        name: guestInfo.name,
        purpose: guestInfo.purpose,
        host: hostName,
      })
      .then(() => {
        setShowSuccessBox(true);
        handleReset();
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSuccessBox(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showSuccessBox]);

  useEffect(() => {
    const queryParams = {
      hostName: hostName,
    };

    const queryString = new URLSearchParams(queryParams).toString();
    axios.get(`/api/getHostName?${queryString}`).then((response) => {
      setHostList(response.data.results);
    });
  }, [hostName]);

  const handleReset = () => {
    setGuestInfo({
      ...guestInfo,
      name: "",
      purpose: "",
    });
    setHostName("");
  };
  return (
    <div className="p-4 h-[100svh] flex flex-wrap flex-col justify-center items-center space-y-5">
      <h1 className="text-4xl text-sky-600 font-semibold text-center gap-2">
        Presidio - Guest CheckIn
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-[550px] bg-white border-2 border-gray-200 shadow-lg rounded-lg px-5 py-8"
      >
        <label htmlFor="name">Name </label>
        <input
          required
          type="text"
          name="name"
          value={guestInfo.name}
          onChange={handleChange}
          id="name"
          placeholder="Please Enter your Full Name"
          className="input"
        />
        <label htmlFor="purpose" className="mt-3">
          Purpose
        </label>
        <input
          required
          type="textarea"
          name="purpose"
          value={guestInfo.purpose}
          onChange={handleChange}
          id="purpose"
          placeholder="Tell us your reason for visit"
          className="input"
        />
        <label htmlFor="host" className="mt-3">
          Host:{" "}
        </label>
        <Typeahead
          name={"host"}
          value={hostName}
          setValue={setHostName}
          placeholder={"Who do you want to meet with?"}
          className={"input"}
          fetchedRow={hostList}
        />
        <input
          type="submit"
          className="bg-sky-600 text-white rounded-lg mt-5 py-1 cursor-pointer hover:bg-sky-700"
        />
      </form>
      {showSuccessBox && (
        <div className="absolute top-0 bg-white w-full">
          <SuccessBox />
        </div>
      )}
    </div>
  );
};

export default Home;
