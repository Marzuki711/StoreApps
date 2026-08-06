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

    const result = await callAPI("login",{
        username,
        password
    });

    console.log("LOGIN RESULT:", result);

    hideLoading();

    // Restore button
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
