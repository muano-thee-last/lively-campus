import React from "react";
import { json } from "react-router-dom";


//enter the ticket code
//search the database if the ticket exists.
//accepts verification if it exists. 

function checkForTicket(userId){


    const res = fetch('url', {
        method: 'GET',
        headers : {
            'Content-Type': 'application/json',
        },

        body : JSON.stringify({'userId': userId})
    }).then(response => response.json()).then(data => console.log(data))


    if(res.error){
        //unable to get the checkForTickets
    }
    
}


function TicketVerification(){

    return(

        <h1>

        </h1>
        
);


}