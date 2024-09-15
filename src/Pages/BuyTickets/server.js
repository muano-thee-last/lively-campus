const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Configure the SMTP transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'livelycampus@gmail.com', 
        pass: 'rkkk ofws pgxc zors', 
    },
});

app.post('/send-confirmation-email', (req, res) => {
    const { email, paymentDetails } = req.body;
    const { amount, date, method, eventTitle } = paymentDetails;

    // Construct the email body with HTML template literals
    const emailBody = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 5px;
            }
            .header {
                text-align: center;
                padding: 10px;
            }
            .header img {
                max-width: 150px;
            }
            .content {
                margin-top: 20px;
            }
            .footer {
                margin-top: 20px;
                text-align: center;
                font-size: 12px;
                color: #777777;
            }
            ul {
                list-style-type: none;
                padding: 0;
            }
            li {
                margin-bottom: 8px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="../../asserts/logo.png" alt="Lively Campus Logo">
            </div>
            <div class="content">
                <h1>Thank you for your purchase!</h1>
                <p>Dear User,</p>
                <p>Thank you for purchasing tickets to ${eventTitle}. Here are your payment details:</p>
                <ul>
                    <li><strong>Amount:</strong> ${amount}</li>
                    <li><strong>Date:</strong> ${date}</li>
                    <li><strong>Payment Method:</strong> ${method}</li>
                </ul>
                <p>If you have any questions, please contact us.</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    // Set up email options
    const mailOptions = {
        from: 'livelycampus@gmail.com',
        to: email,
        subject: 'Payment Confirmation',
        html: emailBody,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send({ message: 'Error sending email', error });
        }
        res.status(200).send({ message: 'Confirmation email sent successfully!' });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
