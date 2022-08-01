import React from "react";
import  LoginPage  from "./components/LoginPage";
import  RegistrationPage from "./components/RegistrationPage";
import  MainPage  from "./components/MainPage";
import { Router } from "@reach/router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import  HomePage  from "./components/HomePage";

function App() {
  return (
    <>
      <Router>
        <RegistrationPage path="/register" />
        <LoginPage path="/login" />
        <MainPage path="/" />
        <HomePage path="/authenticated" />
      </Router>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
