import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// package to store cookie in browser
import Cookies from "js-cookie";

// import icons
import { FaUserPlus } from "react-icons/fa";

// import toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  // navigator
  const navigate = useNavigate();

  // states
  const [user, setUser] = useState({});

  // handling submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = user;

    if (!(name && email && password)) {
      toast.warn("All fields are required", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      try {
        const { data } = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/register`,
          user
        );

        if (data.success === true) {
          Cookies.set("token", data.token, {
            expires: 20,
            path: "/",
          });
          navigate("/dashboard");
        }
      } catch (error) {
        error.response.data?.validMessage &&
          toast.error(error.response.data?.validMessage);
        console.log("error while signup user", error.response.data.message);
      }
    }
  };
  return (
    <div className="w-full h-full flex justify-center items-center bg-blue-50">
      <ToastContainer />
      <form className="p-10 lg:w-3/12 flex flex-col gap-4 bg-white rounded-lg shadow-lg z-10">
        <h1 className="text-2xl font-extrabold text-center text-blue-500 uppercase">
          SignUp
        </h1>
        <input
          type="text"
          placeholder="Name"
          className="p-3 text-base border-b border-gray-300 focus:border-blue-400 outline-none"
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email Address"
          className="p-3 text-base border-b border-gray-300 focus:border-blue-400 outline-none"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="p-3 text-base border-b border-gray-300 focus:border-blue-400 outline-none"
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
        <div
          onClick={handleSubmit}
          className="p-3 text-base font-bold flex justify-center items-center gap-2 active:bg-blue-600 rounded-lg bg-blue-500 text-white hover:drop-shadow-xl active:drop-shadow-lg duration-200 ease-in-out cursor-pointer"
        >
          <FaUserPlus className="text-xl" />
          <button>SignUp</button>
        </div>
      </form>
      <div className="absolute top-32 left-20 w-52 h-52 rounded-full bg-pink-200 blur-2xl"></div>
      <div className="absolute bottom-32 right-64 w-52 h-52 rounded-full bg-blue-200 blur-2xl"></div>
    </div>
  );
};

export default Signup;
