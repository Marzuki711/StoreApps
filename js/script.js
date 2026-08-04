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

/* ==========================================
   LOAD HTML COMPONENT
========================================== */

async function loadComponent(file, target){

    try{

        console.log("Loading:", file);

        const response = await fetch(file);

        console.log("Status:", response.status);

        if(!response.ok){
            throw new Error(file + " not found");
        }

        const html = await response.text();

        console.log("Loaded:", file);

        document.getElementById(target).innerHTML = html;

    }catch(err){

        console.error("Load Error:", file, err);

    }

}

/* ==========================================
   SHOW / HIDE FORM
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
   INITIALIZE APPLICATION
========================================== */

document.addEventListener("DOMContentLoaded", async () => {

    // Load semua component dahulu
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

    // Employee Type Event
    document.getElementById("employeeType")
        .addEventListener("change", function(){

            showForm(this.value);

        });

});
