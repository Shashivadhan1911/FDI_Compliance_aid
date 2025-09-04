
// Polyfill for older browsers
if (!window.Blob) {
    window.Blob = function (data, options) {
        return new (window.Blob || function () { })(data, options);
    };
}

const activeAlerts = [];
const complianceUpdates = [];
const analyticsData = [];
const reviewQueue = []; // New array for legal review queue
const employeeData = [ // Sample employee data
    { id: 'EMP001', name: 'Alice Johnson', department: 'HR', role: 'Manager', status: 'Active' },
    { id: 'EMP002', name: 'Bob Williams', department: 'Finance', role: 'Analyst', status: 'Active' },
    { id: 'EMP003', name: 'Charlie Brown', department: 'Operations', role: 'Supervisor', status: 'Inactive' },
    { id: 'EMP1911', name: 'Shashivadhan Cheepiri', department: 'AI & Regulatory Tech', role: 'AI Compliance Lead', status: 'Active' },
    { id: 'EMP2256', name: 'Siri', department: 'AI & Regulatory Tech', role: 'AI Compliance Lead', status: 'Active' }
];

// Simulated user passwords (for client-side persistence)
let userPasswords = JSON.parse(localStorage.getItem('userPasswords')) || {
    'EMP2256': 'securepass',
    'EMP1911': 'shashi1911'
};

let chart = null;
let riskTimelineChart = null; // New chart instance
let updateInterval = null;
let systemHealthStatus = 'Operational';
const websiteNotifications = [];
let notificationPermissionGranted = false; // Track notification permission

// Pre-populate analyticsData to ensure charts have initial data
for (let i = 0; i < 20; i++) {
    analyticsData.push({
        timestamp: getISTTime(),
        localSourcing: randomInRange(28, 35),
        overallCompliance: randomInRange(89, 95),
        riskScore: randomInRange(5, 15),
        regulatoryChanges: randomInRange(0, 3)
    });
}

// Pre-populate complianceUpdates for the full log history
const initialComplianceActions = [
    'Optimized compliance thresholds for FDI regulations',
    'Blocked non-compliant transaction due to antitrust policy violation',
    'Adjusted seller agreements for new e-commerce tax framework',
    'Updated pricing compliance dynamically for local sourcing mandates',
    'Proactively notified sellers of upcoming data privacy law changes',
    'Validated compliance action via blockchain ledger for audit trail',
    'Automatically updated internal policy document for cross-border data flow',
    'Flagged potential market dominance abuse in new category launch',
    'Initiated automated data anonymization for customer privacy',
    'Synchronized AI insights with Walmart’s transaction systems',
    'Recommended legal review for high-risk international vendor contract'
];
for (let i = 0; i < 30; i++) {
    complianceUpdates.push({
        text: initialComplianceActions[Math.floor(Math.random() * initialComplianceActions.length)],
        timestamp: getISTTime(),
        accuracy: randomInRange(90, 99)
    });
}

// Pre-populate initial alerts for realism
activeAlerts.push({ id: `fdi-policy-${Date.now()}-1`, text: 'High risk of new FDI policy impacting e-commerce operations in Q3. Immediate review recommended to avoid multi-billion rupee penalties.', severity: 'Critical', recommendedAction: 'notifyLegal', timestamp: getISTTime(), confidence: randomInRange(70, 84), ambiguousPhrase: 'significant control', smartSuggestion: 'Consider revising seller onboarding documentation to include clause X under new DPIIT guidelines issued on July 2025.' });
activeAlerts.push({ id: `antitrust-probe-${Date.now()}-2`, text: 'Potential antitrust investigation triggered by recent market share changes. Legal team alerted; prepare for regulatory scrutiny.', severity: 'High', recommendedAction: 'reviewPolicy', timestamp: getISTTime(), confidence: randomInRange(85, 95), ambiguousPhrase: null, smartSuggestion: 'Review current market share reporting mechanisms and internal antitrust compliance guidelines.' });
activeAlerts.push({ id: `data-privacy-compliance-${Date.now()}-3`, text: 'Upcoming data privacy regulation change (e.g., DPDP Bill) requires immediate update to customer data handling protocols. Potential for operational disruptions.', severity: 'Critical', recommendedAction: 'implementDataAnonymization', timestamp: getISTTime(), confidence: randomInRange(70, 84), ambiguousPhrase: 'legitimate interest', smartSuggestion: 'Initiate a cross-functional workshop with IT and Legal to draft a new data anonymization protocol.' });

// Searchable phrases for recommendations and section linking
const searchablePhrases = [
    'Dashboard Overview',
    'System Status Overview',
    'AI Engine',
    'Data Sync',
    'Compliance Rate',
    'Critical Alerts & Notifications',
    'Predictive Analytics Dashboard',
    'Regulatory Risk & Impact Visuals',
    'Control Panel',
    'Monitoring Suite',
    'AI Configuration Hub',
    'Compliance Reporting Suite',
    'Regulatory Relationship Management',
    'Autonomous Compliance Orchestration Log',
    'Legal Review & Human Oversight Queue',
    'AI Engine Modules Status',
    'Advanced Data Intelligence Hub',
    'Quantum-Level NLP & Prediction Engine',
    'Real-Time Business Impact Assessment',
    'Proactive Regulatory Relationship Management',
    'Core Compliance Framework',
    'FDI policy',
    'Antitrust investigation',
    'Data privacy',
    'Seller violation',
    'Local sourcing',
    'Cross-border data',
    'Consumer protection',
    'Emergency Halt',
    'Generate Daily Report',
    'Generate Weekly Report',
    'Generate Monthly Report',
    'Run Impact Simulation', // Quick Action
    'Manage Stakeholder Comms', // Quick Action
    'Draft Legal Email', // Quick Action
    'Generate Transparency Report',
    'Full Log History',
    'Alerts', // Common shorter term
    'Actions', // Common shorter term
    'Help & Documentation', // Added for search
    'About Us', // Added for search
    'Privacy Policy', // Added for search
    'Terms of Service', // Added for search
    'Careers', // Added for search
    'Support', // Added for search
    'Legal Drafting', // Added for search
    '© 2025 Walmart Inc. All Rights Reserved.', // Footer copyright
    'AI Compliance Portal v1.0', // Footer version
    'Last Updated', // Footer last updated
    'Regulatory Partners', // Footer regulatory partners
    'DPIIT', 'CCI', 'MeitY', 'ED', // Regulatory bodies
    'Facebook', 'Twitter', 'Instagram', 'LinkedIn', // Social media links
    'insta', 'facebook', // Specific search terms for navigation
    'Refresh Data', // Quick Actions
    'Employee ID', // Login and Employee details
    'Password', // Login and Employee details
    'Login', // Login button
    'View', // Employee table button
    'Reset Password', // Employee table button and modal title
    'New Password', // Reset password modal
    'Confirm New Password', // Reset password modal
    'Employee Details', // User dropdown
    'Name', // User dropdown
    'Role', // User dropdown
    'Department', // User dropdown
    'Logout', // Quick Action
    'Quick Actions', // Sidebar section
    'Initiate Monitoring', // Control Panel
    'Pause Monitoring', // Control Panel
    'Save AI Settings', // Control Panel
    'Manage Stakeholder Communications', // Modal title
    'Recipient', // Stakeholder modal
    'Message', // Stakeholder modal
    'Detailed System Metrics', // Modal title
    'Processing Load', // Detailed Metrics
    'Data Ingestion Rate', // Detailed Metrics
    'Prediction Accuracy', // Detailed Metrics
    'Automated Actions', // Detailed Metrics
    'Alert Details & Action', // Modal title
    'Recommended Action', // Alert Action Modal
    'Confirm Action', // Alert Action Modal
    'Full Orchestration Log History', // Modal title
    'Download Log (PDF)', // Full Log History Modal
    'Module Details', // Modal title
    'Auto-Draft Legal Communication', // Modal title
    'Subject', // Legal Drafting Modal
    'Draft Email Body', // Legal Drafting Modal
    'Generate Draft', // Legal Drafting Modal
    'Copy to Clipboard', // Legal Drafting Modal
    'Download Draft (PDF)', // Legal Drafting Modal
    'Portal Overview', // Help & Docs
    'Key Features', // Help & Docs
    'Troubleshooting Tips', // Help & Docs
    'Regulatory Resources', // Help & Docs
    'Contact Support' // Help & Docs
];

// Phrases that should only show location, not a "View Section" button
const phrasesWithLocationOnly = [
    '© 2025 Walmart Inc. All Rights Reserved.',
    'AI Compliance Portal v1.0',
    'Last Updated',
    'Regulatory Partners',
    'DPIIT', 'CCI', 'MeitY', 'ED',
    'Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'insta', 'facebook', // Social media
    'Refresh Data', // Quick Action
    'Employee ID', // Login and Employee details
    'Password', // Login and Employee details
    'Login', // Login button
    'View', // Employee table button
    'New Password', // Reset password modal
    'Confirm New Password', // Reset password modal
    'Name', // User dropdown
    'Role', // User dropdown
    'Department', // User dropdown
    'Logout', // Quick Action
    'Recipient', // Stakeholder modal
    'Message', // Stakeholder modal
    'Processing Load', // Detailed Metrics
    'Data Ingestion Rate', // Detailed Metrics
    'Prediction Accuracy', // Detailed Metrics
    'Automated Actions', // Detailed Metrics
    'Recommended Action', // Alert Action Modal
    'Subject', // Legal Drafting Modal
    'Draft Email Body', // Legal Drafting Modal
    'Generate Draft', // Legal Drafting Modal
    'Copy to Clipboard', // Legal Drafting Modal
    'Download Draft (PDF)', // Legal Drafting Modal
];


/**
 * Returns the current time in IST (Indian Standard Time) formatted as a string.
 * @returns {string} The formatted IST time.
 */
function getISTTime() {
    try {
        return new Date().toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour12: true,
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    } catch (e) {
        console.error('Error formatting IST time:', e);
        return new Date().toISOString(); // Fallback to ISO string
    }
}

/**
 * Generates a random integer within a specified range (inclusive).
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} A random integer.
 */
function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Sanitizes HTML strings to prevent XSS attacks.
 * @param {string} str - The string to sanitize.
 * @returns {string} The sanitized string.
 */
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Highlights a given search term within a text.
 * @param {string} text - The original text.
 * @param {string} searchTerm - The term to highlight.
 * @returns {string} The text with the search term highlighted.
 */
function highlightSearchTerm(text, searchTerm) {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

/**
 * Displays a custom toast notification.
 * @param {string} message - The message to display.
 * @param {string} type - The type of notification ('success', 'info', 'warning', 'error').
 * @param {number} duration - Duration in milliseconds before fading out.
 */
function showToast(message, type = 'info', duration = 5000) {
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        console.error('Toast container not found!');
        return;
    }

    const toast = document.createElement('div');
    toast.classList.add('toast', type);

    let iconClass = '';
    switch (type) {
        case 'success':
            iconClass = 'fas fa-check-circle';
            break;
        case 'info':
            iconClass = 'fas fa-info-circle';
            break;
        case 'warning':
            iconClass = 'fas fa-exclamation-triangle';
            break;
        case 'error':
            iconClass = 'fas fa-times-circle';
            break;
        default:
            iconClass = 'fas fa-info-circle';
    }

    toast.innerHTML = `
        <i class="toast-icon ${iconClass}"></i>
        <div class="toast-content">${sanitizeHTML(message)}</div>
        <button class="toast-close" onclick="this.closest('.toast').remove()">&times;</button>
    `;

    toastContainer.appendChild(toast);

    // Remove toast after duration
    setTimeout(() => {
        toast.remove();
    }, duration);
}


/**
 * Updates the overall system health status and individual module statuses.
 */
