// Import EmailJS
import emailjs from "@emailjs/browser";

// Initialize EmailJS
try {
  emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
} catch (error) {
  console.error("EmailJS initialization failed:", error);
}

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Phone number formatting
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    console.log("Phone input element found, attaching handlers");

    phoneInput.addEventListener("input", function (e) {
      // Remove all non-digit characters
      let value = this.value.replace(/\D/g, "");

      // Format phone number with parentheses
      if (value.length > 0) {
        if (value.length <= 3) {
          // Format: (123
          this.value = "(" + value;
        } else if (value.length <= 6) {
          // Format: (123) 456
          this.value = "(" + value.substring(0, 3) + ") " + value.substring(3);
        } else {
          // Format: (123) 456-7890
          this.value =
            "(" +
            value.substring(0, 3) +
            ") " +
            value.substring(3, 6) +
            "-" +
            value.substring(6, 10);
        }
      }

      // Limit to 10 digits (plus formatting)
      if (value.length > 10) {
        value = value.substring(0, 10);
        this.value =
          "(" +
          value.substring(0, 3) +
          ") " +
          value.substring(3, 6) +
          "-" +
          value.substring(6);
      }
    });

    // Prevent non-numeric input
    phoneInput.addEventListener("keypress", function (e) {
      // Allow only digits (0-9) and control keys
      if (
        !/^\d$/.test(e.key) &&
        !e.ctrlKey &&
        !e.metaKey &&
        e.key !== "Backspace" &&
        e.key !== "Delete" &&
        e.key !== "Tab"
      ) {
        e.preventDefault();
        console.log("Prevented non-numeric input: ", e.key);
      }
    });
  } else {
    console.error("Phone input element not found");
  }

  // Handle form submission
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
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
  } else {
    console.error("Contact form element not found");
  }
});
