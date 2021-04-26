import React from "react";
import { IIdentityProvider } from "../index";
import { LoginComponent } from "../components/loginComponent";
import { googleLogin } from "../lib/googleLogin";

interface props {
  identityProvider: IIdentityProvider;
}

export const Login = ({ identityProvider }: props) => {
  return (
    <div>
      <h1>Login</h1>
      <br />
      <LoginComponent />
      <br />
      <div>
        <button
          onClick={() => {
            googleLogin(identityProvider);
          }}
        >
          login with google
        </button>
      </div>
    </div>
  );
};
