const express = require('express');
const { generateTaskDetails, summarizeTasks } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/generate', generateTaskDetails);
router.post('/summarize', summarizeTasks);

module.exports = router;
