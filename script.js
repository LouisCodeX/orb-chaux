// JS for mobile navigation toggle and multi-step contact form
document.addEventListener('DOMContentLoaded', function () {
  // Menu toggle logic
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });

  // Multi-step form logic
  const form = document.getElementById('devis-form');
  if (form) {
    const steps = form.querySelectorAll('.form-step');
    let currentStep = 0;
    const showStep = (index) => {
      steps.forEach((step, i) => {
        step.hidden = i !== index;
      });
    };
    showStep(currentStep);
    const nextButtons = form.querySelectorAll('.next-btn');
    nextButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (currentStep < steps.length - 1) {
          currentStep++;
          showStep(currentStep);
        }
      });
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Merci ! Votre demande a été envoyée. Vous recevrez un devis sous 24 h.');
      form.reset();
      currentStep = 0;
      showStep(currentStep);
    });
  }

  // Gallery filtering logic
  const chips = document.querySelectorAll('.chip');
  const galleryItems = document.querySelectorAll('.gallery-item');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.dataset.filter;
      galleryItems.forEach((item) => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
});