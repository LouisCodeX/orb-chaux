// JS for mobile navigation toggle, multi-step form, gallery filtering and project modals
document.addEventListener('DOMContentLoaded', function () {
  // Apple-style scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe all sections for fade-in animations
  document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
  });

  // Observe cards for scale-in animations
  document.querySelectorAll('.promise-card, .gallery-item, .service-card, .faq-item').forEach(card => {
    card.classList.add('scale-in');
    observer.observe(card);
  });

  // Realistic painting movement simulation for paint roller
  const heroImage = document.querySelector('.hero-image img');
  const heroImageContainer = document.querySelector('.hero-image');
  
  if (heroImage && heroImageContainer) {
    let hasTriggeredSplatter = false;
    let paintingProgress = 0;
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const maxScroll = 800; // Total scroll distance for full painting motion
      
      // Calculate painting progress (0 to 1)
      paintingProgress = Math.min(scrolled / maxScroll, 1);
      
      // Simulate painting movement: roller moves horizontally while painting
      const horizontalMovement = paintingProgress * 60; // Move 60px horizontally
      const verticalMovement = Math.sin(paintingProgress * Math.PI * 2) * 8; // Subtle up/down motion
      const slightRotation = Math.sin(paintingProgress * Math.PI * 4) * 3; // Small rotation for realism
      
      // Apply the painting motion
      heroImage.style.transform = `
        translateX(${horizontalMovement}px) 
        translateY(${verticalMovement}px) 
        rotate(${slightRotation}deg)
      `;
      
      // Trigger paint splatter effect after some painting progress
      if (paintingProgress > 0.1 && !hasTriggeredSplatter) {
        heroImageContainer.classList.add('scrolled');
        hasTriggeredSplatter = true;
      }
    });
  }
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
        // Validate current step before proceeding
        if (currentStep === 0) {
          // Step 1: ensure at least one project type is selected
          const checked = form.querySelectorAll('input[name="type"]:checked');
          if (!checked.length) {
            alert('Veuillez sélectionner au moins un type de projet.');
            return;
          }
        }
        if (currentStep === 1) {
          // Step 2: ensure surface has a value
          const surfaceInput = form.querySelector('input[name="surface"]');
          if (surfaceInput && surfaceInput.value.trim() === '') {
            alert('Veuillez indiquer la surface en mètres carrés.');
            return;
          }
        }
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

  // Project definitions for modals
  const projects = {
    sejour: {
      title: 'Séjour contemporain',
      location: 'Sérignan',
      context: 'Rénovation complète d’un séjour avec mise en valeur des volumes et application de teintes pastel sur les murs.',
      teintes: 'Murs : RAL 9016 mat ; Boiseries : NCS S0502-Y',
      produits: 'Peintures écologiques sans COV',
      delais: '5 jours',
      surface: '32 m²',
      images: ['serignan.jpg']
    },
    cuisine: {
      title: 'Cuisine épurée',
      location: 'Marseillan',
      context: 'Rafraîchissement d’une cuisine mansardée avec réfection des placards et plans de travail.',
      teintes: 'Placards : RAL 6021 satiné ; Crédence : NCS S2500-N',
      produits: 'Laques résistantes à l’humidité',
      delais: '4 jours',
      surface: '18 m²',
      images: ['kitchen-close.webp', 'kitchen-living.webp']
    },
    facade: {
      title: 'Façade ensoleillée',
      location: 'Béziers',
      context: 'Réfection d’une façade R+2 avec badigeon à la chaux et volets huilés.',
      teintes: 'Façade : RAL 3012 pêche ; Volets : RAL 6027 turquoise',
      produits: 'Badigeon de chaux aérienne et huiles naturelles',
      delais: '7 jours',
      surface: '85 m²',
      images: ['facade.webp']
    }
  };

  // Modal handling
  const modal = document.getElementById('project-modal');
  const modalBody = modal ? modal.querySelector('.modal-body') : null;
  const modalClose = modal ? modal.querySelector('.modal-close') : null;

  function openModal(key) {
    if (!modal || !modalBody) return;
    const project = projects[key];
    if (!project) return;
    let html = `<h3>${project.title} — ${project.location}</h3>`;
    if (project.images && project.images.length) {
      html += '<div class="modal-images">';
      project.images.forEach((img) => {
        html += `<img src="${img}" alt="${project.title}">`;
      });
      html += '</div>';
    }
    html += `<p><strong>Contexte :</strong> ${project.context}</p>`;
    html += `<p><strong>Teintes :</strong> ${project.teintes}</p>`;
    html += `<p><strong>Produits :</strong> ${project.produits}</p>`;
    html += `<p><strong>Délais :</strong> ${project.delais}</p>`;
    html += `<p><strong>Surface :</strong> ${project.surface}</p>`;
    modalBody.innerHTML = html;
    modal.removeAttribute('hidden');
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    if (!modal) return;
    modal.setAttribute('hidden', '');
    document.body.classList.remove('modal-open');
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Attach modal open handlers to gallery items
  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const key = item.dataset.project;
      openModal(key);
    });
  });
});
