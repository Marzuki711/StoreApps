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

    const btn=document.getElementById("btnLogin");

    btn.disabled=true;

    btn.innerHTML=`
    <i class="fa-solid fa-spinner fa-spin"></i>
    Signing In...
    `;

    showLoading();

    console.log("LOGIN RESULT:", result);

    if(!result.status){

        showError(result.message);

        return;

    }

    currentUser = result;

    sessionStorage.setItem(
    "currentUser",
    JSON.stringify(result)
);

    showHome();

}
