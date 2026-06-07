const db = require("../config/db");
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
        }
        else if (developerScore > 10000) {
            category = "Intermediate";
        }

        const githubCreatedAt = new Date(user.created_at)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");

        const query = `
        INSERT INTO profiles (
            username,
            name,
            followers,
            following,
            public_repos,
            public_gists,
            total_stars,
            total_forks,
            most_used_language,
            developer_score,
            account_age_days,
            profile_url,
            avatar_url,
            created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

        ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            followers = VALUES(followers),
            following = VALUES(following),
            public_repos = VALUES(public_repos),
            public_gists = VALUES(public_gists),
            total_stars = VALUES(total_stars),
            total_forks = VALUES(total_forks),
            most_used_language = VALUES(most_used_language),
            developer_score = VALUES(developer_score),
            account_age_days = VALUES(account_age_days),
            profile_url = VALUES(profile_url),
            avatar_url = VALUES(avatar_url);
        `;

        db.query(
            query,
            [
                user.login,
                user.name,
                user.followers,
                user.following,
                user.public_repos,
                user.public_gists,
                totalStars,
                totalForks,
                mostUsedLanguage,
                developerScore,
                accountAgeDays,
                user.html_url,
                user.avatar_url,
                githubCreatedAt
            ],
            (err, result) => {
                if (err) {
                    console.error("Database Error:", err);

                    return res.status(500).json({
                        message: "Database Error",
                        error: err.message
                    });
                }

                res.status(200).json({
                    success: true,
                    message: "Profile analyzed and saved successfully",
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
                        developerScore
                    }
                });
            }
        );

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error analyzing profile",
            error: error.message
        });
    }
};

const getAllProfiles = (req, res) => {

    const query = "SELECT * FROM profiles";

    db.query(query, (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Database Error"
            });
        }

        res.status(200).json(results);
    });
};

const getSingleProfile = (req, res) => {

    const username = req.params.username;

    const query =
        "SELECT * FROM profiles WHERE username = ?";

    db.query(
        query,
        [username],
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error"
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "Profile not found"
                });
            }

            res.status(200).json(results[0]);
        }
    );
};

module.exports = {
    analyzeProfile,
    getAllProfiles,
    getSingleProfile
};