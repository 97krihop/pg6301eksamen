import { postJson } from "../lib/http";
import React, { useEffect } from "react";
import { useHistory } from "react-router";

export const Logout = () => {
  const history = useHistory();
  const logout = async () => {
    await postJson("/api/logout");
    history.push("/");
  };

  useEffect(() => {
    logout();
  }, []);

  return <h1>logout</h1>;
};
