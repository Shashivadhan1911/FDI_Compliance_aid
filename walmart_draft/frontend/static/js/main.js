document.addEventListener("DOMContentLoaded", function () {
  // Initial load
  fetchComplianceData();
  fetchRegulatoryChanges();
  fetchPredictions();

  // Set up event listeners
  document.getElementById("refresh-btn").addEventListener("click", refreshAll);
  document
    .getElementById("save-settings")
    .addEventListener("click", saveSettings);

  // Set up periodic refresh (every 5 minutes)
  setInterval(fetchComplianceData, 300000);
});

function refreshAll() {
  fetchComplianceData();
  fetchRegulatoryChanges();
  fetchPredictions();
}

function fetchComplianceData() {
  fetch("/api/compliance-status")
    .then((response) => response.json())
    .then((data) => {
      updateComplianceUI(data);
    })
    .catch((error) => {
      console.error("Error fetching compliance data:", error);
    });
}

function fetchRegulatoryChanges() {
  fetch("/api/regulatory-changes")
    .then((response) => response.json())
    .then((data) => {
      updateChangesUI(data);
    })
    .catch((error) => {
      console.error("Error fetching regulatory changes:", error);
    });
}

function fetchPredictions() {
  fetch("/api/predictions")
    .then((response) => response.json())
    .then((data) => {
      updatePredictionsUI(data);
    })
    .catch((error) => {
      console.error("Error fetching predictions:", error);
    });
}

function updateComplianceUI(data) {
  // Update FDI status
  const fdiStatus = document.getElementById("fdi-status");
  const statusIndicator = fdiStatus.querySelector(".status-indicator");

  statusIndicator.textContent = data.fdi.status;
  statusIndicator.className =
    "status-indicator " + data.fdi.status.toLowerCase();
  document.getElementById("fdi-update-time").textContent = new Date(
    data.fdi.last_updated
  ).toLocaleString();

  // Update alert badge
  document.getElementById("alert-badge").textContent = data.alerts_count;
}

function updateChangesUI(changes) {
  const changesList = document.getElementById("changes-list");
  changesList.innerHTML = "";

  changes.forEach((change) => {
    const changeItem = document.createElement("div");
    changeItem.className = "change-item";

    changeItem.innerHTML = `
            <h3>${change.title}</h3>
            <div class="change-meta">
                Source: ${change.source} | Published: ${new Date(
      change.published_date
    ).toLocaleDateString()}
            </div>
            <p>${change.summary}</p>
            <div class="change-impact ${change.impact}-impact">
                ${change.impact.toUpperCase()} impact on ${change.affected_areas.join(
      ", "
    )}
            </div>
        `;

    changesList.appendChild(changeItem);
  });
}

function updatePredictionsUI(prediction) {
  const insightDiv = document.getElementById("prediction-insight");
  insightDiv.innerHTML = `
        <h3>${prediction.title}</h3>
        <p>${prediction.description}</p>
        <div class="prediction-details">
            <p><strong>Probability:</strong> ${prediction.probability}%</p>
            <p><strong>Potential Impact:</strong> ${prediction.impact_level}</p>
            <p><strong>Recommended Actions:</strong></p>
            <ul>
                ${prediction.recommended_actions
                  .map((action) => `<li>${action}</li>`)
                  .join("")}
            </ul>
        </div>
    `;
}

function saveSettings() {
  const settings = {
    scan_frequency: document.getElementById("scan-frequency").value,
    fdi_countries: document
      .getElementById("fdi-countries")
      .value.split(",")
      .map((c) => c.trim()),
  };

  fetch("/api/settings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Settings saved successfully!");
    })
    .catch((error) => {
      console.error("Error saving settings:", error);
      alert("Failed to save settings.");
    });
}
