import React, { useState } from "react";
import { InputField } from "../components/inputField";
import { useLoading } from "../lib/useLoading";
import { fetchJson, postJson } from "../lib/http";
import { ErrorView } from "../components/errorView";
import { useSubmit } from "../lib/useSubmit";
import { useHistory } from "react-router";

export const NewUser = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const history = useHistory();
  const { handleSubmit, submitting, error: postError } = useSubmit(
    async () => {
      if (password.length <= 6) throw new Error("password is to short");
      if (password !== confirmPassword)
        throw new Error("password dose not match");
      if (!validateEmail(email)) throw new Error("email is not correct");
      await postJson("/api/signup", {
        email,
        password,
        firstName,
        lastName,
      });
    },
    () => {
      history.push("/");
    }
  );

  const { loading, error } = useLoading(
    async () => await fetchJson("/api/profile")
  );
  // source form https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
  const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  if (error) return <ErrorView error={error} />;

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <h1>register new User</h1>
      {postError && <div>{postError.toString()}</div>}
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <InputField
          value={firstName}
          onValueChange={setFirstName}
          label={"firstName"}
        />
        <InputField
          value={lastName}
          onValueChange={setLastName}
          label={"lastName"}
        />
        <InputField
          value={email}
          onValueChange={setEmail}
          type={"email"}
          label={"email"}
        />
        <InputField
          value={password}
          onValueChange={setPassword}
          type={"password"}
          label={"password"}
        />
        <InputField
          value={confirmPassword}
          onValueChange={setConfirmPassword}
          type={"password"}
          label={"confirm password"}
        />
        <button disabled={submitting}>create</button>
      </form>
    </div>
  );
};
