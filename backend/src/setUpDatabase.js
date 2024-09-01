// const { Client } = require('pg');

// // PostgreSQL client configuration
// const client = new Client({
//     connectionString: 'postgres://postgres:password@localhost:5430/hosp_db' // Adjust if needed
// });

// async function setupDatabase() {
//     try {
//         // Connect to the database
//         await client.connect();
//         console.log('Connected to PostgreSQL!');

//         // SQL commands to create tables
//         const createTablesQuery = `
//             -- Create the hospitals table
//             CREATE TABLE IF NOT EXISTS hospitals (
//                 id SERIAL PRIMARY KEY,
//                 name VARCHAR(255) NOT NULL,
//                 location VARCHAR(255),
//                 doctor_number INT
//             );

//             -- Create the doctors table
//             CREATE TABLE IF NOT EXISTS doctors (
//                 id SERIAL PRIMARY KEY,
//                 name VARCHAR(255) NOT NULL,
//                 experience INT,
//                 date_of_birth DATE,
//                 profile_image TEXT,
//                 speciality VARCHAR(255),
//                 hospital_id INT REFERENCES hospitals(id) ON DELETE CASCADE
//             );

//             -- Create the appointments table
//             CREATE TABLE IF NOT EXISTS appointments (
//                 id SERIAL PRIMARY KEY,
//                 date DATE NOT NULL,
//                 slot TIME NOT NULL,
//                 doctor_id INT REFERENCES doctors(id) ON DELETE CASCADE,
//                 UNIQUE (date, slot, doctor_id)  -- Ensure that each slot is unique for a doctor on a given date
//             );
//         `;

//         // Execute the table creation commands
//         await client.query(createTablesQuery);
//         console.log('Tables created successfully!');

//         // Insert data into the hospitals table
//         const insertHospitalsQuery = `
//             INSERT INTO hospitals (name, location, doctor_number) VALUES
//             ('Divine Hospital', 'Eluru', 20),
//             ('Killers', 'Eluru', 20),
//             ('Sataya Hospital', 'Eluru', 20),
//             ('Asram Hospital', 'Eluru', 20),
//             ('Bhimavaram Hospital', 'Bhimavaram', 12),
//             ('Sai Hospitals', 'Rajahmundry', 34)
//             ON CONFLICT (id) DO NOTHING;
//         `;

//         await client.query(insertHospitalsQuery);
//         console.log('Hospitals inserted successfully!');

//         // Insert data into the doctors table
//         const insertDoctorsQuery = `
//             INSERT INTO doctors (name, experience, date_of_birth, profile_image, speciality, hospital_id) VALUES
//             ('Teja', 6, '1989-12-01', 'https://i.pravatar.cc/1000?img=9', 'Gynecology', 1),
//             ('Sai', 2, '1989-12-01', 'https://i.pravatar.cc/1000?img=4', 'Gastroenterology', 1),
//             ('Satya', 9, '1989-12-01', 'https://i.pravatar.cc/1000?img=10', 'General Physician', 1),
//             ('Satya', 9, '1989-12-01', 'https://i.pravatar.cc/1000?img=10', 'Oncology', 1),
//             ('Satya', 9, '1989-12-01', 'https://i.pravatar.cc/1000?img=10', 'Neurology', 1),
//             ('Teja', 6, '1989-12-01', 'https://i.pravatar.cc/1000?img=9', 'Oncology', 2),
//             ('Sai', 2, '1989-12-01', 'https://i.pravatar.cc/1000?img=9', 'Gynecology', 2),
//             ('Satya', 9, '1989-12-01', 'https://i.pravatar.cc/1000?img=9', 'Oncology', 2),
//             ('Teja', 6, '1989-12-01', 'https://i.pravatar.cc/1000?img=9', 'Oncology', 3),
//             ('Sai', 2, '1989-12-01', 'https://i.pravatar.cc/1000?img=9', 'Oncology', 3),
//             ('Satya', 9, '1989-12-01', 'https://i.pravatar.cc/1000?img=9', 'Oncology', 3),
//             ('Teja', 6, '1989-12-01', 'https://i.pravatar.cc/1000?img=9', 'Oncology', 4),
//             ('Sai', 2, '1989-12-01', 'https://i.pravatar.cc/1000?img=9', 'Oncology', 4),
//             ('Satya', 9, '1989-12-01', 'https://i.pravatar.cc/1000?img=9', 'Oncology', 4),
//             ('Teja', 6, '1989-12-01', 'https://i.pravatar.cc/1000?img=9', 'Oncology', 5),
//             ('Sai', 2, '1989-12-01', 'https://i.pravatar.cc/1000?img=9', 'Oncology', 5),
//             ('Satya', 9, '1989-12-01', 'https://i.pravatar.cc/1000?img=9', 'Oncology', 5),
//             ('Teja', 6, '1989-12-01', 'https://i.pravatar.cc/1000?img=9', 'Oncology', 6),
//             ('Sai', 2, '1989-12-01', 'https://i.pravatar.cc/1000?img=9', 'Oncology', 6),
//             ('Satya', 9, '1989-12-01', 'https://i.pravatar.cc/1000?img=7', 'Oncology', 6)
//             ON CONFLICT (id) DO NOTHING;
//         `;

