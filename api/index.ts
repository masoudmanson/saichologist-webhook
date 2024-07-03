require('dotenv').config();

const express = require('express');
const app = express();
const { sql } = require('@vercel/postgres');

const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

// Create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'components', 'home.htm'));
});

app.post('/saichologist', urlencodedParser, async (req, res) => {
    try {
        await sql`INSERT INTO saichologist (type, email, ip) VALUES (${req.body.type}, ${req.body["data[email]"]}, ${req.body["data[ip_opt]"]});`;
        res.status(200).send('<h1>Request added successfully</h1>');
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send('Error saving data');
    }
});

app.get("/count", async (req, res) => {
    try {
        const result = await sql`SELECT COUNT(id) FROM saichologist;`;
        const count = result.rows[0].count;
        res.status(200).send(`
            <html>
                <head>
                    <title>Subscribers</title>
                    <style>
                        p {
                            font-family: mukta, sans-serif;
                        }
                    </style>
                </head>
                <body>
                    <p>${count} others has joined</p>
                </body>
            </html>
        `);
    } catch (error) {
        res.status(500).send('Error fetching data!');
    }
});

app.listen(3000, () => console.log('Server ready on port 3000.'));

module.exports = app;
