/**
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(() => {
  "use strict";

  // Cache DOM selections
  const DOM = {
    body: document.querySelector('body'),
    navbar: document.querySelector('#navbar'),
    backToTop: document.querySelector('.back-to-top'),
    typed: document.querySelector('.typed'),
    skillsContent: document.querySelector('.skills-content'),
    projectContainer: document.querySelector('.project-container'),
    educationContainer: document.querySelector('.education-container'),
    certificationContainer: document.querySelector('#certification .container .row'),
    testimonialsSlider: document.querySelector('.testimonials-slider .swiper-wrapper')
  };

  // Debounce function for performance
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  /**
   * Optimized selector helper function with caching
   */
  const select = (() => {
    const cache = new Map();
    
    return (el, all = false) => {
      const key = `${el}-${all}`;
      if (cache.has(key)) return cache.get(key);
      
      const result = all ? 
        [...document.querySelectorAll(el.trim())] : 
        document.querySelector(el.trim());
      
      cache.set(key, result);
      return result;
    };
  })();

  /**
   * Optimized event listener with delegation
   */
  const on = (type, el, listener, all = false) => {
    const selectEl = select(el, all);
    if (!selectEl) return;

    if (all) {
      selectEl.forEach(e => e.addEventListener(type, listener, { passive: true }));
    } else {
      selectEl.addEventListener(type, listener, { passive: true });
    }
  };

  /**
   * Optimized scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', debounce(listener, 100), { passive: true });
  };

  /**
   * Navbar links active state on scroll
   */
  const navbarlinksActive = debounce(() => {
    const position = window.scrollY + 200;
    const navbarlinks = select('#navbar .scrollto', true);
    
    navbarlinks?.forEach(navbarlink => {
      if (!navbarlink.hash) return;
      const section = select(navbarlink.hash);
      if (!section) return;
      
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active');
      } else {
        navbarlink.classList.remove('active');
      }
    });
  }, 100);

  /**
   * Smooth scroll with header offset
   */
  const scrollto = (el) => {
    const elementPos = select(el)?.offsetTop ?? 0;
    window.scrollTo({
      top: elementPos,
      behavior: 'smooth'
    });
  };

  /**
   * Back to top button handler
   */
  if (DOM.backToTop) {
    const toggleBacktotop = debounce(() => {
      DOM.backToTop.classList.toggle('active', window.scrollY > 100);
    }, 100);

    window.addEventListener('load', toggleBacktotop, { passive: true });
    onscroll(document, toggleBacktotop);
  }

  /**
   * Mobile nav toggle with event delegation
   */
  document.addEventListener('click', (e) => {
    const toggle = e.target.closest('.mobile-nav-toggle');
    if (!toggle) return;

    DOM.body.classList.toggle('mobile-nav-active');
    toggle.classList.toggle('bi-list');
    toggle.classList.toggle('bi-x');
  }, { passive: true });

  /**
   * Scroll with offset on links with event delegation
   */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('.scrollto');
    if (!link || !select(link.hash)) return;

    e.preventDefault();
    if (DOM.body.classList.contains('mobile-nav-active')) {
      DOM.body.classList.remove('mobile-nav-active');
      const navbarToggle = select('.mobile-nav-toggle');
      navbarToggle?.classList.toggle('bi-list');
      navbarToggle?.classList.toggle('bi-x');
    }
    scrollto(link.hash);
  });

  /**
   * Load and render dynamic data with better error handling
   */
  const loadData = async () => {
    try {
      const response = await fetch('assets/data.json');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      await Promise.all([
        renderProjects(data.projects),
        renderEducation(data.education),
        renderCertifications(data.certifications),
        renderTestimonials(data.testimonials),
        renderSkills(data.skills)
      ]);

      initIsotopeFilters();
    } catch (error) {
      console.error('Error loading data:', error);
      // Show user-friendly error message
      const errorMessage = document.createElement('div');
      errorMessage.className = 'alert alert-danger';
      errorMessage.textContent = 'Failed to load content. Please refresh the page or try again later.';
      document.body.insertBefore(errorMessage, document.body.firstChild);
    }
  };

  /**
   * Optimized render functions using DocumentFragment
   */
  const renderProjects = (projects) => {
    if (!DOM.projectContainer || !projects?.length) return;

    const fragment = document.createDocumentFragment();
    projects.forEach(project => {
      const useYoutubeThumbnail = project.youtubeId && !project.image;
      const thumbnailSrc = useYoutubeThumbnail
        ? `https://img.youtube.com/vi/${project.youtubeId}/hqdefault.jpg`
        : project.image;

      const div = document.createElement('div');
      div.className = `col-lg-4 col-md-6 project-item filter-${project.category}`;
      div.innerHTML = `
        <div class="project-wrap">
          <img src="${thumbnailSrc}" class="img-fluid" alt="${project.title || ''}" loading="lazy">
          <div class="project-links">
            ${useYoutubeThumbnail 
              ? `<a href="https://www.youtube.com/watch?v=${project.youtubeId}" 
                   data-gallery="portfolioGallery" 
                   class="project-lightbox" 
                   title="${project.lightboxTitle || project.title || ''}">
                   <i class="bx bx-play"></i>
                 </a>`
              : `<a href="${project.image}" 
                   data-gallery="portfolioGallery" 
                   class="project-lightbox" 
                   title="${project.lightboxTitle || project.title || ''}">
                   <i class="bx bx-plus"></i>
                 </a>`
            }
            ${project.github 
              ? `<a href="${project.github}" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   title="View on GitHub">
                   <i class="bx bxl-github"></i>
                 </a>`
              : `<a href="#project" title="More Details">
                   <i class="bx bx-link"></i>
                 </a>`
            }
          </div>
        </div>`;
      fragment.appendChild(div);
    });

    DOM.projectContainer.innerHTML = '';
    DOM.projectContainer.appendChild(fragment);
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
        handler: function (direction) {
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
   * Lazy initialization of components
   */
  const lazyInit = () => {
    // Initialize components that require immediate loading
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });

    // Initialize typed effect if element exists
    if (DOM.typed) {
      const typed_strings = DOM.typed.getAttribute('data-typed-items')?.split(',') ?? [];
      new Typed('.typed', {
        strings: typed_strings,
        loop: true,
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 2000
      });
    }

    // Load dynamic data and initialize dependent components
    loadData().then(() => {
      requestAnimationFrame(() => {
        initPortfolioLightbox();
        initProjectDetailsSlider();
        initTestimonialsSlider();
      });
    });

    // Initialize counter
    new PureCounter();
  };

  // Initialize everything when DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', lazyInit);
  } else {
    lazyInit();
  }
})();