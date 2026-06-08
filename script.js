/* ============================================================
   ETS - Ehtisham Technical Services | script.js
   ============================================================
   SECTIONS:
   1. Navbar scroll effect
   2. Mobile hamburger menu
   3. Smooth anchor scrolling
   4. Scroll fade-up animations
   5. Booking form submit
   6. Complaint form submit
   7. Star rating system
   8. Feedback / review submit
   9. Toast notification
   ============================================================ */


// ============================================================
// 1. NAVBAR — Add shadow when user scrolls down
// ============================================================
window.addEventListener('scroll', function () {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 20) {
    navbar.style.boxShadow = '0 4px 30px rgba(26,58,143,0.18)';
  } else {
    navbar.style.boxShadow = '0 2px 20px rgba(26,58,143,0.12)';
  }
});


// ============================================================
// 2. MOBILE HAMBURGER MENU — Toggle open/close
// ============================================================
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

// Toggle when hamburger is clicked
hamburger.addEventListener('click', function (e) {
  e.stopPropagation();
  mobileMenu.classList.toggle('open');
});

// Close when any mobile menu link is clicked
mobileMenu.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () {
    mobileMenu.classList.remove('open');
  });
});

// Close when clicking anywhere outside the menu
document.addEventListener('click', function (e) {
  if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
    mobileMenu.classList.remove('open');
  }
});


// ============================================================
// 3. SMOOTH SCROLLING — Offset for fixed navbar height
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offsetTop = target.offsetTop - 70; // 70px = navbar height
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  });
});


// ============================================================
// 4. FADE-UP SCROLL ANIMATIONS
//    Elements with class "fade-up" animate in when visible
// ============================================================
const fadeObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.fade-up').forEach(function (el) {
  fadeObserver.observe(el);
});


// ============================================================
// 5. BOOKING FORM — Validate & submit
// ============================================================
const bookingForm = document.getElementById('bookingForm');

bookingForm.addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent page reload

  // Get values
  const name    = document.getElementById('b_name').value.trim();
  const phone   = document.getElementById('b_phone').value.trim();
  const area    = document.getElementById('b_area').value;
  const service = document.getElementById('b_service').value;

  // Basic validation
  if (!name || !phone || !area || !service) {
    showToast('⚠️ Please fill all required fields.');
    return;
  }

  // Show success message
  const successMsg = document.getElementById('bookingSuccess');
  successMsg.style.display = 'block';

  // Reset form
  bookingForm.reset();

  // Show toast
  showToast('✅ Booking request sent successfully!');

  // Hide success message after 5 seconds
  setTimeout(function () {
    successMsg.style.display = 'none';
  }, 5000);
});


// ============================================================
// 6. COMPLAINT FORM — Validate & submit
// ============================================================
const complaintForm = document.getElementById('complaintForm');

complaintForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const name  = document.getElementById('c_name').value.trim();
  const phone = document.getElementById('c_phone').value.trim();
  const type  = document.getElementById('c_type').value;
  const desc  = document.getElementById('c_desc').value.trim();

  if (!name || !phone || !type || !desc) {
    showToast('⚠️ Please fill all required fields.');
    return;
  }

  const successMsg = document.getElementById('complaintSuccess');
  successMsg.style.display = 'block';
  complaintForm.reset();
  showToast('📨 Complaint submitted. Manager will contact you soon.');

  setTimeout(function () {
    successMsg.style.display = 'none';
  }, 5000);
});


// ============================================================
// 7. STAR RATING SYSTEM
// ============================================================
let selectedRating = 0;

const starButtons = document.querySelectorAll('.star-btn');

starButtons.forEach(function (btn) {
  btn.addEventListener('click', function () {
    selectedRating = parseInt(this.getAttribute('data-val'));
    updateStars(selectedRating);
  });

  // Hover preview
  btn.addEventListener('mouseenter', function () {
    updateStars(parseInt(this.getAttribute('data-val')));
  });
});

// Reset to selected on mouse leave
document.getElementById('starsInput').addEventListener('mouseleave', function () {
  updateStars(selectedRating);
});

// Helper: highlight stars up to given value
function updateStars(val) {
  starButtons.forEach(function (btn) {
    const btnVal = parseInt(btn.getAttribute('data-val'));
    btn.classList.toggle('active', btnVal <= val);
  });
}


// ============================================================
// 8. FEEDBACK / REVIEW SUBMIT
// ============================================================
document.getElementById('submitFeedbackBtn').addEventListener('click', function () {

  const name    = document.getElementById('fbName').value.trim();
  const text    = document.getElementById('fbText').value.trim();
  const service = document.getElementById('fbService').value.trim();
  const imgFile = document.getElementById('fbImage').files[0];

  // Validation
  if (!name) {
    showToast('⚠️ Please enter your name.');
    return;
  }
  if (selectedRating === 0) {
    showToast('⚠️ Please select a star rating.');
    return;
  }
  if (!text) {
    showToast('⚠️ Please write your feedback.');
    return;
  }

  // Build star display string
  const starsDisplay = '★'.repeat(selectedRating) + '☆'.repeat(5 - selectedRating);

  // Create new review card
  const card = document.createElement('div');
  card.className = 'feedback-card';

  card.innerHTML =
    '<div class="feedback-card-top">' +
      '<div class="feedback-avatar">' + name.charAt(0).toUpperCase() + '</div>' +
      '<div>' +
        '<div class="feedback-card-name">' + name + (service ? ' — ' + service : '') + '</div>' +
        '<div class="feedback-stars">' + starsDisplay + '</div>' +
      '</div>' +
    '</div>' +
    '<p class="feedback-text">' + text + '</p>';

  // If image uploaded, show it in the card
  if (imgFile) {
    const reader = new FileReader();
    reader.onload = function (ev) {
      const img = document.createElement('img');
      img.src = ev.target.result;
      img.className = 'feedback-img';
      card.appendChild(img);
    };
    reader.readAsDataURL(imgFile);
  }

  // Add card at top of reviews list
  const feedbackCards = document.getElementById('feedbackCards');
  feedbackCards.insertBefore(card, feedbackCards.firstChild);

  // Reset form fields
  document.getElementById('fbName').value    = '';
  document.getElementById('fbText').value    = '';
  document.getElementById('fbService').value = '';
  document.getElementById('fbImage').value   = '';
  selectedRating = 0;
  updateStars(0);

  showToast('⭐ Thank you for your review!');
});


// ============================================================
// 9. TOAST NOTIFICATION — Show bottom-right pop message
// ============================================================
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(function () {
    toast.classList.remove('show');
  }, 3500);
}
