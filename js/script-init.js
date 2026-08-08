/* ==========================================
   RESTORE SEARCH BUTTON
========================================== */

function restoreSearchButton(btn){

    if(!btn){

        return;

    }

    btn.disabled = false;

    btn.classList.remove("loading");

    btn.style.color = "";

    btn.innerHTML = `
        <i class="fa-solid fa-magnifying-glass"></i>
    `;

}

/* ==========================================
   CLEAR EMPLOYEE INFO
========================================== */

function clearEmployeeInfo(employeeType){

    switch(employeeType){

        case "Full Timer":

            document.getElementById("ft_unit").value = "";

            document.getElementById("ft_employeeName").value = "";

            document.getElementById("ft_position").selectedIndex = 0;

            document.getElementById("ft_employeeId").focus();

            break;

        case "Part Timer":

            document.getElementById("pt_unit").value = "";

            document.getElementById("pt_employeeName").value = "";

            document.getElementById("pt_employeeId").focus();

            break;

        case "Foreign Worker":

            document.getElementById("fw_unit").value = "";

            document.getElementById("fw_employeeName").value = "";

            document.getElementById("fw_position").selectedIndex = 0;

            document.getElementById("fw_om").value = "";

            document.getElementById("fw_fm").value = "";

            document.getElementById("fw_employeeId").focus();

            break;

    }

}

/* ==========================================
   SWEET ALERT
========================================== */

function showSuccess(message){

    Swal.fire({

        icon: "success",

        title: "SUCCESS",

        text: message,

        confirmButtonText: "OK",

        confirmButtonColor: "#198754",

        allowOutsideClick: false

    });

}

function showError(message){

    Swal.fire({

        icon: "error",

        title: "VALIDATION",

        text: message,

        confirmButtonText: "OK",

        confirmButtonColor: "#dc3545"

    });

}

function showWarning(message){

    Swal.fire({

        icon: "warning",

        title: "WARNING",

        text: message,

        confirmButtonText: "OK",

        confirmButtonColor: "#ffc107"

    });

}

/* ==========================================
   LOADING
========================================== */

function showLoading() {

    const loading = document.getElementById("loading");

    if (loading) {

        loading.style.display = "flex";

    }

}

function hideLoading() {

    const loading = document.getElementById("loading");

    if (loading) {

        loading.style.display = "none";

    }

}

function checkInternet(){

    if(!navigator.onLine){

        Swal.fire({
            icon:"error",
            title:"No Internet Connection",
            text:"Please check your internet connection and try again.",
            confirmButtonColor:"#C1121F"
        });

        return false;

    }

    return true;

}

/* ==========================================
   LOAD HTML COMPONENT
========================================== */

const componentCache = new Map();

async function loadComponent(file, target) {

    try {

        let html = componentCache.get(file);

        if (!html) {

            const response = await fetch(file);

            if (!response.ok) {
                throw new Error(file + " not found");
            }

            html = await response.text();

            componentCache.set(file, html);

        }

        const container = document.getElementById(target);

        if (container) {
            container.innerHTML = html;
        }

    } catch (err) {

        console.error("Component Error :", err);

    }

}

/* ==========================================
   SHOW / HIDE FORM
========================================== */

function showForm(type) {

    const ft = document.getElementById("fullTimerForm");
    const pt = document.getElementById("partTimerForm");
    const fw = document.getElementById("foreignWorkerForm");

    if (ft) ft.style.display = "none";
    if (pt) pt.style.display = "none";
    if (fw) fw.style.display = "none";

    switch (type) {

        case "Full Timer":

            if (ft) ft.style.display = "block";

            break;

        case "Part Timer":

            if (pt) pt.style.display = "block";

            break;

        case "Foreign Worker":

            if (fw) fw.style.display = "block";

            break;

    }

}

/* ==========================================
   RESET FORM
========================================== */

function resetForm(formId) {

    const form = document.getElementById(formId);

    if (!form) return;

    // Reset Input
    form.querySelectorAll("input").forEach(input => {

        switch (input.type) {

            case "text":
            case "date":
            case "time":
            case "number":
            case "email":
                input.value = "";
                break;

            case "checkbox":
            case "radio":
                input.checked = false;
                break;

        }

        input.classList.remove("input-error");

    });

    // Reset Select
    form.querySelectorAll("select").forEach(select => {

        select.selectedIndex = 0;

        select.classList.remove("input-error");

    });

    // Reset Textarea
    form.querySelectorAll("textarea").forEach(textarea => {

        textarea.value = "";

        textarea.classList.remove("input-error");

    });

}

/* ==========================================
   VALIDATE FORM V2
========================================== */

function validateForm(formId){

    const form = document.getElementById(formId);

    if(!form) return false;

    let valid = true;

    let missingFields = [];

    const requiredFields = form.querySelectorAll("[data-required='true']");

    requiredFields.forEach(field => {

        field.classList.remove("input-error");

        // ===============================
        // SMART VALIDATION REPORT NUMBER
        // ===============================

        if(field.id === "ft_reportNo"){

            const reason = document.getElementById("ft_reason").value;

            if(reason === "Ot Capped") return;

        }

        if(field.id === "pt_reportNo"){

            const reason = document.getElementById("pt_reason").value;

            if(reason === "Ot Capped") return;

        }

        if(field.id === "fw_reportNo"){

            const reason = document.getElementById("fw_reason").value;

            if(reason === "Ot Capped") return;

        }

        const value = (field.value || "").trim();

        if(value === ""){

            valid = false;

            field.classList.add("input-error");

            missingFields.push(field.dataset.label);

        }

    });

    if(!valid){

        Swal.fire({

            icon:"error",

            title:"Validation Failed",

            html: `
            <div style="text-align:left;font-size:15px;line-height:1.8">

                <b>Please complete the following field(s):</b>

                <br><br>

                ${missingFields.map(item => `
                    <div style="
                        padding:8px;
                        margin-bottom:6px;
                        background:#fff5f5;
                        border-left:5px solid #dc3545;
                        border-radius:6px;
                    ">
                        ❌ ${item}
                    </div>
                `).join("")}

            </div>
            `,

            confirmButtonText:"OK",

            confirmButtonColor:"#dc3545",

            allowOutsideClick:false

        });

    }

    return valid;

}
