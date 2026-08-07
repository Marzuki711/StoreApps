/*************************************************
 * Manual OT Claim System
 * ui.js
 *************************************************/

/* ==========================================
   SWEET ALERT
========================================== */

function showSuccess(message){

    Swal.fire({
        icon:"success",
        title:"SUCCESS",
        text:message,
        confirmButtonText:"OK",
        confirmButtonColor:"#198754",
        allowOutsideClick:false
    });

}

function showError(message){

    Swal.fire({
        icon:"error",
        title:"VALIDATION",
        text:message,
        confirmButtonText:"OK",
        confirmButtonColor:"#dc3545"
    });

}

function showWarning(message){

    Swal.fire({
        icon:"warning",
        title:"WARNING",
        text:message,
        confirmButtonText:"OK",
        confirmButtonColor:"#ffc107"
    });

}

/* ==========================================
   LOADING
========================================== */

function showLoading(){

    const loading=document.getElementById("loading");

    if(loading){

        loading.style.display="flex";

    }

}

function hideLoading(){

    const loading=document.getElementById("loading");

    if(loading){

        loading.style.display="none";

    }

}

/* ==========================================
   SHOW FORM
========================================== */

function showForm(type){

    const ft=document.getElementById("fullTimerForm");
    const pt=document.getElementById("partTimerForm");
    const fw=document.getElementById("foreignWorkerForm");

    if(ft) ft.style.display="none";
    if(pt) pt.style.display="none";
    if(fw) fw.style.display="none";

    switch(type){

        case "Full Timer":

            if(ft) ft.style.display="block";

            break;

        case "Part Timer":

            if(pt) pt.style.display="block";

            break;

        case "Foreign Worker":

            if(fw) fw.style.display="block";

            break;

    }

}

/* ==========================================
   RESET FORM
========================================== */

function resetForm(formId){

    const form=document.getElementById(formId);

    if(!form) return;

    form.querySelectorAll("input").forEach(input=>{

        switch(input.type){

            case "text":
            case "date":
            case "time":
            case "number":
            case "email":

                input.value="";

                break;

            case "checkbox":
            case "radio":

                input.checked=false;

                break;

        }

        input.classList.remove("input-error");

    });

    form.querySelectorAll("select").forEach(select=>{

        select.selectedIndex=0;

        select.classList.remove("input-error");

    });

    form.querySelectorAll("textarea").forEach(textarea=>{

        textarea.value="";

        textarea.classList.remove("input-error");

    });

}

/* ==========================================
   VALIDATE FORM
========================================== */

function validateForm(formId){

    const form=document.getElementById(formId);

    if(!form) return false;

    let valid=true;

    let missingFields=[];

    const requiredFields=form.querySelectorAll("[data-required='true']");

    requiredFields.forEach(field=>{

        field.classList.remove("input-error");

        const value=(field.value || "").trim();

        if(value===""){

            valid=false;

            field.classList.add("input-error");

            missingFields.push(field.dataset.label);

        }

    });

    if(!valid){

        Swal.fire({

            icon:"error",

            title:"Validation Failed",

            html:`
            <div style="text-align:left">

                <b>Please complete:</b>

                <br><br>

                ${missingFields.map(item=>`❌ ${item}<br>`).join("")}

            </div>
            `,

            confirmButtonColor:"#dc3545"

        });

    }

    return valid;

}
