const form = document.getElementById("form");
const modal = document.getElementById("successModal");
const closeModal = document.getElementById("closeModal");
const closeModalBtn = document.getElementById("closeModalBtn");

let redirected = false;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const course = document.getElementById("course").value;
  const cohort = document.getElementById("cohort").value;
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();

  const formData = {
    name: `${firstName} ${lastName}`,
    email,
    phone,
    course: `${course} - ${cohort}`
  };

  try {
    const response = await fetch("/api/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    console.log("API response:", data);

    if (response.ok) {
      form.reset();
      modal.classList.remove("hidden");

      // ✅ Countdown + Redirect
      let timeLeft = 3;
      const redirectText = document.getElementById("redirectText");

      const countdown = setInterval(() => {
        timeLeft--;

        if (redirectText) {
          redirectText.textContent = `Redirecting you to WhatsApp in ${timeLeft} seconds...`;
        }

        if (timeLeft <= 0) {
          clearInterval(countdown);

          if (!redirected) {
            redirected = true;
            window.open("https://chat.whatsapp.com/HSpmuCRldp1FooyDYatmBF", "_blank");
          }
        }
      }, 1000);

    } else {
      alert(data.message || "Submission failed");
    }

  } catch (error) {
    console.error("Frontend error:", error);
    alert("Error submitting form");
  }
});

// ❌ Close modal (X button)
closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// ❌ Close modal (button)
closeModalBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// ❌ Close when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});