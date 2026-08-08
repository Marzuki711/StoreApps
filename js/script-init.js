/*************************************************
 * Manual OT Claim System
 * script-init.js
 *
 * APPLICATION INITIALIZATION
 *
 * IMPORTANT:
 * - UI functions live in ui.js
 * - Employee search lives in script-search.js
 * - Calculations live in calculator.js
 * - Save functions live in save.js
 *
 * This file does NOT load or depend on script.js.
 *************************************************/

/* ==========================================
   INITIALIZE APPLICATION
========================================== */

document.addEventListener("DOMContentLoaded", async () => {

    // ==========================
    // LOAD COMPONENTS
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

    // ==========================
    // LOGIN / HOME
    // ==========================

    document
        .getElementById("btnLogin")
        ?.addEventListener("click", loginSystem);

    document
        .getElementById("btnHome")
        ?.addEventListener("click", showHome);

    // ==========================
    // SHOW HOME
    // ==========================

    showHome();

    // ==========================
    // EMPLOYEE TYPE
    // ==========================

    const employeeType =
        document.getElementById("employeeType");

    if(employeeType){

        employeeType.addEventListener("change", function(){

            showForm(this.value);

        });

    }

    // ==========================
    // NUMBER ONLY
    // ==========================

    numberOnly(
        document.getElementById("ft_unit"),
        4
    );

    numberOnly(
        document.getElementById("pt_unit"),
        4
    );

    numberOnly(
        document.getElementById("fw_unit"),
        4
    );

    numberOnly(
        document.getElementById("ft_employeeId"),
        8
    );

    numberOnly(
        document.getElementById("pt_employeeId"),
        8
    );

    numberOnly(
        document.getElementById("fw_employeeId"),
        8
    );

    // ==========================
    // FORMAT EMPLOYEE ID
    // ==========================

    formatEmployeeID(
        document.getElementById("ft_employeeId")
    );

    formatEmployeeID(
        document.getElementById("pt_employeeId")
    );

    formatEmployeeID(
        document.getElementById("fw_employeeId")
    );

    // ==========================
    // FULL TIMER CALCULATION
    // ==========================

    document
        .getElementById("ft_position")
        ?.addEventListener(
            "change",
            calculateFullTimer
        );

    document
        .getElementById("ft_firstIn")
        ?.addEventListener(
            "change",
            calculateFullTimer
        );

    document
        .getElementById("ft_lastOut")
        ?.addEventListener(
            "change",
            calculateFullTimer
        );

    // ==========================
    // PART TIMER CALCULATION
    // ==========================

    document
        .getElementById("pt_firstIn")
        ?.addEventListener(
            "change",
            calculatePartTimer
        );

    document
        .getElementById("pt_lastOut")
        ?.addEventListener(
            "change",
            calculatePartTimer
        );

    // ==========================
    // FOREIGN WORKER CALCULATION
    // ==========================

    document
        .getElementById("fw_firstIn")
        ?.addEventListener(
            "change",
            calculateForeignWorker
        );

    document
        .getElementById("fw_lastOut")
        ?.addEventListener(
            "change",
            calculateForeignWorker
        );

    // ==========================
    // RESET BUTTON
    // ==========================

    document
        .getElementById("btnResetFT")
        ?.addEventListener(
            "click",
            () => resetForm("fullTimerForm")
        );

    document
        .getElementById("btnResetPT")
        ?.addEventListener(
            "click",
            () => resetForm("partTimerForm")
        );

    document
        .getElementById("btnResetFW")
        ?.addEventListener(
            "click",
            () => resetForm("foreignWorkerForm")
        );

    // ==========================
    // SAVE BUTTON
    // ==========================

    document
        .getElementById("btnSaveFT")
        ?.addEventListener(
            "click",
            saveFullTimer
        );

    document
        .getElementById("btnSavePT")
        ?.addEventListener(
            "click",
            savePartTimer
        );

    document
        .getElementById("btnSaveFW")
        ?.addEventListener(
            "click",
            saveForeignWorker
        );

});

/* ==========================================
   NUMBER ONLY
========================================== */

function numberOnly(input, maxLength){

    if(!input){
        return;
    }

    input.addEventListener("input", function(){

        // Buang semua selain nombor
        this.value =
            this.value.replace(/\D/g,"");

        // Had maksimum digit
        if(this.value.length > maxLength){

            this.value =
                this.value.substring(0,maxLength);

        }

    });

}

/* ==========================================
   EMPLOYEE ID FORMAT
========================================== */

function formatEmployeeID(input){

    if(!input){
        return;
    }

    input.addEventListener("blur", function(){

        let value =
            this.value.replace(/\D/g,"");

        if(value !== ""){

            this.value =
                value.padStart(8,"0");

        }

    });

}

/* ==========================================
   REGISTER SERVICE WORKER
========================================== */

if("serviceWorker" in navigator){

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("./sw.js")

            .then(() => {

                console.log("PWA Ready");

            })

            .catch(err => {

                console.log(err);

            });

    });

}

/* ==========================================
   SHOW HOME
========================================== */

function showHome(){

    const topbar =
        document.querySelector(".topbar");

    if(topbar){

        topbar.style.display = "flex";

        if(window.innerWidth <= 768){

            topbar.style.flexDirection =
                "column";

        }else{

            topbar.style.flexDirection =
                "row";

        }

    }

    const loginContainer =
        document.getElementById("loginContainer");

    const homeContainer =
        document.getElementById("homeContainer");

    const otModule =
        document.getElementById("otModule");

    if(loginContainer){
        loginContainer.style.display = "none";
    }

    if(homeContainer){
        homeContainer.style.display = "block";
    }

    if(otModule){
        otModule.style.display = "none";
    }

}

/* ==========================================
   OPEN MANUAL OT
========================================== */

function openManualOT(){

    const homeContainer =
        document.getElementById("homeContainer");

    const otModule =
        document.getElementById("otModule");

    const employeeType =
        document.getElementById("employeeType");

    if(homeContainer){
        homeContainer.style.display = "none";
    }

    if(otModule){
        otModule.style.display = "block";
    }

    if(employeeType){

        employeeType.value = "Full Timer";

        showForm("Full Timer");

    }

}
