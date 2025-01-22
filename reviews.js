// Initialize the map and fetch reviews
function initMap() {
    const placeId = 'ChIJOSQ5B-RkcVMRYulwGYKCBlI'; // Your Place ID
    const service = new google.maps.places.PlacesService(document.createElement('div'));

    service.getDetails({
        placeId: placeId,
        fields: ['reviews', 'rating']
    }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            displayReviews(place.reviews, place.rating);
        } else {
            console.error(`Error fetching reviews: ${status}`);
            document.querySelector('#google-reviews').innerHTML = 
                '<p class="error-message">Unable to load reviews. Please check back later.</p>';
        }
    });
}

// Display reviews on the page
function displayReviews(reviews = [], overallRating = 0) {
    const container = document.querySelector('#google-reviews');
    const ratingSummary = document.querySelector('.rating-summary');

    // Update overall rating
    ratingSummary.innerHTML = `
        <div class="rating-stars">
            ${getStarRating(overallRating)}
        </div>
        <p>${overallRating.toFixed(1)} out of 5</p>
    `;

    // Handle case where no reviews are returned
    if (!reviews.length) {
        container.innerHTML = '<p class="no-reviews">No reviews available at this time.</p>';
        return;
    }

    // Display individual reviews
    container.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <img 
                    src="${review.profile_photo_url || 'images/default-avatar.png'}" 
                    alt="${review.author_name}"
                    class="reviewer-image">
                <div class="reviewer-info">
                    <h4>${review.author_name}</h4>
                    <div class="review-rating">
                        ${getStarRating(review.rating)}
                        <span class="review-rating-number">${review.rating.toFixed(1)} / 5</span>
                    </div>
                    <div class="review-date">${formatDate(review.time)}</div>
                </div>
            </div>
            <p class="review-text">${review.text || 'No review text available.'}</p>
        </div>
    `).join('');
}

// Generate star ratings as HTML
function getStarRating(rating) {
    const filledStars = Math.floor(rating); // Full stars
    const hasPartialStar = rating % 1 !== 0; // Check for partial star

    let starsHTML = '';

    // Add filled stars
    for (let i = 0; i < filledStars; i++) {
        starsHTML += '<i class="fas fa-star" style="color: #FFD700;"></i>';
    }

    // Add a half star if applicable
    if (hasPartialStar) {
        starsHTML += '<i class="fas fa-star-half-alt" style="color: #FFD700;"></i>';
    }

    // Add empty stars
    for (let i = filledStars + (hasPartialStar ? 1 : 0); i < 5; i++) {
        starsHTML += '<i class="far fa-star" style="color: #FFD700;"></i>';
    }

    return starsHTML;
}

// Format timestamp into a readable date
function formatDate(timestamp) {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}