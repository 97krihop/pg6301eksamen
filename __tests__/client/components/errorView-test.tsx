import { render, screen } from "@testing-library/react";
import React from "react";
import { ErrorView } from "../../../src/client/components/errorView";
import { HttpException } from "../../../src/client/lib/http";
import { MemoryRouter } from "react-router-dom";

it("should render Error 401", () => {
  render(
    <MemoryRouter>
      <ErrorView
        error={
          new HttpException(
            // @ts-ignore
            { status: 401, statusText: "something when`t wrong" },
            "/"
          )
        }
      />
    </MemoryRouter>
  );
  screen.getByText("you are not logged in");
  screen.getByText("go to login page");
});
it("should render Error other", () => {
  render(
    <MemoryRouter>
      <ErrorView
        error={
          new HttpException(
            // @ts-ignore
            { status: 400, statusText: "something when`t wrong" },
            "/"
          )
        }
      />
    </MemoryRouter>
  );

  screen.getByText(
    "400 Error: Error while loading / : 400 something when`t wrong"
  );
});
