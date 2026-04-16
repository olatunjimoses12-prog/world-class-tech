const form = document.getElementById("form");
const modal = document.getElementById("successModal");
const closeModal = document.getElementById("closeModal");
const closeModalBtn = document.getElementById("closeModalBtn");

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

      // 🔥 RESET STATE
      modal.classList.remove("animate");
      modal.classList.add("hidden");

      // 🔥 RE-TRIGGER ANIMATION CLEANLY
      setTimeout(() => {
        modal.classList.remove("hidden");
        modal.classList.add("animate");
      }, 50);

      // ✅ MOBILE SAFE REDIRECT
      setTimeout(() => {
        window.location.href = "https://chat.whatsapp.com/HSpmuCRldp1FooyDYatmBF";
      }, 3000);

    } else {
      alert(data.message || "Submission failed");
    }

  } catch (error) {
    console.error("Frontend error:", error);
    alert("Error submitting form");
  }
});

// CLOSE MODAL (X)
closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
  modal.classList.remove("animate");
});

// CLOSE MODAL (BUTTON)
closeModalBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
  modal.classList.remove("animate");
});

// CLICK OUTSIDE
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
    modal.classList.remove("animate");
  }
});