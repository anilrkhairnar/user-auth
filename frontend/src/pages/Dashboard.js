import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// import icons
import { FaSignOutAlt, FaPen } from "react-icons/fa";

// import toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Cookies from "js-cookie";
import axios from "axios";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [popUpform, setPopUpform] = useState(false);
  const [profileClicked, setProfileClicked] = useState(false);

  const [user, setUser] = useState({});

  // navigator
  const navigate = useNavigate();

  // check session
  const checkSession = async () => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const { data } = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/login`,
          { token },
          {
            withCredentials: true,
          }
        );
        if (data.success === true) {
          data.user.password = "";
          setUser(data.user);
          setLoading(false);
        }
      } catch (error) {
        navigate("/");
        console.log("error while checking session: ", error);
      }
    } else {
      navigate("/");
    }
  };

  // updateProfile function
  const updateProfile = async () => {
    const { name, password } = user;

    if (!name && !password) {
      toast.warn("No changes to update", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/updateProfile`,
        user
      );
      if (data.success === true) {
        toast.success(data.message, { position: toast.POSITION.TOP_CENTER });
        console.log(data.user);
        setUser({ ...data.user });
      }
      setPopUpform(false);
    } catch (error) {
      console.error("error coming while updating profile", error);
    }
  };

  // logout function
  const logout = async () => {
    try {
      Cookies.remove("token");
      navigate("/");
    } catch (error) {
      console.log("error while login out");
      console.log(error);
    }
  };

  useEffect(() => {
    checkSession();
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center gap-4">
        <span className="loader w-2 h-2 rounded-full bg-red-400"></span>
        <span className="loader w-2 h-2 rounded-full bg-red-400"></span>
        <span className="loader w-2 h-2 rounded-full bg-red-400"></span>
      </div>
    );
  } else {
    return (
      <div className="relative w-full h-full bg-[#F3F3F3]">
        <ToastContainer />
        {/* navbar start */}
        <nav className="px-4 py-3 lg:px-32 lg:py-6 flex justify-between items-center bg-white">
          <img
            className="w-32 lg:w-auto cursor-pointer"
            src="./images/logo.svg"
            alt="logo"
          />
          <div className="relative flex items-center gap-6">
            <span className="hidden md:block text-xl text-[#636363] capitalize">
              {user.name}
            </span>
            <img
              onClick={() =>
                profileClicked
                  ? setProfileClicked(false)
                  : setProfileClicked(true)
              }
              className="w-10 rounded-xl cursor-pointer"
              src="./images/user-icon.jpg"
              alt="user-icon"
            />
            {profileClicked && (
              <div
                onClick={logout}
                className="absolute group -bottom-20 -left-24 lg:left-[35%] px-5 py-5 w-36 lg:w-full text-white font-bold bg-red-400 flex justify-center items-center rounded-xl gap-3 hover:scale-105 active:scale-100 duration-200 ease-in-out cursor-pointer"
              >
                <div className="absolute -top-1 left-[80%] lg:left-[50%] w-2 h-2 text-lg bg-red-400 rotate-45 group-hover:scale-105 duration-200 ease-in-out"></div>
                <h4>Log Out</h4>
                <FaSignOutAlt />
              </div>
            )}
          </div>
        </nav>
        {/* navbar end */}
        <div
          onClick={(e) => setProfileClicked(false)}
          className="px-4 py-3 lg:px-32 lg:py-6 mt-10 mb-1 flex items-center gap-6"
        >
          <span className="w-5 h-2 rounded-full bg-[#FB2BFF]"></span>
          <h4 className="text-xl font-medium text-[#636363]">Profile</h4>
        </div>

        <div
          onClick={(e) => setProfileClicked(false)}
          className="px-10 py-16 lg:px-32 lg:py-20 mx-4 lg:mx-32 flex flex-col md:flex-row md:items-center gap-10 md:gap-56 bg-white"
        >
          <img
            className="w-full md:w-52 lg:w-80 rounded-2xl"
            src="./images/user-icon.jpg"
            alt="user-icon"
          />
          <form className="lg:w-3/12 flex flex-col justify-between gap-10">
            <div className="flex flex-col">
              <label className="font-medium text-[#535353]">Name</label>
              <span className="text-[#636363] capitalize">{user.name}</span>
              <input
                type="text"
                id="name-input"
                className="hidden outline-none border-b border-[#E3E3E3] text-[#636363]"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium text-[#535353]">Email</label>
              <span className="text-[#ACACAC]">{user.email}</span>
              <input
                type="text"
                className="hidden outline-none border-b border-[#E3E3E3] text-[#636363]"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium text-[#535353]">Password</label>
              <span className="text-[#636363]">********</span>
              <input
                type="text"
                id="password-input"
                className="hidden outline-none border-b border-[#E3E3E3] text-[#636363]"
              />
            </div>

            <div
              onClick={() => setPopUpform(true)}
              className="p-3 text-base font-bold flex justify-center items-center gap-2 active:bg-blue-600 rounded-lg bg-blue-500 text-white hover:drop-shadow-xl active:drop-shadow-lg duration-200 ease-in-out cursor-pointer"
            >
              Edit Profile
              <FaPen onClick={() => {}} />
            </div>
          </form>
        </div>
        {popUpform && (
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-[#000000a1]">
            <div className="p-3 w-72 h-fit flex flex-col top-52 left-10 z-10 rounded-xl bg-white shadow-xl">
              <h4 className="p-2 mb-4 uppercase text-xl font-bold text-blue-400">
                Edit Profile
              </h4>
              <input
                className="px-2 py-1 mb-3 border-b border-gray-300 focus:border-blue-300 outline-none"
                placeholder="Enter name"
                value={user.name}
                onChange={(e) => {
                  const newUser = { ...user };
                  newUser.name = e.target.value;
                  setUser({ ...newUser });
                }}
                type="text"
              />
              <input
                className="px-2 py-1 mb-3 border-b border-gray-300 focus:border-blue-300 outline-none"
                placeholder="New password"
                value={user.password}
                onChange={(e) => {
                  const newUser = { ...user };
                  newUser.password = e.target.value;
                  setUser({ ...newUser });
                }}
                type="text"
              />

              <div className="flex gap-3">
                <button
                  className="mt-3 p-2 w-full rounded-lg bg-red-300 text-red-900 hover:scale-105 duration-300 ease-in-out active:bg-red-400 active:scale-100"
                  onClick={() => {
                    setPopUpform(false);
                    checkSession();
                  }}
                >
                  Cancel
                </button>
                <button
                  className="mt-3 p-2 w-full rounded-lg bg-blue-300 text-blue-900 hover:scale-105 duration-300 ease-in-out active:bg-blue-400 active:scale-100"
                  onClick={updateProfile}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default Dashboard;
