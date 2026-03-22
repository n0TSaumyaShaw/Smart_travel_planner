let popupCount = 0;

function showError(message, delay = 0) {
    setTimeout(() => {
        let popup = document.createElement("div");
        popup.className = "popup";
        popup.innerText = message;

        popup.style.top = (20 + popupCount * 60) + "px";
        popupCount++;

        document.body.appendChild(popup);

        let sound = new Audio("error.mp3");
        sound.play().catch(() => {});

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

    // 🌟 Generate all valid plans
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

    // 🎯 Preference filter
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

    // 🌙 Fallback
    let finalPlans = [];
    let usedFallback = false;

    if (filteredPlans.length === 0) {
        finalPlans = validPlans;
        usedFallback = true;
    } else {
        finalPlans = filteredPlans;
    }

    // 🏆 Best plan
    finalPlans.sort((a, b) => a.cost - b.cost);
    let best = finalPlans[0];

    // 💡 Insight calculation
    let extraNeeded = 0;

    if (usedFallback) {
        let targetTransport, targetHotel;

        if (choice == "3") {
            targetTransport = "Flight";
            targetHotel = "Luxury";
        } else if (choice == "2") {
            targetTransport = "Train";
            targetHotel = "Standard";
        }

        if (targetTransport && targetHotel) {
            let transportCost = transports.find(t => t.type === targetTransport).cost;
            let hotelCost = hotels.find(h => h.type === targetHotel).cost;

            let requiredCost = transportCost + (hotelCost * days);

            if (requiredCost > budget) {
                extraNeeded = requiredCost - budget;
            }
        }
    }

    // 💾 Save everything
    localStorage.setItem("result", JSON.stringify({
        name: name,
        destination: destination,
        transport: best.transport,
        hotel: best.hotel,
        cost: best.cost,
        fallback: usedFallback,
        extraNeeded: extraNeeded
    }));

    // 🎬 Transition
    document.body.classList.add("fade-out");

    setTimeout(() => {
        window.location.href = "result.html";
    }, 500);
}