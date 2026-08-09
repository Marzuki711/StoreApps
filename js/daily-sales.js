/* ==========================================
   DAILY SALES MODULE
========================================== */

let dsStores = [];
let dsRows = [];
let dsEditId = "";

function dsGetCurrentUser() {
    if (typeof getCurrentUser === "function") {
        return getCurrentUser();
    }

    if (typeof currentUser !== "undefined" && currentUser) {
        return currentUser;
    }

    try {
        return JSON.parse(
            sessionStorage.getItem("currentUser") || "null"
        );
    } catch (error) {
        return null;
    }
}

function dsHasAccess() {
    if (typeof requirePermission === "function") {
        return requirePermission("daily_sales");
    }

    return true;
}

async function openDailySales() {
    if (!dsHasAccess()) return;

    const container = document.getElementById("dailySalesContainer");
    const home = document.getElementById("homeContainer");
    const ot = document.getElementById("otModule");
    const userManagement = document.getElementById("userManagementContainer");

    if (container) container.style.display = "block";
    if (home) home.style.display = "none";
    if (ot) ot.style.display = "none";
    if (userManagement) userManagement.style.display = "none";

    await dsLoad();
}

async function dsLoad() {
    const user = dsGetCurrentUser() || {};

    try {
        const storeResult = await callAPI(
            "getDailySalesStores",
            { username: user.username || "" }
        );

        const listResult = await callAPI(
            "getDailySalesList",
            { username: user.username || "" }
        );

        if (!storeResult?.status) {
            dsShowError(
                storeResult?.message ||
                "Unable to load Store data."
            );
            return;
        }

        if (!listResult?.status) {
            dsShowError(
                listResult?.message ||
                "Unable to load Daily Sales."
            );
            return;
        }

        dsStores = storeResult.stores || [];
        dsRows = listResult.rows || [];

        dsPopulateStoreSelect();
        dsRenderTable();

    } catch (error) {
        console.error("Daily Sales load error:", error);
        dsShowError("Unable to connect to the server.");
    }
}

function dsPopulateStoreSelect(selectedValue = "") {
    const select = document.getElementById("dsStoreNo");

    if (!select) return;

    select.innerHTML =
        '<option value="">Select Store No</option>';

    dsStores.forEach(store => {
        const option = document.createElement("option");
        option.value = store.storeNo;
        option.textContent =
            `${store.storeNo} - ${store.storeName}`;
        select.appendChild(option);
    });

    if (selectedValue) {
        select.value = selectedValue;
    }
}

function dsStoreChanged() {
    const storeNo =
        document.getElementById("dsStoreNo")?.value || "";

    const store = dsStores.find(item =>
        String(item.storeNo) === String(storeNo)
    );

    dsSet("dsStoreName", "");
    dsSet("dsOperatingHour", "");
    dsSet("dsOpeningDate", "");
    dsSet("dsBudgetSales", "");
    dsSet("dsPersonInCharge", "");

    if (!store) {
        dsCalculate();
        return;
    }

    dsSet("dsStoreName", store.storeName);
    dsSet("dsOperatingHour", store.operatingHour);
    dsSet("dsOpeningDate", store.openingDate);
    dsSet("dsBudgetSales", dsMoney(store.budgetSales));
    dsSet("dsPersonInCharge", store.personInCharge);

    dsCalculate();
}

function openDailySalesForm(record = null) {
    if (!dsHasAccess()) return;

    const form = document.getElementById("dailySalesForm");

    if (form) {
        form.reset();
    }

    dsEditId = record ? record.dsId : "";

    document.getElementById("dsFormTitle").textContent =
        record ? "Edit Daily Sales" : "Add Daily Sales";

    dsSet(
        "dsDailySalesNo",
        record?.dailySalesNo || "Auto Generate"
    );

    dsSet("dsTransactionSize", "0.00");
    dsSet("dsPercentage", "0.00%");

    if (record) {
        dsSet("dsStoreNo", record.storeNo);
        dsStoreChanged();

        dsSet(
            "dsBusinessDate",
            dsToInputDate(record.businessDate)
        );

        dsSet("dsTotalSales", record.totalSales);
        dsSet(
            "dsTotalMerchandiseSales",
            record.totalMerchandiseSales
        );
        dsSet("dsServices", record.services);
        dsSet("dsFood", record.food);
        dsSet("dsBeverage", record.beverage);
        dsSet(
            "dsGeneralMerchandise",
            record.generalMerchandise
        );
        dsSet("dsTobacco", record.tobacco);
        dsSet("dsSupply", record.supply);
        dsSet("dsFoodService", record.foodService);
        dsSet("dsAlcoholic", record.alcoholic);
        dsSet("dsTotalCustomer", record.totalCustomer);

        dsCalculate();
    }

    dsToggleForm(true);
}

function closeDailySalesForm() {
    dsToggleForm(false);
    dsEditId = "";
}

