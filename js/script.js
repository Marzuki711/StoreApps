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

/* ==========================================
   LOAD HTML COMPONENT
========================================== */

async function loadComponent(file, target){

    try{

        const response = await fetch(file);

        if(!response.ok){
            throw new Error("Unable to load " + file);
        }

        const html = await response.text();

        document.getElementById(target).innerHTML = html;

    }catch(err){

        console.error(err);

    }

}

/* ==========================================
   INITIALIZE PAGE
========================================== */

document.addEventListener("DOMContentLoaded", async () => {

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

});