function updateSystemHealth() {
    try {
        const statuses = ['Operational', 'Optimizing', 'Analyzing', 'Validating', 'Monitoring'];
        systemHealthStatus = statuses[Math.floor(Math.random() * statuses.length)];

        const systemHealth = document.getElementById('systemHealth');
        if (systemHealth) {
            systemHealth.textContent = `AI Agent: ${systemHealthStatus}`;
            systemHealth.classList.remove('text-red-600', 'text-yellow-600', 'text-blue-600', 'text-green-600');
            if (systemHealthStatus === 'Operational' || systemHealthStatus === 'Monitoring') {
                systemHealth.classList.add('text-green-600');
            } else if (systemHealthStatus === 'Optimizing' || systemHealthStatus === 'Analyzing' || systemHealthStatus === 'Validating') {
                systemHealth.classList.add('text-blue-600');
            } else {
                systemHealth.classList.add('text-red-600');
            }
        }

        // Update AI Module Statuses and Confidence
        updateAIModulesStatus();

    } catch (e) {
        console.error('Error updating system health:', e);
    }
}

/**
 * Updates the AI Engine status, Data Sync status, Compliance Rate, and Last Update time.
 */
function updateStatus() {
    try {
        const lastUpdate = document.getElementById('lastUpdate');
        const complianceRate = document.getElementById('complianceRate');
        const aiStatus = document.getElementById('aiStatus');
        const dataSync = document.getElementById('dataSync');
        const footerLastUpdated = document.getElementById('footerLastUpdated');

        const currentTime = getISTTime();
        if (lastUpdate) lastUpdate.textContent = sanitizeHTML(currentTime);
        if (footerLastUpdated) footerLastUpdated.textContent = sanitizeHTML(currentTime);

        const currentCompliance = randomInRange(89, 95);
        if (complianceRate) {
            complianceRate.textContent = `${currentCompliance}%`;
            complianceRate.classList.remove('text-red-600', 'text-yellow-600', 'text-green-600');
            if (currentCompliance < 90) {
                complianceRate.classList.add('text-red-600');
            } else if (currentCompliance < 92) {
                complianceRate.classList.add('text-yellow-600');
            } else {
                complianceRate.classList.add('text-green-600');
            }
        }

        const aiStatuses = ['Active', 'Idle', 'Processing'];
        const dataSyncStatuses = ['Synced', 'Syncing', 'Error'];
        const currentAiStatus = aiStatuses[Math.floor(Math.random() * aiStatuses.length)];
        const currentDataSync = dataSyncStatuses[Math.floor(Math.random() * dataSyncStatuses.length)];

        if (aiStatus) {
            aiStatus.textContent = currentAiStatus;
            aiStatus.classList.remove('text-green-600', 'text-yellow-600', 'text-red-600');
            if (currentAiStatus === 'Active') aiStatus.classList.add('text-green-600');
            else if (currentAiStatus === 'Processing') aiStatus.classList.add('text-yellow-600');
            else aiStatus.classList.add('text-gray-600');
        }

        if (dataSync) {
            dataSync.textContent = currentDataSync;
            dataSync.classList.remove('text-green-600', 'text-yellow-600', 'text-red-600');
            if (currentDataSync === 'Synced') dataSync.classList.add('text-green-600');
            else if (currentDataSync === 'Syncing') dataSync.classList.add('text-yellow-600');
            else dataSync.classList.add('text-red-600');
        }
    } catch (e) {
        console.error('Error updating status:', e);
    }
}

/**
 * Updates the list of autonomous compliance orchestration actions.
 */
function updateComplianceUpdates() {
    try {
        if (!document.getElementById('dynamicRules')?.checked) {
            const updatesDiv = document.getElementById('complianceUpdates');
            if (updatesDiv) {
                updatesDiv.innerHTML = '<div class="text-gray-500 text-center py-4">Dynamic rule updates are currently disabled.</div>';
            }
            return;
        }

        const actions = [
            'Optimized compliance thresholds for FDI regulations',
            'Blocked non-compliant transaction due to antitrust policy violation',
            'Adjusted seller agreements for new e-commerce tax framework',
            'Updated pricing compliance dynamically for local sourcing mandates',
            'Proactively notified sellers of upcoming data privacy law changes',
            'Validated compliance action via blockchain ledger for audit trail',
            'Automatically updated internal policy document for cross-border data flow',
            'Flagged potential market dominance abuse in new category launch',
            'Initiated automated data anonymization for customer privacy',
            'Synchronized AI insights with Walmart’s transaction systems',
            'Recommended legal review for high-risk international vendor contract'
        ];
        const update = {
            text: `${actions[Math.floor(Math.random() * actions.length)]}`,
            timestamp: getISTTime(),
            accuracy: randomInRange(90, 99)
        };

        complianceUpdates.unshift(update);
        if (complianceUpdates.length > 30) complianceUpdates.pop();

        const updatesDiv = document.getElementById('complianceUpdates');
        if (updatesDiv) {
            updatesDiv.innerHTML = complianceUpdates.slice(0, 15).map(u => `
                <div class="compliance-update-item">
                    <i class="fas fa-check-circle text-green-500 mr-2"></i>
                    ${sanitizeHTML(u.text)} <span class="font-bold text-gray-600">(${u.accuracy}% accuracy)</span> - <span class="text-gray-500 text-sm">${sanitizeHTML(u.timestamp)}</span>
                </div>
            `).join('');
        }
    } catch (e) {
        console.error('Error updating compliance updates:', e);
    }
}

/**
 * Updates the predictive analytics chart and table.
 */
function updateAnalytics() {
    try {
        const timestamp = getISTTime();
        const localSourcing = randomInRange(28, 35);
        const overallCompliance = randomInRange(89, 95);
        const riskScore = randomInRange(5, 15);
        const regulatoryChanges = randomInRange(0, 3);

        analyticsData.unshift({ timestamp, localSourcing, overallCompliance, riskScore, regulatoryChanges });
        if (analyticsData.length > 20) analyticsData.pop();

        if (chart) {
            chart.data.labels = analyticsData.map(data => data.timestamp).slice(0, 10).reverse();
            chart.data.datasets[0].data = analyticsData.map(data => data.overallCompliance).slice(0, 10).reverse();
            chart.data.datasets[1].data = analyticsData.map(data => data.riskScore).slice(0, 10).reverse();
            chart.update();
        }

        if (riskTimelineChart) {
            riskTimelineChart.data.labels = analyticsData.map(data => data.timestamp).reverse();
            riskTimelineChart.data.datasets[0].data = analyticsData.map(data => data.riskScore).reverse();
            riskTimelineChart.data.datasets[1].data = analyticsData.map(data => data.regulatoryChanges).reverse();
            riskTimelineChart.update();
        }

        const tableBody = document.getElementById('analyticsTable');
        if (tableBody) {
            tableBody.innerHTML = analyticsData.slice(0, 10).map(data => `
                <tr>
                    <td>${sanitizeHTML(data.timestamp)}</td>
                    <td>${data.localSourcing}%</td>
                    <td>${data.overallCompliance}%</td>
                    <td class="${data.riskScore > 10 ? 'text-red-500 font-bold' : 'text-green-500'}">${data.riskScore}%</td>
                </tr>
            `).join('');
        }
    } catch (e) {
        console.error('Error updating analytics:', e);
    }
}

/**
 * Updates the critical alerts section. Alerts persist until an action is taken.
 */
function updateAlerts() {
    try {
        if (!document.getElementById('proactiveAlerts')?.checked) {
            const alertsDiv = document.getElementById('alerts');
            if (alertsDiv) {
                alertsDiv.innerHTML = '<div class="text-gray-500 text-center py-4">Proactive alerts are currently disabled.</div>';
            }
            return;
        }

        const newAlertMessages = [
            { id: `fdi-policy-${Date.now()}`, text: 'High risk of new FDI policy impacting e-commerce operations in Q3. Immediate review recommended to avoid multi-billion rupee penalties.', severity: 'Critical', recommendedAction: 'notifyLegal', timestamp: getISTTime(), confidence: randomInRange(70, 84), ambiguousPhrase: 'significant control', smartSuggestion: 'Consider revising seller onboarding documentation to include clause X under new DPIIT guidelines issued on July 2025.' },
            { id: `antitrust-probe-${Date.now()}`, text: 'Potential antitrust investigation triggered by recent market share changes. Legal team alerted; prepare for regulatory scrutiny.', severity: 'High', recommendedAction: 'reviewPolicy', timestamp: getISTTime(), confidence: randomInRange(85, 95), ambiguousPhrase: null, smartSuggestion: 'Review current market share reporting mechanisms and internal antitrust compliance guidelines.' },
            { id: `data-privacy-compliance-${Date.now()}`, text: 'Upcoming data privacy regulation change (e.g., DPDP Bill) requires immediate update to customer data handling protocols. Potential for operational disruptions.', severity: 'Critical', recommendedAction: 'implementDataAnonymization', timestamp: getISTTime(), confidence: randomInRange(70, 84), ambiguousPhrase: 'legitimate interest', smartSuggestion: 'Initiate a cross-functional workshop with IT and Legal to draft a new data anonymization protocol.' },
            { id: `seller-violation-${Date.now()}`, text: 'Seller #XYZ detected violating platform terms related to pricing parity. Automated block initiated, manual review required.', severity: 'High', recommendedAction: 'updateSellerTerms', confidence: randomInRange(80, 90), ambiguousPhrase: null, smartSuggestion: 'Send automated notification to seller with a warning and link to updated terms.' },
            { id: `local-sourcing-mandate-${Date.now()}`, text: 'Predicted increase in local sourcing mandate for certain product categories. Adjust supply chain strategy to maintain compliance.', severity: 'Medium', recommendedAction: 'adjustPricing', confidence: randomInRange(90, 98), ambiguousPhrase: null, smartSuggestion: 'Analyze current supplier contracts for flexibility in local sourcing percentages.' },
            { id: `cross-border-data-${Date.now()}`, text: 'New policy framework on cross-border data flow detected. Review data transfer mechanisms to ensure compliance.', severity: 'High', recommendedAction: 'reviewPolicy', confidence: randomInRange(75, 88), ambiguousPhrase: 'data localization', smartSuggestion: 'Consult with external legal counsel specializing in international data regulations.' },
            { id: `consumer-protection-${Date.now()}`, text: 'Emerging consumer protection guidelines require update to dispute resolution processes. Potential for recurring violations if not addressed.', severity: 'Medium', recommendedAction: 'reviewPolicy', confidence: randomInRange(88, 96), ambiguousPhrase: null, smartSuggestion: 'Update customer service training modules to reflect new dispute resolution procedures.' }
        ];

        if (Math.random() < 0.3) {
            const newAlert = newAlertMessages[Math.floor(Math.random() * newAlertMessages.length)];
            if (!activeAlerts.some(alert => alert.text === newAlert.text && !alert.isResolved)) {
                activeAlerts.unshift({ ...newAlert, timestamp: getISTTime(), isResolved: false });
                addWebsiteNotification(`New Critical Alert: ${newAlert.text.substring(0, 70)}...`, 'alert');
            }
        }

        const alertsDiv = document.getElementById('alerts');
        if (alertsDiv) {
            alertsDiv.innerHTML = activeAlerts.filter(alert => !alert.isResolved).map(alert => `
                <div class="alert-item">
                    <div class="alert-content">
                        <i class="fas fa-exclamation-triangle"></i>
                        <div>
                            <span class="font-semibold text-${alert.severity === 'Critical' ? 'red' : (alert.severity === 'High' ? 'orange' : 'gray')}-700">${sanitizeHTML(alert.severity)} Alert:</span> ${sanitizeHTML(alert.text)}
                            <span class="text-gray-500 text-sm ml-auto block mt-1">Detected: ${sanitizeHTML(alert.timestamp)}</span>
                        </div>
                    </div>
                    <button class="button-primary button-small button-action mt-2 self-end"
                        onclick="openAlertActionModal('${alert.id}')">
                        <i class="fas fa-gavel mr-2"></i>Take Immediate Action
                    </button>
                </div>
            `).join('');

            if (activeAlerts.filter(alert => !alert.isResolved).length === 0) {
                alertsDiv.innerHTML = '<div class="text-gray-500 text-center py-4">No critical alerts at this time. All clear!</div>';
            }
        }
    } catch (e) {
        console.error('Error updating alerts:', e);
    }
}

/**
 * Updates the AI Module Statuses and Confidence levels.
 */
