import React from "react";
import "./ticketVerification.css";
import Header from "../dashboard/header";
import TicketInfo from "./ticketDetails";
//enter the ticket code
//search the database if the ticket exists.
//accepts verification if it exists. 
//returns info about the tickest

// function VerifyTicket(userId){
    

//     const res = fetch('url', {
//         method: 'GET',
//         headers : {
//             'Content-Type': 'application/json',
//         },

//         body : JSON.stringify({'userId': userId})
//     }).then(response => response.json()).then(data => console.log(data))


//     if(res.error){
//         //unable to get the checkForTickets
//     }
    
// }


function TicketVerification(){

    const ticket = {
        name : "evnnAME",
        buyer : "eventBuer",
        price: "$50",
        purchaseDate: "2024-09-16",
        code: "ABC123XYZ",
      };

    return(

        <div>
            <Header></Header>

<input placeholder="Enter ticke code" className="input" name="email" type="email"></input>
   <button className="button" >Verify</button> 
            
   <TicketInfo ticket={ticket} />

        </div>
        
);


}

export default TicketVerification;