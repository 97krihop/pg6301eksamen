const fetch = require("node-fetch");
const fetchJson = async (url, options) => {
  const res = await fetch(url, options);
  if (!res.ok)
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  return await res.json();
};

module.exports = fetchJson;
