// ZAKA 2026 - Navigation System

window.ZakaNavigation = {
  init() {
    this.header = document.querySelector('.nav-header');
    this.mobileBtn = document.querySelector('.mobile-menu-btn');
    this.mobileOverlay = document.querySelector('.mobile-nav-overlay');
    this.mobileLinks = document.querySelectorAll('.mobile-nav-overlay .nav-link');
    
    this.lastScroll = 0;
    this.isMobileMenuOpen = false;
    
    this.bindEvents();
  },

  bindEvents() {
    // Scroll behavior for sticky glass header
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      
      if (currentScroll > 50) {
        this.header.style.background = 'rgba(3, 3, 3, 0.85)';
        this.header.style.borderBottomColor = 'rgba(255, 255, 255, 0.1)';
      } else {
        this.header.style.background = 'rgba(3, 3, 3, 0.72)';
        this.header.style.borderBottomColor = 'var(--color-gray-border)';
      }

      this.lastScroll = currentScroll;
    }, { passive: true });

    // Mobile Menu Toggle
    if (this.mobileBtn) {
      this.mobileBtn.addEventListener('click', () => {
        this.toggleMobileMenu();
      });
    }

    // Close Mobile Menu on Link Click
    if (this.mobileLinks) {
      this.mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          if (this.isMobileMenuOpen) this.toggleMobileMenu();
        });
      });
    }
  },

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    
    if (this.isMobileMenuOpen) {
      this.mobileBtn.classList.add('is-active');
      this.mobileOverlay.classList.add('is-active');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    } else {
      this.mobileBtn.classList.remove('is-active');
      this.mobileOverlay.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }
};