//         await client.query(insertDoctorsQuery);
//         console.log('Doctors inserted successfully!');

//         // Insert data into the appointments table
//         const insertAppointmentsQuery = `
//             -- Doctor 1 (Satya)
//             INSERT INTO appointments (date, slot, doctor_id) VALUES
//             ('2024-09-01', '10:00:00', 4),
//             ('2024-09-01', '10:15:00', 4),
//             ('2024-09-01', '10:30:00', 4),
//             ('2024-09-01', '10:45:00', 4),
//             ('2024-09-01', '11:00:00', 4),
//             ('2024-09-01', '12:00:00', 4),
//             ('2024-09-02', '10:00:00', 4),
//             ('2024-09-02', '10:15:00', 4),
//             ('2024-09-02', '10:30:00', 4),
//             ('2024-09-02', '10:45:00', 4),
//             ('2024-09-02', '11:00:00', 4),
//             ('2024-09-02', '12:00:00', 4),
//             ('2024-08-03', '10:00:00', 4),
//             ('2024-08-03', '10:15:00', 4),
//             ('2024-08-03', '10:30:00', 4),
//             ('2024-08-03', '10:45:00', 4),
//             ('2024-08-03', '11:00:00', 4),
//             ('2024-08-03', '12:00:00', 4);

//             -- Doctor 2 (Teja)
//             INSERT INTO appointments (date, slot, doctor_id) VALUES
//             ('2024-09-01', '10:00:00', 1),
//             ('2024-09-01', '10:15:00', 1),
//             ('2024-09-01', '10:30:00', 1),
//             ('2024-09-01', '10:45:00', 1),
//             ('2024-09-01', '11:00:00', 1),
//             ('2024-09-01', '12:00:00', 1),
//             ('2024-01-02', '10:00:00', 1),
//             ('2024-01-02', '10:15:00', 1),
//             ('2024-01-02', '10:30:00', 1),
//             ('2024-01-02', '10:45:00', 1),
//             ('2024-01-02', '11:00:00', 1),
//             ('2024-01-02', '12:00:00', 1),
//             ('2024-08-03', '10:00:00', 1),
//             ('2024-08-03', '10:15:00', 1),
//             ('2024-08-03', '10:30:00', 1),
//             ('2024-08-03', '10:45:00', 1),
//             ('2024-08-03', '11:00:00', 1),
//             ('2024-08-03', '12:00:00', 1);
//         `;

//         await client.query(insertAppointmentsQuery);
//         console.log('Appointments inserted successfully!');

//     } catch (err) {
//         console.error('Error setting up the database:', err);
//     } finally {
//         // Close the database connection
//         await client.end();
//     }
// }

// // Run the setup function
// setupDatabase();
