// Initialize EmailJS
try {
  emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
} catch (error) {
  console.error("EmailJS initialization failed:", error);
}

// Handle form submission
document
  .getElementById("contact-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // Show loading state
    const submitButton = this.querySelector('input[type="submit"]');
    const successMessage = document.getElementById("success-message");
    const errorMessage = document.getElementById("error-message");
    const originalValue = submitButton.value;

    // Reset messages
    successMessage.style.display = "none";
    errorMessage.style.display = "none";

    // Show loading state
    submitButton.value = "Sending...";
    submitButton.disabled = true;

    // Get the form data
    const formData = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      message: document.getElementById("message").value.trim(),
      time: new Date().toLocaleString(), // Add timestamp to the email
    };

    // Validate form data
    if (!formData.name || !formData.email || !formData.message) {
      errorMessage.textContent = "Please fill in all fields.";
      errorMessage.style.display = "inline";
      submitButton.value = originalValue;
      submitButton.disabled = false;
      return;
    }

    try {
      // Send the email using EmailJS
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formData
      );

      // Show success message
      successMessage.style.display = "inline";
      errorMessage.style.display = "none";

      // Reset form
      document.getElementById("contact-form").reset();

      // Reset button state after 2 seconds
      setTimeout(() => {
        submitButton.value = originalValue;
        submitButton.disabled = false;
        // Hide success message after 5 seconds
        setTimeout(() => {
          successMessage.style.display = "none";
        }, 5000);
      }, 2000);
    } catch (error) {
      // Show error message
      errorMessage.textContent = "Failed to send message. Please try again.";
      errorMessage.style.display = "inline";
      successMessage.style.display = "none";
      submitButton.value = "Error! Try Again";
      submitButton.disabled = false;

      // Reset button text after 2 seconds
      setTimeout(() => {
        submitButton.value = originalValue;
      }, 2000);
    }
  });
