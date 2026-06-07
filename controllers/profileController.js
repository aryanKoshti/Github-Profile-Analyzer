const { getGithubProfile } = require("../services/githubService");

const analyzeProfile = async (req, res) => {
    try {
        const username = req.params.username;


        const { user, repos } = await getGithubProfile(username);

        let totalStars = 0;
        let totalForks = 0;

        const languageCount = {};

        repos.forEach((repo) => {
            totalStars += repo.stargazers_count;
            totalForks += repo.forks_count;

            if (repo.language) {
                languageCount[repo.language] =
                    (languageCount[repo.language] || 0) + 1;
            }
        });

        let mostUsedLanguage = "Unknown";
        let max = 0;

        for (let language in languageCount) {
            if (languageCount[language] > max) {
                max = languageCount[language];
                mostUsedLanguage = language;
            }
        }

        const accountAgeDays = Math.floor(
            (new Date() - new Date(user.created_at)) /
            (1000 * 60 * 60 * 24)
        );

        const developerScore =
            user.followers * 2 +
            user.public_repos +
            totalStars * 3;

        let category = "Beginner";

        if (developerScore > 100000) {
            category = "Expert";
        } else if (developerScore > 10000) {
            category = "Intermediate";
        }

        res.status(200).json({
            success: true,
            data: {
                username: user.login,
                name: user.name,
                followers: user.followers,
                following: user.following,
                publicRepos: user.public_repos,
                publicGists: user.public_gists,
                totalStars,
                totalForks,
                mostUsedLanguage,
                accountAgeDays,
                developerScore,
                category,
                profileUrl: user.html_url,
                avatarUrl: user.avatar_url
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Error analyzing profile",
            error: error.message
        });
    }


};

module.exports = {
    analyzeProfile
};
