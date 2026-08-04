/*************************************************
 * Manual OT Claim System
 * script.js
 * GitHub Version
 *************************************************/

/* ==========================================
   API CALL (No CORS Preflight)
========================================== */

async function callAPI(action, data = {}) {

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

        const result = await response.json();

        hideLoading();

        return result;

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
   VALIDATE FORM
========================================== */

function validateForm(formId) {

    const form = document.getElementById(formId);

    if (!form) return false;

    let valid = true;

    const fields = form.querySelectorAll("[data-required='true']");

    fields.forEach(field => {

        field.classList.remove("input-error");

        const value = (field.value || "").trim();

        if (value === "") {

            field.classList.add("input-error");

            valid = false;

        }

    });

    if (!valid) {

        alert("Please complete all required fields.");

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

        alert(result.message || "Saved Successfully");

        resetForm("fullTimerForm");

    } else {

        alert(result?.message || "Save Failed");

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

        alert(result?.message || "Save Failed");

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

    // Load HTML Components
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

    // Hide semua form
    showForm("");

    // Employee Type
    const employeeType = document.getElementById("employeeType");

    if (employeeType) {

        employeeType.addEventListener("change", function () {

            showForm(this.value);

        });

    }

/* ==========================================
   FULL TIMER AUTO CALCULATE
========================================== */

document.getElementById("ft_position")
?.addEventListener("change", calculateFullTimer);

document.getElementById("ft_firstIn")
?.addEventListener("change", calculateFullTimer);

document.getElementById("ft_lastOut")
?.addEventListener("change", calculateFullTimer);

    // ==========================
    // RESET BUTTON
    // ==========================

    document.getElementById("btnResetFT")
    ?.addEventListener("click", () => {

        resetForm("fullTimerForm");

    });

    document.getElementById("btnResetPT")
    ?.addEventListener("click", () => {

        resetForm("partTimerForm");

    });

    document.getElementById("btnResetFW")
    ?.addEventListener("click", () => {

        resetForm("foreignWorkerForm");

    });

    // ==========================
    // SAVE BUTTON
    // ==========================

    document.getElementById("btnSaveFT")
    ?.addEventListener("click", saveFullTimer);

    document.getElementById("btnSavePT")
    ?.addEventListener("click", savePartTimer);

    document.getElementById("btnSaveFW")
    ?.addEventListener("click", saveForeignWorker);

});
