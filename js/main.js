// Main page functionality - index.html

// Track Subscribe Click
function trackSubscribeClick() {
    trackConversion('SubscribedButtonClickt', {
        content_name: 'First Customer System',
        content_type: 'product',
        value: 17,
        currency: 'USD',
        content_ids: ['FCS-001']
    });
}

// Carousel functionality
(function() {
    const slidesContainer = document.getElementById('carouselSlides');
    const slides = slidesContainer.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carouselDots');
    let currentIndex = 0;
    const totalSlides = slides.length;

    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.dataset.index = i;
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentIndex = index;
        slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    }

    function nextSlide() { goToSlide(currentIndex + 1); }
    function prevSlide() { goToSlide(currentIndex - 1); }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
    });

    let touchStartX = 0,
        touchEndX = 0;
    const carousel = document.querySelector('.carousel-container');
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
    });

    window.goToSlide = goToSlide;
})();

// Show success area after purchase (demo)
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.search.includes('success=1')) {
        document.getElementById('successArea').style.display = 'block';
        setTimeout(() => {
            document.getElementById('successArea').scrollIntoView({ behavior: 'smooth' });
        }, 300);
    }
});

// Expose functions globally
window.trackSubscribeClick = trackSubscribeClick;