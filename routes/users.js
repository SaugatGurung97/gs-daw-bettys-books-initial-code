const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');

// Assuming 'db' is your database connection object (e.g., MySQL, MongoDB, etc.)

// Register user route (GET)
router.get('/register', function (req, res, next) {
    res.render('register.ejs'); // Display registration form
});

// Register user route (POST)
router.post('/registered', function (req, res, next) {
    // saving data in database
    const saltRounds = 10;
    const plainPassword = req.body.password;

    // Hash the password using bcrypt
    bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
        if (err) {
            return next(err);
        }

        // Insert the user data into the database (excluding plain password)
        let sqlquery = "INSERT INTO users(username, firstname, lastname, email, hashedpassword) VALUES (?,?,?,?,?)";
        let newrecord = [req.body.username, req.body.firstname, req.body.lastname, req.body.email, hashedPassword];

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return next(err);
            }

            // Acknowledge successful registration
            let response = 'Hello ' + req.body.firstname + ' ' + req.body.lastname + ', you are now registered! We will send an email to ' + req.body.email + ' with further details.';
            
            res.send(response); // Send a general success message
        });
    });
});

// List users route (GET)
router.get('/listusers', (req, res, next) => {
    // Query to select all users but exclude the hashed password
    let sqlquery = "SELECT username, firstname, lastname, email FROM users"; // Exclude 'hashedpassword'

    db.query(sqlquery, (err, result) => {
        if (err) {
            return next(err);
        }

        // Render the list of users using the 'listusers.ejs' template
        res.render('listusers.ejs', { users: result });
    });
});

// Export the router object so index.js can access it
module.exports = router;
