import {
  clearAllUsers,
  createUser,
  getUser,
  verifyUser,
} from "../../../src/server/db/users";

describe("users DB tests", () => {
  beforeEach(() => {
    clearAllUsers();
  });

  it("should create a user", async () => {
    const user = {
      firstname: "bob",
      lastname: "hansen",
      email: "bob@bob.com",
      password: "password",
    };
    expect(
      createUser(user.email, user.password, user.firstname, user.lastname)
    ).toBe(true);
    expect(getUser(user.email)).toEqual(user);
  });
  it("should fail at creating a user", async () => {
    const user = {
      firstname: "bob",
      lastname: "hansen",
      email: "bob@bob.com",
      password: "password",
    };
    expect(
      createUser(user.email, user.password, user.firstname, user.lastname)
    ).toBe(true);
    expect(
      createUser(user.email, user.password, user.firstname, user.lastname)
    ).toBe(false);
    expect(getUser(user.email)).toEqual(user);
  });
  it("should verify a user", async () => {
    const user = {
      firstname: "bob",
      lastname: "hansen",
      email: "bob@bob.com",
      password: "password",
    };
    expect(
      createUser(user.email, user.password, user.firstname, user.lastname)
    ).toBe(true);
    expect(verifyUser(user.email, user.password)).toBe(true);
    expect(verifyUser("something else", user.password)).toBe(false);
    expect(verifyUser(user.email, "something else")).toBe(false);
  });
});
