/* ==========================================
    MANUAL OT CLAIM SYSTEM
    Script.html
    PART 1
========================================== */

document.addEventListener("DOMContentLoaded", function() {
    init();
});

function init() {
    hideLoading();

    const employeeType = document.getElementById('employeeType');
    if (employeeType) {
        employeeType.addEventListener('change', showForm);
    }
}

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

function hideAllForms() {
    const fullTimerForm = document.getElementById('fullTimerForm');
    const partTimerForm = document.getElementById('partTimerForm');
    const foreignWorkerForm = document.getElementById('foreignWorkerForm');

    if (fullTimerForm) fullTimerForm.style.display = "none";
    if (partTimerForm) partTimerForm.style.display = "none";
    if (foreignWorkerForm) foreignWorkerForm.style.display = "none";
}

function showForm() {
    hideAllForms();
    const employeeType = document.getElementById('employeeType');
    if (!employeeType) return;

    const fullTimerForm = document.getElementById('fullTimerForm');
    const partTimerForm = document.getElementById('partTimerForm');
    const foreignWorkerForm = document.getElementById('foreignWorkerForm');

    switch (employeeType.value) {
        case "Full Timer":
            if (fullTimerForm) fullTimerForm.style.display = "block";
            break;
        case "Part Timer":
            if (partTimerForm) partTimerForm.style.display = "block";
            break;
        case "Foreign Worker":
            if (foreignWorkerForm) foreignWorkerForm.style.display = "block";
            break;
        default:
            break;
    }
}

/* ==========================================
    TIME CALCULATION
========================================== */

function timeToHours(timeString) {
    if (!timeString) return 0;
    const p = timeString.split(":");
    return Number(p[0]) + Number(p[1]) / 60;
}

function calculateWorkHours(start, end) {
    if (!start || !end) return "";
    let diff = timeToHours(end) - timeToHours(start);
    if (diff < 0) {
        diff += 24;
    }
    return Number(diff.toFixed(2));
}

function roundHalf(value) {
    return Math.floor(value * 2) / 2;
}

/* ==========================================
    FULL TIMER CALCULATION
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const ftFirstIn = document.getElementById("ft_firstIn");
    const ftLastOut = document.getElementById("ft_lastOut");
    const ftPosition = document.getElementById("ft_position");

    if (ftFirstIn) ftFirstIn.addEventListener("change", calculateFullTimer);
    if (ftLastOut) ftLastOut.addEventListener("change", calculateFullTimer);
    if (ftPosition) ftPosition.addEventListener("change", calculateFullTimer);
});

function calculateFullTimer() {
    const ftFirstIn = document.getElementById("ft_firstIn");
    const ftLastOut = document.getElementById("ft_lastOut");
    const ftPosition = document.getElementById("ft_position");

    if (!ftFirstIn || !ftLastOut || !ftPosition) return;

    const workHours = calculateWorkHours(ftFirstIn.value, ftLastOut.value);
    document.getElementById("ft_workHours").value = workHours;

    let appHours = "";
    switch (ftPosition.value) {
        case "Sm":
        case "Asm":
        case "Sc":
            appHours = 8;
            break;
        case "Sv1":
        case "Sv2":
        case "Asv":
        case "Cm":
        case "Fc":
            appHours = 8.5;
            break;
        default:
            appHours = "";
            break;
    }

    document.getElementById("ft_appHours").value = appHours;

    let approved = 0;
    if (appHours !== "" && workHours > appHours) {
        let diff = workHours - appHours;
        approved = Math.floor(diff) + ((diff % 1) >= 0.5 ? 0.5 : 0);
    }

    document.getElementById("ft_approvedOT").value = approved;
}

/* ==========================================
    PART TIMER CALCULATION
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const ptFirstIn = document.getElementById("pt_firstIn");
    const ptLastOut = document.getElementById("pt_lastOut");

    if (ptFirstIn) ptFirstIn.addEventListener("input", calculatePartTimer);
    if (ptLastOut) ptLastOut.addEventListener("input", calculatePartTimer);
});

function calculatePartTimer() {
    const ptFirstIn = document.getElementById("pt_firstIn");
    const ptLastOut = document.getElementById("pt_lastOut");

    if (!ptFirstIn || !ptLastOut) return;

    const workHours = calculateWorkHours(ptFirstIn.value, ptLastOut.value);
    document.getElementById("pt_workHours").value = workHours;

    if (workHours === "") {
        document.getElementById("pt_floorHours").value = "";
        document.getElementById("pt_firstFour").value = "";
        document.getElementById("pt_secondFour").value = "";
        document.getElementById("pt_afterEight").value = "";
        return;
    }

    const floorHours = Math.floor(workHours * 2) / 2;
    document.getElementById("pt_floorHours").value = floorHours;

    const firstFour = Math.min(floorHours, 4);
    document.getElementById("pt_firstFour").value = firstFour;

    const secondFour = Math.max(Math.min(floorHours - 4, 4), 0);
    document.getElementById("pt_secondFour").value = secondFour;

    const afterEight = Math.max(floorHours - 8, 0);
    document.getElementById("pt_afterEight").value = afterEight;
}

/* ==========================================
    FOREIGN WORKER CALCULATION
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const fwFirstIn = document.getElementById("fw_firstIn");
    const fwLastOut = document.getElementById("fw_lastOut");
    const fwPosition = document.getElementById("fw_position");

    if (fwFirstIn) fwFirstIn.addEventListener("input", calculateForeignWorker);
    if (fwLastOut) fwLastOut.addEventListener("input", calculateForeignWorker);
    if (fwPosition) fwPosition.addEventListener("change", calculateForeignWorker);
});

function calculateForeignWorker() {
    const fwFirstIn = document.getElementById("fw_firstIn");
    const fwLastOut = document.getElementById("fw_lastOut");
    const fwPosition = document.getElementById("fw_position");

    if (!fwFirstIn || !fwLastOut || !fwPosition) return;

    const workHours = calculateWorkHours(fwFirstIn.value, fwLastOut.value);
    document.getElementById("fw_workHours").value = workHours;

    let appHours = "";
    if (fwPosition.value === "FW") {
        appHours = 12;
    }
    document.getElementById("fw_appHours").value = appHours;

    let approved = 0;
    if (appHours !== "" && workHours > appHours) {
        const diff = workHours - appHours;
        approved = Math.floor(diff) + ((diff % 1) >= 0.5 ? 0.5 : 0);
    }

    document.getElementById("fw_approvedOT").value = approved;
}

/* ==========================================
    UNIVERSAL RESET
========================================== */

function resetForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.querySelectorAll("input").forEach(el => {
        switch (el.type) {
            case "text":
            case "date":
            case "time":
            case "number":
                el.value = "";
                break;
        }
    });

    form.querySelectorAll("textarea").forEach(el => {
        el.value = "";
    });

    form.querySelectorAll("select").forEach(el => {
        el.selectedIndex = 0;
    });
}

/* ==========================================
    BUTTON RESET & SAVE LISTENERS
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const btnResetFT = document.getElementById("btnResetFT");
    const btnResetPT = document.getElementById("btnResetPT");
    const btnResetFW = document.getElementById("btnResetFW");
    const btnSaveFT = document.getElementById("btnSaveFT");
    const btnSavePT = document.getElementById("btnSavePT");
    const btnSaveFW = document.getElementById("btnSaveFW");

    if (btnResetFT) btnResetFT.addEventListener("click", () => resetForm("fullTimerForm"));
    if (btnResetPT) btnResetPT.addEventListener("click", () => resetForm("partTimerForm"));
    if (btnResetFW) btnResetFW.addEventListener("click", () => resetForm] ? resetForm("foreignWorkerForm") : document.getElementById("btnResetFW").addEventListener("click", () => resetForm("foreignWorkerForm"))); // diselaraskan bawah

    if (btnResetFW) btnResetFW.addEventListener("click", () => resetForm("foreignWorkerForm"));
    if (btnSaveFT) btnSaveFT.addEventListener("click", saveFullTimer);
    if (btnSavePT) btnSavePT.addEventListener("click", savePartTimer);
    if (btnSaveFW) btnSaveFW.addEventListener("click", saveForeignWorker);
});

/* ==========================================
    VALIDATION V2
========================================== */

function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    const required = form.querySelectorAll("[data-required='true']");
    let missing = [];

    required.forEach(field => {
        field.style.borderColor = "#D9D9D9";
        if (field.value === "" || field.value === "Please Select..") {
            field.style.border = "2px solid #DC2626";
            const labelEl = field.closest("div")?.querySelector("label");
            const label = labelEl ? labelEl.innerText : "Field";
            missing.push(label);
        }
    });

    if (missing.length) {
        showValidation(missing);
        return false;
    }

    return true;
}

/* ==========================================
    SAVE FULL TIMER
========================================== */

