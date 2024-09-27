import  { useState, useEffect } from 'react';

async function getRedirectLink(amount) {
    try {
        const response = await fetch('https://us-central1-witslivelycampus.cloudfunctions.net/app/getPaymentUrl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: amount }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        return result.redirectUrl;
    } catch (error) {
        console.error('Error fetching payment URL:', error.message, error); // More detailed error
        return null;
    }
}

function BuyTicket({ event }) {
    const [redirectUrl, setRedirectUrl] = useState(null);

    useEffect(() => {
        const fetchRedirectLink = async () => {
            console.log(event)
            const url = await getRedirectLink(event.ticketPrice);
            if (url) {
                setRedirectUrl(url); 
            }
        };

        fetchRedirectLink();
    }, [event.ticketPrice,event]);

    useEffect(() => {
        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    }, [redirectUrl]);

    return null; // No need to return any UI elements
}

export default BuyTicket;
