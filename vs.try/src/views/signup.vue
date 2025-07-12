<script setup>
import logo from '@/assets/images/logo.png'
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSun, faMoon, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Add icons to library
library.add(faSun, faMoon, faEye, faEyeSlash, faGoogle, faGithub)

const router = useRouter()

// Define color palette
const colors = {
  goldPrimary: '#D4AF37',
  goldSecondary: '#B8860B',
  goldLight: '#FFDF6B',
  white: '#FFFFFF',
  black: '#000000',
  darkBg: '#121212',
  darkCard: '#1A1A1A',
  lightGray: '#F5F5F5',
  mediumGray: '#E0E0E0',
  darkGray: '#333333',
  error: '#E74C3C'
}

const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const rememberMe = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const showSocialLogin = ref(true)
const darkMode = ref(false)
const errors = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// Update body class and background when darkMode changes
function updateTheme() {
  if (darkMode.value) {
    document.body.classList.add('dark-mode')
    document.body.style.backgroundColor = colors.darkBg
  } else {
    document.body.classList.remove('dark-mode')
    document.body.style.backgroundColor = colors.white
  }
}

// Set initial theme
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  if (savedTheme) {
    darkMode.value = savedTheme === 'dark'
  } else {
    darkMode.value = systemPrefersDark
  }

  updateTheme()
})

// Watch for theme changes
watch(darkMode, () => {
  localStorage.setItem('theme', darkMode.value ? 'dark' : 'light')
  updateTheme()
})

function toggleTheme() {
  darkMode.value = !darkMode.value
}

function clearError(field) {
  if (errors.value[field]) {
    errors.value[field] = ''
  }
}

async function handleSignup() {
  errors.value = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  }

  // Validation
  if (!formData.value.name.trim()) {
    errors.value.name = 'Full name is required'
    return
  }

  if (!formData.value.email.trim()) {
    errors.value.email = 'Email is required'
    return
  } else if (!/^\S+@\S+\.\S+$/.test(formData.value.email)) {
    errors.value.email = 'Please enter a valid email'
    return
  }

  if (!formData.value.password) {
    errors.value.password = 'Password is required'
    return
  } else if (formData.value.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters'
    return
  }

  if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
    return
  }

  try {
    isLoading.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    // Redirect to login or dashboard after successful signup
    router.push('/login')
  } catch (error) {
    errors.value.general = 'Signup failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="signup-container" :class="{ 'dark-mode': darkMode }">
    <div class="signup-card">
      <div class="gold-border"></div>

      <div class="theme-toggle" @click="toggleTheme">
        <FontAwesomeIcon :icon="darkMode ? 'sun' : 'moon'" />
      </div>

      <div class="signup-header">
        <div class="logo">
          <img :src="logo" alt="Logo" width="55" height="55" />
        </div>
        <h2>Create Your Account</h2>
        <p>Join us to get started</p>
      </div>

      <form @submit.prevent="handleSignup" class="signup-form">
        <div class="form-row">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input id="name" v-model="formData.name" type="text" placeholder="Enter your full name" required
              :class="{ 'input-error': errors.name }" @input="clearError('name')" />
            <span class="error-message" v-if="errors.name">{{ errors.name }}</span>
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <input id="email" v-model="formData.email" type="email" placeholder="Enter your email" required
              :class="{ 'input-error': errors.email }" @input="clearError('email')" />
            <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="password">Password</label>
            <div class="password-input-wrapper">
              <input id="password" v-model="formData.password" :type="showPassword ? 'text' : 'password'"
                placeholder="Create a password" required :class="{ 'input-error': errors.password }"
                @input="clearError('password')" />
              <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                <FontAwesomeIcon :icon="showPassword ? 'eye-slash' : 'eye'" />
              </button>
            </div>
            <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <div class="password-input-wrapper">
              <input id="confirmPassword" v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'" placeholder="Confirm your password" required
                :class="{ 'input-error': errors.confirmPassword }" @input="clearError('confirmPassword')" />
              <button type="button" class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
                <FontAwesomeIcon :icon="showConfirmPassword ? 'eye-slash' : 'eye'" />
              </button>
            </div>
            <span class="error-message" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</span>
          </div>
        </div>

        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe" />
            <span class="checkmark"></span>
            I agree to the <router-link to="/terms" class="terms-link">Terms & Conditions</router-link>
          </label>
        </div>

        <button type="submit" class="signup-button" :disabled="isLoading">
          <span v-if="!isLoading">Create Account</span>
          <span v-else class="loading-spinner"></span>
        </button>

        <div class="social-login" v-if="showSocialLogin">
          <div class="divider">
            <span class="divider-line"></span>
            <span class="divider-text">OR</span>
            <span class="divider-line"></span>
          </div>
          <div class="social-buttons">
            <button type="button" class="social-button google">
              <FontAwesomeIcon :icon="['fab', 'google']" />
              Sign up with Google
            </button>
            <button type="button" class="social-button github">
              <FontAwesomeIcon :icon="['fab', 'github']" />
              Sign up with GitHub
            </button>
          </div>
        </div>
      </form>

      <div class="signup-footer">
        <p>Already have an account? <router-link to="/" class="login-link">Log in</router-link>
        </p>
      </div>


    </div>
  </div>
</template>

<style scoped>
/* Base styles */
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  padding: 1rem;
  transition: background-color 0.3s ease;
}

