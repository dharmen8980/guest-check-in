import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

export const Typeahead = ({
  name,
  value,
  placeholder,
  className,
  fetchedRow,
  setValue,
}) => {
  const [showList, setShowList] = useState(false);
  const handleHostChange = (e) => {
    setValue(e.target.value);
    setShowList(true);
  };

  return (
    <>
      <input
        type="text"
        name={name}
        value={value}
        onChange={handleHostChange}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
        required
      />
      {showList && (
        <div className="w-full relative">
          <div className="absolute z-10 w-full bg-white p-4 border-2 border-gray-200 shadow-md rounded-lg">
            <p className="flex justify-end font-bold">
              <AiOutlineClose
                onClick={() => {
                  setShowList(false);
                }}
                className="cursor-pointer text-xl"
              />
            </p>
            {fetchedRow.map((row) => (
              <p
                key={row.name}
                onClick={() => {
                  setValue(row.name);
                  setShowList(false);
                }}
                className="hover:bg-gray-200 text-gray-500 w-full px-2"
              >
                {row.name}
              </p>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
