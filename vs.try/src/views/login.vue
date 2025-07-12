<script setup>
import logo from '@/assets/images/logo.png'
import '@/assets/styles/login.scss'
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

const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const isLoading = ref(false)
const showSocialLogin = ref(true)
const darkMode = ref(false)
const errors = ref({
  username: '',
  password: ''
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

async function handleLogin() {
  errors.value = { username: '', password: '' }

  if (!username.value.trim()) {
    errors.value.username = 'Username is required'
    return
  }

  if (!password.value) {
    errors.value.password = 'Password is required'
    return
  }

  if (password.value.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
    return
  }

  try {
    isLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 1500))
    router.push('/dashboard')
  } catch (error) {
    errors.value.general = 'Invalid username or password'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-container" :class="{ 'dark-mode': darkMode }">
    <div class="login-card">
      <div class="gold-border"></div>

      <div class="theme-toggle" @click="toggleTheme">
        <FontAwesomeIcon :icon="darkMode ? 'sun' : 'moon'" />
      </div>

      <div class="login-header">
        <div class="logo">
          <img :src="logo" alt="Logo" width="55" height="55" />
        </div>

        <h2>Welcome Back</h2>
        <p>Please enter your credentials to login</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-row">
          <div class="form-group">
            <label for="username">Username or Email</label>
            <input id="username" v-model="username" type="text" placeholder="Enter your username or email" required
              :class="{ 'input-error': errors.username }" @input="clearError('username')" />
            <span class="error-message" v-if="errors.username">{{ errors.username }}</span>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="password-input-wrapper">
              <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password" required :class="{ 'input-error': errors.password }"
                @input="clearError('password')" />
              <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                <FontAwesomeIcon :icon="showPassword ? 'eye-slash' : 'eye'" />
              </button>
            </div>
            <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
          </div>
        </div>

        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe" />
            <span class="checkmark"></span>
            Remember me
          </label>
          <router-link to="/forgot-password" class="forgot-password">Forgot password?</router-link>
        </div>

        <button type="submit" class="login-button" :disabled="isLoading">
          <span v-if="!isLoading">Login</span>
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
              Continue with Google
            </button>
            <button type="button" class="social-button github">
              <FontAwesomeIcon :icon="['fab', 'github']" />
              Continue with GitHub
            </button>
          </div>
        </div>
      </form>

      <div class="login-footer">
        <p>Don't have an account?
          <!-- Change this line from /register to /signup -->
          <router-link to="/signup" class="signup-link">Sign up</router-link>
        </p>
      </div>
    </div>
  </div>
</template>
