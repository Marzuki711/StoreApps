async function loginSystem(){

    console.log("LOGIN CLICKED");

    const username =
        document.getElementById("loginUsername").value.trim();

    const password =
        document.getElementById("loginPassword").value;

    console.log(username, password);

    const result = await callAPI("login",{
        username,
        password
    });

    console.log("LOGIN RESULT:", result);

    if(!result.status){

        showError(result.message);

        return;

    }

    currentUser = result;

    showHome();

}
