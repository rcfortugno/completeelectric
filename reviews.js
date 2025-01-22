// Create a file called reviews.js
function initMap() {
    const placeId = 'ChIJOSQ5B-RkcVMRYulwGYKCBlI'; // Your place ID
    const service = new google.maps.places.PlacesService(document.createElement('div'));
    
    service.getDetails({
        placeId: placeId,
        fields: ['reviews', 'rating']
    }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            displayReviews(place.reviews, place.rating);
        } else {
            console.error('Error fetching reviews:', status);
            document.querySelector('#google-reviews').innerHTML = 
                '<p class="error-message">Unable to load reviews. Please check back later.</p>';
        }
    });
}

function displayReviews(reviews, overallRating) {
    const container = document.querySelector('#google-reviews');
    const ratingSummary = document.querySelector('.rating-summary');
    
    // Update overall rating
    ratingSummary.innerHTML = `
        <div class="rating-stars">
            ${getStarRating(overallRating)}
        </div>
        <p>${overallRating.toFixed(1)} out of 5</p>
    `;

    // Display individual reviews
    container.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <img 
                    src="${review.profile_photo_url}" 
                    alt="${review.author_name}"
                    class="reviewer-image"
                    onerror="this.src='images/default-avatar.png'"
                >
                <div class="reviewer-info">
                    <h4>${review.author_name}</h4>
                    <div class="review-rating">
                        ${getStarRating(review.rating)}
                    </div>
                    <div class="review-date">${formatDate(review.time)}</div>
                </div>
            </div>
            <p class="review-text">${review.text || ''}</p>
        </div>
    `).join('');
}

function getStarRating(rating) {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
}

function formatDate(timestamp) {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}