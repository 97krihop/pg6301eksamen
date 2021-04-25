import React from "react";
import { useLocalStorage } from "../../../src/client/lib/useLocalStorage";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

//mocks
jest.spyOn(window.localStorage.__proto__, "setItem");
window.localStorage.__proto__.setItem = jest.fn();
jest.spyOn(window.localStorage.__proto__, "getItem");
window.localStorage.__proto__.getItem = jest
  .fn()
  .mockReturnValue(JSON.stringify("test"));
jest.spyOn(window.localStorage.__proto__, "removeItem");
window.localStorage.__proto__.removeItem = jest.fn();

const TestComponent = () => {
  const [value, setValue] = useLocalStorage("test");

  return (
    <>
      <div>{value && value.toString()}</div>
      <button
        onClick={() => {
          setValue("test2");
        }}
      >
        button
      </button>
      <button
        onClick={() => {
          setValue(null);
        }}
      >
        remove
      </button>
    </>
  );
};
beforeEach(() => {
  window.localStorage.__proto__.setItem.mockClear();
  window.localStorage.__proto__.getItem.mockClear();
  window.localStorage.__proto__.removeItem.mockClear();
});

describe("test localStorage hook", () => {
  it("should get value", async () => {
    render(<TestComponent />);
    expect(window.localStorage.__proto__.getItem).toHaveBeenCalledTimes(1);
    expect(window.localStorage.__proto__.getItem).toHaveBeenCalledWith("test");
    expect(window.localStorage.__proto__.setItem).toHaveBeenCalledTimes(1);
    screen.getByText("test");
    await userEvent.click(screen.getByText("button"));
    await screen.findByText("test2");
    expect(window.localStorage.__proto__.setItem).toHaveBeenCalledTimes(2);
  });
});
describe("test localStorage hook", () => {
  it("should remove value value", async () => {
    render(<TestComponent />);
    expect(window.localStorage.__proto__.getItem).toHaveBeenCalledTimes(1);
    expect(window.localStorage.__proto__.getItem).toHaveBeenCalledWith("test");
    expect(window.localStorage.__proto__.setItem).toHaveBeenCalledTimes(1);
    screen.getByText("test");
    await userEvent.click(screen.getByText("remove"));
    expect(window.localStorage.__proto__.removeItem).toHaveBeenCalledTimes(1);
  });
});
