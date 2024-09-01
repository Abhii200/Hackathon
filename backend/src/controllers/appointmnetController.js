const client = require('../utils/db');

// Fetch available slots by doctor ID and date
exports.getAvailableSlots = async (req, res) => {
    const { doctorId, date } = req.params;

    try {
        const result = await client.query(
            `SELECT slot
             FROM appointments
             WHERE doctor_id = $1 AND date = $2 AND user_id IS NULL`,
            [doctorId, date]
        );

        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching available slots');
    }
};

// Book an appointment
exports.bookAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    const userId = req.user.id;

    try {
        const result = await client.query(
            `UPDATE appointments
             SET user_id = $1
             WHERE id = $2 AND user_id IS NULL`,
            [userId, appointmentId]
        );

        if (result.rowCount === 0) {
            return res.status(400).send('Appointment slot is already booked');
        }

        res.status(200).send('Appointment booked successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error booking appointment');
    }
};