function updateAIModulesStatus() {
    const moduleData = {
        dataHub: { status: 'Actively crawling sources', confidence: randomInRange(90, 99), pulseClass: 'pulse-blue' },
        nlpEngine: { status: 'Analyzing regulatory changes', confidence: randomInRange(90, 99), pulseClass: 'pulse-green' },
        impactAssessment: { status: 'Running simulations', confidence: randomInRange(80, 95), pulseClass: 'pulse-orange' },
        regulatoryMgmt: { status: 'Notifying stakeholders', confidence: randomInRange(90, 99), pulseClass: 'pulse-blue' },
        coreFramework: { status: 'Blockchain validation active', confidence: randomInRange(95, 99), pulseClass: 'pulse-green' }
    };

    for (const moduleId in moduleData) {
        const data = moduleData[moduleId];
        const statusEl = document.getElementById(`${moduleId}Status`);
        const confidenceEl = document.getElementById(`${moduleId}Confidence`);

        if (statusEl) { // Check if statusEl exists
            statusEl.textContent = `Status: ${data.status}`;
            const pulseEl = statusEl.previousElementSibling; // Get previous sibling
            if (pulseEl && pulseEl.classList.contains('pulse-indicator')) { // Check if it's the correct element
                pulseEl.classList.remove('pulse-blue', 'pulse-green', 'pulse-orange', 'pulse-red');
                pulseEl.classList.add(data.pulseClass);
            } else {
                console.warn(`Pulse indicator not found or is not the previous sibling for ${moduleId}Status.`);
            }
        } else {
            console.warn(`Status element not found for ID: ${moduleId}Status`);
        }

        if (confidenceEl) { // Check if confidenceEl exists
            confidenceEl.textContent = `${data.confidence}%`;
        } else {
            console.warn(`Confidence element not found for ID: ${moduleId}Confidence`);
        }
    }
}


/**
 * Loads and initializes the Chart.js graph.
 */
function loadChartJS() {
    try {
        const ctx = document.getElementById('complianceChart').getContext('2d');
        if (chart) chart.destroy();

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: analyticsData.map(data => data.timestamp).slice(0, 10).reverse(),
                datasets: [{
                    label: 'Overall Compliance (%)',
                    data: analyticsData.map(data => data.overallCompliance).slice(0, 10).reverse(),
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                    tension: 0.3,
                    fill: true,
                    pointRadius: 5,
                    pointBackgroundColor: '#22c55e',
                    pointBorderColor: '#fff',
                    pointHoverRadius: 7,
                    pointHoverBackgroundColor: '#22c55e',
                }, {
                    label: 'Risk Score (%)',
                    data: analyticsData.map(data => data.riskScore).slice(0, 10).reverse(),
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    tension: 0.3,
                    fill: true,
                    pointRadius: 5,
                    pointBackgroundColor: '#ef4444',
                    pointBorderColor: '#fff',
                    pointHoverRadius: 7,
                    pointHoverBackgroundColor: '#ef4444',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: { family: 'Inter', size: 14 },
                            color: '#334155'
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        bodyFont: { family: 'Inter' },
                        titleFont: { family: 'Inter' }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Time',
                            font: { family: 'Inter', size: 14 },
                            color: '#4a5568'
                        },
                        ticks: {
                            font: { family: 'Inter' },
                            color: '#6b7280'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Percentage',
                            font: { family: 'Inter', size: 14 },
                            color: '#4a5568'
                        },
                        ticks: {
                            font: { family: 'Inter' },
                            color: '#6b7280',
                            callback: function (value) { return value + '%'; }
                        }
                    }
                }
            }
        });
        document.getElementById('chartError').style.display = 'none';
    } catch (e) {
        console.error('Error in loadChartJS:', e);
        document.getElementById('chartError').style.display = 'block';
    }
}

/**
 * Loads and initializes the Regulatory Risk Timeline Chart.
 */
function loadRiskTimelineChart() {
    try {
        const ctx = document.getElementById('riskTimelineChart').getContext('2d');
        if (riskTimelineChart) riskTimelineChart.destroy();

        riskTimelineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: analyticsData.map(data => data.timestamp).reverse(),
                datasets: [{
                    label: 'Overall Risk Score (%)',
                    data: analyticsData.map(data => data.riskScore).reverse(),
                    borderColor: '#f97316', // Orange for risk
                    backgroundColor: 'rgba(249, 115, 22, 0.2)',
                    tension: 0.3,
                    fill: true,
                    pointRadius: 4,
                    pointBackgroundColor: '#f97316',
                    pointBorderColor: '#fff',
                    pointHoverRadius: 6,
                },
                {
                    label: 'Regulatory Changes Count',
                    data: analyticsData.map(data => data.regulatoryChanges).reverse(),
                    borderColor: '#3b82f6', // Blue for changes
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    tension: 0.3,
                    fill: false,
                    pointRadius: 4,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#fff',
                    pointHoverRadius: 6,
                    yAxisID: 'y1' // Use a secondary Y-axis
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: { family: 'Inter', size: 14 },
                            color: '#334155'
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        bodyFont: { family: 'Inter' },
                        titleFont: { family: 'Inter' }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Time',
                            font: { family: 'Inter', size: 14 },
                            color: '#4a5568'
                        },
                        ticks: {
                            font: { family: 'Inter' },
                            color: '#6b7280'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Risk Score (%)',
                            font: { family: 'Inter', size: 14 },
                            color: '#4a5568'
                        },
                        ticks: {
                            font: { family: 'Inter' },
                            color: '#6b7280',
                            callback: function (value) { return value + '%'; }
                        }
                    },
                    y1: { // Secondary Y-axis for regulatory changes
                        type: 'linear',
                        display: true,
                        position: 'right',
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Regulatory Changes Count',
                            font: { family: 'Inter', size: 14 },
                            color: '#4a5568'
                        },
                        ticks: {
                            font: { family: 'Inter' },
                            color: '#6b7280',
                            stepSize: 1
                        },
                        grid: {
                            drawOnChartArea: false,
                        }
                    }
                }
            }
        });
    } catch (e) {
        console.error('Error in loadRiskTimelineChart:', e);
    }
}

// Control Panel Functions (Simulated)
function initiateMonitoring() {
    showToast('Monitoring initiated! AI agents are now actively tracking regulatory changes.', 'success');
}

function pauseMonitoring() {
    showToast('Monitoring paused. System will hold current state.', 'warning');
}

function emergencyHalt() {
    showToast('EMERGENCY HALT: All automated compliance processes stopped!', 'error');
}

function saveAIConfig() {
    const dynamicRules = document.getElementById('dynamicRules').checked;
    const proactiveAlerts = document.getElementById('proactiveAlerts').checked;
    const diagnosticMode = document.getElementById('diagnosticMode').checked;
    showToast('AI Configuration Saved! Settings applied.', 'info');
    console.log('AI Config:', { dynamicRules, proactiveAlerts, diagnosticMode });
}

function generateReport(type) {
    const reportTitle = `${type} Compliance Report - ${getISTTime()}`;
    let reportContent = `<h3>${reportTitle}</h3><p class="text-gray-700">This is a simulated ${type.toLowerCase()} compliance report.</p><br>`;

    if (type === 'Daily') {
        reportContent += `
            <p><strong>Summary for Today:</strong></p>
            <ul class="list-disc list-inside ml-4">
                <li>New Alerts: ${randomInRange(0, 3)}</li>
                <li>Automated Actions: ${randomInRange(5, 15)}</li>
                <li>Overall Compliance Rate: ${randomInRange(90, 98)}%</li>
                <li>Average Risk Score: ${randomInRange(5, 12)}%</li>
            </ul>
            <p class="mt-4">Detailed breakdown of today's events:</p>
            <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                ${complianceUpdates.slice(0, 5).map(u => `- ${u.text} (${u.timestamp})`).join('\n')}
                ${activeAlerts.filter(a => !a.isResolved).slice(0, 2).map(a => `- ALERT: ${a.text} (Severity: ${a.severity})`).join('\n')}
            </pre>
        `;
    } else if (type === 'Weekly') {
        reportContent += `
            <p><strong>Weekly Performance Overview:</strong></p>
            <ul class="list-disc list-inside ml-4">
                <li>Total Alerts: ${randomInRange(5, 15)}</li>
                <li>Total Automated Actions: ${randomInRange(20, 50)}</li>
                <li>Average Weekly Compliance Rate: ${randomInRange(88, 96)}%</li>
                <li>Highest Risk Score Recorded: ${randomInRange(10, 25)}%</li>
            </ul>
            <p class="mt-4">Key trends and summaries from the past week:</p>
            <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                - Trend: Slight increase in data privacy related alerts.
                - Resolved: ${randomInRange(3, 10)} critical alerts resolved.
                - New Regulations Monitored: ${randomInRange(1, 5)} new regulatory updates detected.
                </pre>
        `;
    } else if (type === 'Monthly') {
        reportContent += `
            <p><strong>Monthly Strategic Compliance Report:</strong></p>
            <ul class="list-disc list-inside ml-4">
                <li>Monthly Compliance Rate: ${randomInRange(85, 95)}%</li>
                <li>Significant Regulatory Changes: ${randomInRange(2, 7)}</li>
                <li>Simulations Run: ${randomInRange(1, 5)}</li>
                <li>Impact Assessment Summary: Overall positive, with minor adjustments needed for Q4.</li>
            </ul>
            <p class="mt-4">Strategic recommendations for the upcoming month:</p>
            <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                - Recommendation 1: Allocate resources for deep dive into new e-commerce tax implications.
                - Recommendation 2: Schedule proactive engagement with DPIIT on upcoming FDI policy amendments.
                - Recommendation 3: Review and update internal training modules based on recent compliance actions.
            </pre>
        `;
    }

    document.getElementById('reportModalTitle').textContent = reportTitle;
    document.getElementById('reportModalContent').innerHTML = reportContent;
    openModal('reportViewerModal');
    showToast(`${type} Report generated successfully!`, 'success');
}

async function downloadCurrentReport() {
    const reportModalContent = document.getElementById('reportModalContent');
    const reportTitle = document.getElementById('reportModalTitle').textContent;

    showToast('Generating PDF for current report...', 'info');

    try {
        // Temporarily clone the content to render it without scrollbars affecting the PDF
        const tempDiv = document.createElement('div');
        tempDiv.style.width = reportModalContent.offsetWidth + 'px'; // Use actual width
        tempDiv.style.padding = '20px'; // Add some padding for better appearance
        tempDiv.style.backgroundColor = '#ffffff';
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px'; // Move off-screen
        tempDiv.innerHTML = reportModalContent.innerHTML;
        document.body.appendChild(tempDiv);

        const canvas = await html2canvas(tempDiv, { scale: 2 }); // Increased scale for better quality
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');

        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight); // Start at top of first page
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, -(imgHeight - heightLeft), imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`${reportTitle.replace(/ /g, '_')}.pdf`);
        showToast('Current report downloaded successfully as PDF!', 'success');

        document.body.removeChild(tempDiv); // Remove the temporary div
    } catch (error) {
        console.error('Error generating PDF:', error);
        showToast('Failed to generate PDF. Please try again.', 'error');
    }
}


