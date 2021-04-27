import {
  clearAllUsers,
  createUser,
  getUser,
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
    expect(createUser(user.email, user.password, user.firstname, user.lastname)).toBe(true)
    expect(getUser(user.email)).toEqual(user)
  });
  it("should fail at creating a user", async () => {
    const user = {
      firstname: "bob",
      lastname: "hansen",
      email: "bob@bob.com",
      password: "password",
    };
    expect(createUser(user.email, user.password, user.firstname, user.lastname)).toBe(true)
    expect(createUser(user.email, user.password, user.firstname, user.lastname)).toBe(false)
    expect(getUser(user.email)).toEqual(user)
  });
});
