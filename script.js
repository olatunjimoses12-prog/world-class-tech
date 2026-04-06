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

await fetch("/api/apply", {

method: "POST",

headers: {
"Content-Type": "application/json"
},

body: JSON.stringify(formData)

});

alert("Application Submitted Successfully!");

} catch (error) {

alert("Error submitting form");

}

});