function dsToggleForm(show) {
    const wrapper =
        document.getElementById("dailySalesFormWrapper");

    if (!wrapper) return;

    wrapper.style.display = show ? "block" : "none";

    if (show) {
        wrapper.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

function dsSet(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.value = value ?? "";
    }
}

function dsGet(id) {
    return (
        document.getElementById(id)?.value || ""
    ).trim();
}

function calculateDailySales() {
    dsCalculate();
}

function dsCalculate() {
    const sales = dsNum("dsTotalSales");
    const customers = dsNum("dsTotalCustomer");
    const budget = dsNum("dsBudgetSales");

    const transactionSize =
        customers > 0 ? sales / customers : 0;

    const percentage =
        budget > 0 ? (sales / budget) * 100 : 0;

    dsSet(
        "dsTransactionSize",
        transactionSize.toFixed(2)
    );

    dsSet(
        "dsPercentage",
        percentage.toFixed(2) + "%"
    );
}

async function saveDailySales() {
    if (!dsHasAccess()) return;

    const storeNo = dsGet("dsStoreNo");
    const businessDate = dsGet("dsBusinessDate");

    if (!storeNo) {
        dsShowError("Please select Store No.");
        return;
    }

    if (!businessDate) {
        dsShowError("Please select Business Date.");
        return;
    }

    const user = dsGetCurrentUser() || {};

    const data = {
        mode: dsEditId ? "edit" : "add",
        dsId: dsEditId,
        dailySalesNo:
            dsGet("dsDailySalesNo") === "Auto Generate"
                ? ""
                : dsGet("dsDailySalesNo"),
        storeNo,
        businessDate,
        totalSales: dsNum("dsTotalSales"),
        totalMerchandiseSales: dsNum(
            "dsTotalMerchandiseSales"
        ),
        services: dsNum("dsServices"),
        food: dsNum("dsFood"),
        beverage: dsNum("dsBeverage"),
        generalMerchandise: dsNum(
            "dsGeneralMerchandise"
        ),
        tobacco: dsNum("dsTobacco"),
        supply: dsNum("dsSupply"),
        foodService: dsNum("dsFoodService"),
        alcoholic: dsNum("dsAlcoholic"),
        totalCustomer: dsNum("dsTotalCustomer")
    };

    const button =
        document.querySelector(
            '#dailySalesFormWrapper button[onclick="saveDailySales()"]'
        );

    if (button) {
        button.disabled = true;
        button.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
    }

    try {
        const result = await callAPI(
            "saveDailySales",
            {
                username: user.username || "",
                data
            }
        );

        if (!result?.status) {
            dsShowError(
                result?.message ||
                "Unable to save Daily Sales."
            );
            return;
        }

        dsShowSuccess(
            result.message ||
            "Daily Sales saved successfully."
        );

        closeDailySalesForm();
        await dsLoad();

    } catch (error) {
        console.error("Daily Sales save error:", error);
        dsShowError("Unable to connect to the server.");

    } finally {
        if (button) {
            button.disabled = false;
            button.innerHTML =
                '<i class="fa-solid fa-floppy-disk"></i> Save Daily Sales';
        }
    }
}

function editDailySales(record) {
    openDailySalesForm(record);
}

function filterDailySalesTable() {
    dsRenderTable();
}

function dsRenderTable() {
    const body =
        document.getElementById("dsTableBody");

    const count =
        document.getElementById("dsCount");

    if (!body) return;

    const query =
        dsGet("dsSearch").toLowerCase();

    const rows = dsRows.filter(record =>
        [
            record.dsId,
            record.dailySalesNo,
            record.storeNo,
            record.storeName,
            record.businessDate,
            record.personInCharge
        ]
            .join(" ")
            .toLowerCase()
            .includes(query)
    );

    if (count) {
        count.textContent =
            `${rows.length} Record${rows.length === 1 ? "" : "s"}`;
    }

    if (!rows.length) {
        body.innerHTML = `
            <tr>
                <td colspan="8" class="ds-empty">
                    No Daily Sales records found.
                </td>
            </tr>
        `;
        return;
    }

    body.innerHTML = rows.map(record => `
        <tr>
            <td>${dsEsc(record.dsId)}</td>
            <td>${dsEsc(record.dailySalesNo)}</td>
            <td>${dsEsc(record.storeNo)}</td>
            <td>${dsEsc(record.storeName)}</td>
            <td>${dsEsc(record.businessDate)}</td>
            <td class="ds-number">
                ${dsMoney(record.totalSales)}
            </td>
            <td>${dsEsc(record.personInCharge)}</td>
            <td>
                <button
                    class="ds-edit-btn"
                    type="button"
                    onclick='editDailySales(${JSON.stringify(record)})'>
                    <i class="fa-solid fa-pen"></i>
                    Edit
                </button>
            </td>
        </tr>
    `).join("");
}

function dsNum(id) {
    const value = dsGet(id)
        .replace(/,/g, "")
        .replace(/[^\d.-]/g, "");

    const number = Number(value);

    return Number.isFinite(number) ? number : 0;
}

function dsMoney(value) {
    const number = Number(
        String(value || "")
            .replace(/,/g, "")
            .replace(/[^\d.-]/g, "")
    );

    if (!Number.isFinite(number)) return "";

    return number.toLocaleString("en-MY", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function dsToInputDate(value) {
    const text = String(value || "");

    const match = text.match(
        /^(\d{2})\/(\d{2})\/(\d{4})$/
    );

    if (match) {
        return `${match[3]}-${match[2]}-${match[1]}`;
    }

    return text;
}

function dsEsc(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function dsShowSuccess(message) {
    if (typeof showSuccess === "function") {
        return showSuccess(message);
    }

    if (typeof Swal !== "undefined") {
        return Swal.fire({
            icon: "success",
            title: "SUCCESS",
            text: message,
            confirmButtonColor: "#198754"
        });
    }

    alert(message);
}

function dsShowError(message) {
    if (typeof showError === "function") {
        return showError(message);
    }

    if (typeof Swal !== "undefined") {
        return Swal.fire({
            icon: "error",
            title: "VALIDATION",
            text: message,
            confirmButtonColor: "#dc3545"
        });
    }

    alert(message);
}

window.openDailySales = openDailySales;
window.openDailySalesForm = openDailySalesForm;
window.closeDailySalesForm = closeDailySalesForm;
window.saveDailySales = saveDailySales;
window.editDailySales = editDailySales;
window.dsStoreChanged = dsStoreChanged;
window.calculateDailySales = calculateDailySales;
window.filterDailySalesTable = filterDailySalesTable;