async function downloadAllReports() {
    showToast('Generating PDF for all reports... This may take a moment.', 'info');

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 297;

    const reportTypes = ['Daily', 'Weekly', 'Monthly'];

    for (const type of reportTypes) {
        // Generate content for each report type
        const tempDiv = document.createElement('div');
        tempDiv.style.width = '190mm'; // Set a width for rendering
        tempDiv.style.padding = '10mm';
        tempDiv.style.backgroundColor = '#ffffff';
        tempDiv.style.marginBottom = '20mm';
        tempDiv.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        tempDiv.style.borderRadius = '8px';
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px'; // Move off-screen
        document.body.appendChild(tempDiv); // Temporarily append to body for html2canvas

        const reportTitle = `${type} Compliance Report - ${getISTTime()}`;
        let reportContent = `<h3 style="font-size: 20px; margin-bottom: 10px; color: #1a2e44;">${reportTitle}</h3><p style="font-size: 14px; color: #6b7280;">This is a simulated ${type.toLowerCase()} compliance report.</p><br>`;

        if (type === 'Daily') {
            reportContent += `
                <p style="font-weight: bold; font-size: 16px;">Summary for Today:</p>
                <ul style="list-style-type: disc; margin-left: 20px; font-size: 14px;">
                    <li>New Alerts: ${randomInRange(0, 3)}</li>
                    <li>Automated Actions: ${randomInRange(5, 15)}</li>
                    <li>Overall Compliance Rate: ${randomInRange(90, 98)}%</li>
                    <li>Average Risk Score: ${randomInRange(5, 12)}%</li>
                </ul>
                <p style="margin-top: 15px; font-size: 14px;">Detailed breakdown of today's events:</p>
                <pre style="background-color: #f8f8f8; padding: 10px; border-radius: 5px; font-size: 12px; overflow-x: auto;">
                    ${complianceUpdates.slice(0, 5).map(u => `- ${u.text} (${u.timestamp})`).join('\n')}
                    ${activeAlerts.filter(a => !a.isResolved).slice(0, 2).map(a => `- ALERT: ${a.text} (Severity: ${a.severity})`).join('\n')}
                </pre>
            `;
        } else if (type === 'Weekly') {
            reportContent += `
                <p style="font-weight: bold; font-size: 16px;">Weekly Performance Overview:</p>
                <ul style="list-style-type: disc; margin-left: 20px; font-size: 14px;">
                    <li>Total Alerts: ${randomInRange(5, 15)}</li>
                    <li>Total Automated Actions: ${randomInRange(20, 50)}</li>
                    <li>Average Weekly Compliance Rate: ${randomInRange(88, 96)}%</li>
                    <li>Highest Risk Score Recorded: ${randomInRange(10, 25)}%</li>
                </ul>
                <p style="margin-top: 15px; font-size: 14px;">Key trends and summaries from the past week:</p>
                <pre style="background-color: #f8f8f8; padding: 10px; border-radius: 5px; font-size: 12px; overflow-x: auto;">
                    - Trend: Slight increase in data privacy related alerts.
                    - Resolved: ${randomInRange(3, 10)} critical alerts resolved.
                    - New Regulations Monitored: ${randomInRange(1, 5)} new regulatory updates detected.
                </pre>
            `;
        } else if (type === 'Monthly') {
            reportContent += `
                <p style="font-weight: bold; font-size: 16px;">Monthly Strategic Compliance Report:</p>
                <ul style="list-style-type: disc; margin-left: 20px; font-size: 14px;">
                    <li>Monthly Compliance Rate: ${randomInRange(85, 95)}%</li>
                    <li>Significant Regulatory Changes: ${randomInRange(2, 7)}</li>
                    <li>Simulations Run: ${randomInRange(1, 5)}</li>
                    <li>Impact Assessment Summary: Overall positive, with minor adjustments needed for Q4.</li>
                </ul>
                <p style="margin-top: 15px; font-size: 14px;">Strategic recommendations for the upcoming month:</p>
                <pre style="background-color: #f8f8f8; padding: 10px; border-radius: 5px; font-size: 12px; overflow-x: auto;">
                    - Recommendation 1: Allocate resources for deep dive into new e-commerce tax implications.
                    - Recommendation 2: Schedule proactive engagement with DPIIT on upcoming FDI policy amendments.
                    - Recommendation 3: Review and update internal training modules based on recent compliance actions.
                </pre>
            `;
        }
        tempDiv.innerHTML = reportContent;

        const canvas = await html2canvas(tempDiv, { scale: 2 }); // Increased scale for better quality
        const imgData = canvas.toDataURL('image/png');
        const imgHeight = canvas.height * imgWidth / canvas.width;

        if (pdf.internal.getNumberOfPages() > 0) { // Add a new page if not the very first report
            pdf.addPage();
        }

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        document.body.removeChild(tempDiv); // Remove temporary div
    }

    pdf.save(`All_Compliance_Reports_${getISTTime().replace(/ /g, '_')}.pdf`);
    showToast('All reports downloaded successfully as PDF!', 'success');
}


function refreshData() {
    showToast('Data refresh initiated. Updating all modules...', 'info');
    updateSystemHealth();
    updateStatus();
    updateComplianceUpdates();
    updateAnalytics();
    updateAlerts();
    updateDetailedMetrics();
    updateReviewQueue(); // Refresh review queue
    setTimeout(() => {
        showToast('All data refreshed and synchronized!', 'success');
    }, 1000);
}

// Modal Functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function openSimulationModal() {
    document.getElementById('simulationResults').classList.add('hidden'); // Hide previous results
    document.getElementById('simulationResultText').textContent = '';
    document.getElementById('simulationConfidence').textContent = '';
    document.getElementById('simulationJustification').textContent = '';
    document.getElementById('simulationSuggestion').classList.add('hidden');
    document.getElementById('simulationSuggestion').innerHTML = '';
    openModal('simulationModal');
}

function runSimulation() {
    const scenario = document.getElementById('simulationScenario').value;
    const impact = document.getElementById('simulationImpact').value;
    const simulationResultsDiv = document.getElementById('simulationResults');
    const simulationResultText = document.getElementById('simulationResultText');
    const simulationConfidence = document.getElementById('simulationConfidence');
    const simulationJustification = document.getElementById('simulationJustification');
    const simulationSuggestionDiv = document.getElementById('simulationSuggestion');

    const confidence = randomInRange(60, 99);
    const justificationOptions = [
        'high risk score in recent analytics',
        'detection of an ambiguous legal phrase in a new draft bill',
        'a significant increase in regulatory scrutiny on e-commerce platforms',
        'low AI confidence in predicting the impact of a specific policy change'
    ];
    const justification = justificationOptions[Math.floor(Math.random() * justificationOptions.length)];

    simulationResultText.innerHTML = `Simulation for <strong>${sanitizeHTML(scenario)}</strong> completed. Expected impact: <strong>${sanitizeHTML(impact)}</strong>.`;
    simulationConfidence.textContent = `${confidence}%`;
    simulationJustification.textContent = sanitizeHTML(justification);

    if (confidence < 85) {
        simulationSuggestionDiv.classList.remove('hidden');
        simulationSuggestionDiv.innerHTML = `
            <i class="fas fa-lightbulb text-yellow-500 mr-2"></i>
            Suggestion: Consider a manual legal review for this scenario due to lower AI confidence. Focus on potential ambiguities in the "${scenario.includes('FDI') ? 'foreign investment clauses' : (scenario.includes('privacy') ? 'data consent requirements' : 'market competition rules')}" section.
        `;
    } else {
        simulationSuggestionDiv.classList.add('hidden');
    }

    simulationResultsDiv.classList.remove('hidden');
    showToast(`Running simulation for: ${scenario} with expected impact: ${impact}`, 'info');
    console.log('Simulation Parameters:', { scenario, impact });
    // closeModal('simulationModal'); // Keep modal open to show results
    setTimeout(() => {
        showToast(`Simulation for '${scenario}' completed. Results displayed.`, 'success');
    }, 1000);
}

function openStakeholderModal() {
    openModal('stakeholderModal');
}

function sendCommunication() {
    const recipient = document.getElementById('commRecipient').value;
    const message = document.getElementById('commMessage').value;
    if (message.trim() === '') {
        showToast('Message cannot be empty!', 'warning');
        return;
    }
    showToast(`Sending communication to ${recipient}: "${message.substring(0, 30)}..."`, 'info');
    console.log('Communication Sent:', { recipient, message });
    closeModal('stakeholderModal');
    document.getElementById('commMessage').value = '';
}

async function generateTransparencyReport() {
    showToast('Generating Transparency Report... This may take a moment.', 'info');
    const reportTitle = `Transparency Report - ${getISTTime()}`;
    const reportContent = `
        <h3 style="font-size: 20px; margin-bottom: 10px; color: #1a2e44;">${reportTitle}</h3>
        <p style="font-size: 14px; color: #6b7280;">This report outlines Walmart's commitment to regulatory transparency and compliance, powered by our AI engine.</p>
        <br>
        <p style="font-weight: bold; font-size: 16px;">Key Highlights:</p>
        <ul style="list-style-type: disc; margin-left: 20px; font-size: 14px;">
            <li>Proactive identification of ${randomInRange(5, 15)} potential regulatory changes.</li>
            <li>Automated compliance adjustments for ${randomInRange(10, 30)} operational processes.</li>
            <li>Overall compliance score maintained at ${randomInRange(90, 98)}%.</li>
            <li>${randomInRange(1, 5)} instances of AI-assisted legal drafting for regulatory inquiries.</li>
        </ul>
        <p style="margin-top: 15px; font-size: 14px;">Our AI system ensures auditable and explainable compliance, fostering trust with regulatory bodies and consumers alike.</p>
        <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">Generated by Walmart AI Compliance Portal.</p>
    `;

    try {
        const tempDiv = document.createElement('div');
        tempDiv.style.width = '190mm';
        tempDiv.style.padding = '10mm';
        tempDiv.style.backgroundColor = '#ffffff';
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.innerHTML = reportContent;
        document.body.appendChild(tempDiv);

        const canvas = await html2canvas(tempDiv, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');

        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, -(imgHeight - heightLeft), imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`${reportTitle.replace(/ /g, '_')}.pdf`);
        showToast('Transparency Report generated and downloaded successfully!', 'success');
        document.body.removeChild(tempDiv);
    } catch (error) {
        console.error('Error generating Transparency Report PDF:', error);
        showToast('Failed to generate Transparency Report PDF. Please try again.', 'error');
    }
}


// New Modal Functions

function updateDetailedMetrics() {
    document.getElementById('metricCpuLoad').textContent = `${randomInRange(30, 70)}%`;
    document.getElementById('metricIngestionRate').textContent = `${randomInRange(500, 1500)} docs/min`;
    document.getElementById('metricPredictionAccuracy').textContent = `${randomInRange(95, 99)}%`;
    document.getElementById('metricAutomatedActions').textContent = `${randomInRange(10, 50)}`;
}

let currentAlertId = null;

function openAlertActionModal(alertId) {
    currentAlertId = alertId;
    const alert = activeAlerts.find(a => a.id === alertId);
    if (!alert) {
        showToast('Alert not found.', 'error');
        return;
    }

    const alertModalContent = document.getElementById('alertModalContent');
    alertModalContent.innerHTML = `
        <p class="font-bold text-lg mb-2 text-${alert.severity === 'Critical' ? 'red' : (alert.severity === 'High' ? 'orange' : 'gray')}-700">${sanitizeHTML(alert.severity)} Alert: ${sanitizeHTML(alert.text)}</p>
        <p class="text-sm text-gray-600">Alert ID: ${alert.id}</p>
        <p class="text-sm text-gray-600">Detected: ${sanitizeHTML(alert.timestamp)}</p>
        <p class="mt-2">This alert indicates a potential compliance issue requiring immediate attention. Select an action below to proceed.</p>
    `;
    const actionInput = document.getElementById('alertActionInput');
    actionInput.value = alert.recommendedAction || '';

    const confidenceJustification = document.getElementById('alertConfidenceJustification');
    const ambiguousPhraseSpan = document.getElementById('ambiguousPhrase');
    const smartSuggestionDiv = document.getElementById('alertSmartSuggestion');

    if (alert.confidence < 85) {
        confidenceJustification.classList.remove('hidden');
        ambiguousPhraseSpan.textContent = alert.ambiguousPhrase || 'unclear wording';
    } else {
        confidenceJustification.classList.add('hidden');
    }

    if (alert.smartSuggestion) {
        smartSuggestionDiv.classList.remove('hidden');
        smartSuggestionDiv.innerHTML = `<i class="fas fa-lightbulb text-yellow-500 mr-2"></i>Suggestion: "${sanitizeHTML(alert.smartSuggestion)}"`;
    } else {
        smartSuggestionDiv.classList.add('hidden');
    }

    openModal('alertActionModal');
}

