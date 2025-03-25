/**
 * Contact form handling with EmailJS
 *
 * This script handles phone number validation and formatting
 * and submits the form using EmailJS.
 */

// EmailJS configuration
const EMAILJS_PUBLIC_KEY = "9YiWD6lOZXmFmrbYA";
const EMAILJS_SERVICE_ID = "service_bx73ty1";
const EMAILJS_TEMPLATE_ID = "template_vt0s1t6";

// Initialize EmailJS when the script loads
(function () {
  if (typeof emailjs !== "undefined") {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  } else {
    console.error("EmailJS not loaded");
  }
})();

/**
 * Initialize phone input formatting
 */
function initPhoneInput() {
  const phoneInput = document.getElementById("phone");
  if (!phoneInput) {
    setTimeout(initPhoneInput, 300);
    return;
  }

  // Format function
  function formatPhoneNumber(input) {
    // Strip all non-numeric characters
    const numbers = input.replace(/\D/g, "");

    // Format based on length
    if (numbers.length <= 3) {
      return numbers.length ? `(${numbers}` : "";
    } else if (numbers.length <= 6) {
      return `(${numbers.substring(0, 3)}) ${numbers.substring(3)}`;
    } else {
      return `(${numbers.substring(0, 3)}) ${numbers.substring(
        3,
        6
      )}-${numbers.substring(6, 10)}`;
    }
  }

  // Input event handler
  phoneInput.addEventListener("input", function (e) {
    // Store cursor position
    const cursorPos = this.selectionStart;
    const oldValue = this.value;
    const oldLength = oldValue.length;

    // Format the value
    const cleaned = this.value.replace(/\D/g, "").substring(0, 10);
    this.value = formatPhoneNumber(cleaned);

    // Adjust cursor position if needed
    if (cursorPos === oldLength) {
      // If cursor was at the end, keep it at the end
      this.setSelectionRange(this.value.length, this.value.length);
    } else if (this.value.length > 0) {
      // Try to maintain cursor position
      this.setSelectionRange(cursorPos, cursorPos);
    }
  });

  // Block non-numeric keys directly in keydown event
  phoneInput.addEventListener("keydown", function (e) {
    // Always allow: navigation keys, tab, backspace, delete
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      "Home",
      "End",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
    ];

    // Allow control/cmd key combinations (copy, paste, etc)
    if (e.ctrlKey || e.metaKey) return;

    // Allow navigation keys
    if (allowedKeys.includes(e.key)) return;

    // Block any non-numeric keys
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  });
}

/**
 * Initialize contact form submission
 */
function initContactForm() {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) {
    setTimeout(initContactForm, 300);
    return;
  }

  contactForm.addEventListener("submit", async function (event) {
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
      phone: document.getElementById("phone").value.trim(),
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

    // Check if EmailJS is loaded
    if (typeof emailjs === "undefined") {
      errorMessage.textContent =
        "Email service not available. Please try again later.";
      errorMessage.style.display = "inline";
      submitButton.value = originalValue;
      submitButton.disabled = false;
      return;
    }

    try {
      // Send the email using EmailJS
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formData);

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
}

/**
 * Initialize everything when the page loads
 */
document.addEventListener("DOMContentLoaded", function () {
  try {
    initPhoneInput();
    initContactForm();
  } catch (error) {
    console.error("Error during contact form initialization:", error);
  }
});