.signup-card {
  position: relative;
  background: v-bind('colors.white');
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  padding: 1.75rem 2.5rem;
  width: 100%;
  max-width: 700px;
  transition: all 0.3s ease;
  border: 1px solid rgba(v-bind('colors.goldPrimary'), 0.1);
}

.dark-mode .signup-card {
  background: v-bind('colors.darkCard');
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.gold-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, v-bind('colors.goldSecondary'), v-bind('colors.goldPrimary'), v-bind('colors.goldSecondary'));
}

.theme-toggle {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: v-bind('colors.lightGray');
  color: v-bind('colors.goldPrimary');
  border: none;
  transition: all 0.3s ease;
}

.dark-mode .theme-toggle {
  background-color: v-bind('colors.darkGray');
}

.theme-toggle:hover {
  background-color: v-bind('colors.goldPrimary');
  color: v-bind('colors.white');
  transform: rotate(20deg) scale(1.1);
}

.signup-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.signup-header .logo {
  margin-bottom: 0.75rem;
  display: flex;
  justify-content: center;
}

.signup-header h2 {
  color: v-bind('colors.black');
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.dark-mode .signup-header h2 {
  color: v-bind('colors.white');
}

.signup-header p {
  color: v-bind('colors.darkGray');
  font-size: 0.9375rem;
  margin: 0;
}

.dark-mode .signup-header p {
  color: v-bind('colors.mediumGray');
}

/* Form styles */
.signup-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  align-items: flex-start;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
}

label {
  font-size: 0.875rem;
  color: v-bind('colors.black');
  font-weight: 500;
  margin-bottom: -0.25rem;
}

.dark-mode label {
  color: v-bind('colors.white');
}

input {
  padding: 0.75rem 0.875rem;
  border: 1px solid v-bind('colors.mediumGray');
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  width: 100%;
  background-color: v-bind('colors.white');
  color: v-bind('colors.black');
  box-sizing: border-box;
}

.dark-mode input {
  background-color: v-bind('colors.darkGray');
  border-color: v-bind('colors.darkGray');
  color: v-bind('colors.white');
}

/* Password input specific styles */
.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper input {
  padding-right: 2.25rem;
}

.toggle-password {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  color: v-bind('colors.darkGray');
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  transition: color 0.2s ease;
}

.toggle-password:hover {
  color: v-bind('colors.goldPrimary');
}

.dark-mode .toggle-password {
  color: v-bind('colors.mediumGray');
}

.dark-mode .toggle-password:hover {
  color: v-bind('colors.goldLight');
}

input:focus {
  outline: none;
  border-color: v-bind('colors.goldPrimary');
  box-shadow: 0 0 0 3px rgba(v-bind('colors.goldPrimary'), 0.1);
}

.input-error {
  border-color: v-bind('colors.error');
}

.input-error:focus {
  box-shadow: 0 0 0 3px rgba(v-bind('colors.error'), 0.1);
}

.error-message {
  color: v-bind('colors.error');
  font-size: 0.75rem;
  margin-top: 0.25rem;
  position: absolute;
  bottom: -1.1rem;
  left: 0;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8125rem;
  margin-top: 0.25rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: v-bind('colors.darkGray');
  cursor: pointer;
  user-select: none;
  transition: color 0.2s ease;
}

