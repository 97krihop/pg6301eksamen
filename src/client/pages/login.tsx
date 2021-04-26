import React from "react";
import { IIdentityProvider } from "../index";
import { LoginComponent } from "../components/loginComponent";
import { GoogleLogin } from "../components/googleLoginComponent";

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
      <GoogleLogin identityProvider={identityProvider} />
    </div>
  );
};
