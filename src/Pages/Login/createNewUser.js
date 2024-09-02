

async function createNewUser(result){

    const userID = result.user.uid;

    const user = {
        UserID: userID,
        FirstName: result.user.displayName,
        LastName: result.user.displayName,
        profile_picture: result.user.photoURL,
        Email: result.user.email,
      };



      const createUserUrl = "https://us-central1-witslivelycampus.cloudfunctions.net/app/users";
      await fetch(createUserUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      alert("Account successfully created");

      


}

export default createNewUser;