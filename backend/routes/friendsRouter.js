const express = require('express');
const router = express.Router();

const {
    getFriends
} = require('../controllers/friendsController');

router.get('/', getFriends);

// router.get('/tasks', getFriendsTasks);

// router.get('/requests', getFriendRequests);

// router.get('/requests/:username', respondToFriendRequest);

module.exports = router;