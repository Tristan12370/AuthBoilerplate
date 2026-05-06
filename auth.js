/**
 * Premium Auth Boilerplate - Shared Authentication Module
 * Production-ready form validation, password strength, JWT handling, and mock APIs
 */

class AuthModule {
  constructor() {
    this.isLoading = false;
    this.currentUser = this.getStoredUser();
    this.token = localStorage.getItem('authToken');
  }

  /**
   * Email validation using RFC 5322 simplified regex
   */
  validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * Calculate password strength: 0-4 scale
   * 0: too weak, 1: weak, 2: fair, 3: good, 4: strong
   */
  getPasswordStrength(password) {
    if (!password) return 0;

    let strength = 0;

    // Length checks
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;

    // Character variety
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    // Cap at 4
    return Math.min(Math.floor(strength / 1.5), 4);
  }

  /**
   * Get human-readable strength label
   */
  getStrengthLabel(strength) {
    const labels = ['Too Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return labels[strength] || 'Too Weak';
  }

  /**
   * Get strength color for UI display
   */
  getStrengthColor(strength) {
    const colors = {
      0: '#ef4444', // red
      1: '#f97316', // orange
      2: '#eab308', // yellow
      3: '#84cc16', // lime
      4: '#22c55e'  // green
    };
    return colors[strength] || '#ef4444';
  }

  /**
   * Validate password requirements
   */
  validatePassword(password) {
    const errors = [];
    if (password.length < 8) errors.push('At least 8 characters');
    if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
    if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
    if (!/[0-9]/.test(password)) errors.push('One number');
    return errors;
  }

  /**
   * Validate password confirmation
   */
  validatePasswordMatch(password, confirm) {
    return password === confirm;
  }

  /**
   * Generate a mock JWT token
   */
  generateMockToken(email) {
    // Simple base64 mock token (not cryptographically secure - for demo only)
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      email: email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400,
      sub: 'user_' + Math.random().toString(36).substr(2, 9)
    }));
    const signature = btoa('mock-signature-' + Math.random());
    return `${header}.${payload}.${signature}`;
  }

  /**
   * Simulate login API call with realistic delay
   */
  async simulateLogin(email, password) {
    this.isLoading = true;
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = {
          id: 'user_' + Math.random().toString(36).substr(2, 9),
          email: email,
          name: email.split('@')[0],
          createdAt: new Date().toISOString()
        };

        const token = this.generateMockToken(email);
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));

        this.currentUser = user;
        this.token = token;
        this.isLoading = false;

        resolve({ success: true, user, token });
      }, 1200);
    });
  }

  /**
   * Simulate registration API call
   */
  async simulateRegister(email, password) {
    this.isLoading = true;
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = {
          id: 'user_' + Math.random().toString(36).substr(2, 9),
          email: email,
          name: email.split('@')[0],
          createdAt: new Date().toISOString(),
          emailVerified: false
        };

        const token = this.generateMockToken(email);
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));

        this.currentUser = user;
        this.token = token;
        this.isLoading = false;

        resolve({ success: true, user, token, requiresEmailVerification: true });
      }, 1400);
    });
  }

  /**
   * Simulate password reset request
   */
  async simulatePasswordReset(email) {
    this.isLoading = true;
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isLoading = false;
        resolve({ success: true, message: 'Reset link sent to ' + email });
      }, 800);
    });
  }

  /**
   * Simulate 2FA verification
   */
  async simulateTwoFactorVerify(code) {
    this.isLoading = true;
    return new Promise((resolve) => {
      setTimeout(() => {
        const isValid = code === '123456'; // Mock validation
        this.isLoading = false;

        if (isValid) {
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          user.twoFactorVerified = true;
          localStorage.setItem('user', JSON.stringify(user));
          resolve({ success: true, message: '2FA verified successfully' });
        } else {
          resolve({ success: false, error: 'Invalid verification code' });
        }
      }, 900);
    });
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.token && !!this.currentUser;
  }

  /**
   * Get stored user from localStorage
   */
  getStoredUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  /**
   * Logout - clear all auth data
   */
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.token = null;
    this.currentUser = null;
  }

  /**
   * Redirect to login if not authenticated
   */
  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = '../variant-1-split-screen/login.html';
      return false;
    }
    return true;
  }

  /**
   * Format date in human-readable way
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

// Initialize global auth instance
const auth = new AuthModule();

/**
 * Notification system for toast messages
 */
