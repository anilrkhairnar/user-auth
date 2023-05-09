import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

// import icons
import { FaUser, FaUserPlus } from "react-icons/fa";

// import toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";
import Cookies from "js-cookie";

const Login = () => {
  // navigator
  const navigate = useNavigate();

  // states
  const [user, setUser] = useState({});

  // handling submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = user;

    if (!(email && password)) {
      toast.warn("All fields are required", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      try {
        console.log("this is user: ", user);
        const { data } = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/login`,
          user
        );

        if (data.success === true) {
          console.log(data.token);
          Cookies.set("token", data.token, {
            expires: 20,
            path: "/",
          });
          navigate("/dashboard");
        }
      } catch (error) {
        error.response.data?.validMessage
          ? toast.error(error.response.data?.validMessage, {
              position: toast.POSITION.TOP_CENTER,
            })
          : toast.error(error.response.data?.message, {
              position: toast.POSITION.TOP_CENTER,
            });
        console.log(error.response.data?.message);
      }
    }
  };

  // check if user token is there
  // before Login
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
          navigate("/dashboard");
        }
      } catch (error) {
        console.log("error while checking session: ", error);
      }
    }
  };

  useEffect(() => {
    checkSession();
    // eslint-disable-next-line
  }, []);
  return (
    <div className="w-full h-full flex justify-center items-center bg-blue-50">
      <ToastContainer />
      <form className="p-10 lg:w-3/12 flex flex-col gap-4 bg-white rounded-lg shadow-lg z-10">
        <h1 className="text-2xl font-extrabold text-center text-blue-500 uppercase">
          Login
        </h1>
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
          <FaUser />
          <button>Log In</button>
        </div>
        <hr />
        <div className="text-center">
          <h3 className="text-sm text-gray-400">Don't have account yet</h3>
          <h3 className="text-base text-gray-600">let's create</h3>
        </div>

        <Link
          className="p-3 text-base font-bold flex justify-center items-center gap-2 text-center border border-blue-500 text-blue-500 hover:bg-blue-500 active:bg-blue-600 hover:text-white hover:drop-shadow-xl active:drop-shadow-lg rounded-lg duration-200 ease-in-out"
          to="/signup"
        >
          <FaUserPlus size={20} />
          SignUp
        </Link>
      </form>
      <div className="absolute top-32 left-20 w-52 h-52 rounded-full bg-pink-200 blur-2xl"></div>
      <div className="absolute bottom-32 right-64 w-52 h-52 rounded-full bg-blue-200 blur-2xl"></div>
    </div>
  );
};

export default Login;
