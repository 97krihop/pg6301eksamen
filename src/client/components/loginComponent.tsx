import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { InputField } from "./inputField";
import { useSubmit } from "../lib/useSubmit";
import { postJson } from "../lib/http";

export const LoginComponent = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const history = useHistory();

  const { handleSubmit, submitting, error } = useSubmit(
    async () => {
      await postJson("/api/login", { email, password });
    },
    () => history.push("/")
  );

  return (
    <div>
      {error && <div>{error.toString()}</div>}
      <form onSubmit={handleSubmit}>
        <InputField
          value={email}
          onValueChange={setEmail}
          type={"email"}
          label="username"
        />
        <InputField
          value={password}
          onValueChange={setPassword}
          label="password"
          type="password"
        />

        <button disabled={submitting}>Log in</button>
      </form>
    </div>
  );
};
