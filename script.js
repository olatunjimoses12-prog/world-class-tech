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

      // 🔥 RESET MODAL + ANIMATION CLASS
      modal.classList.add("hidden");
      modal.classList.remove("animate");

      // force reflow (important)
      void modal.offsetWidth;

      // 🔥 SHOW MODAL + TRIGGER ANIMATION
      modal.classList.remove("hidden");
      modal.classList.add("animate");

      // ✅ WHATSAPP REDIRECT (MOBILE SAFE)
      setTimeout(() => {
        window.open("https://chat.whatsapp.com/HSpmuCRldp1FooyDYatmBF", "_self");
      }, 3000);

    } else {
      alert(data.message || "Submission failed");
    }

  } catch (error) {
    console.error("Frontend error:", error);
    alert("Error submitting form");
  }
});


// ✅ CLOSE MODAL (X BUTTON)
closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// ✅ CLOSE MODAL (BUTTON)
closeModalBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// ✅ CLICK OUTSIDE TO CLOSE
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});