function togglePasswordVisibility() {
    var passwordInput = document.getElementById("loginPassword");
    var toggleIcon = document.getElementById("togglePasswordIcon");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    }
}

function openHelpDocumentationModal() {
    var modal = document.getElementById('helpDocsModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}
