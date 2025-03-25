// Import EmailJS
import emailjs from "@emailjs/browser";

// Initialize EmailJS
try {
  emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
} catch (error) {
  console.error("EmailJS initialization failed:", error);
}

// Function to format phone numbers
function formatPhoneNumber(value) {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, "");

  // Format based on length
  if (digits.length <= 3) {
    return digits.length ? `(${digits}` : "";
  } else if (digits.length <= 6) {
    return `(${digits.substring(0, 3)}) ${digits.substring(3)}`;
  } else {
    return `(${digits.substring(0, 3)}) ${digits.substring(
      3,
      6
    )}-${digits.substring(6, 10)}`;
  }
}

// Initialize phone input formatting
function initPhoneFormatting() {
  const phoneInput = document.getElementById("phone");

  if (!phoneInput) {
    console.error("Phone input element not found");
    // Try again in 500ms - sometimes elements aren't immediately available
    setTimeout(initPhoneFormatting, 500);
    return;
  }

  console.log("Phone input element found, attaching handlers");

  // Store the cursor position for better UX when typing
  let cursorPosition = 0;

  // Handle input event
  phoneInput.addEventListener("input", function (e) {
    // Save cursor position
    cursorPosition = this.selectionStart;

    // Get input value and remove non-digits
    const value = this.value;
    const digits = value.replace(/\D/g, "").substring(0, 10);

    // Format and set the value
    const formattedValue = formatPhoneNumber(digits);

    // Only update if value changed to prevent cursor jumping
    if (this.value !== formattedValue) {
      this.value = formattedValue;

      // Adjust cursor position based on formatting changes
      if (cursorPosition === value.length) {
        // If cursor was at the end, keep it at the end
        this.setSelectionRange(formattedValue.length, formattedValue.length);
      } else {
        // Try to maintain cursor position relative to digits
        this.setSelectionRange(cursorPosition, cursorPosition);
      }
    }
  });

  // Use keydown to handle special keys and prevent non-numeric input
  phoneInput.addEventListener("keydown", function (e) {
    // Don't block control keys or navigation
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    // Allow: backspace, delete, tab, escape, arrow keys, home, end
    if ([8, 9, 27, 46, 37, 38, 39, 40, 35, 36].indexOf(e.keyCode) !== -1)
      return;

    // Block non-numeric keys except function keys F1-F12
    if (
      (e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105) &&
      (e.keyCode < 112 || e.keyCode > 123)
    ) {
      e.preventDefault();
      console.log("Prevented non-numeric input: ", e.key);
    }
  });

  // Ensure proper formatting on blur
  phoneInput.addEventListener("blur", function () {
    const digits = this.value.replace(/\D/g, "");
    if (digits.length > 0 && digits.length < 10) {
      // If incomplete number, normalize format
      this.value = formatPhoneNumber(digits);
    }
  });
}

// Try both approaches for maximum compatibility
// 1. Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded fired");
  initPhoneFormatting();
  initContactForm();
});

// 2. Also try immediate initialization if the document is already loaded
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  console.log("Document already loaded, initializing immediately");
  setTimeout(function () {
    initPhoneFormatting();
    initContactForm();
  }, 1);
}

// Handle form submission
function initContactForm() {
  const contactForm = document.getElementById("contact-form");

  if (!contactForm) {
    console.error("Contact form element not found");
    // Try again in 500ms - sometimes elements aren't immediately available
    setTimeout(initContactForm, 500);
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