class NotificationManager {
  static show(message, type = 'success', duration = 4000) {
    const id = 'toast-' + Date.now();

    const toast = document.createElement('div');
    toast.id = id;
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white font-medium shadow-lg animate-slideIn z-50 ${
      type === 'success' ? 'bg-green-500' :
      type === 'error' ? 'bg-red-500' :
      type === 'warning' ? 'bg-yellow-500' :
      'bg-blue-500'
    }`;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('animate-slideOut');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  static success(message) { this.show(message, 'success'); }
  static error(message) { this.show(message, 'error'); }
  static warning(message) { this.show(message, 'warning'); }
  static info(message) { this.show(message, 'info'); }
}

/**
 * Form state manager with real-time validation feedback
 */
class FormValidator {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    this.errors = {};
    this.setupListeners();
  }

  setupListeners() {
    if (!this.form) return;

    const inputs = this.form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => {
        if (this.errors[input.name]) {
          this.validateField(input);
        }
      });
    });
  }

  validateField(input) {
    const name = input.name;
    const value = input.value.trim();
    let error = null;

    // Email validation
    if (input.type === 'email' && value) {
      if (!auth.validateEmail(value)) {
        error = 'Please enter a valid email address';
      }
    }

    // Password validation
    if (input.type === 'password' && name === 'password' && value) {
      const errors = auth.validatePassword(value);
      if (errors.length > 0) {
        error = `Password needs: ${errors.join(', ')}`;
      }
    }

    // Password confirmation
    if (name === 'confirmPassword' && value) {
      const passwordInput = this.form.querySelector('input[name="password"]');
      if (passwordInput && !auth.validatePasswordMatch(passwordInput.value, value)) {
        error = 'Passwords do not match';
      }
    }

    // Required field
    if (input.hasAttribute('required') && !value) {
      error = `${input.placeholder || 'This field'} is required`;
    }

    return this.setFieldError(input, error);
  }

  setFieldError(input, error) {
    const wrapper = input.closest('[data-field-wrapper]') || input.parentElement;
    const errorElement = wrapper.querySelector('[data-error-message]');

    if (error) {
      this.errors[input.name] = error;
      input.classList.add('border-red-400', 'focus:border-red-500', 'focus:ring-red-200');
      input.classList.remove('border-gray-300', 'focus:border-blue-500', 'focus:ring-blue-100');

      if (errorElement) {
        errorElement.textContent = error;
        errorElement.style.display = 'block';
      }
      return false;
    } else {
      delete this.errors[input.name];
      input.classList.remove('border-red-400', 'focus:border-red-500', 'focus:ring-red-200');
      input.classList.add('border-gray-300', 'focus:border-blue-500', 'focus:ring-blue-100');

      if (errorElement) {
        errorElement.style.display = 'none';
      }
      return true;
    }
  }

  validateForm() {
    if (!this.form) return true;

    const inputs = this.form.querySelectorAll('input, textarea, select');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  getFormData() {
    const formData = new FormData(this.form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    return data;
  }

  reset() {
    this.errors = {};
    this.form.reset();
    const inputs = this.form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => this.setFieldError(input, null));
  }
}

/**
 * Password strength indicator with visual feedback
 */
class PasswordStrengthMeter {
  constructor(inputSelector, meterSelector, labelSelector) {
    this.input = document.querySelector(inputSelector);
    this.meter = document.querySelector(meterSelector);
    this.label = document.querySelector(labelSelector);

    if (this.input) {
      this.input.addEventListener('input', () => this.update());
    }
  }

  update() {
    const password = this.input.value;
    const strength = auth.getPasswordStrength(password);
    const label = auth.getStrengthLabel(strength);
    const color = auth.getStrengthColor(strength);

    if (this.meter) {
      this.meter.style.backgroundColor = color;
      this.meter.style.width = ((strength + 1) / 5 * 100) + '%';
    }

    if (this.label) {
      this.label.textContent = label;
      this.label.style.color = color;
    }
  }
}

/**
 * Auto-advancing code input (for 2FA, email verification, etc.)
 */
class CodeInput {
  constructor(containerSelector, codeLength = 6) {
    this.container = document.querySelector(containerSelector);
    this.codeLength = codeLength;
    this.inputs = [];

    if (this.container) {
      this.createInputs();
      this.setupListeners();
    }
  }

  createInputs() {
    this.container.innerHTML = '';
    for (let i = 0; i < this.codeLength; i++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.inputMode = 'numeric';
      input.maxLength = '1';
      input.className = 'w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors';
      input.dataset.index = i;
      this.container.appendChild(input);
      this.inputs.push(input);
    }
  }

  setupListeners() {
    this.inputs.forEach((input, index) => {
      input.addEventListener('input', (e) => {
        if (e.target.value.length === 1) {
          if (index < this.inputs.length - 1) {
            this.inputs[index + 1].focus();
          }
        }
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && index > 0) {
          this.inputs[index - 1].focus();
        }
      });

      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const paste = (e.clipboardData || window.clipboardData).getData('text');
        const digits = paste.replace(/[^\d]/g, '').slice(0, this.codeLength);

        for (let i = 0; i < digits.length; i++) {
          this.inputs[i].value = digits[i];
        }

        if (digits.length === this.codeLength) {
          this.inputs[this.codeLength - 1].focus();
        }
      });
    });
  }

  getCode() {
    return this.inputs.map(input => input.value).join('');
  }

  setCode(code) {
    const digits = code.toString().split('');
    this.inputs.forEach((input, index) => {
      input.value = digits[index] || '';
    });
  }

  clear() {
    this.inputs.forEach(input => input.value = '');
    this.inputs[0].focus();
  }

  isComplete() {
    return this.getCode().length === this.codeLength;
  }
}

/**
 * Show/hide password toggle
 */
function setupPasswordToggle(toggleSelector, inputSelector) {
  const toggle = document.querySelector(toggleSelector);
  const input = document.querySelector(inputSelector);

  if (toggle && input) {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      // Toggle icon
      toggle.innerHTML = isPassword ?
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>' :
        '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-4.753 4.753m4.753-4.753L3.596 3.596m16.807 16.807L6.404 6.404m0 0A3.375 3.375 0 005.396 9.25"></path></svg>';
    });
  }
}

/**
 * Loading state manager
 */
class LoadingState {
  constructor(buttonSelector) {
    this.button = document.querySelector(buttonSelector);
    this.originalContent = null;
    this.originalDisabled = false;
  }

  start() {
    if (!this.button) return;

    this.originalContent = this.button.innerHTML;
    this.originalDisabled = this.button.disabled;

    this.button.disabled = true;
    this.button.innerHTML = `
      <svg class="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    `;
  }

  stop() {
    if (!this.button) return;

    this.button.innerHTML = this.originalContent;
    this.button.disabled = this.originalDisabled;
  }
}

/**
 * Social login handler
 */
async function handleSocialLogin(provider) {
  NotificationManager.info(`${provider} login simulation started...`);

  // Simulate social OAuth flow
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockEmail = `user.${provider.toLowerCase()}@example.com`;
      const user = {
        id: 'social_' + Math.random().toString(36).substr(2, 9),
        email: mockEmail,
        name: provider + ' User',
        provider: provider.toLowerCase(),
        createdAt: new Date().toISOString()
      };

      const token = auth.generateMockToken(mockEmail);
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      NotificationManager.success(`Logged in as ${mockEmail}`);
      resolve({ success: true, user, token });
    }, 1500);
  });
}