function saveFullTimer() {
    if (!validateForm("fullTimerForm")) return;
    calculateFullTimer();

    const obj = {
        employeeType: "Full Timer",
        unit: document.getElementById("ft_unit")?.value || "",
        employeeId: document.getElementById("ft_employeeId")?.value || "",
        employeeName: document.getElementById("ft_employeeName")?.value || "",
        position: document.getElementById("ft_position")?.value || "",
        actualDate: document.getElementById("ft_actualDate")?.value || "",
        firstIn: document.getElementById("ft_firstIn")?.value || "",
        lastOut: document.getElementById("ft_lastOut")?.value || "",
        workHours: document.getElementById("ft_workHours")?.value || "",
        appHours: document.getElementById("ft_appHours")?.value || "",
        approvedOT: document.getElementById("ft_approvedOT")?.value || "",
        publicHoliday: document.getElementById("ft_publicHoliday")?.value || "",
        restDay: document.getElementById("ft_restDay")?.value || "",
        nightShift: document.getElementById("ft_nightShift")?.value || "",
        reason: document.getElementById("ft_reason")?.value || "",
        reportNo: document.getElementById("ft_reportNo")?.value || "",
        reasonOT: document.getElementById("ft_reasonOT")?.value || "",
        remark: document.getElementById("ft_remark")?.value || ""
    };

    if (typeof google !== 'undefined' && google.script) {
        google.script.run
            .withSuccessHandler(res => {
                resetForm("fullTimerForm");
                showSuccess(res.message);
            })
            .withFailureHandler(err => {
                alert(err.message);
            })
            .saveData(obj);
    } else {
        console.log("Simulated Save Full Timer:", obj);
    }
}

function showSuccess(message) {
    const successText = document.getElementById("successText");
    const successModal = document.getElementById("successModal");
    if (successText) successText.innerHTML = message;
    if (successModal) successModal.style.display = "flex";
}

function closeSuccess() {
    const successModal = document.getElementById("successModal");
    if (successModal) successModal.style.display = "none";
}

/* ==========================================
    SAVE PART TIMER
========================================== */

function savePartTimer() {
    if (!validateForm("partTimerForm")) return;
    calculatePartTimer();

    const obj = {
        employeeType: "Part Timer",
        unit: document.getElementById("pt_unit")?.value || "",
        employeeId: document.getElementById("pt_employeeId")?.value || "",
        employeeName: document.getElementById("pt_employeeName")?.value || "",
        actualDate: document.getElementById("pt_actualDate")?.value || "",
        firstIn: document.getElementById("pt_firstIn")?.value || "",
        lastOut: document.getElementById("pt_lastOut")?.value || "",
        workHours: document.getElementById("pt_workHours")?.value || "",
        floorHours: document.getElementById("pt_floorHours")?.value || "",
        firstFour: document.getElementById("pt_firstFour")?.value || "",
        secondFour: document.getElementById("pt_secondFour")?.value || "",
        afterEight: document.getElementById("pt_afterEight")?.value || "",
        publicHoliday: document.getElementById("pt_publicHoliday")?.value || "",
        restDay: document.getElementById("pt_restDay")?.value || "",
        reason: document.getElementById("pt_reason")?.value || "",
        reportNo: document.getElementById("pt_reportNo")?.value || "",
        reasonOT: document.getElementById("pt_reasonOT")?.value || "",
        remark: document.getElementById("pt_remark")?.value || ""
    };

    if (typeof google !== 'undefined' && google.script) {
        google.script.run
            .withSuccessHandler(res => {
                resetForm("partTimerForm");
                showSuccess(res.message);
            })
            .withFailureHandler(err => {
                alert(err.message);
            })
            .saveData(obj);
    } else {
        console.log("Simulated Save Part Timer:", obj);
    }
}

/* ==========================================
    SAVE FOREIGN WORKER
========================================== */

