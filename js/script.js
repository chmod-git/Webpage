document.addEventListener("DOMContentLoaded", function () {
  const dateInput = document.getElementById("reservation-date");

  dateInput.addEventListener("focus", function () {
    const today = new Date().toISOString().split("T")[0];
    dateInput.setAttribute("min", today);

    if (dateInput.type !== 'date') {
      dateInput.setAttribute('type', 'date');
    }
  });
});


