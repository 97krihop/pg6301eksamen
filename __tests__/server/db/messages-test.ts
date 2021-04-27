import {
  addMessage,
  clearMessages,
  createNewMessage,
  getAllMessages,
  getMessages,
} from "../../../src/server/db/messages";

describe("db Messages", () => {
  beforeEach(() => {
    clearMessages();
  });
  it("should create a message", async () => {
    const message = {
      message: { email: "bob@bob.com", message: "test" },
      recipients: ["bob@bob.com", "a@a.com"],
    };

    expect(
      createNewMessage(
        JSON.stringify(message.recipients.sort()),
        message.recipients
      )
    ).toBe(true);
    expect(
      addMessage(JSON.stringify(message.recipients.sort()), message.message)
    ).toBe(true);
    const result = getMessages(JSON.stringify(message.recipients.sort()));
    expect(result).toBeDefined();
    expect(result.message).toContain(message.message);
    expect(result.recipients).toEqual(message.recipients);
  });
  it("should create a fail to create Message", async () => {
    const message = {
      message: { email: "bob@bob.com", message: "test" },
      recipients: ["bob@bob.com", "a@a.com"],
    };

    expect(
      createNewMessage(
        JSON.stringify(message.recipients.sort()),
        message.recipients
      )
    ).toBe(true);
    expect(
      createNewMessage(
        JSON.stringify(message.recipients.sort()),
        message.recipients
      )
    ).toBe(false);
    expect(addMessage("something else", message.message)).toBe(false);
  });
  it("should create a get all Messages of one email as recipient or sender", async () => {
    const message1 = {
      message: { email: "bob@bob.com", message: "test" },
      recipients: ["bob@bob.com", "a@a.com"],
    };
    const message2 = {
      message: { email: "bob@bob.com", message: "test2" },
      recipients: ["bob@bob.com"],
    };

    expect(
      createNewMessage(
        JSON.stringify(message1.recipients.sort()),
        message1.recipients
      )
    ).toBe(true);
    expect(
      createNewMessage(
        JSON.stringify(message2.recipients.sort()),
        message2.recipients
      )
    ).toBe(true);

    expect(
      addMessage(JSON.stringify(message1.recipients.sort()), message1.message)
    ).toBe(true);
    expect(
      addMessage(JSON.stringify(message2.recipients.sort()), message2.message)
    ).toBe(true);

    const res1 = getAllMessages("a@a.com");
    expect(res1).toContain(message1.message);
    expect(res1).not.toContain(message2.message);
    const res2 = getAllMessages("bob@bob.com");
    expect(res2).toContain(message1.message);
    expect(res2).toContain(message2.message);
  });
});
