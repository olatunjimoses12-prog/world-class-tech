document
  .getElementById("form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      course: e.target.course.value
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

      if (response.ok) {
        alert("Application Submitted Successfully!");
        e.target.reset();
      } else {
        alert("Submission failed: " + data.message);
      }

    } catch (error) {
      alert("Error submitting form");
    }
  });