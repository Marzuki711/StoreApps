async function loginSystem(){

    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;

    if(!username || !password){

        showError("Please enter Username and Password.");
        return;

    }

    const btn = document.getElementById("btnLogin");

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing In...';

    showLoading();

    const result = await callAPI("login",{
        username,
        password
    });

    hideLoading();

    btn.disabled = false;
    btn.innerHTML = "LOGIN";

    if(!result || !result.status){

        showError(result?.message || "Login Failed");
        return;

    }

    currentUser = result;

    sessionStorage.setItem(
        "currentUser",
        JSON.stringify(result)
    );

    requestAnimationFrame(showHome);

    setTimeout(() => {

    callAPI("updateLastLogin",{
        username: currentUser.username
    }).catch(console.error);

},300);

}

document.addEventListener("DOMContentLoaded",()=>{

    initPasswordToggle(
        "loginPassword",
        "toggleLoginPassword"
    );

});

/* ==========================================
   CHANGE PASSWORD
========================================== */

async function changePassword(){

    const currentPassword =
        document.getElementById("currentPassword").value.trim();

    const newPassword =
        document.getElementById("newPassword").value.trim();

    const confirmPassword =
        document.getElementById("confirmPassword").value.trim();

    // ==========================
    // VALIDATION
    // ==========================

    if(currentPassword===""){

        showError("Please enter Current Password.");

        return;

    }

    if(newPassword===""){

        showError("Please enter New Password.");

        return;

    }

    if(confirmPassword===""){

        showError("Please confirm your New Password.");

        return;

    }

    if(newPassword!==confirmPassword){

        showError("New Password and Confirm Password do not match.");

        return;

    }

    if(newPassword.length<6){

        showError("Password must be at least 6 characters.");

        return;

    }

    if(currentPassword===newPassword){

        showError("New Password cannot be the same as Current Password.");

        return;

    }

    const btn =
        document.getElementById("btnSavePassword");

    btn.disabled = true;

    btn.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Saving...
    `;

    showLoading();

    let result;

    try{

        result = await callAPI("changePassword",{

            username: currentUser.username,

            currentPassword,

            newPassword

        });

    }catch(err){

        hideLoading();

        btn.disabled = false;

        btn.innerHTML = "Save";

        console.error(err);

        showError("Unable to connect to server.");

        return;

    }

    hideLoading();

    btn.disabled = false;

    btn.innerHTML = "Save";

    if(!result){

        showError("No response from server.");

        return;

    }

    if(!result.status){

        showError(result.message);

        return;

    }

    showSuccess(result.message);

    closeChangePassword();

}

/* ==========================================
   SHOW / HIDE PASSWORD
========================================== */

function initPasswordToggle(inputId, iconId){

    const input = document.getElementById(inputId);

    const icon = document.getElementById(iconId);

    if(!input || !icon){

        return;

    }

    icon.addEventListener("click",()=>{

        if(input.type==="password"){

            input.type="text";

            icon.classList.remove("fa-eye");

            icon.classList.add("fa-eye-slash");

        }else{

            input.type="password";

            icon.classList.remove("fa-eye-slash");

            icon.classList.add("fa-eye");

        }

    });

}
