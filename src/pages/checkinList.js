import React, { useEffect, useState } from "react";
import Axios from "axios";

const CheckInList = () => {
  const [guests, setGuests] = useState([]); // Stores complete information for guest list
  const [guestNames, setGuestNames] = useState([]); // Stores unique names of guests
  const [hostNames, setHostNames] = useState([]); // Stores unique names of hosts

  const [searchQuery, setSearchQuery] = useState("");
  const [filterByGuest, setFilterByGuest] = useState("all");
  const [filterByHost, setFilterByHost] = useState("all");
  const [offset, setOffset] = useState(0);
  const pageSize = 13;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleGuestFilterChange = (e) => {
    setFilterByGuest(e.target.value);
  };

  const handleHostFilterChange = (e) => {
    setFilterByHost(e.target.value);
  };

  useEffect(() => {
    const queryParams = {
      pageSize: pageSize,
      paging: offset,
      search: searchQuery,
      guestFilter: filterByGuest,
      hostFilter: filterByHost,
    };

    const queryString = new URLSearchParams(queryParams).toString();
    Axios.get(`/api/dbOperation?${queryString}`).then((response) => {
      setGuests(response.data.results);
    });
  }, [offset, searchQuery, filterByGuest, filterByHost]);

  useEffect(() => {
    Axios.get("/api/fullList").then((response) => {
      setGuestNames(response.data.guest);
      setHostNames(response.data.host);
    });
  }, []);
  return (
    <div className="w-full max-w-[1200px] mx-auto p-4">
      <div className="bg-white w-full z-10">
        <div className="border-b-2 border-gray-400 py-2 pt-4 text-center">
          <p className="text-sky-600 text-4xl font-bold">
            Presidio - Guest Checkin List
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center my-8 gap-3">
          {/* Search field */}
          <input
            type="text"
            placeholder="Search by guest name, host, or purpose"
            value={searchQuery}
            onChange={handleSearchChange}
            className="p-2 border border-gray-400 rounded-md w-full sm:w-1/3 px-3"
          />
          <div className="flex justify-end items-center gap-6">
            {/* Filter by Guest name */}
            <div>
              <label htmlFor="filterByGuest">Filter by Guest: </label>
              <select
                id="filterByGuest"
                value={filterByGuest}
                onChange={handleGuestFilterChange}
                className={
                  filterByGuest === "all"
                    ? "border border-gray-400 rounded-md p-2"
                    : "text-white bg-sky-600 border border-gray-400 rounded-md p-2"
                }
              >
                <option value="all">All Guests</option>
                {guestNames.map((row) => (
                  <option key={row.name} value={row.name}>
                    {row.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Filter by host name */}
            <div>
              <label htmlFor="filterByHost">Filter by Host: </label>
              <select
                id="filterByHost"
                value={filterByHost}
                onChange={handleHostFilterChange}
                className={
                  filterByHost === "all"
                    ? "border border-gray-400 rounded-md p-2"
                    : "text-white bg-sky-600 border border-gray-400 rounded-md p-2"
                }
              >
                <option value="all">All Hosts</option>
                {hostNames.map((row) => (
                  <option key={row.name} value={row.name}>
                    {row.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <table className="w-full p-2">
          <thead className="">
            <tr className="grid grid-cols-3">
              <th>Guest Name</th>
              <th>Host Name</th>
              <th>Reason for Visit</th>
            </tr>
          </thead>
        </table>
      </div>
      <div className="h-[650px] overflow-y-auto scrollbar-hidden relative">
        <table className="w-full border-2 border-gray-200 p-2">
          <tbody>
            {guests.map((guest) => (
              <tr key={guest.id} className="grid grid-cols-3">
                <td>{guest.name}</td>
                <td>{guest.host}</td>
                <td>{guest.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => setOffset(Math.max(0, offset - pageSize))}
          className="px-3 py-1 rounded-md bg-sky-600 hover:bg-sky-700 text-white"
        >
          Prev Page
        </button>
        <button
          onClick={() => {
            if (guests.length == pageSize) {
              setOffset(offset + pageSize);
            }
          }}
          className="px-3 py-1 rounded-md bg-sky-600 hover:bg-sky-700 text-white"
        >
          Next Page
        </button>
      </div>
    </div>
  );
};

export default CheckInList;
