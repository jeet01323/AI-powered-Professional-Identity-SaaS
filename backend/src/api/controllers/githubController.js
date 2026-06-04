const axios = require("axios");

const Profile = require("../../models/Profile");


// Connect GitHub
const connectGitHub = async (req, res) => {
  try {

    const { username } = req.body;


    // GitHub User API
    const userResponse =
      await axios.get(
        `https://api.github.com/users/${username}`
      );


    // GitHub Repositories API
    const repoResponse =
      await axios.get(
        `https://api.github.com/users/${username}/repos`
      );


    // Format Repositories
    const repositories =
      repoResponse.data.map((repo) => ({
        name: repo.name,

        description: repo.description,

        language: repo.language,

        stars: repo.stargazers_count,

        forks: repo.forks_count,

        repoUrl: repo.html_url,
      }));


    // Find User Profile
    const profile = await Profile.findOne({
      userId: req.user.id,
    });


    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }


    // Save GitHub Data
    profile.githubData = {
      username: userResponse.data.login,

      profileUrl: userResponse.data.html_url,

      avatar: userResponse.data.avatar_url,

      followers: userResponse.data.followers,

      following: userResponse.data.following,

      publicRepos: userResponse.data.public_repos,

      repositories,
    };


    await profile.save();


    res.json({
      message: "GitHub connected successfully",

      githubData: profile.githubData,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  connectGitHub,
};
