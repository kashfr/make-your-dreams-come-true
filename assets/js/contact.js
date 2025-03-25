// Import EmailJS
import emailjs from "@emailjs/browser";
// Instead of importing imask from npm, use it from CDN
// import IMask from "imask";

// Initialize EmailJS
try {
  emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
} catch (error) {
  console.error("EmailJS initialization failed:", error);
}

// Dynamically load IMask from CDN
function loadIMaskFromCDN() {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/imask@7.6.1/dist/imask.min.js";
    script.onload = () => resolve(window.IMask);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * Initialize phone input masking
 */
async function initPhoneInput() {
  const phoneInput = document.getElementById("phone");
  if (!phoneInput) {
    console.error("Phone input element not found");
    // Try again later
    setTimeout(initPhoneInput, 300);
    return;
  }

  try {
    // Load IMask from CDN
    const IMask = await loadIMaskFromCDN();

    // Create mask instance for US phone format
    const phoneMask = IMask(phoneInput, {
      mask: "(000) 000-0000",
      lazy: false, // make placeholder always visible
      placeholderChar: "_",
    });

    console.log("Phone mask initialized successfully");
  } catch (error) {
    console.error("Failed to initialize phone mask:", error);
  }
}

/**
 * Initialize contact form submission
 */
function initContactForm() {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) {
    console.error("Contact form element not found");
    // Try again later
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
      console.error("EmailJS error:", error);
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
 * Initialize everything as soon as possible in multiple ways
 * to maximize compatibility across different environments
 */
function initAll() {
  try {
    initPhoneInput();
    initContactForm();
    console.log("Form initialization complete");
  } catch (error) {
    console.error("Error during initialization:", error);
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAll);
} else {
  // DOM already loaded, initialize now
  initAll();
}
