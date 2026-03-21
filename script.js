let popupCount = 0;

function showError(message, delay = 0) {
    setTimeout(() => {
        let popup = document.createElement("div");
        popup.className = "popup";
        popup.innerText = message;

        // 🔥 STACKING POSITION
        popup.style.top = (20 + popupCount * 60) + "px";
        popupCount++;

        document.body.appendChild(popup);

        // 🔊 SOUND
        let sound = new Audio("error.mp3");
        sound.play().catch(() => {});

        // REMOVE + SHIFT UP
        setTimeout(() => {
            popup.remove();
            popupCount--;
        }, 3000);

    }, delay);
}
function planTrip() {
    let name = document.getElementById("name").value.trim();
    let budget = parseFloat(document.getElementById("budget").value);
    let days = parseInt(document.getElementById("days").value);
    let destination = document.getElementById("destination").value.trim();
    let choice = document.getElementById("preference").value;

    let errors = [];

    if (name === "") errors.push("Enter your name.");
    if (isNaN(budget) || budget <= 0) errors.push("Enter valid budget.");
    if (isNaN(days) || days <= 0) errors.push("Enter valid days.");
    if (destination === "") errors.push("Enter destination.");

    if (errors.length > 0) {
        errors.forEach((e, i) => showError(e, i * 400));
        return;
    }

    let transports = [
        { type: "Flight", cost: 8000 },
        { type: "Train", cost: 3000 },
        { type: "Bus", cost: 1500 }
    ];

    let hotels = [
        { type: "Budget", cost: 1000 },
        { type: "Standard", cost: 2000 },
        { type: "Luxury", cost: 4000 }
    ];

    let validPlans = [];

    for (let t of transports) {
        for (let h of hotels) {
            let total = t.cost + (h.cost * days);

            if (total <= budget) {
                validPlans.push({
                    transport: t.type,
                    hotel: h.type,
                    cost: total
                });
            }
        }
    }

    if (validPlans.length === 0) {
        showError("No plan fits your budget.");
        return;
    }

    let filteredPlans = [];

    if (choice == "3") {
        filteredPlans = validPlans.filter(p =>
            p.transport === "Flight" && p.hotel === "Luxury"
        );
    }
    else if (choice == "2") {
        filteredPlans = validPlans.filter(p =>
            p.transport === "Train" && p.hotel === "Standard"
        );
    }
    else {
        filteredPlans = validPlans;
    }

    if (filteredPlans.length === 0) {
        showError("No plan matches your selected preference.");
        return;
    }

    filteredPlans.sort((a, b) => a.cost - b.cost);
    let best = filteredPlans[0];

    // 🔥 THIS WAS MISSING (MAIN FEATURE)
    localStorage.setItem("result", JSON.stringify({
        name: name,
        destination: destination,
        transport: best.transport,
        hotel: best.hotel,
        cost: best.cost
    }));

    // 🔥 REDIRECT TO NEW PAGE
    // 🔥 SAVE DATA
localStorage.setItem("result", JSON.stringify({
    name: name,
    destination: destination,
    transport: best.transport,
    hotel: best.hotel,
    cost: best.cost
}));

// 🔥 ADD SMOOTH TRANSITION
document.body.classList.add("fade-out");

// WAIT THEN REDIRECT
setTimeout(() => {
    window.location.href = "result.html";
}, 500);
}