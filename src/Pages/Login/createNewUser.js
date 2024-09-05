

async function createNewUser(result) {

  const userID = result.user.uid;

  sessionStorage.setItem("uid", userID);
  sessionStorage.setItem("user", JSON.stringify(result.user));
  const user = {
    UserID: userID,
    FirstName: result.user.displayName,
    LastName: result.user.displayName,
    profile_picture: result.user.photoURL,
    Email: result.user.email,
  };
  

  if (!user.FirstName) {

    const newFirstName = prompt("Please enter your name:");
    if (newFirstName) {
      user.FirstName = newFirstName;
    } else {
      alert("First name is required!");
      return;
    }
  }

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