import React from 'react';

const PaymentConfirmation = () => {
    const handlePaymentConfirmation = () => {
        // Example of payment details
        const paymentDetails = {
            amount: 'R500',
            date: new Date().toLocaleString(),
        };

        fetch('http://localhost:3001/send-confirmation-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'amogelangkoras5@gmail.com', // User's email
                paymentDetails: JSON.stringify(paymentDetails), // Details to include in email
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                alert(data.message); // Show success message
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('There was an error confirming the payment.');
            });
    };

    return (
        <div>
            <button onClick={handlePaymentConfirmation}>Confirm Payment</button>
        </div>
    );
};

export default PaymentConfirmation;
