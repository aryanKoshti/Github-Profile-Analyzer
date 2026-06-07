const axios = require("axios");

const getGithubProfile = async (username) => {
  const userResponse = await axios.get(
    `https://api.github.com/users/${username}`
  );

  const repoResponse = await axios.get(
    `https://api.github.com/users/${username}/repos`
  );

  return {
    user: userResponse.data,
    repos: repoResponse.data
  };
};

module.exports = { getGithubProfile };