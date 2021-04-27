const fetchJson = require("../../../src/server/lib/fetchJson");

jest.mock("node-fetch", () => require("fetch-mock-jest").sandbox());
const fetchMock = require("node-fetch");

describe("fetchJson helper function", () => {
  it("should fetch", async () => {
    fetchMock.getOnce("/", { status: 200, json: jest.fn() });
    await fetchJson("/");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
