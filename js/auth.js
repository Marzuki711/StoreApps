async function loginSystem(){

    console.log("LOGIN CLICKED");

    const username =
        document.getElementById("loginUsername").value.trim();

    const password =
        document.getElementById("loginPassword").value;

    // ==========================
    // VALIDATION
    // ==========================

    if(username === "" || password === ""){

        showError("Please enter Username and Password.");

        return;

    }

    // ==========================
    // CHECK INTERNET
    // ==========================

    if(!checkInternet()){

        return;

    }

    // ==========================
    // BUTTON LOADING
    // ==========================

    const btn = document.getElementById("btnLogin");

    btn.disabled = true;

    btn.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Signing In...
    `;

    showLoading();

    // ==========================
    // LOGIN API
    // ==========================

    let result;

    try{

        result = await callAPI("login",{
            username,
            password
        });

    }catch(err){

        hideLoading();

        btn.disabled = false;

        btn.innerHTML = "LOGIN";

        showError("Unable to connect to server.");

        return;

    }

    console.log("LOGIN RESULT:", result);

    // ==========================
    // NO RESPONSE
    // ==========================

    if(!result){

        hideLoading();

        btn.disabled = false;

        btn.innerHTML = "LOGIN";

        showError("No response from server.");

        return;

    }

    // ==========================
    // RESTORE BUTTON
    // ==========================

    hideLoading();

    btn.disabled = false;

    btn.innerHTML = "LOGIN";

    // ==========================
    // LOGIN FAILED
    // ==========================

    if(!result.status){

        showError(result.message);

        return;

    }

    // ==========================
    // LOGIN SUCCESS
    // ==========================

    currentUser = result;

    sessionStorage.setItem(
        "currentUser",
        JSON.stringify(result)
    );

    showHome();

}
