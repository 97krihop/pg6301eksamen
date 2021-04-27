import { act, render, screen } from "@testing-library/react";
import React from "react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { InputField } from "../../../src/client/components/inputField";
import userEvent from "@testing-library/user-event";

let counter = "";
beforeEach(() => {
  counter = "";
});
const fn = (a: string) => {
  counter += a;
};

it("should render inputField", async () => {
  const history = createMemoryHistory();
  act(() => {
    render(
      <Router history={history}>
        <InputField
          label={"test"}
          // @ts-ignore
          onValueChange={fn}
          value={counter}
        />
      </Router>
    );
  });

  const a = screen.getByText("test:");
  act(() => {
    userEvent.type(a, "test");
  });
  expect(counter).toBe("test");
});
