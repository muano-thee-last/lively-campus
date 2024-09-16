import React from "react";
import "./ticketVerification.css";
import Header from "../dashboard/header";
import TicketInfo from "./ticketDetails";

//enter the ticket code
//search the database if the ticket exists.
//accepts verification if it exists. 
//returns info about the tickest

function VerifyTicket(ticketNum){
    
    const data = {
      ticketNum : ticketNum
    };


    const res = fetch('url', {
        method: 'GET',
        headers : {
            'Content-Type': 'application/json',
        },

        body : JSON.stringify({data})
    }).then(response => response.json()).then(data => console.log(data))


    if(res.error){
    }
    
}


function TicketVerification(ticketID){


let ticket;

  const ticketId = ticketID; 

fetch(`https://us-central1-witslivelycampus.cloudfunctions.net/app/verifyTicket?ticketId=${ticketId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        ticket = {
            buyer: "eventBuer", 
            price: `$${data.price}`, // Use the price from the API response
            purchaseDate: data.purchaseDate, // Use the purchaseDate from the API response
            code: data.ticketCode, // Use the ticketCode from the API response
        };

        console.log("Ticket data:", ticket);
        // Do something with the ticket data (e.g., update UI or process further)
    })
    .catch(error => {
        console.error("Error fetching ticket:", error);
    });





    return(

        <div>
            <Header></Header>

<input placeholder="Enter ticke code" className="input" name="email" type="email" id=""></input>
   <button className="button" >Verify</button> 
            
   <TicketInfo ticket={ticket} />

        </div>
        
);


}

export default TicketVerification;