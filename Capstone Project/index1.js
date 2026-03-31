
document.addEventListener('DOMContentLoaded', () => {

   //── Mobile Nav Toggle ─────────────────────────────────── 
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navAccountDropdown = document.querySelector('.nav-account-dropdown');

  if (toggle) {
    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('mobile-open');
      navAccountDropdown && navAccountDropdown.classList.toggle('mobile-open', isOpen);
      toggle.querySelector('i').className = isOpen ? 'fa fa-times' : 'fa fa-bars';
    });
  }

  const switchDashboardSection = (sectionKey) => {
    if (!sectionKey) return;

    const sectionId = 'section-' + sectionKey;
    const section = document.getElementById(sectionId);
    if (!section) return;

    document.querySelectorAll('.dash-content-section.active').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.dash-nav-item.active').forEach(i => i.classList.remove('active'));

    section.classList.add('active');
    const navItem = document.querySelector(`.dash-nav-item[data-section="${sectionKey}"]`);
    if (navItem) navItem.classList.add('active');
  };

  const bindDashboardNavigation = () => {
    document.querySelectorAll('.dash-nav-item[data-section]').forEach(navItem => {
      navItem.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionValue = navItem.getAttribute('data-section');
        if (sectionValue === 'post-internship') {
          const modal = document.getElementById('postModal');
          if (modal) modal.classList.add('open');
          return;
        }
        switchDashboardSection(sectionValue);
      });
    });

    const accountMenuItems = document.querySelectorAll('.dropdown-item[data-action]');
    if (accountMenuItems.length > 0) {
      accountMenuItems.forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();

          const action = item.dataset.action;
          const target = item.dataset.target;

          if (action === 'logout') {
            window.location.href = 'index.html';
            return;
          }

          if (target) {
            switchDashboardSection(target);
          } else {
            if (action === 'view-profile') switchDashboardSection('my-profile');
            else if (action === 'settings') switchDashboardSection('settings');
            else if (action === 'view-history') switchDashboardSection('my-applications');
          }

          const accountToggleEl = document.getElementById('accountToggle');
          const accountMenuEl = document.getElementById('accountMenu');
          if (accountToggleEl) accountToggleEl.classList.remove('active');
          if (accountMenuEl) accountMenuEl.classList.remove('active');
        });
      });
    }
  };

  //── Account Dropdown Toggle ───────────────────────────── 
  const accountToggle = document.getElementById('accountToggle');
  const accountMenu = document.getElementById('accountMenu');

  if (accountToggle && accountMenu) {
    accountToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      accountToggle.classList.toggle('active');
      accountMenu.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!accountToggle.contains(e.target) && !accountMenu.contains(e.target)) {
        accountToggle.classList.remove('active');
        accountMenu.classList.remove('active');
      }
    });

    // Dashboard menu actions are handled by bindDashboardNavigation
  }

  bindDashboardNavigation();

   //── Helpers ───────────────────────────────────────────── 
  const showError = (input, msg) => {
    clearError(input);
    input.classList.add('input-error');
    const err = document.createElement('span');
    err.className = 'field-error';
    err.textContent = msg;
    input.parentElement.appendChild(err);
  };

  const clearError = (input) => {
    input.classList.remove('input-error');
    const prev = input.parentElement.querySelector('.field-error');
    if (prev) prev.remove();
  };

  const showToast = (msg, type = 'success') => {
    let toast = document.getElementById('ic-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'ic-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className = `ic-toast ic-toast--${type} ic-toast--show`;
    setTimeout(() => toast.classList.remove('ic-toast--show'), 3500);
  };
  

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isValidPhone = (v) => /^[0-9+\s\-()]{7,15}$/.test(v);
  const isValidURL   = (v) => { try { new URL(v); return true; } catch { return false; } };

  /* ── Sign-In Validation ────────────────────────────────── */
  const signInForm = document.querySelector('auth-card form');
  if (signInForm && document.title.includes('Sign In')) {

    const emailIn = signInForm.querySelector('input[type="email"]');
    const passIn  = signInForm.querySelector('input[type="password"]');

    [emailIn, passIn].forEach(inp => {
      if (inp) inp.addEventListener('input', () => clearError(inp));
    });

    signInForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      if (!emailIn.value.trim()) {
        showError(emailIn, 'Email is required.'); valid = false;
      } else if (!isValidEmail(emailIn.value.trim())) {
        showError(emailIn, 'Enter a valid email address.'); valid = false;
      }

      if (!passIn.value) {
        showError(passIn, 'Password is required.'); valid = false;
      } else if (passIn.value.length < 8) {
        showError(passIn, 'Password must be at least 8 characters.'); valid = false;
      }

      if (valid) {
        const btn = signInForm.querySelector('button[type="submit"]');
        btn.textContent = 'Signing in…';
        btn.disabled = true;
        setTimeout(() => {
          showToast('Signed in successfully! Redirecting…');
          setTimeout(() => window.location.href = 'student-dashboard.html', 1500);
        }, 800);
      }
    });
  }

  /* ── Sign-Up Validation ────────────────────────────────── */
  const signUpForm = document.getElementById('signupForm');
  if (signUpForm) {

    /* Live clear on input */
    signUpForm.querySelectorAll('input, textarea').forEach(inp => {
      inp.addEventListener('input', () => clearError(inp));
    });

    const validateStudentForm = () => {
      let valid = true;
      const fields = signUpForm.querySelectorAll('.student-field');
      const [fullName, studentCode, email, phone, password, confirmPass] = fields;

      if (!fullName.value.trim() || fullName.value.trim().length < 2) {
        showError(fullName, 'Enter your full name.'); valid = false;
      }
      if (!studentCode.value.trim() || !/^\d{6,10}$/.test(studentCode.value.trim())) {
        showError(studentCode, 'Enter a valid student code (6–10 digits).'); valid = false;
      }
      if (!isValidEmail(email.value.trim())) {
        showError(email, 'Enter a valid email address.'); valid = false;
      }
      if (phone.value.trim() && !isValidPhone(phone.value.trim())) {
        showError(phone, 'Enter a valid phone number.'); valid = false;
      }
      if (password.value.length < 8) {
        showError(password, 'Password must be at least 8 characters.'); valid = false;
      }
      if (confirmPass.value !== password.value) {
        showError(confirmPass, 'Passwords do not match.'); valid = false;
      }
      return valid;
      
    };

    const validateOrgForm = () => {
      let valid = true;
      const fields = signUpForm.querySelectorAll('.org-field');
      const [orgName, location, email, phone, password, confirmPass] = fields;

      if (!orgName.value.trim() || orgName.value.trim().length < 2) {
        showError(orgName, 'Enter the organization name.'); valid = false;
      }
      if (!location.value.trim()) {
        showError(location, 'Enter your location.'); valid = false;
      }
      if (!isValidEmail(email.value.trim())) {
        showError(email, 'Enter a valid email address.'); valid = false;
      }
      if (!isValidPhone(phone.value.trim())) {
        showError(phone, 'Enter a valid phone number.'); valid = false;
      }
      if (password.value.length < 8) {
        showError(password, 'Password must be at least 8 characters.'); valid = false;
      }
      if (confirmPass.value !== password.value) {
        showError(confirmPass, 'Passwords do not match.'); valid = false;
      }
      return valid;
    };

    signUpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const termsBox = document.getElementById('terms');
      const isStudent = document.getElementById('student').checked;

      if (!termsBox.checked) {
        showToast('Please accept the Terms & Conditions.', 'error');
        return;
      }

      const valid = isStudent ? validateStudentForm() : validateOrgForm();

      if (valid) {
        const btn = signUpForm.querySelector('button[type="submit"]');
        btn.textContent = 'Creating account…';
        btn.disabled = true;
        setTimeout(() => {
          showToast('Account created! Redirecting…');
          const dest = isStudent ? 'student-dashboard.html' : 'org-dashboard.html';
          setTimeout(() => window.location.href = dest, 60);
        }, 60);
      }
    });
  }

  /* ── Hero Search Bar ───────────────────────────────────── */
  const searchBtn = document.querySelector('.btn-search');
  const searchInput = document.querySelector('.search-bar input');
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      const q = searchInput.value.trim();
      if (q) window.location.href = `internships.html?search=${encodeURIComponent(q)}`;
      else searchInput.focus();
    });
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') searchBtn.click();
    });
  }

});
