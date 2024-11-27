document.addEventListener("DOMContentLoaded", function () {
    const bookingForm = document.querySelector("form");
    const dateInput = document.getElementById("reservation-date");
    const guestsSelect = document.getElementById("people");
    const checkTimesButton = document.getElementById("check-times-button");
    const availableTimesContainer = document.getElementById("available-times-container");
    const availableTimesSelect = document.getElementById("available-times");

    checkTimesButton.addEventListener("click", async function () {
        const selectedDate = dateInput.value;
        const selectedGuests = guestsSelect.value;

        if (!selectedDate || !selectedGuests) {
            alert("Please select a date and the number of people first.");
            return;
        }

        try {
            const availableTimes = await getAvailableTimes(selectedDate);
            populateAvailableTimes(availableTimes);
        } catch (error) {
            console.error("Error fetching available times:", error);
            alert("Unable to fetch available times. Please try again later.");
        }
    });

    async function getAvailableTimes(date) {
        const response = await fetch("http://localhost:3000/reservations");
        const reservations = await response.json();

        const filteredReservations = reservations.filter(
            reservation => reservation.reservationDate === date
        );

        const allTimes = ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30"];
        const occupiedTimes = filteredReservations.map(reservation => reservation.reservationTime);

        return allTimes.filter(time => !occupiedTimes.includes(time));
    }

    function populateAvailableTimes(times) {
        availableTimesSelect.innerHTML = '<option value="" disabled selected>Select available time</option>';
        if (times.length > 0) {
            times.forEach(time => {
                const option = document.createElement("option");
                option.value = time;
                option.textContent = time;
                availableTimesSelect.appendChild(option);
            });
            availableTimesContainer.style.display = "block";
        } else {
            alert("No available times for the selected date.");
            availableTimesContainer.style.display = "none";
        }
    }

    bookingForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const selectedDate = dateInput.value;
        const selectedTime = availableTimesSelect.value;

        if (!selectedTime) {
            alert("Please select an available time before submitting.");
            return;
        }

        const bookingDetails = {
            fullName: document.getElementById("fName").value,
            emailAddress: document.getElementById("fEmail").value,
            phoneNumber: document.getElementById("phone").value,
            guestCount: parseInt(guestsSelect.value),
            reservationDate: selectedDate,
            reservationTime: selectedTime,
            additionalInfo: document.querySelector("textarea[name='asking']").value
        };

        try {
            await saveBooking(bookingDetails);
            alert("Your table has been successfully booked!");
            bookingForm.reset();
            availableTimesContainer.style.display = "none";
        } catch (error) {
            console.error("Error during booking:", error);
            alert("Unable to complete the booking. Please try again later.");
        }
    });

    async function saveBooking(details) {
        const response = await fetch("http://localhost:3000/reservations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(details)
        });

        const result = await response.json();
        console.log("Booking confirmation:", result);
    }

    async function updateBooking(id, updatedDetails) {
        try {
            const response = await fetch(`http://localhost:3000/reservations/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedDetails)
            });

            const result = await response.json();
            console.log("Updated booking:", result);
            alert("Booking updated successfully!");
        } catch (error) {
            console.error("Error updating booking:", error);
            alert("Unable to update the booking. Please try again later.");
        }
    }

    async function deleteBooking(id) {
        try {
            const response = await fetch(`http://localhost:3000/reservations/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                console.log("Booking deleted.");
                alert("Booking deleted successfully!");
            } else {
                alert("Failed to delete the booking. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting booking:", error);
            alert("Unable to delete the booking. Please try again later.");
        }
    }
});