function performAlertAction() {
    const action = document.getElementById('alertActionInput').value;
    if (action === '') {
        showToast('Please select an action for the alert.', 'warning');
        return;
    }

    const alertIndex = activeAlerts.findIndex(alert => alert.id === currentAlertId);
    if (alertIndex !== -1) {
        const alert = activeAlerts[alertIndex];
        if (action === 'markForHumanReview' || action === 'escalate') {
            reviewQueue.push({
                id: alert.id,
                text: alert.text,
                timestamp: getISTTime(),
                status: action === 'markForHumanReview' ? 'Pending Review' : 'Escalated',
                confidence: alert.confidence, // Carry over confidence
                ambiguousPhrase: alert.ambiguousPhrase, // Carry over ambiguous phrase
                smartSuggestion: alert.smartSuggestion // Carry over smart suggestion
            });
            alert.isResolved = true; // Mark original alert as resolved from main alerts view
            showToast(`Alert "${alert.text.substring(0, 50)}..." moved to Legal Review Queue.`, 'info');
        } else {
            alert.isResolved = true;
            showToast(`Alert resolved: ${alert.text.substring(0, 70)}... Action: ${action}.`, 'success');
        }
        console.log('Alert Action:', action, 'for alert ID:', currentAlertId);
        closeModal('alertActionModal');
        updateAlerts();
        updateReviewQueue(); // Update the review queue display
    } else {
        showToast('Error: Alert not found for resolution.', 'error');
    }
}

// New functions for Legal Review Queue
function updateReviewQueue() {
    const reviewQueueDiv = document.getElementById('reviewQueue');
    if (reviewQueueDiv) {
        if (reviewQueue.length === 0) {
            reviewQueueDiv.innerHTML = '<div class="text-gray-500 text-center py-4">No items currently pending human review.</div>';
        } else {
            reviewQueueDiv.innerHTML = reviewQueue.map(item => `
                <div class="review-item">
                    <p class="text-gray-800 font-medium">${sanitizeHTML(item.text)}</p>
                    <span class="text-gray-500 text-sm">${sanitizeHTML(item.timestamp)}</span>
                    <span class="status-tag ${item.status === 'Pending Review' ? 'status-pending' : (item.status === 'Resolved' ? 'status-resolved' : 'status-escalated')}">
                        ${sanitizeHTML(item.status)}
                    </span>
                    ${item.confidence < 85 ? `
                    <p class="text-sm text-gray-600 mt-2">
                        <i class="fas fa-lightbulb mr-1 text-yellow-500"></i>
                        AI Confidence: <strong>${item.confidence}%</strong>. Flagged due to ambiguous legal phrase: <em>"${sanitizeHTML(item.ambiguousPhrase || 'unclear wording')}"</em>.
                    </p>` : ''}
                    ${item.smartSuggestion ? `
                    <div class="smart-suggestion mt-3">
                        <i class="fas fa-lightbulb text-yellow-500 mr-2"></i>Suggestion: "${sanitizeHTML(item.smartSuggestion)}"
                    </div>` : ''}
                    <div class="flex justify-end gap-2 mt-2">
                        <button class="button-small bg-green-500 text-white hover:bg-green-600" onclick="resolveReviewItem('${item.id}')">Resolve</button>
                        <button class="button-small bg-red-500 text-white hover:bg-red-600" onclick="escalateReviewItem('${item.id}')">Escalate</button>
                    </div>
                </div>
            `).join('');
        }
    }
}

function addSampleReviewItem() {
    const sampleItems = [
        { id: `review-${Date.now()}-1`, text: 'Legal review required for new cross-border data transfer policy interpretation.', status: 'Pending Review', confidence: randomInRange(70, 84), ambiguousPhrase: 'data portability', smartSuggestion: 'Draft a memo outlining potential interpretations of the new data transfer policy.' },
        { id: `review-${Date.now()}-2`, text: 'Human validation needed for AI-recommended adjustment to seller commission structure.', status: 'Pending Review', confidence: randomInRange(80, 90), ambiguousPhrase: null, smartSuggestion: 'Convene a meeting with finance and legal to review the proposed commission changes.' },
        { id: `review-${Date.now()}-3`, text: 'Compliance team to review implications of recent court ruling on e-commerce taxation.', status: 'Pending Review', confidence: randomInRange(75, 88), ambiguousPhrase: 'digital services tax', smartSuggestion: 'Prepare a brief on the court ruling and its direct impact on current tax calculations.' }
    ];
    const newItem = sampleItems[Math.floor(Math.random() * sampleItems.length)];
    reviewQueue.unshift({ ...newItem, timestamp: getISTTime() });
    updateReviewQueue();
    showToast(`New item added to Legal Review Queue: "${newItem.text.substring(0, 50)}..."`, 'info');
}

function resolveReviewItem(itemId) {
    const itemIndex = reviewQueue.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        reviewQueue[itemIndex].status = 'Resolved';
        showToast(`Review item "${reviewQueue[itemIndex].text.substring(0, 50)}..." marked as Resolved.`, 'success');
        // Optionally remove from queue after resolution
        reviewQueue.splice(itemIndex, 1);
        updateReviewQueue();
    }
}

function escalateReviewItem(itemId) {
    const itemIndex = reviewQueue.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        reviewQueue[itemIndex].status = 'Escalated';
        showToast(`Review item "${reviewQueue[itemIndex].text.substring(0, 50)}..." Escalated.`, 'error');
        updateReviewQueue();
    }
}


function openFullLogHistoryModal() {
    const fullLogDiv = document.getElementById('fullComplianceLog');
    if (fullLogDiv) {
        // Ensure the full log is always up-to-date when opened
        fullLogDiv.innerHTML = complianceUpdates.map(u => `
            <div class="compliance-update-item">
                <i class="fas fa-check-circle text-green-500 mr-2"></i>
                ${sanitizeHTML(u.text)} <span class="font-bold text-gray-600">(${u.accuracy}% accuracy)</span> - <span class="text-gray-500 text-sm">${sanitizeHTML(u.timestamp)}</span>
            </div>
        `).join('');
        if (complianceUpdates.length === 0) {
            fullLogDiv.innerHTML = '<div class="text-gray-500 text-center py-4">No historical logs available yet.</div>';
        }
    }
    openModal('fullLogHistoryModal');
}

async function downloadFullLogHistory() {
    showToast('Generating Full Log History PDF... This may take a moment.', 'info');
    const logTitle = `Full Orchestration Log History - ${getISTTime()}`;
    const logContent = `
        <h3 style="font-size: 20px; margin-bottom: 10px; color: #1a2e44;">${logTitle}</h3>
        <p style="font-size: 14px; color: #6b7280;">A complete, tamper-proof record of all automated compliance actions and system events.</p>
        <br>
        ${complianceUpdates.map(u => `
            <div style="margin-bottom: 8px; padding: 5px; border-left: 3px solid #22c55e; background-color: #ebf9eb; font-size: 12px;">
                <strong>Action:</strong> ${sanitizeHTML(u.text)}<br>
                <strong>Accuracy:</strong> ${u.accuracy}%<br>
                <strong>Timestamp:</strong> ${sanitizeHTML(u.timestamp)}
            </div>
        `).join('')}
        ${complianceUpdates.length === 0 ? '<p style="text-align: center; color: #6b7280; font-size: 14px;">No historical logs available yet.</p>' : ''}
        <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">Generated by Walmart AI Compliance Portal.</p>
    `;

    try {
        const tempDiv = document.createElement('div');
        tempDiv.style.width = '190mm';
        tempDiv.style.padding = '10mm';
        tempDiv.style.backgroundColor = '#ffffff';
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.innerHTML = logContent;
        document.body.appendChild(tempDiv);

        const canvas = await html2canvas(tempDiv, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');

        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, -(imgHeight - heightLeft), imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`${logTitle.replace(/ /g, '_')}.pdf`);
        showToast('Full Log History downloaded successfully as PDF!', 'success');
        document.body.removeChild(tempDiv);
    } catch (error) {
        console.error('Error generating Full Log History PDF:', error);
        showToast('Failed to generate Full Log History PDF. Please try again.', 'error');
    }
}


const moduleDetails = {
    dataHub: {
        title: 'Advanced Data Intelligence Hub',
        content: `
            <p>This module continuously aggregates and processes vast amounts of regulatory data from diverse sources including:</p>
            <ul class="list-disc list-inside mt-2 ml-4 text-gray-600">
                <li>Parliamentary proceedings & legislative drafts (e.g., new FDI policy proposals)</li>
                <li>Judicial precedents & court rulings (e.g., antitrust case outcomes)</li>
                <li>International trade agreements & global regulations impacting e-commerce</li>
                <li>Industry lobby intelligence & expert analyses on regulatory shifts</li>
                <li>Social media sentiment & public discourse on policy changes</li>
                <li>Economic indicators & market trends relevant to retail compliance</li>
            </ul>
            <p class="mt-2">It leverages advanced web crawling, API integrations, and secure data pipelines. The "Regulatory Network Mapping" sub-module identifies key decision-makers, agency interaction patterns, and integrates political calendars for predictive insights, specifically for the Indian e-commerce landscape.</p>
        `
    },
    nlpEngine: {
        title: 'Quantum-Level NLP & Prediction Engine',
        content: `
            <p>Our proprietary NLP engine goes beyond basic text analysis, focusing on the nuances of Indian regulatory language. It features:</p>
            <ul class="list-disc list-inside mt-2 ml-4 text-gray-600">
                <li><strong>Contextual Intelligence:</strong> Understanding the specific legal and policy language evolution in India, and cross-referencing impacts across complex FDI, antitrust, and e-commerce laws.</li>
                <li><strong>Ambiguity Detection:</strong> Identifying vague or open-ended clauses in new regulations (e.g., "fair trade practices") that could lead to future compliance challenges or multi-billion rupee penalties.</li>
                <li><strong>Implementation Timeline Prediction:</strong> Forecasting when a proposed regulation is likely to be enacted and enforced, helping Walmart prepare proactively.</li>
                <li><strong>Behavioral Pattern Recognition:</strong> Analyzing past actions and decisions of Indian regulatory bodies (e.g., CCI, DPIIT) to predict future enforcement trends and areas of scrutiny.</li>
                <li><strong>Cross-Lingual Analysis:</strong> Processing regulatory texts in multiple Indian languages to capture regional nuances and local interpretations of laws.</li>
                <li><strong>Predictive Compliance Scoring:</strong> Assigning a real-time compliance score to new regulations based on their complexity, historical enforcement patterns, and potential for business impact.</li>
            </ul>
            <p class="mt-2">It operates with 99% precision, powered by reinforcement learning and deep neural networks, specifically trained on India's regulatory environment.</p>
        `
    },
    impactAssessment: {
        title: 'Real-Time Business Impact Assessment',
        content: `
            <p>This module dynamically maps regulatory changes to Walmart's specific business processes and operations in India, providing quantifiable impact assessments:</p>
            <ul class="list-disc list-inside mt-2 ml-4 text-gray-600">
                <li><strong>Revenue Impact Analysis:</strong> Predicting potential financial gains or losses due to compliance or non-compliance with new regulations (e.g., impact of local sourcing mandates on profitability).</li>
                <li><strong>Operational Disruption Forecasting:</strong> Identifying specific business units, supply chain segments, or or seller operations that will be affected by regulatory shifts.</li>
                <li><strong>Seller Ecosystem Impact Predictor:</strong> How regulations affect the vast network of third-party sellers on the platform, including potential changes to their onboarding, commission structures, or product listings.</li>
                <li><strong>Customer Experience Impact Analyzer:</strong> Assessing the potential effect on customer trust and satisfaction due to changes in pricing, product availability, or service delivery stemming from compliance.</li>
                <li><strong>Resource Allocation Optimization:</strong> Recommending optimal allocation of legal, financial, and operational resources to address new compliance requirements efficiently.</li>
                <li><strong>Risk Mitigation Strategy Generation:</strong> Automatically suggesting tailored strategies to minimize negative impacts and ensure business continuity amidst regulatory changes.</li>
            </ul>
            <p class="mt-2">It includes a "Compliance Scenario Simulator" with "What-If Analysis" and "Business Model Stress Testing" capabilities, allowing proactive strategic adjustments to mitigate risks and capitalize on opportunities.</p>
        `
    },
    regulatoryMgmt: {
        title: 'Proactive Regulatory Relationship Management',
        content: `
            <p>This module automates and optimizes communication and engagement with key Indian regulatory bodies and internal stakeholders:</p>
            <ul class="list-disc list-inside mt-2 ml-4 text-gray-600">
                <li><strong>Automated Stakeholder Notifications:</strong> Sending targeted, real-time alerts and summaries to legal, operations, and leadership teams regarding relevant regulatory changes and required actions.</li>
                <li><strong>Policy Influence Strategy:</strong> Providing data-driven recommendations for engaging with Indian policymakers to shape upcoming regulations, advocating for Walmart's interests.</li>
                <li><strong>Transparency Reporting:</strong> Generating comprehensive, tamper-proof reports for Indian regulators, building trust and demonstrating proactive compliance efforts.</li>
                <li><strong>Industry Collaboration:</b> Identifying opportunities for collaborative efforts with other e-commerce players in India on shared regulatory challenges.</li>
            </ul>
        `
    },
    coreFramework: {
        title: 'Core Compliance Framework',
        content: `
            <p>This is the foundational layer, orchestrating the entire system for robust compliance in the Indian e-commerce context:</p>
            <ul class="list-disc list-inside mt-2 ml-4 text-gray-600">
                <li><strong>Ensemble AI:</strong> Combining multiple AI models (NLP, predictive, reinforcement learning) for robust decision-making tailored to India's complex regulatory environment.</li>
                <li><strong>Reinforcement Learning:</strong> The system continuously learns and adapts its compliance strategies based on outcomes and new data, optimizing for proactive risk mitigation.</li>
                <li><strong>Blockchain Integration:</strong> For immutable audit trails, secure record-keeping of all compliance actions, and enhanced transparency with regulators. This ensures data integrity and builds trust, especially critical given past regulatory scrutiny.</li>
                <li><strong>Automated Action Triggers:</strong> Seamlessly integrating AI insights with Walmart's transaction systems to dynamically update compliance thresholds, flag non-compliant deals, or even block them in real-time before violations occurs.</li>
            </ul>
        `
    }
};

