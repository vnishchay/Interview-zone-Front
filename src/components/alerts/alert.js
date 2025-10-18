import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  return (
    <div>
      <button
        onClick={() => {
          toast.info("Oh look, an alert!");
        }}
      >
        Show Alert
      </button>

      <button
        onClick={() => {
          toast.error("You just broke something!");
        }}
      >
        Oops, an error
      </button>

      <button
        onClick={() => {
          toast.success("It's ok now!");
        }}
      >
        Success!
      </button>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Home;
