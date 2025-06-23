const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Protect this route
router.get('/secret', authMiddleware, (req, res) => {
  res.json({
    msg: `Welcome, your user ID is ${req.user.id} and your role is ${req.user.role}`
  });
});

module.exports = router;
