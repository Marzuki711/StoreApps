/* ==========================================
   js/account.js
   LOGOUT
========================================== */

function logout(){

    Swal.fire({

        title: "Logout",

        text: "Are you sure you want to logout?",

        icon: "question",

        showCancelButton: true,

        confirmButtonText: "Logout",

        cancelButtonText: "Cancel",

        confirmButtonColor: "#C1121F",

        cancelButtonColor: "#6B7280"

    }).then((result)=>{

        if(!result.isConfirmed){

            return;

        }

        sessionStorage.clear();

        currentUser = null;

        document.querySelector(".topbar").style.display="none";

        document.getElementById("homeContainer").style.display="none";

        document.getElementById("otModule").style.display="none";

        document.getElementById("loginContainer").style.display="block";

        document.getElementById("loginUsername").value="";

        document.getElementById("loginPassword").value="";

        Swal.fire({

            icon:"success",

            title:"Logged Out",

            text:"You have been logged out successfully.",

            confirmButtonColor:"#C1121F"

        });

    });

}

function openChangePassword(){

    document
        .getElementById("accountDropdown")
        ?.classList
        .remove("show");

    document
        .getElementById("changePasswordModal")
        .style.display="flex";
   
/* ==========================================================
   CHANGE PASSWORD MODAL
========================================================== */

function closeChangePassword(){

    document
        .getElementById("changePasswordModal")
        .style.display="none";

    document
        .getElementById("currentPassword")
        .value="";

    document
        .getElementById("newPassword")
        .value="";

    document
        .getElementById("confirmPassword")
        .value="";

}
