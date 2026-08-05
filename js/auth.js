/*************************************************
 * AUTHENTICATION
 * StoreApps V1
 *************************************************/

let currentUser = null;

/* ==========================================
   LOGIN
========================================== */

async function loginSystem(){

    const username =
        document.getElementById("loginUsername")
        .value
        .trim();

    const password =
        document.getElementById("loginPassword")
        .value;

    if(username === ""){

        showError("Please enter Username.");

        return;

    }

    if(password === ""){

        showError("Please enter Password.");

        return;

    }

    const result = await callAPI("login",{

        username:username,

        password:password

    });

    if(!result.status){

        showError(result.message);

        return;

    }

    currentUser = result;

    // Hide Login
    document.getElementById("loginContainer")
        .style.display="none";

    // Show Home
    showHome();

}
