import React from "react";
import { useSubmit } from "../../../src/client/lib/useSubmit";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

let fail = false;
let res: boolean;
beforeEach(() => {
  res = false;
});

const TestComponent = () => {
  const { handleSubmit, submitting, error } = useSubmit(
    async () =>
      new Promise((resolve) =>
        setTimeout(!fail ? resolve : JSON.parse("aa"), 500)
      ),
    () => {
      res = true;
    }
  );

  if (submitting) {
    return <div>Loading</div>;
  }
  if (error) {
    return <div>Error</div>;
  }
  return (
    <>
      <form
        // @ts-ignore
        onSubmit={handleSubmit}
      >
        <button>submit</button>
      </form>
    </>
  );
};
describe("use submit hook", () => {
  it("should render testComponent and use submit success", async () => {
    render(<TestComponent />);
    const button = screen.getByText("submit");
    userEvent.click(button);
    await screen.findByText("Loading");
    setTimeout(() => expect(res).toBe(true), 1000);
  });

  it("should render testComponent and use submit success", async () => {
    fail = true;
    render(<TestComponent />);
    const button = screen.getByText("submit");
    userEvent.click(button);
    await screen.findByText("Loading");
    await screen.findByText("Error");
  });
});
