const googleOAuth = require("../../../src/server/middelware/googleOpenID");
const fetchJson = require("../../../src/server/lib/fetchJson");

jest.mock("../../../src/server/lib/fetchJson");

describe("test middleware googleAuth", () => {
  let mockRequest: any;
  let mockResponse: any;
  let nextFunction: any;

  beforeEach(() => {
    nextFunction = jest.fn();
    mockRequest = {
      header: jest.fn(),
      session: {
        userinfo: null,
      },
    };
    // @ts-ignore
    fetchJson.mockReturnValue({ test: "test" });
  });

  test("without headers", async () => {
    await googleOAuth(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toBeCalledTimes(1);
    expect(mockRequest.header).toBeCalledTimes(1);
  });

  test("with headers", async () => {
    // @ts-ignore
    fetchJson.mockReturnValueOnce({ userinfo_endpoint: "something" });
    mockRequest.header.mockReturnValueOnce("test2");
    await googleOAuth(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toBeCalledTimes(1);
    expect(mockRequest.header).toBeCalledTimes(1);
    expect(mockRequest.session.userinfo.test).toBe("test");
    expect(fetchJson).toBeCalledTimes(2);
    expect(fetchJson).toBeCalledWith(
      "https://accounts.google.com/.well-known/openid-configuration"
    );
    expect(fetchJson).toBeCalledWith("something", {
      headers: {
        Authorization: "test2",
      },
    });
  });
});
