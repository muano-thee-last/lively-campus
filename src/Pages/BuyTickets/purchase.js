/* eslint-disable */
import { useState, useEffect } from 'react';


async function getRedirectLink(amount, id) {
    const userString = sessionStorage.getItem('user');
    try {   
        const response = await fetch('https://us-central1-witslivelycampus.cloudfunctions.net/app/getPaymentUrl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                amount: amount,
                externalId : JSON.stringify({
                    id : id,
                    uid : JSON.parse(userString).uid
                })
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        //setPaymentId(result.id);
        return result.redirectUrl;
    } catch (error) {
        console.error('Error fetching payment URL:', error.message, error);
        return null;
    }
}

function BuyTicket({ event }) {
    const [redirectUrl, setRedirectUrl] = useState(null);
    var [paymentId, setPaymentId] = useState("")


    console.log(event)
    useEffect(() => {
        const fetchRedirectLink = async () => {
            try {
                if (event && event.ticketPrice) {
                    console.log(event);
                    const url = await getRedirectLink(event.ticketPrice, event.id);
                    if (url) {
                        setRedirectUrl(url);
                    }
                }
            } catch (error) {
                console.error('Error in fetching redirect link:', error);
            }
        };

        fetchRedirectLink();
    }, [event]);

    useEffect(() => {
        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    }, [redirectUrl]);

    return null;
}

export default BuyTicket;