function openModuleDetailsModal(moduleId) {
    const module = moduleDetails[moduleId];
    if (module) {
        document.getElementById('moduleTitle').textContent = module.title;
        document.getElementById('moduleContent').innerHTML = module.content;
        openModal('moduleDetailsModal');
    } else {
        showToast('Module details not found.', 'error');
    }
}

// --- Website-specific functions ---

// The function remains for the reset password modal where the icon is still present.
function togglePasswordVisibility(fieldId, iconElement) {
    const passwordField = document.getElementById(fieldId);
    const icon = iconElement.querySelector('i');
    if (passwordField.type === "password") {
        passwordField.type = "text";
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = "password";
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function handleLogin() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const loginMessage = document.getElementById('loginMessage');
    
    // Ensure loginMessage exists before trying to access its classList
    if (loginMessage) {
        loginMessage.classList.add('hidden'); // Hide previous messages
    }

    if (!username.startsWith('EMP')) {
        showToast('Wrong Employee ID. Employee ID must start with "EMP".', 'error');
        if (loginMessage) { // Check again before setting text
            loginMessage.textContent = 'Wrong Employee ID. Employee ID must start with "EMP".';
            loginMessage.classList.remove('hidden');
        }
        return;
    }

    if (userPasswords[username] && userPasswords[username] === password) {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('appContainer').classList.remove('hidden');
        document.getElementById('loggedInUserName').textContent = employeeData.find(emp => emp.id === username)?.name || 'Admin'; // User name
        document.getElementById('userName').textContent = employeeData.find(emp => emp.id === username)?.name || 'Admin'; // For the user dropdown
        document.getElementById('employeeId').textContent = username; // Use entered Employee ID
        document.getElementById('userRole').textContent = employeeData.find(emp => emp.id === username)?.role || 'AI Compliance Lead'; // For the user dropdown
        document.getElementById('userDept').textContent = employeeData.find(emp => emp.id === username)?.department || 'AI & Regulatory Tech'; // For the user dropdown

        showToast(`Login successful! Welcome, ${employeeData.find(emp => emp.id === username)?.name || 'Admin'} (${username}).`, 'success');
        addWebsiteNotification(`User ${username} logged in to the portal.`, 'info');
        initializeDashboard(); // Initialize dashboard content after login
    } else {
        showToast('Wrong password. Please try again.', 'error');
        if (loginMessage) { // Check again before setting text
            loginMessage.textContent = 'Wrong password. Please try again.';
            loginMessage.classList.remove('hidden');
        }
    }
}

function simulateLogout() {
    document.getElementById('appContainer').classList.add('hidden');
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('loginUsername').value = ''; // Clear Employee ID
    document.getElementById('loginPassword').value = ''; // Clear password field
    showToast('Logged out successfully.', 'info');
    // Clear intervals and charts on logout
    if (updateInterval) clearInterval(updateInterval);
    if (chart) chart.destroy();
    if (riskTimelineChart) riskTimelineChart.destroy();
}

function addWebsiteNotification(message, type = 'info') {
    const notification = {
        id: `notif-${Date.now()}`,
        message: message,
        timestamp: getISTTime(),
        read: false,
        type: type
    };
    websiteNotifications.unshift(notification); // Add to beginning
    updateNotificationDropdown();
    updateNotificationCount();
    if (notificationPermissionGranted) {
        // You can also trigger a native browser notification here if permission is granted
        // new Notification('Walmart Portal', { body: message, icon: 'path/to/icon.png' });
    }
    showToast(message, type); // Show as toast pop-up
}

function updateNotificationCount() {
    const unreadCount = websiteNotifications.filter(n => !n.read).length;
    const countElement = document.getElementById('notificationCount');
    if (unreadCount > 0) {
        countElement.textContent = unreadCount;
        countElement.classList.remove('hidden');
    } else {
        countElement.classList.add('hidden');
    }
}

function updateNotificationDropdown() {
    const notificationList = document.getElementById('notificationList');
    if (notificationList) {
        if (websiteNotifications.length === 0) {
            notificationList.innerHTML = '<div class="notification-item text-gray-500 text-center">No new notifications.</div>';
        } else {
            notificationList.innerHTML = websiteNotifications.map(n => `
                <div class="notification-item ${n.read ? '' : 'unread'}">
                    <i class="mr-2 ${n.type === 'alert' ? 'fas fa-exclamation-circle text-red-500' : (n.type === 'success' ? 'fas fa-check-circle text-green-500' : (n.type === 'warning' ? 'fas fa-exclamation-triangle text-orange-500' : 'fas fa-info-circle text-blue-500'))}"></i>
                    ${sanitizeHTML(n.message)}
                    <span>${sanitizeHTML(n.timestamp)}</span>
                </div>
            `).join('');
        }
    }
}

function toggleNotificationDropdown() {
    const dropdown = document.getElementById('notificationDropdown');
    dropdown.classList.toggle('active');
    if (dropdown.classList.contains('active')) {
        websiteNotifications.forEach(n => n.read = true);
        updateNotificationCount();
        updateNotificationDropdown();
    }
}

function markAllNotificationsRead() {
    websiteNotifications.forEach(n => n.read = true);
    updateNotificationCount();
    updateNotificationDropdown();
    showToast('All notifications marked as read.', 'info');
}

function toggleUserDropdown() {
    document.getElementById('userDropdown').classList.toggle('active');
}

function scrollToSection(event, sectionId) {
    event.preventDefault(); // Prevent default anchor link behavior
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Update active class in secondary navigation
        document.querySelectorAll('.secondary-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        // Find the corresponding nav item based on sectionId
        const navItem = document.querySelector(`.secondary-nav-item[href="#${sectionId}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }
    }
}

function handleSearchEnter(event) {
    if (event.key === 'Enter') {
        performSearch();
        hideSearchRecommendations(); // Hide recommendations after search
    }
}

function showSearchRecommendations() {
    const searchTerm = document.getElementById('searchBar').value.trim().toLowerCase();
    const recommendationsDiv = document.getElementById('searchRecommendations');
    let recommendationsHtml = '';

    if (searchTerm.length > 0) {
        const filteredRecommendations = searchablePhrases.filter(phrase =>
            phrase.toLowerCase().includes(searchTerm)
        ).slice(0, 7); // Limit to top 7 recommendations

        if (filteredRecommendations.length > 0) {
            filteredRecommendations.forEach(phrase => {
                recommendationsHtml += `
                    <div class="search-recommendations-item" onclick="selectSearchRecommendation('${sanitizeHTML(phrase)}')">
                        ${highlightSearchTerm(sanitizeHTML(phrase), searchTerm)}
                    </div>
                `;
            });
            recommendationsDiv.innerHTML = recommendationsHtml;
            recommendationsDiv.classList.add('active');
        } else {
            hideSearchRecommendations();
        }
    } else {
        hideSearchRecommendations();
    }
}

function hideSearchRecommendations() {
    document.getElementById('searchRecommendations').classList.remove('active');
}

function selectSearchRecommendation(phrase) {
    document.getElementById('searchBar').value = phrase;
    performSearch();
    hideSearchRecommendations();
}

function performSearch() {
    const searchTerm = document.getElementById('searchBar').value.trim().toLowerCase();
    const searchResultsContent = document.getElementById('searchResultsContent');
    const searchResultsSection = document.getElementById('searchResultsSection');
    let resultsHtml = '';
    let hasResults = false;

    // Clear previous results
    searchResultsContent.innerHTML = '';
    searchResultsSection.style.display = 'none'; // Hide by default

    if (!searchTerm) {
        showToast('Please enter a search term.', 'warning');
        return;
    }

    // Search in section titles (e.g., "Critical Alerts & Notifications") and other searchable phrases
    const matchedPhrases = searchablePhrases.filter(phrase =>
        phrase.toLowerCase().includes(searchTerm)
    );

    if (matchedPhrases.length > 0) {
        resultsHtml += '<h3 class="font-semibold text-lg text-gray-800 mb-2">Matching Content:</h3>';

        matchedPhrases.forEach(phrase => {
            let targetId = '';
            let actionType = 'scrollToSection'; // Default action
            let locationDescription = ''; // For phrasesWithLocationOnly

            if (phrasesWithLocationOnly.includes(phrase)) {
                if (phrase.includes('Walmart Inc.') || phrase.includes('AI Compliance Portal') || phrase.includes('Last Updated') || phrase.includes('Regulatory Partners') || ['DPIIT', 'CCI', 'MeitY', 'ED'].includes(phrase)) {
                    locationDescription = 'Located in Footer';
                } else if (['Privacy Policy', 'Terms of Service', 'Careers', 'Support', 'About Us'].includes(phrase)) {
                    locationDescription = 'Located in Footer (Modal Link)';
                } else if (['Refresh Data', 'Run Impact Simulation', 'Draft Legal Email', 'Generate Daily Report'].includes(phrase)) {
                    locationDescription = 'Located in Quick Actions sidebar';
                } else if (['Employee ID', 'Password', 'Login'].includes(phrase)) {
                    locationDescription = 'Located on Login Screen';
                } else if (['View', 'Reset Password'].includes(phrase) && phrase !== 'Reset Password') { // "View" button in employee table
                    locationDescription = 'Located in Employee Details Table';
                } else if (['New Password', 'Confirm New Password'].includes(phrase)) {
                    locationDescription = 'Located in Reset Password Modal';
                } else if (['Employee Details', 'Name', 'Role', 'Department'].includes(phrase)) {
                    locationDescription = 'Located in User Profile Dropdown';
                } else if (['Logout', 'Quick Actions'].includes(phrase)) {
                    locationDescription = 'Located in Quick Actions Sidebar';
                } else if (['Initiate Monitoring', 'Pause Monitoring', 'Emergency Halt', 'Save AI Settings', 'Generate Transparency Report'].includes(phrase)) {
                    locationDescription = 'Located in Control Panel';
                } else if (['Manage Stakeholder Communications', 'Recipient', 'Message'].includes(phrase)) {
                    locationDescription = 'Located in Stakeholder Communication Modal';
                } else if (['Detailed System Metrics', 'Processing Load', 'Data Ingestion Rate', 'Prediction Accuracy', 'Automated Actions'].includes(phrase)) {
                    locationDescription = 'Located in Detailed Metrics Modal';
                } else if (['Alert Details & Action', 'Recommended Action', 'Confirm Action'].includes(phrase)) {
                    locationDescription = 'Located in Alert Action Modal';
                } else if (['Full Orchestration Log History', 'Download Log (PDF)'].includes(phrase)) {
                    locationDescription = 'Located in Full Log History Modal';
                } else if (['Module Details'].includes(phrase)) {
                    locationDescription = 'Located in Module Details Modal';
                } else if (['Auto-Draft Legal Communication', 'Subject', 'Draft Email Body', 'Generate Draft', 'Copy to Clipboard', 'Download Draft (PDF)'].includes(phrase)) {
                    locationDescription = 'Located in Legal Drafting Modal';
                } else if (['Portal Overview', 'Key Features', 'Troubleshooting Tips', 'Regulatory Resources', 'Contact Support'].includes(phrase)) {
                    locationDescription = 'Located in Help & Documentation Modal';
                }
                resultsHtml += `
                    <div class="search-result-item">
                        <span class="type">Info:</span> ${highlightSearchTerm(sanitizeHTML(phrase), searchTerm)}
                        <span class="text-gray-500 text-sm ml-2">${locationDescription}</span>
                    </div>
                `;
            } else {
                // Map phrases to their corresponding IDs or modal functions
                if (phrase === 'Dashboard Overview') targetId = 'system-status-overview';
                else if (phrase === 'System Status Overview') targetId = 'system-status-overview';
                else if (phrase === 'Critical Alerts & Notifications') targetId = 'critical-alerts';
                else if (phrase === 'Predictive Analytics Dashboard') targetId = 'predictive-analytics';
                else if (phrase === 'Regulatory Risk & Impact Visuals') targetId = 'regulatory-risk-timeline';
                else if (phrase === 'Control Panel') targetId = 'control-panel';
                else if (phrase === 'Monitoring Suite') targetId = 'control-panel'; // Scrolls to control panel
                else if (phrase === 'AI Configuration Hub') targetId = 'control-panel'; // Scrolls to control panel
                else if (phrase === 'Compliance Reporting Suite') targetId = 'control-panel'; // Scrolls to control panel
                else if (phrase === 'Regulatory Relationship Management') targetId = 'control-panel'; // Scrolls to control panel
                else if (phrase === 'Autonomous Compliance Orchestration Log') targetId = 'orchestration-log';
                else if (phrase === 'Legal Review & Human Oversight Queue') targetId = 'legal-review-queue';
                else if (phrase === 'AI Engine Modules Status') targetId = 'ai-modules-status';
                else if (phrase === 'Advanced Data Intelligence Hub') targetId = 'ai-modules-status'; // Scrolls to AI modules
                else if (phrase === 'Quantum-Level NLP & Prediction Engine') targetId = 'ai-modules-status'; // Scrolls to AI modules
                else if (phrase === 'Real-Time Business Impact Assessment') targetId = 'ai-modules-status'; // Scrolls to AI modules
                else if (phrase === 'Proactive Regulatory Relationship Management') targetId = 'ai-modules-status'; // Scrolls to AI modules
                else if (phrase === 'Core Compliance Framework') targetId = 'ai-modules-status'; // Scrolls to AI modules
                else if (phrase === 'FDI policy') targetId = 'system-status-overview'; // Example, link to relevant section or modal
                else if (phrase === 'Antitrust investigation') targetId = 'critical-alerts'; // Example
                else if (phrase === 'Data privacy') targetId = 'critical-alerts'; // Example
                else if (phrase === 'Seller violation') targetId = 'critical-alerts'; // Example
                else if (phrase === 'Local sourcing') targetId = 'system-status-overview'; // Example
                else if (phrase === 'Cross-border data') targetId = 'critical-alerts'; // Example
                else if (phrase === 'Consumer protection') targetId = 'critical-alerts'; // Example
                else if (phrase === 'Emergency Halt') targetId = 'control-panel';
                else if (phrase === 'Generate Transparency Report') targetId = 'control-panel';
                else if (phrase === 'Full Log History') targetId = 'orchestration-log';
                else if (phrase === 'Alerts') targetId = 'critical-alerts';
                else if (phrase === 'Actions') targetId = 'orchestration-log';
                else if (phrase === 'Help & Documentation') { targetId = 'helpDocumentationModal'; actionType = 'openModal'; }
                else if (phrase === 'About Us') { targetId = 'aboutUsModal'; actionType = 'openModal'; }
                else if (phrase === 'Legal Drafting') { targetId = 'legalDraftingModal'; actionType = 'openModal'; }
                else if (phrase === 'Reset Password') { targetId = 'employeeResetPasswordModal'; actionType = 'openModal'; } // For the modal itself
                else if (phrase === 'Employee Details') { targetId = 'userDropdown'; actionType = 'toggleUserDropdown'; } // For the user dropdown
                else if (phrase === 'Refresh Data') { targetId = 'quick-actions-refresh'; actionType = 'triggerFunction'; } // For Refresh Data button
                else if (phrase === 'Reset Password') { targetId = 'employeeResetPasswordModal'; actionType = 'openModal'; } // For the modal itself
                else if (phrase === 'View') { targetId = 'employeeTableBody'; actionType = 'scrollToSection'; } // For employee table view button

                // Mapping for modal names to their open functions
                else if (phrase === 'Manage Stakeholder Communications') { targetId = 'stakeholderModal'; actionType = 'openModal'; }
                else if (phrase === 'Detailed System Metrics') { targetId = 'detailedMetricsModal'; actionType = 'openModal'; }
                else if (phrase === 'Alert Details & Action') { targetId = 'alertActionModal'; actionType = 'openModal'; }
                else if (phrase === 'Full Orchestration Log History') { targetId = 'fullLogHistoryModal'; actionType = 'openModal'; }
                else if (phrase === 'Module Details') { targetId = 'moduleDetailsModal'; actionType = 'openModal'; }
                else if (phrase === 'Auto-Draft Legal Communication') { targetId = 'legalDraftingModal'; actionType = 'openModal'; }
                else if (phrase === 'Privacy Policy') { targetId = 'privacyPolicyModal'; actionType = 'openModal'; }
                else if (phrase === 'Terms of Service') { targetId = 'termsOfServiceModal'; actionType = 'openModal'; }
                else if (phrase === 'Careers') { targetId = 'careersModal'; actionType = 'openModal'; }
                else if (phrase === 'Support') { targetId = 'supportModal'; actionType = 'openModal'; }


                resultsHtml += `
                    <div class="search-result-item">
                        <span class="type">Section:</span> ${highlightSearchTerm(sanitizeHTML(phrase), searchTerm)}
                        <button class="button-small bg-blue-500 text-white hover:bg-blue-600 ml-2"
                            onclick="${actionType === 'openModal' ? `openModal('${targetId}')` : (actionType === 'triggerFunction' ? `${targetId.split('-')[0]}()` : `scrollToSection(event, '${targetId}')`)}">
                            <i class="fas fa-arrow-right mr-1"></i> View Section
                        </button>
                    </div>
                `;
            }
            hasResults = true;
        });
    }

    // Search in alerts
    activeAlerts.filter(alert => !alert.isResolved).forEach(alert => {
        if (alert.text.toLowerCase().includes(searchTerm)) {
            resultsHtml += `
                <div class="search-result-item">
                    <span class="type">Alert:</span> ${highlightSearchTerm(sanitizeHTML(alert.text), searchTerm)}
                    <button class="button-small bg-red-500 text-white hover:bg-red-600 ml-2"
                        onclick="openAlertActionModal('${alert.id}')">
                        <i class="fas fa-exclamation-triangle mr-1"></i> Take Action
                    </button>
                </div>
            `;
            hasResults = true;
        }
    });

    // Search in compliance updates
    complianceUpdates.forEach(update => {
        if (update.text.toLowerCase().includes(searchTerm)) {
            resultsHtml += `
                <div class="search-result-item">
                    <span class="type">Action Log:</span> ${highlightSearchTerm(sanitizeHTML(update.text), searchTerm)}
                    <button class="button-small bg-gray-500 text-white hover:bg-gray-600 ml-2"
                        onclick="openFullLogHistoryModal()">
                        <i class="fas fa-scroll mr-1"></i> View Full Log
                    </button>
                </div>
            `;
            hasResults = true;
        }
    });

    // Search in employee data
    employeeData.forEach(emp => {
        if (emp.id.toLowerCase().includes(searchTerm) || emp.name.toLowerCase().includes(searchTerm) || emp.department.toLowerCase().includes(searchTerm) || emp.role.toLowerCase().includes(searchTerm)) {
            resultsHtml += `
                <div class="search-result-item">
                    <span class="type">Employee:</span> ${highlightSearchTerm(sanitizeHTML(`${emp.name} (${emp.id}) - ${emp.role}, ${emp.department}`), searchTerm)}
                    <button class="button-small bg-blue-500 text-white hover:bg-blue-600 ml-2"
                        onclick="openEmployeeResetPasswordModalFor('${emp.id}')">
                        <i class="fas fa-key mr-1"></i> Manage
                    </button>
                </div>
            `;
            hasResults = true;
        }
    });

    if (hasResults) {
        searchResultsContent.innerHTML = resultsHtml;
        searchResultsSection.style.display = 'block';
        searchResultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        searchResultsContent.innerHTML = '<div class="no-results">No results found for your search.</div>';
        searchResultsSection.style.display = 'block';
    }
    showToast(`Search completed for "${searchTerm}".`, 'info');
}

/**
 * Populates the employee dropdown in the reset password modal.
 */
function populateEmployeeDropdown() {
    const dropdown = document.getElementById('employeeIdToReset');
    if (dropdown) {
        dropdown.innerHTML = employeeData.map(emp => `<option value="${emp.id}">${sanitizeHTML(emp.name)} (${sanitizeHTML(emp.id)})</option>`).join('');
    }
}

/**
 * Opens the employee reset password modal.
 */
function openEmployeeResetPasswordModal() {
    populateEmployeeDropdown(); // Ensure dropdown is populated before opening
    openModal('employeeResetPasswordModal');
}

/**
 * Performs the employee password reset.
 */
function performEmployeePasswordReset() {
    const employeeId = document.getElementById('employeeIdToReset').value;
    const newPassword = document.getElementById('newEmployeePassword').value;
    const confirmPassword = document.getElementById('confirmEmployeePassword').value;

    if (!employeeId) {
        showToast('Please select an Employee ID.', 'warning');
        return;
    }
    if (newPassword.length < 6) {
        showToast('New password must be at least 6 characters long.', 'warning');
        return;
    }
    if (newPassword !== confirmPassword) {
        showToast('New password and confirm password do not match.', 'error');
        return;
    }

    // Simulate password reset
    userPasswords[employeeId] = newPassword;
    localStorage.setItem('userPasswords', JSON.stringify(userPasswords)); // Persist the change

    showToast(`Password for Employee ID ${employeeId} has been successfully reset!`, 'success');
    addWebsiteNotification(`Password for Employee ID ${employeeId} was reset.`, 'success');
    closeModal('employeeResetPasswordModal');
    document.getElementById('newEmployeePassword').value = '';
    document.getElementById('confirmEmployeePassword').value = '';
}

// Legal Drafting / Email Generation
function openLegalDraftingModal() {
    // Clear previous content
    document.getElementById('draftRecipient').value = 'CCI'; // Reset to default
    document.getElementById('draftSubject').value = '';
    document.getElementById('draftBody').value = '';
    openModal('legalDraftingModal');
}

async function generateLegalEmail() {
    const recipient = document.getElementById('draftRecipient').value;
    const subject = document.getElementById('draftSubject').value;
    const draftBody = document.getElementById('draftBody');

    if (!subject.trim()) {
        showToast('Please enter a subject for the email.', 'warning');
        return;
    }

    showToast('Generating email draft using AI...', 'info');

    // Simulate AI generation with more dynamic content
    const aiGeneratedContent = `
Dear ${recipient} Team,

This email is to provide an update regarding the recent developments concerning ${subject.toLowerCase()}. Our AI-powered regulatory prediction engine has analyzed the latest data and identified the following key points:

1.  **Regulatory Landscape Shift:** We anticipate a significant shift in ${subject.includes('FDI') ? 'Foreign Direct Investment policies' : (subject.includes('antitrust') ? 'antitrust enforcement' : (subject.includes('data privacy') ? 'data privacy regulations' : 'relevant regulatory area'))} within the next quarter, primarily driven by [simulated reason, e.g., "recent parliamentary discussions" or "evolving judicial interpretations"].
2.  **Potential Business Impact:** Our models predict a [simulated impact, e.g., "moderate operational adjustment requirement" or "potential for increased compliance costs"] if proactive measures are not taken. Specifically, this could affect [simulated affected area, e.g., "our cross-border transaction flows" or "seller onboarding processes"].
3.  **Recommended Actions:** To mitigate these risks and ensure continued adherence, we recommend:
* Reviewing [relevant policy/process, e.g., "our current data handling protocols"] by [date, e.g., "August 15, 2025"].
* Initiating discussions with [relevant department/stakeholder, e.g., "the Operations team"] to align on necessary adjustments.
* Considering [specific action, e.g., "a proactive communication strategy with key regulatory bodies"].

We are committed to maintaining the highest standards of regulatory adherence and are taking necessary steps to address these findings. Please find attached a summary report for your detailed review.

For any further clarification or discussion, please do not hesitate to contact us.

Sincerely,

Walmart AI Compliance Team
Generated on: ${getISTTime()}
    `.trim();

    draftBody.value = aiGeneratedContent;
    showToast('Email draft generated successfully!', 'success');
}

async function downloadLegalEmailDraft() {
    const draftBody = document.getElementById('draftBody');
    const draftRecipient = document.getElementById('draftRecipient').value;
    const draftSubject = document.getElementById('draftSubject').value;

    if (!draftBody.value.trim()) {
        showToast('Please generate the email draft first.', 'warning');
        return;
    }

    showToast('Generating email draft PDF...', 'info');

    const pdfContent = `
        <h3 style="font-size: 20px; margin-bottom: 10px; color: #1a2e44;">Legal Communication Draft</h3>
        <p style="font-size: 14px; color: #6b7280;"><strong>To:</strong> ${sanitizeHTML(draftRecipient)} Team</p>
        <p style="font-size: 14px; color: #6b7280;"><strong>Subject:</strong> ${sanitizeHTML(draftSubject)}</p>
        <br>
        <pre style="white-space: pre-wrap; font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.6; background-color: #f8f8f8; padding: 10px; border-radius: 5px;">${sanitizeHTML(draftBody.value)}</pre>
        <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">Generated by Walmart AI Compliance Portal.</p>
    `;

    try {
        const tempDiv = document.createElement('div');
        tempDiv.style.width = '190mm';
        tempDiv.style.padding = '10mm';
        tempDiv.style.backgroundColor = '#ffffff';
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.innerHTML = pdfContent;
        document.body.appendChild(tempDiv);

        const canvas = await html2canvas(tempDiv, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');

        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, -(imgHeight - heightLeft), imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`Legal_Email_Draft_${draftSubject.replace(/ /g, '_')}.pdf`);
        showToast('Email draft downloaded successfully as PDF!', 'success');
        document.body.removeChild(tempDiv);
    } catch (error) {
        console.error('Error generating email draft PDF:', error);
        showToast('Failed to generate email draft PDF. Please try again.', 'error');
    }
}


function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.select();
        document.execCommand('copy');
        showToast('Content copied to clipboard!', 'success');
    } else {
        showToast('Failed to copy content.', 'error');
    }
}

async function downloadHelpDocumentation() {
    showToast('Generating Help & Documentation PDF...', 'info');
    const helpModalContent = document.getElementById('helpDocumentationModal').querySelector('.modal-content').cloneNode(true);

    // Remove the close button and modal buttons from the cloned content for PDF
    const closeBtn = helpModalContent.querySelector('.close-button');
    if (closeBtn) closeBtn.remove();
    const modalBtns = helpModalContent.querySelector('.modal-buttons');
    if (modalBtns) modalBtns.remove();

    const pdfContent = helpModalContent.innerHTML;

    try {
        const tempDiv = document.createElement('div');
        tempDiv.style.width = '190mm';
        tempDiv.style.padding = '10mm';
        tempDiv.style.backgroundColor = '#ffffff';
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.innerHTML = pdfContent;
        document.body.appendChild(tempDiv);

        const canvas = await html2canvas(tempDiv, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');

        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, -(imgHeight - heightLeft), imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`Walmart_AI_Compliance_Help_Docs_${getISTTime().replace(/ /g, '_')}.pdf`);
        showToast('Help & Documentation downloaded successfully as PDF!', 'success');
        document.body.removeChild(tempDiv);
    } catch (error) {
        console.error('Error generating Help & Documentation PDF:', error);
        showToast('Failed to generate Help & Documentation PDF. Please try again.', 'error');
    }
}


// Initial setup and event listeners
window.onload = function () {
    // Show the landing screen initially
    document.getElementById('landingScreen').classList.remove('hidden');
    document.getElementById('loginScreen').classList.add('hidden'); // Ensure login is hidden
    document.getElementById('appContainer').classList.add('hidden'); // Ensure app is hidden

    const proceedButton = document.getElementById('proceedToLoginButton');
    if (proceedButton) {
        proceedButton.addEventListener('click', function () {
            document.getElementById('landingScreen').classList.add('hidden');
            document.getElementById('loginScreen').classList.remove('hidden');
        });
    }

    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');
    const loginButton = document.getElementById('loginButton');

    // Event listener for login button click
    if (loginButton) {
        loginButton.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent form submission
            handleLogin();
        });
    }

    // Event listener for Enter key press on username field
    if (loginUsername) {
        loginUsername.addEventListener('keyup', function (event) {
            if (event.key === 'Enter') {
                handleLogin();
            }
        });
    }

    // Event listener for Enter key press on password field
    if (loginPassword) {
        loginPassword.addEventListener('keyup', function (event) {
            if (event.key === 'Enter') {
                handleLogin();
            }
        });
    }

    // Populate employee dropdown for reset password modal
    populateEmployeeDropdown();

    // Attach event listener for employee details reset password button
    const resetPasswordBtn = document.querySelector('#employeeDetails button[data-bs-target="#employeeResetPasswordModal"]');
    if (resetPasswordBtn) {
        resetPasswordBtn.addEventListener('click', openEmployeeResetPasswordModal);
    }

    // Removed login page password toggle icon listener as the icon is removed
    // The function remains for the reset password modal where the icon is still present.
    // const passwordToggleIcon = document.getElementById('passwordToggleIcon');
    // if (passwordToggleIcon) {
    //     passwordToggleIcon.addEventListener('click', function () {
    //         togglePasswordVisibility('loginPassword', this);
    //     });
    // }

    // Attach event listeners for password toggle icons in reset password modal (still needed here)
    document.querySelectorAll('#employeeResetPasswordModal .password-toggle-icon').forEach(icon => {
        icon.addEventListener('click', function () {
            const targetId = this.previousElementSibling.id;
            togglePasswordVisibility(targetId, this);
        });
    });

    // Handle form submission for employee password reset
    const resetPasswordForm = document.getElementById('employeeResetPasswordModal').querySelector('form');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', function (event) {
            event.preventDefault();
            performEmployeePasswordReset();
        });
    }

    // Set initial footer update time
    document.getElementById('footerLastUpdated').textContent = getISTTime();
    // Set initial help docs last reviewed time
    document.getElementById('helpDocsLastReviewed').textContent = getISTTime();


    // Request notification permission (optional, for native browser notifications)
    requestNotificationPermission();
};

/**
 * Requests notification permission from the user.
 */
function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                notificationPermissionGranted = true;
                console.log('Notification permission granted.');
            } else {
                notificationPermissionGranted = false;
                console.warn('Notification permission denied.');
            }
        }).catch(error => {
            console.error('Error requesting notification permission:', error);
        });
    }
}

/**
 * Initializes the dashboard content and starts periodic updates.
 */
function initializeDashboard() {
    // Initial data loads
    updateSystemHealth();
    updateStatus();
    updateComplianceUpdates();
    updateAnalytics();
    updateAlerts();
    updateDetailedMetrics();
    updateReviewQueue(); // Initial load for review queue
    loadEmployeeDetails(); // Load employee data into the table
    loadChartJS(); // Load main compliance chart
    loadRiskTimelineChart(); // Load risk timeline chart

    // Start periodic updates (every 5 seconds)
    if (updateInterval) clearInterval(updateInterval); // Clear any existing interval
    updateInterval = setInterval(() => {
        updateSystemHealth();
        updateStatus();
        updateComplianceUpdates();
        updateAnalytics();
        updateAlerts();
        updateDetailedMetrics();
        updateReviewQueue();
    }, 5000); // Update every 5 seconds

    // Set initial active secondary nav item
    document.querySelector('.secondary-nav-item.active')?.classList.remove('active');
    document.querySelector('.secondary-nav-item[href="#system-status-overview"]')?.classList.add('active');
}

/**
 * Dynamically loads employee details into the table.
 */
function loadEmployeeDetails() {
    const tableBody = document.getElementById('employeeTableBody');
    if (tableBody) {
        tableBody.innerHTML = employeeData.map(emp => `
            <tr>
                <td>${sanitizeHTML(emp.id)}</td>
                <td>${sanitizeHTML(emp.name)}</td>
                <td>${sanitizeHTML(emp.department)}</td>
                <td>${sanitizeHTML(emp.role)}</td>
                <td>${sanitizeHTML(emp.status)}</td>
                <td>
                    <button class="button-small bg-blue-500 text-white hover:bg-blue-600" onclick="alert('Viewing details for ${emp.name}')">View</button>
                    <button class="button-small bg-yellow-500 text-white hover:bg-yellow-600 ml-2" onclick="openEmployeeResetPasswordModalFor('${emp.id}')">Reset Password</button>
                </td>
            </tr>
        `).join('');
    }
}

/**
 * Opens the reset password modal pre-selecting the employee.
 * @param {string} employeeId - The ID of the employee to pre-select.
 */
function openEmployeeResetPasswordModalFor(employeeId) {
    populateEmployeeDropdown(); // Ensure dropdown is populated
    document.getElementById('employeeIdToReset').value = employeeId; // Pre-select the employee
    openModal('employeeResetPasswordModal');
}


// Clean up interval and charts on page unload
window.addEventListener('unload', () => {
    if (updateInterval) clearInterval(updateInterval);
    if (chart) chart.destroy();
    // deepDiveChart is removed, so no need to destroy it here
    if (riskTimelineChart) riskTimelineChart.destroy();
});

// Event listener for search bar to hide recommendations when clicking outside
document.addEventListener('click', function (event) {
    const searchBar = document.getElementById('searchBar');
    const searchRecommendations = document.getElementById('searchRecommendations');
    if (searchBar && searchRecommendations && !searchBar.contains(event.target) && !searchRecommendations.contains(event.target)) {
        hideSearchRecommendations();
    }
});

// Event listener for notification dropdown to hide when clicking outside
document.addEventListener('click', function (event) {
    const notificationBell = document.querySelector('.notification-bell');
    const notificationDropdown = document.getElementById('notificationDropdown');
    if (notificationBell && notificationDropdown && !notificationBell.contains(event.target) && !notificationDropdown.contains(event.target)) {
        notificationDropdown.classList.remove('active');
    }
});

// Event listener for user dropdown to hide when clicking outside
document.addEventListener('click', function (event) {
    const userIconContainer = document.querySelector('.user-icon-container');
    const userDropdown = document.getElementById('userDropdown');
    if (userIconContainer && userDropdown && !userIconContainer.contains(event.target) && !userDropdown.contains(event.target)) {
        userDropdown.classList.remove('active');
    }
});

// Event listener for modals to close when clicking outside of modal-content
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function (event) {
        if (event.target === modal) {
            closeModal(modal.id);
        }
    });
});

// Ensure the landing screen is shown directly on load
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('landingScreen').classList.remove('hidden');
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('appContainer').classList.add('hidden');
});

