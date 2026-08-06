/*************************************************
 * Manual OT Claim System
 * script.js
 * GitHub Version
 *************************************************/

/* ==========================================
   API CALL (No CORS Preflight)
========================================== */

async function callAPI(action, data = {}) {

   if(!checkInternet()){

    return {
        status:false,
        message:"No Internet"
    };

}

    try {

        showLoading();

        const formData = new URLSearchParams();

        formData.append(
            "payload",
            JSON.stringify({
                action: action,
                data: data
            })
        );

        const response = await fetch(CONFIG.WEB_APP_URL, {
            method: "POST",
            body: formData
        });

        const text = await response.text();

        console.log("========== RESPONSE ==========");
        console.log(text);
        console.log("==============================");

        try {

            const result = JSON.parse(text);

            hideLoading();

            return result;

        } catch (err) {

            hideLoading();

            if (text.includes("<!DOCTYPE html")) {

                return {
                    status: false,
                    message: "Unable to connect to the server. Please check your internet connection."
                };

            }

            return {
                status: false,
                message: text
            };

        }

    } catch (err) {

        hideLoading();

        console.error(err);

        return {
            status: false,
            message: err.message
        };

    }

}   


/* ==========================================
   SEARCH EMPLOYEE
========================================== */

async function searchEmployee(employeeId){

    console.log("searchEmployee()", employeeId);

    if(!employeeId) return;

    const result = await callAPI("searchEmployee",{
        employeeId: employeeId
    });

    console.log("API RESULT:", result);

    if(!result.status){

    const employeeType = document.getElementById("employeeType").value;

    if(employeeType === "Full Timer"){

        document.getElementById("ft_unit").value = "";
        document.getElementById("ft_employeeName").value = "";
        document.getElementById("ft_position").selectedIndex = 0;

    }

    else if(employeeType === "Part Timer"){

        document.getElementById("pt_unit").value = "";
        document.getElementById("pt_employeeName").value = "";

    }

    else if(employeeType === "Foreign Worker"){

        document.getElementById("fw_unit").value = "";
        document.getElementById("fw_employeeName").value = "";
        document.getElementById("fw_position").selectedIndex = 0;
        document.getElementById("fw_om").value = "";
        document.getElementById("fw_fm").value = "";

    }

    showError(result.message);

    return;

}

    const employeeType =
        document.getElementById("employeeType").value;

    // ==========================
    // FULL TIMER
    // ==========================

    if(employeeType === "Full Timer"){

        document.getElementById("ft_unit").value = result.unit;
        document.getElementById("ft_employeeName").value = result.employeeName;
        document.getElementById("ft_position").value = result.position;

        calculateFullTimer();

    }

    // ==========================
    // PART TIMER
    // ==========================

    else if(employeeType === "Part Timer"){

        document.getElementById("pt_unit").value = result.unit;
        document.getElementById("pt_employeeName").value = result.employeeName;

    }

    // ==========================
    // FOREIGN WORKER
    // ==========================

    else if(employeeType === "Foreign Worker"){

        document.getElementById("fw_unit").value = result.unit;
        document.getElementById("fw_employeeName").value = result.employeeName;
        document.getElementById("fw_position").value = result.position;
        document.getElementById("fw_om").value = result.om;
        document.getElementById("fw_fm").value = result.fm;

        calculateForeignWorker();

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

async function loadComponent(file, target) {

    try {

        const response = await fetch(file);

        if (!response.ok) {

            throw new Error(file + " not found");

        }

        const html = await response.text();

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

/* ==========================================
   CALCULATE FULL TIMER
========================================== */

function calculateFullTimer() {

    const firstIn = document.getElementById("ft_firstIn").value;
    const lastOut = document.getElementById("ft_lastOut").value;
    const position = document.getElementById("ft_position").value;

    if (!firstIn || !lastOut) return;

    const start = new Date("2000-01-01 " + firstIn);
    let end = new Date("2000-01-01 " + lastOut);

    if (end < start) {
        end.setDate(end.getDate() + 1);
    }

    // Work Hours
    const workHours = (end - start) / 3600000;

    document.getElementById("ft_workHours").value =
        workHours.toFixed(2);

    // App Work Hours
    let appHours = 0;

    if (["Sm","Asm","Sc"].includes(position)) {

        appHours = 8;

    } else if (["Sv1","Sv2","Asv","Cm","Fc"].includes(position)) {

        appHours = 8.5;

    }

    document.getElementById("ft_appHours").value = appHours;

    // Approved OT
    let ot = workHours - appHours;

    if (ot < 0) ot = 0;

    ot = Math.floor(ot) + ((ot % 1) >= 0.5 ? 0.5 : 0);

    document.getElementById("ft_approvedOT").value =
        ot.toFixed(1);

}

/* ==========================================
   CALCULATE PART TIMER
========================================== */

function calculatePartTimer(){

    const firstIn = document.getElementById("pt_firstIn").value;
    const lastOut = document.getElementById("pt_lastOut").value;

    if(!firstIn || !lastOut) return;

    const start = new Date("2000-01-01 " + firstIn);
    let end = new Date("2000-01-01 " + lastOut);

    if(end < start){

        end.setDate(end.getDate() + 1);

    }

    // Work Hours
    let workHours = (end - start) / 3600000;

    document.getElementById("pt_workHours").value =
        workHours.toFixed(2);

    // Floor Hours (ikut Excel - floor kepada 0.5 jam)
    let floorHours = Math.floor(workHours * 2) / 2;

    document.getElementById("pt_floorHours").value =
        floorHours.toFixed(1);

    // 1st 4 Hours
    let firstFour = Math.min(floorHours,4);

    document.getElementById("pt_firstFour").value =
        firstFour.toFixed(1);

    // 2nd 4 Hours
    let secondFour = 0;

    if(floorHours > 4){

        secondFour = Math.min(floorHours - 4,4);

    }

    document.getElementById("pt_secondFour").value =
        secondFour.toFixed(1);

    // After 8 Hours
    let afterEight = 0;

    if(floorHours > 8){

        afterEight = floorHours - 8;

    }

    document.getElementById("pt_afterEight").value =
        afterEight.toFixed(1);

}

/* ==========================================
   CALCULATE FOREIGN WORKER
========================================== */

function calculateForeignWorker(){

    const firstIn = document.getElementById("fw_firstIn").value;
    const lastOut = document.getElementById("fw_lastOut").value;

    if(!firstIn || !lastOut) return;

    const start = new Date("2000-01-01 " + firstIn);
    let end = new Date("2000-01-01 " + lastOut);

    if(end < start){

        end.setDate(end.getDate() + 1);

    }

    // Work Hours
    const workHours = (end - start) / 3600000;

    document.getElementById("fw_workHours").value =
        workHours.toFixed(2);

    // Foreign Worker App Hours = 12
    const appHours = 12;

    document.getElementById("fw_appHours").value =
        appHours;

    // Approved OT
    let ot = workHours - appHours;

    if(ot < 0){

        ot = 0;

    }

    ot = Math.floor(ot) + ((ot % 1) >= 0.5 ? 0.5 : 0);

    document.getElementById("fw_approvedOT").value =
        ot.toFixed(1);

}

/* ==========================================
   SAVE FULL TIMER
========================================== */

async function saveFullTimer() {

    if (!validateForm("fullTimerForm")) return;

    const data = {

        employeeType: "Full Timer",

        unit: document.getElementById("ft_unit").value.trim(),

        employeeId: document.getElementById("ft_employeeId").value.trim(),

        employeeName: document.getElementById("ft_employeeName").value.trim(),

        position: document.getElementById("ft_position").value,

        actualDate: document.getElementById("ft_actualDate").value,

        firstIn: document.getElementById("ft_firstIn").value,

        lastOut: document.getElementById("ft_lastOut").value,

        workHours: document.getElementById("ft_workHours").value,

        appHours: document.getElementById("ft_appHours").value,

        approvedOT: document.getElementById("ft_approvedOT").value,

        publicHoliday: document.getElementById("ft_publicHoliday").value,

        restDay: document.getElementById("ft_restDay").value,

        nightShift: document.getElementById("ft_nightShift").value,

        reason: document.getElementById("ft_reason").value,

        reportNo: document.getElementById("ft_reportNo").value.trim(),

        reasonOT: document.getElementById("ft_reasonOT").value,

        remark: document.getElementById("ft_remark").value.trim()

    };

    const result = await callAPI("saveData", data);

    if (result && result.status) {

        showSuccess("Data Saved Successfully");

        resetForm("fullTimerForm");

    } else {

        showError(result.message);

    }

}

/* ==========================================
   SAVE PART TIMER
========================================== */

async function savePartTimer() {

    if (!validateForm("partTimerForm")) return;

    const data = {

        employeeType: "Part Timer",

        unit: document.getElementById("pt_unit").value.trim(),

        employeeId: document.getElementById("pt_employeeId").value.trim(),

        employeeName: document.getElementById("pt_employeeName").value.trim(),

        actualDate: document.getElementById("pt_actualDate").value,

        firstIn: document.getElementById("pt_firstIn").value,

        lastOut: document.getElementById("pt_lastOut").value,

        workHours: document.getElementById("pt_workHours").value,

        floorHours: document.getElementById("pt_floorHours").value,

        firstFour: document.getElementById("pt_firstFour").value,

        secondFour: document.getElementById("pt_secondFour").value,

        afterEight: document.getElementById("pt_afterEight").value,

        publicHoliday: document.getElementById("pt_publicHoliday").value,

        restDay: document.getElementById("pt_restDay").value,

        reason: document.getElementById("pt_reason").value,

        reportNo: document.getElementById("pt_reportNo").value.trim(),

        reasonOT: document.getElementById("pt_reasonOT").value,

        remark: document.getElementById("pt_remark").value.trim()

    };

    const result = await callAPI("saveData", data);

    if (result && result.status) {

        alert(result.message || "Saved Successfully");

        resetForm("partTimerForm");

    } else {

        showError(result.message);

    }

}

/* ==========================================
   SAVE FOREIGN WORKER
========================================== */

async function saveForeignWorker() {

    if (!validateForm("foreignWorkerForm")) return;

    const data = {

        employeeType: "Foreign Worker",

        om: document.getElementById("fw_om").value.trim(),

        fm: document.getElementById("fw_fm").value.trim(),

        unit: document.getElementById("fw_unit").value.trim(),

        employeeId: document.getElementById("fw_employeeId").value.trim(),

        employeeName: document.getElementById("fw_employeeName").value.trim(),

        position: document.getElementById("fw_position").value,

        actualDate: document.getElementById("fw_actualDate").value,

        firstIn: document.getElementById("fw_firstIn").value,

        lastOut: document.getElementById("fw_lastOut").value,

        workHours: document.getElementById("fw_workHours").value,

        appHours: document.getElementById("fw_appHours").value,

        approvedOT: document.getElementById("fw_approvedOT").value,

        publicHoliday: document.getElementById("fw_publicHoliday").value,

        restDay: document.getElementById("fw_restDay").value,

        replacementLeave: document.getElementById("fw_replacementLeave").value,

        reason: document.getElementById("fw_reason").value,

        reportNo: document.getElementById("fw_reportNo").value.trim(),

        reasonOT: document.getElementById("fw_reasonOT").value,

        remark: document.getElementById("fw_remark").value.trim()

    };

    const result = await callAPI("saveData", data);

    if (result && result.status) {

        alert(result.message || "Saved Successfully");

        resetForm("foreignWorkerForm");

    } else {

        alert(result?.message || "Save Failed");

    }

}

/* ==========================================
   INITIALIZE APPLICATION
========================================== */

document.addEventListener("DOMContentLoaded", async () => {

    // ==========================
    // LOAD COMPONENT
    // ==========================

    await loadComponent(
        "components/login.html",
        "loginContainer"
   );
   
    await loadComponent(
        "components/home.html",
        "homeContainer"
    );

    await loadComponent(
        "components/fulltimer.html",
        "fullTimerContainer"
    );

    await loadComponent(
        "components/parttimer.html",
        "partTimerContainer"
    );

    await loadComponent(
        "components/foreignworker.html",
        "foreignWorkerContainer"
    );

   document
   .getElementById("btnLogin")
   ?.addEventListener("click",loginSystem);

   document
   .getElementById("btnHome")
   ?.addEventListener("click",showHome);

   document
   .getElementById("btnLogout")
   ?.addEventListener("click",logout);

   document
   .getElementById("btnAccount")
   ?.addEventListener("click",toggleAccountMenu);

   document
   .getElementById("btnChangePassword")
   ?.addEventListener("click",openChangePassword);

   // ==========================
   // FIRST SCREEN
   // ==========================

   document.getElementById("loginContainer").style.display = "block";
   document.getElementById("homeContainer").style.display = "none";
   document.getElementById("otModule").style.display = "none";
   document.querySelector(".topbar").style.display = "none";

   document.body.style.visibility = "visible";

   
    // ==========================
    // EMPLOYEE TYPE
    // ==========================

    const employeeType = document.getElementById("employeeType");
    employeeType.addEventListener("change", function () {
    showForm(this.value);

    });

    // ==========================
    // NUMBER ONLY
    // ==========================

    numberOnly(document.getElementById("ft_unit"),4);
    numberOnly(document.getElementById("pt_unit"),4);
    numberOnly(document.getElementById("fw_unit"),4);

    numberOnly(document.getElementById("ft_employeeId"),8);
    numberOnly(document.getElementById("pt_employeeId"),8);
    numberOnly(document.getElementById("fw_employeeId"),8);

    // ==========================
    // FORMAT EMPLOYEE ID
    // ==========================

    formatEmployeeID(document.getElementById("ft_employeeId"));
    formatEmployeeID(document.getElementById("pt_employeeId"));
    formatEmployeeID(document.getElementById("fw_employeeId"));

    // ==========================
    // FULL TIMER
    // ==========================

    document.getElementById("ft_position")
        ?.addEventListener("change",calculateFullTimer);

    document.getElementById("ft_firstIn")
        ?.addEventListener("change",calculateFullTimer);

    document.getElementById("ft_lastOut")
        ?.addEventListener("change",calculateFullTimer);

    // ==========================
    // PART TIMER
    // ==========================

    document.getElementById("pt_firstIn")
        ?.addEventListener("change",calculatePartTimer);

    document.getElementById("pt_lastOut")
        ?.addEventListener("change",calculatePartTimer);

    // ==========================
    // FOREIGN WORKER
    // ==========================

    document.getElementById("fw_firstIn")
        ?.addEventListener("change",calculateForeignWorker);

    document.getElementById("fw_lastOut")
        ?.addEventListener("change",calculateForeignWorker);

    // ==========================
    // RESET BUTTON
    // ==========================

    document.getElementById("btnResetFT")
        ?.addEventListener("click",()=>resetForm("fullTimerForm"));

    document.getElementById("btnResetPT")
        ?.addEventListener("click",()=>resetForm("partTimerForm"));

    document.getElementById("btnResetFW")
        ?.addEventListener("click",()=>resetForm("foreignWorkerForm"));

    // ==========================
    // SAVE BUTTON
    // ==========================

    document.getElementById("btnSaveFT")
        ?.addEventListener("click",saveFullTimer);

    document.getElementById("btnSavePT")
        ?.addEventListener("click",savePartTimer);

    document.getElementById("btnSaveFW")
        ?.addEventListener("click",saveForeignWorker);

    // ==========================
    // EMPLOYEE SEARCH
    // ==========================

    let searchTimer;

    function autoSearchEmployee(employeeId){

        clearTimeout(searchTimer);

        searchTimer = setTimeout(()=>{

            searchEmployee(employeeId);

        },300);

    }

    // Full Timer
    document.getElementById("ft_employeeId")
    ?.addEventListener("input",function(){

        const id=this.value.trim();

        if(id.length<8){

            document.getElementById("ft_unit").value="";
            document.getElementById("ft_employeeName").value="";
            document.getElementById("ft_position").selectedIndex=0;
            return;

        }

        autoSearchEmployee(id);

    });

    // Part Timer
    document.getElementById("pt_employeeId")
    ?.addEventListener("input",function(){

        const id=this.value.trim();

        if(id.length<8){

            document.getElementById("pt_unit").value="";
            document.getElementById("pt_employeeName").value="";
            return;

        }

        autoSearchEmployee(id);

    });

    // Foreign Worker
    document.getElementById("fw_employeeId")
    ?.addEventListener("input",function(){

        const id=this.value.trim();

        if(id.length<8){

            document.getElementById("fw_unit").value="";
            document.getElementById("fw_employeeName").value="";
            document.getElementById("fw_position").selectedIndex=0;
            document.getElementById("fw_om").value="";
            document.getElementById("fw_fm").value="";
            return;

        }

        autoSearchEmployee(id);

    });

});

/* ==========================================
   NUMBER ONLY
========================================== */

function numberOnly(input, maxLength){

    input.addEventListener("input", function(){

        // Buang semua selain nombor
        this.value = this.value.replace(/\D/g,"");

        // Had maksimum digit
        if(this.value.length > maxLength){

            this.value = this.value.substring(0,maxLength);

        }

    });

}

/* ==========================================
   EMPLOYEE ID FORMAT
========================================== */

function formatEmployeeID(input){

    input.addEventListener("blur", function(){

        let value = this.value.replace(/\D/g,"");

        if(value !== ""){

            this.value = value.padStart(8,"0");

        }

    });

}

/* ==========================================
   REGISTER SERVICE WORKER
========================================== */

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker.register("./sw.js")

            .then(() => {

                console.log("PWA Ready");

            })

            .catch(err => {

                console.log(err);

            });

    });

}

function showHome(){

    const topbar = document.querySelector(".topbar");

    topbar.style.display = "flex";

    if(window.innerWidth <= 768){
        topbar.style.flexDirection = "column";
    }else{
        topbar.style.flexDirection = "row";
    }

    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("homeContainer").style.display = "block";
    document.getElementById("otModule").style.display = "none";
}

function openManualOT(){
     
    document.getElementById("homeContainer").style.display="none";

    document.getElementById("otModule").style.display="block";

    document.getElementById("employeeType").value="Full Timer";

    showForm("Full Timer");

}

/* ==========================================
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

    Swal.fire({
        icon:"info",
        title:"Change Password",
        text:"Change Password Module Coming Soon",
        confirmButtonColor:"#C1121F"
    });

}

/* ==========================================================
   ACCOUNT MENU
========================================================== */

function toggleAccountMenu(e){

    e.stopPropagation();

    document
        .getElementById("accountDropdown")
        .classList
        .toggle("show");

}

document.addEventListener("click",function(){

    document
        .getElementById("accountDropdown")
        ?.classList
        .remove("show");

});

function openChangePassword(){

    document
        .getElementById("accountDropdown")
        .classList
        .remove("show");

    Swal.fire({

        icon:"info",

        title:"Change Password",

        text:"Change Password Module Coming Soon",

        confirmButtonColor:"#C1121F"

    });

}
