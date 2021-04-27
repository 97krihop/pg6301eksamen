import { render, screen } from "@testing-library/react";
import React from "react";
import { Home } from "../../../src/client/pages/home";
import { Messages } from "../../../src/client/components/messages";

jest.mock("../../../src/client/components/messages");

// @ts-ignore
Messages.mockReturnValue(<div>test</div>);

it("should render home", () => {
  render(<Home />);
  screen.getByText("Chat app")
  screen.getByText("test")
});
