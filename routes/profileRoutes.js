const express = require("express");

const router = express.Router();

const {
    analyzeProfile,
    getAllProfiles,
    getSingleProfile
} = require("../controllers/profileController");

router.post("/profile/:username", analyzeProfile);

router.get("/profiles", getAllProfiles);

router.get("/profile/:username", getSingleProfile);

module.exports = router;