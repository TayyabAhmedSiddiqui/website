/**
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos,
      behavior: 'smooth'
    })
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function (e) {
    select('body').classList.toggle('mobile-nav-active')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function (e) {
    if (select(this.hash)) {
      e.preventDefault()

      let body = select('body')
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Hero type effect
   */
  const typed = select('.typed')
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items')
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function (direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Load and render dynamic data
   */
  const loadData = async () => {
    try {
      const response = await fetch('assets/data.json');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
  
      renderProjects(data.projects);
      renderEducation(data.education);
      renderCertifications(data.certifications);
      renderTestimonials(data.testimonials);
      renderSkills(data.skills); // Add this line
  
      // Initialize Isotope after data is loaded
      initIsotopeFilters();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  /**
   * Render Projects
   */
  const renderProjects = (projects) => {
    const container = select('.project-container');
    if (!container) return;

    container.innerHTML = projects.map(project => `
      <div class="col-lg-4 col-md-6 project-item filter-${project.category}">
        <div class="project-wrap">
          <img src="${project.image}" class="img-fluid" alt="${project.title || ''}">
          <div class="project-links">
            <a href="${project.image}" data-gallery="portfolioGallery" 
               class="project-lightbox" title="${project.lightboxTitle || project.title || ''}">
              <i class="bx bx-plus"></i>
            </a>
            <a href="#project" title="More Details"><i class="bx bx-link"></i></a>
          </div>
        </div>
      </div>
    `).join('');
  };


  /**
   * Render Education
   */
  const renderEducation = (education) => {
    const container = select('.education-container');
    if (!container) return;

    container.innerHTML = education.map(edu => `
      <div class="col-lg-4 col-md-6 education-item filter-${edu.category}">
        <div class="education-wrap">
          <img src="${edu.image}" class="img-fluid" alt="${edu.title}">
          <div class="education-links">
            <a href="${edu.image}" data-gallery="portfolioGallery" 
               class="project-lightbox" title="${edu.title}">
              <i class="bx bx-plus"></i>
            </a>
            <a href="#education" title="More Details"><i class="bx bx-link"></i></a>
          </div>
        </div>
      </div>
    `).join('');
  };

  /**
   * Render Certifications
   */
  const renderCertifications = (certifications) => {
    const container = select('#certification .container .row'); // Target the row div
    if (!container) return;

    // Clear existing content while preserving the section title
    container.innerHTML = '';

    certifications.forEach(cert => {
      const certHTML = `
        <div class="col-lg-4 col-md-6 icon-box" data-aos="fade-up" ${cert.delay ? `data-aos-delay="${cert.delay}"` : ''}>
          <div class="icon"><i class="${cert.icon}"></i></div>
          <h4 class="title"><a href="${cert.link || '#'}" ${cert.link ? 'target="_blank"' : ''}>${cert.title}</a></h4>
          <img src="${cert.image}" class="description" alt="${cert.title}" width="200" height="120">
          <div class="certification-links">
            <a href="${cert.image}" data-gallery="portfolioGallery" 
               class="project-lightbox" title="${cert.title}">
              <i class="bx bx-plus"></i>
            </a>
            ${cert.link ? `
            <a href="${cert.link}" target="_blank" title="More Details">
              <i class="bx bx-link"></i>
            </a>
            ` : ''}
          </div>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', certHTML);
    });
  };

  /**
   * Render Testimonials
   */
  const renderTestimonials = (testimonials) => {
    const container = select('.testimonials-slider .swiper-wrapper');
    if (!container) return;

    container.innerHTML = testimonials.map(testimonial => `
      <div class="swiper-slide">
        <div class="testimonial-item" data-aos="fade-up">
          <p>
            <i class="bx bxs-quote-alt-left quote-icon-left"></i>
            ${testimonial.quote}
            <i class="bx bxs-quote-alt-right quote-icon-right"></i>
          </p>
          <img src="${testimonial.image}" class="testimonial-img" alt="${testimonial.name}">
          <h3>${testimonial.name}</h3>
          <h4>${testimonial.role}</h4>
        </div>
      </div>
    `).join('');

    // Reinitialize Swiper
    initTestimonialsSlider();
  };

  /**
 * Render Skills
 */
const renderSkills = (skills) => {
  const container = select('.skills-content');
  if (!container || !skills) return;

  // Clear existing content
  container.innerHTML = '';

  // Split skills into two columns
  const midPoint = Math.ceil(skills.length / 2);
  const firstColumn = skills.slice(0, midPoint);
  const secondColumn = skills.slice(midPoint);

  // Create first column
  const col1 = document.createElement('div');
  col1.className = 'col-lg-6';
  col1.setAttribute('data-aos', 'fade-up');
  
  firstColumn.forEach(skill => {
    col1.appendChild(createSkillElement(skill));
  });

  // Create second column
  const col2 = document.createElement('div');
  col2.className = 'col-lg-6';
  col2.setAttribute('data-aos', 'fade-up');
  col2.setAttribute('data-aos-delay', '100');
  
  secondColumn.forEach(skill => {
    col2.appendChild(createSkillElement(skill));
  });

  // Append columns to container
  container.appendChild(col1);
  container.appendChild(col2);

  // Initialize skills animation
  initSkillsAnimation();
};

const createSkillElement = (skill) => {
  const progressDiv = document.createElement('div');
  progressDiv.className = 'progress';
  
  const skillSpan = document.createElement('span');
  skillSpan.className = 'skill';
  skillSpan.innerHTML = `${skill.name} <i class="val">${skill.level}%</i>`;
  
  const progressBarWrap = document.createElement('div');
  progressBarWrap.className = 'progress-bar-wrap';
  
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  progressBar.setAttribute('role', 'progressbar');
  progressBar.setAttribute('aria-valuenow', skill.level);
  progressBar.setAttribute('aria-valuemin', '0');
  progressBar.setAttribute('aria-valuemax', '100');
  
  progressBarWrap.appendChild(progressBar);
  progressDiv.appendChild(skillSpan);
  progressDiv.appendChild(progressBarWrap);
  
  return progressDiv;
};

/**
 * Initialize skills animation
 */
const initSkillsAnimation = () => {
  const skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }
};

  /**
   * Initialize Isotope filters
   */
  const initIsotopeFilters = () => {
    // Projects Isotope
    const projectContainer = select('.project-container');
    if (projectContainer) {
      const projectIsotope = new Isotope(projectContainer, {
        itemSelector: '.project-item',
        layoutMode: 'fitRows'
      });

      on('click', '#project-flters li', function (e) {
        e.preventDefault();
        select('#project-flters .filter-active', true).forEach(el => {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');
        projectIsotope.arrange({ filter: this.getAttribute('data-filter') });
        projectIsotope.on('arrangeComplete', () => AOS.refresh());
      }, true);

      // Trigger default filter
      const defaultProjectFilter = select('#project-flters li[data-filter=".filter-cth"]');
      if (defaultProjectFilter) defaultProjectFilter.click();
    }

    // Education Isotope
    const educationContainer = select('.education-container');
    if (educationContainer) {
      const educationIsotope = new Isotope(educationContainer, {
        itemSelector: '.education-item',
        layoutMode: 'fitRows'
      });

      on('click', '#education-flters li', function (e) {
        e.preventDefault();
        select('#education-flters .filter-active', true).forEach(el => {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');
        educationIsotope.arrange({ filter: this.getAttribute('data-filter') });
        educationIsotope.on('arrangeComplete', () => AOS.refresh());
      }, true);

      // Trigger default filter
      const defaultEducationFilter = select('#education-flters li[data-filter=".filter-certificate"]');
      if (defaultEducationFilter) defaultEducationFilter.click();
    }
  };

  /**
   * Initialize Testimonials Slider
   */
  const initTestimonialsSlider = () => {
    new Swiper('.testimonials-slider', {
      speed: 600,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 20
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 20
        }
      }
    });
  };

  /**
   * Initiate project lightbox 
   */
  const initPortfolioLightbox = () => {
    GLightbox({
      selector: '.project-lightbox'
    });
  };

  /**
   * Portfolio details slider
   */
  const initProjectDetailsSlider = () => {
    new Swiper('.project-details-slider', {
      speed: 400,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      }
    });
  };

  /**
   * Animation on scroll
   */
  AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,  // <-- This is the key
    mirror: false
  });

  /**
   * Initialize all components
   */
  const init = () => {
    // Load dynamic data first
    loadData().then(() => {
      // Then initialize other components
      initPortfolioLightbox();
      initProjectDetailsSlider();
      initTestimonialsSlider();
    });

    // Initialize components that don't depend on data
    initAOS();
    new PureCounter();
  };

  // Start everything
  window.addEventListener('load', init);
})();