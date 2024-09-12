const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3001; // You can use your preferred port

app.use(cors());
app.use(bodyParser.json());

app.post('/send-confirmation-email', (req, res) => {
    const { email, paymentDetails } = req.body;

    // Configure the SMTP transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail', // You can replace this with your email provider (e.g., SMTP details)
        auth: {
            user: '2544404@students.wits.ac.za', // Your email address
            pass: 'fayo iibe kiab eeuf', // Ensure you use a secure method for handling passwords
        },
    });

    // Set up email options
    let mailOptions = {
        from: '2544404@students.wits.ac.za', // Your email address
        to: email, // Email of the recipient
        subject: 'Payment Confirmation',
        text: `Your payment has been confirmed. Here are the details: \n${paymentDetails}`, // Customize the message body
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
