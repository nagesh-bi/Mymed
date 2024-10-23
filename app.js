const express = require('express');
const sql = require('mssql');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // To serve static files (HTML, JS)

// Azure SQL Database connection details
const config = {
    user: 'nagesh',
    password: 'Maya@123',
    server: 'appointment-server1.database.windows.net',
    database: 'AppointmentDB',
    options: {
        encrypt: true, // Use this if you're on Azure
    },
};

// Route to serve HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'form.html')); // Serve the HTML form
});

// Route to handle form submission
app.post('/submit', async (req, res) => {
    const { name, number, email, date } = req.body;

    try {
        // Connect to Azure SQL Database
        let pool = await sql.connect(config);

        // Insert data into Appointments table
        await pool.request()
            .input('Name', sql.NVarChar, name)
            .input('PhoneNumber', sql.NVarChar, number)
            .input('Email', sql.NVarChar, email)
            .input('AppointmentDate', sql.Date, date)
            .query(`INSERT INTO Appointments (Name, PhoneNumber, Email, AppointmentDate) 
                    VALUES (@Name, @PhoneNumber, @Email, @AppointmentDate)`);

        res.json({ message: 'Appointment booked successfully!' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'An error occurred while booking the appointment.' });
    }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
