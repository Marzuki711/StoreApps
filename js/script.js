/*************************************************
 * Manual OT Claim System
 * script.js
 * GitHub Version
 *************************************************/

/* ==========================================
   API CALL
========================================== */

async function callAPI(action, data = {}) {

    try {

        showLoading();

        const response = await fetch(CONFIG.WEB_APP_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                action: action,
                data: data
            })

        });

        const result = await response.json();

        hideLoading();

        return result;

    } catch (err) {

        hideLoading();

        console.error(err);

        alert("Unable to connect server.");

        return {
            status: false,
            message: err.message
        };

    }

}

/* ==========================================
   Loading
========================================== */

function showLoading() {

    const loading = document.getElementById("loading");

    if (loading)
        loading.style.display = "flex";

}

function hideLoading() {

    const loading = document.getElementById("loading");

    if (loading)
        loading.style.display = "none";

}