.remember-me:hover {
  color: v-bind('colors.black');
}

.dark-mode .remember-me {
  color: v-bind('colors.mediumGray');
}

.dark-mode .remember-me:hover {
  color: v-bind('colors.white');
}

.remember-me input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  background-color: v-bind('colors.white');
  border: 1px solid v-bind('colors.mediumGray');
  border-radius: 0.2rem;
  position: relative;
  transition: all 0.2s ease;
}

.dark-mode .checkmark {
  background-color: v-bind('colors.darkGray');
  border-color: v-bind('colors.darkGray');
}

.remember-me:hover .checkmark {
  border-color: v-bind('colors.goldPrimary');
}

.remember-me input:checked~.checkmark {
  background-color: v-bind('colors.goldPrimary');
  border-color: v-bind('colors.goldPrimary');
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 0.3125rem;
  top: 0.125rem;
  width: 0.25rem;
  height: 0.5rem;
  border: solid v-bind('colors.white');
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.remember-me input:checked~.checkmark:after {
  display: block;
}

.terms-link {
  color: v-bind('colors.goldPrimary');
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.terms-link:hover {
  color: v-bind('colors.goldSecondary');
  text-decoration: underline;
}

.signup-button {
  background-color: v-bind('colors.goldPrimary');
  color: v-bind('colors.white');
  border: none;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2.75rem;
  margin-top: 0.25rem;
}

.signup-button:hover {
  background-color: v-bind('colors.goldSecondary');
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(v-bind('colors.goldPrimary'), 0.3);
}

.signup-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(v-bind('colors.goldPrimary'), 0.2);
}

.signup-button:disabled {
  background-color: v-bind('colors.mediumGray');
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(v-bind('colors.white'), 0.3);
  border-radius: 50%;
  border-top-color: v-bind('colors.white');
  animation: spin 1s ease-in-out infinite;
}

.divider {
  display: flex;
  align-items: center;
  margin: 1rem 0;
}

.divider-line {
  flex: 1;
  height: 1px;
  background-color: v-bind('colors.mediumGray');
}

.divider-text {
  padding: 0 0.75rem;
  color: v-bind('colors.darkGray');
  font-size: 0.8125rem;
}

.dark-mode .divider-text {
  color: v-bind('colors.mediumGray');
}

.social-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.social-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid v-bind('colors.mediumGray');
  background-color: v-bind('colors.white');
  color: v-bind('colors.black');
}

.dark-mode .social-button {
  background-color: v-bind('colors.darkGray');
  border-color: v-bind('colors.darkGray');
  color: v-bind('colors.white');
}

.social-button:hover {
  background-color: v-bind('colors.lightGray');
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dark-mode .social-button:hover {
  background-color: v-bind('colors.black');
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.social-button:active {
  transform: translateY(0);
}

.social-button.google:hover {
  border-color: #DB4437;
  color: #DB4437;
}

.social-button.google:hover svg {
  color: #DB4437;
}

.social-button.github:hover {
  border-color: #333;
  color: #333;
}

.social-button.github:hover svg {
  color: #333;
}

.signup-footer {
  text-align: center;
  margin-top: 1.25rem;
  font-size: 0.875rem;
  color: v-bind('colors.darkGray');
}

.dark-mode .signup-footer {
  color: v-bind('colors.mediumGray');
}

.login-link {
  color: v-bind('colors.goldPrimary');
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.login-link:hover {
  color: v-bind('colors.goldSecondary');
  text-decoration: underline;
  transform: translateX(2px);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .signup-card {
    padding: 1.5rem;
    max-width: 550px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .signup-header h2 {
    font-size: 1.375rem;
  }

  .error-message {
    position: relative;
    bottom: auto;
    margin-top: 0.25rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }
}

@media (max-width: 480px) {
  .signup-container {
    padding: 0.75rem;
  }

  .signup-card {
    padding: 1.25rem;
    max-width: 100%;
  }

  .signup-header h2 {
    font-size: 1.25rem;
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .theme-toggle {
    top: 0.75rem;
    right: 0.75rem;
    width: 32px;
    height: 32px;
  }

  input {
    padding: 0.6875rem 0.75rem;
  }

  .toggle-password {
    right: 0.6875rem;
  }

  .gold-border {
    height: 2px;
  }
}
</style>