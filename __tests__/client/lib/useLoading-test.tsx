import React from "react";
import { useLoading } from "../../../src/client/lib/useLoading";
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";

let func: () => Promise<any>;

beforeEach(() => {
  func = () => Promise.resolve(() => "test");
});

const TestComponent = () => {
  const { data, loading, error } = useLoading(func);
  if (loading) return <div>Loading</div>;
  if (error) return <div>error</div>;
  if (data) return <div>{data}</div>;
  return <></>;
};
describe("test useLoading hook", () => {
  it("should show data", async () => {
    act(() => {
      render(<TestComponent />);
    });
    await screen.findByText("test");
  });

  it("should show loading", async () => {
    func = async () => setTimeout(() => Promise.resolve(() => "test"), 500);
    act(() => {
      render(<TestComponent />);
    });
    await screen.findByText("Loading");
  });

  it("should show error", async () => {
    func = async () => {
      throw new Error();
    };
    act(() => {
      render(<TestComponent />);
    });
    await screen.findByText("error");
  });
});
