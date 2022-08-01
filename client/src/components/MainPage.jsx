/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import classnames from "classnames";
import { navigate } from "@reach/router";

function MainPage() {
  return (
    <>
      <div className="bg-blue-900">
        <div
          className={classnames("w-full flex items-center justify-center", {
            "h-screen": true,
          })}
        >
          <form className="w-full md:w-1/3 bg-white rounded-lg">
            <div className="flex font-bold justify-center mt-6">
              <img
                className="h-20 w-20"
                src="https://raw.githubusercontent.com/sefyudem/Responsive-Login-Form/master/img/avatar.svg"
              ></img>
            </div>
            <h2 className="text-3xl text-center text-gray-700 mb-4">
              Welcome to Graphical Password Authentication System
            </h2>
            <div className="px-12 pb-10">
              <div className="w-full mb-2">
                <div className="flex items-center">
                  <i className="ml-3 fill-current text-gray-400 text-xs z-10 fas fa-user"></i>
                </div>
              </div>
              Already a member?
              <button
                className="w-full py-2 -ml-2.5 hover:bg-green-700 rounded-full bg-blue-900 text-gray-100  focus:outline-none"
                type="button"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
              <br></br>
              <br></br>
              Need an account?
              <button
                className="w-full py-2 -ml-2.5 hover:bg-green-700 rounded-full bg-blue-900 text-gray-100  focus:outline-none"
                type="button"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default MainPage;
