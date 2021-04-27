const users = new Map();

function getUser(email) {
  return users.get(email);
}

function verifyUser(email, password) {
  const user = getUser(email);
  if (!user) return false;
  return user.password === password;
}

function createUser(email, password, firstname, lastname) {
  if (getUser(email)) return false;
  const user = {
    email,
    password,
    firstname,
    lastname,
  };
  users.set(email, user);
  return true;
}

function clearAllUsers() {
  users.clear();
}

module.exports = {
  getUser,
  verifyUser,
  createUser,
  clearAllUsers,
};