function saveForeignWorker() {
    if (!validateForm("foreignWorkerForm")) return;
    calculateForeignWorker();

    const obj = {
        employeeType: "Foreign Worker",
        om: document.getElementById("fw_om")?.value || "",
        fm: document.getElementById("fw_fm")?.value || "",
        unit: document.getElementById("fw_unit")?.value || "",
        employeeId: document.getElementById("fw_employeeId")?.value || "",
        employeeName: document.getElementById("fw_employeeName")?.value || "",
        position: document.getElementById("fw_position")?.value || "",
        actualDate: document.getElementById("fw_actualDate")?.value || "",
        firstIn: document.getElementById("fw_firstIn")?.value || "",
        lastOut: document.getElementById("fw_lastOut")?.value || "",
        workHours: document.getElementById("fw_workHours")?.value || "",
        appHours: document.getElementById("fw_appHours")?.value || "",
        approvedOT: document.getElementById("fw_approvedOT")?.value || "",
        publicHoliday: document.getElementById("fw_publicHoliday")?.value || "",
        restDay: document.getElementById("fw_restDay")?.value || "",
        replacementLeave: document.getElementById("fw_replacementLeave")?.value || "",
        reason: document.getElementById("fw_reportNo")?.value || "", // diselaraskan
        reportNo: document.getElementById("fw_reportNo")?.value || "",
        reasonOT: document.getElementById("fw_reasonOT")?.value || "",
        remark: document.getElementById("fw_remark")?.value || ""
    };

    if (typeof google !== 'undefined' && google.script) {
        google.script.run
            .withSuccessHandler(res => {
                resetForm("foreignWorkerForm");
                showSuccess(res.message);
            })
            .withFailureHandler(err => {
                alert(err.message);
            })
            .saveData(obj);
    } else {
        console.log("Simulated Save Foreign Worker:", obj);
    }
}

/* ==========================================
    VALIDATION POPUP
========================================== */

function showValidation(list) {
    let html = "<b>Please complete :</b><br><br>";
    list.forEach(item => {
        html += "• " + item + "<br>";
    });

    const validationList = document.getElementById("validationList");
    const validationModal = document.getElementById("validationModal");

    if (validationList) validationList.innerHTML = html;
    if (validationModal) validationModal.style.display = "flex";
}

function closeValidation() {
    const validationModal = document.getElementById("validationModal");
    if (validationModal) validationModal.style.display = "none";
}

/* ==========================================
    UI TAB & NAVIGATION CONTROLS
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const navButtons = document.querySelectorAll(".nav-tab-btn");
    
    navButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const targetTab = e.currentTarget.getAttribute("data-target");
            switchTab(targetTab);
        });
    });
});

function switchTab(tabId) {
    const tabs = document.querySelectorAll(".tab-content");
    tabs.forEach(tab => {
        tab.style.display = "none";
    });

    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.style.display = "block";
    }

    const navButtons = document.querySelectorAll(".nav-tab-btn");
    navButtons.forEach(btn => {
        btn.classList.remove("active");
        if (btn.getAttribute("data-target") === tabId) {
            btn.classList.add("active");
        }
    });
}

/* ==========================================
    DYNAMIC HISTORY & TABLE LOADER
========================================== */

function loadClaimHistory() {
    showLoading();

    if (typeof google !== 'undefined' && google.script) {
        google.script.run
            .withSuccessHandler(data => {
                hideLoading();
                renderHistoryTable(data);
            })
            .withFailureHandler(err => {
                hideLoading();
                alert("Gagal memuatkan sejarah: " + err.message);
            })
            .getClaimHistory();
    } else {
        hideLoading();
        console.log("Simulated: Load claim history called.");
        renderHistoryTable([]);
    }
}

function renderHistoryTable(data) {
    const tbody = document.getElementById("historyTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #666;">Tiada rekod ditemui.</td></tr>`;
        return;
    }

    data.forEach((row, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${row.actualDate || ''}</td>
            <td>${row.employeeId || ''}</td>
            <td>${row.employeeName || ''}</td>
            <td>${row.employeeType || ''}</td>
            <td>${row.unit || ''}</td>
            <td>${row.approvedOT || row.firstFour || '0'}</td>
            <td><span class="status-badge success">Berjaya</span></td>
        `;
        tbody.appendChild(tr);
    });
}

/* ==========================================
    EXPORT & UTILITY FUNCTIONS
========================================== */

function exportDataToCSV() {
    if (typeof google !== 'undefined' && google.script) {
        google.script.run
            .withSuccessHandler(url => {
                if (url) {
                    window.open(url, '_blank');
                } else {
                    alert("Tiada pautan fail dijana.");
                }
            })
            .withFailureHandler(err => {
                alert("Ralat eksport: " + err.message);
            })
            .exportToCSV();
    } else {
        console.log("Simulated: Export to CSV triggered.");
        alert("Eksport CSV disimulasi untuk persekitaran tempatan.");
    }
}

window.addEventListener("load", () => {
    const loadHistoryBtn = document.getElementById("loadHistoryBtn");
    if (loadHistoryBtn) {
        loadHistoryBtn.addEventListener("click", loadClaimHistory);
    }

    const exportCsvBtn = document.getElementById("exportCsvBtn");
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener("click", exportDataToCSV);
    }
});
