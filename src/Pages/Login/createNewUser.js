

async function createNewUser(result) {

  const userId1 = result.user.uid;

  sessionStorage.setItem("uid", userId1);
  sessionStorage.setItem("user", JSON.stringify(result.user));
  const user = {
    userId1: userId1,
    name: result.user.displayName,
    email: result.user.email,
    commentedEvents: [],
    likedEvents: [],
    profile_picture: result.user.photoURL,
  };
  

  if (!user.name) {

    const newFirstName = prompt("Please enter your name:");
    if (newFirstName) {
      user.name = newFirstName;
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