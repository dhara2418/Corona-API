const apiURL = "https://api.rootnet.in/covid19-in/stats/latest";

let pieChart = null;
let barChart = null;

async function getStateData() {
    const input = document.getElementById("stateInput").value.trim();
    const info = document.getElementById("info");
    const chartSection = document.getElementById("chartSection");

    if (!input) {
        info.innerText = "Please enter state name";
        chartSection.classList.add("d-none");
        return;
    }

    info.innerText = "";

    try {
        const res = await fetch(apiURL);
        const result = await res.json();

        const state = result.data.regional.find(
            s => s.loc.toLowerCase() === input.toLowerCase()
        );

        if (!state) {
            info.innerText = "State not found ❌";
            chartSection.classList.add("d-none");
            return;
        }

        showCards(state);
        showCharts(state);

        chartSection.classList.remove("d-none");

    } catch (error) {
        alert("API Error");
        console.error(error);
        chartSection.classList.add("d-none");
    }
}

/* ================= CARDS ================= */

function showCards(s) {
    document.getElementById("cards").innerHTML = `
    <div class="col-md-3">
      <div class="card-box text-primary">
        <i class="bi bi-activity fs-1"></i>
        <p>Total</p>
        <h5>${s.totalConfirmed}</h5>
      </div>
    </div>

    <div class="col-md-3">
      <div class="card-box text-warning">
        <i class="bi bi-people fs-1"></i>
        <p>Indian</p>
        <h5>${s.confirmedCasesIndian}</h5>
      </div>
    </div>

    <div class="col-md-3">
      <div class="card-box text-danger">
        <i class="bi bi-heartbreak fs-1"></i>
        <p>Deaths</p>
        <h5>${s.deaths}</h5>
      </div>
    </div>

    <div class="col-md-3">
      <div class="card-box text-success">
        <i class="bi bi-heart-pulse fs-1"></i>
        <p>Recovered</p>
        <h5>${s.discharged}</h5>
      </div>
    </div>
    `;
}

/* ================= CHARTS ================= */

function showCharts(s) {

    if (pieChart) pieChart.destroy();
    if (barChart) barChart.destroy();

    const activeCases =
        s.totalConfirmed - (s.discharged + s.deaths);

    /* ✅ PIE CHART (CORRECT LOGIC) */
    pieChart = new Chart(document.getElementById("pieChart"), {
        type: "pie",
        data: {
            labels: ["Active", "Recovered", "Deaths"],
            datasets: [{
                data: [
                    Math.max(activeCases, 0),
                    s.discharged,
                    s.deaths
                ],
                backgroundColor: ["#0d6efd", "#198754", "#dc3545"],
                hoverOffset: 12
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "bottom" }
            }
        }
    });

    /* ✅ BAR CHART */
    barChart = new Chart(document.getElementById("barChart"), {
        type: "bar",
        data: {
            labels: ["Total", "Recovered", "Deaths"],
            datasets: [{
                label: "Cases",
                data: [
                    s.totalConfirmed,
                    s.discharged,
                    s.deaths
                ],
                backgroundColor: ["#0d6efd", "#198754", "#dc3545"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    type: "logarithmic",
                    beginAtZero: true
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}
