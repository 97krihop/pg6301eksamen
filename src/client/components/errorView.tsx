import { HttpException } from "../lib/http";
import { Link } from "react-router-dom";
import React from "react";

export const ErrorView = ({ error }: { error: HttpException | null }) => {
  if (error) {
    if (error.status === 401)
      return (
        <div>
          <h2>you are not logged in</h2>
          <Link to={"/login"}>
            <button>go to login page</button>
          </Link>
        </div>
      );
    return <div>{error.status +" " + error.toString()}</div>;
  }
  return <div />;
};
