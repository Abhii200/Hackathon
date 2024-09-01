const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleWare');
const { getAvailableSlots, bookAppointment } = require('../controllers/appointmnetController');

router.get('/:doctorId/:date', authenticateToken, getAvailableSlots);
router.post('/:appointmentId/book', authenticateToken, bookAppointment);

module.exports = router;
