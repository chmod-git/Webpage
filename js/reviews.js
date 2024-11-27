async function fetchReviews() {
    const reviewsData = document.querySelector(".cards");
    const response = await fetch("http://localhost:3000/reviews");
    const reviews = await response.json();

    reviews.forEach((review, index) => {
        const reviewItem = newPersonReview(review);
        reviewsData.appendChild(reviewItem);
    });
}

function newPersonReview(review) {
    const reviewItem = document.createElement("div");
    reviewItem.classList.add("card");

    reviewItem.innerHTML = `
        <div class="card-img">
            <img src="${review.source}"/>
        </div>
        <div class="card-name">${review.customer}</div>
        <div class="card-description">
            <p>${review.text}</p>
        </div>
        <div class="card-bottom-text">
            <p>${"&#11088;".repeat(review.rating)}</p>
        </div>
    `;

    return reviewItem;
}

document.addEventListener("DOMContentLoaded", fetchReviews);
