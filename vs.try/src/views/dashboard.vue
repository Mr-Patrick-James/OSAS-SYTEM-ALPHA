<template>
  <div class="dashboard" :class="{'dark': darkMode, 'mobile-nav-open': mobileNavOpen}">
    <!-- Gold Particle Background -->
    <div class="gold-particles">
      <div v-for="i in 15" :key="i" class="particle" :style="particleStyle(i)"></div>
    </div>

    <!-- Mobile Header -->
    <header class="mobile-header" v-if="isMobile">
      <button class="menu-toggle" @click="mobileNavOpen = !mobileNavOpen" aria-label="Toggle menu">
        <span class="material-icons">menu</span>
      </button>
      <h1 class="mobile-logo">AUREUM</h1>
      <button class="theme-toggle-mobile" @click="toggleTheme" aria-label="Toggle theme">
        <span class="material-icons">{{ darkMode ? 'light_mode' : 'dark_mode' }}</span>
      </button>
    </header>

    <!-- Side Navigation -->
    <aside class="sidenav" :class="{'visible': mobileNavOpen || !isMobile}">
      <div class="nav-header">
        <div class="logo">
          <svg viewBox="0 0 100 100" class="logo-svg" aria-hidden="true">
            <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" stroke="#D4AF37" stroke-width="4"/>
            <circle cx="50" cy="50" r="30" fill="none" stroke="#D4AF37" stroke-width="4"/>
          </svg>
          <span>AUREUM</span>
        </div>
        <button class="close-nav" @click="mobileNavOpen = false" v-if="isMobile" aria-label="Close menu">
          <span class="material-icons">close</span>
        </button>
      </div>
      
      <nav class="nav-menu" aria-label="Main navigation">
        <button class="nav-item active" aria-current="page">
          <span class="material-icons" aria-hidden="true">dashboard</span>
          <span>Dashboard</span>
          <div class="gold-bar" aria-hidden="true"></div>
        </button>
        <button class="nav-item">
          <span class="material-icons" aria-hidden="true">trending_up</span>
          <span>Analytics</span>
        </button>
        <button class="nav-item">
          <span class="material-icons" aria-hidden="true">people</span>
          <span>Clients</span>
        </button>
        <button class="nav-item">
          <span class="material-icons" aria-hidden="true">payment</span>
          <span>Transactions</span>
        </button>
        <button class="nav-item">
          <span class="material-icons" aria-hidden="true">settings</span>
          <span>Settings</span>
        </button>
      </nav>
      
      <div class="user-profile">
        <div class="avatar">
          <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User profile picture">
        </div>
        <div class="user-info">
          <span class="name">Alexa K.</span>
          <span class="role">Premium Member</span>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Desktop Top Navigation -->
      <header class="topnav" v-if="!isMobile">
        <h1>Executive Dashboard</h1>
        <div class="header-actions">
          <div class="search-bar">
            <span class="material-icons" aria-hidden="true">search</span>
            <input type="text" placeholder="Search..." aria-label="Search dashboard">
          </div>
          <button class="notification-btn" aria-label="Notifications">
            <span class="material-icons" aria-hidden="true">notifications</span>
            <span class="badge">3</span>
          </button>
          <button class="theme-toggle" @click="toggleTheme" aria-label="Toggle theme">
            <span class="material-icons">{{ darkMode ? 'light_mode' : 'dark_mode' }}</span>
          </button>
        </div>
      </header>

      <!-- Dashboard Content -->
      <div class="dashboard-content">
        <!-- Stats Cards -->
        <section class="stats-section" aria-labelledby="stats-heading">
          <h2 id="stats-heading" class="visually-hidden">Key Statistics</h2>
          <div class="stats-grid">
            <div v-for="(stat, index) in stats" :key="index" class="stat-card" :class="stat.trendDirection">
              <div class="card-content">
                <div class="icon" aria-hidden="true">
                  <span class="material-icons">{{ stat.icon }}</span>
                </div>
                <div class="text-content">
                  <p class="title">{{ stat.title }}</p>
                  <h3 class="value">{{ stat.value }}</h3>
                  <div class="trend">
                    <span class="material-icons" aria-hidden="true">{{ stat.trendIcon }}</span>
                    <span>{{ stat.trend }}</span>
                  </div>
                </div>
              </div>
              <div class="gold-accent" aria-hidden="true"></div>
            </div>
          </div>
        </section>

        <!-- Charts Section -->
        <section class="charts-section" aria-labelledby="charts-heading">
          <h2 id="charts-heading" class="visually-hidden">Data Charts</h2>
          <div class="main-chart">
            <div class="chart-header">
              <h3>Revenue Performance</h3>
              <div class="time-filters">
                <button 
                  v-for="filter in timeFilters" 
                  :key="filter" 
                  :class="{active: activeFilter === filter}"
                  @click="activeFilter = filter"
                  :aria-label="`View ${filter} data`"
                >
                  {{ filter }}
                </button>
              </div>
            </div>
            <div class="chart-container">
              <canvas :id="'mainChart-' + _uid" ref="mainChart" role="img" :aria-label="'Revenue performance chart showing ' + activeFilter + ' data'"></canvas>
            </div>
          </div>
          
          <div class="secondary-charts">
            <div class="donut-chart">
              <h3>Revenue Sources</h3>
              <div class="chart-container">
                <canvas :id="'donutChart-' + _uid" ref="donutChart" role="img" aria-label="Revenue sources breakdown chart"></canvas>
              </div>
            </div>
            
            <div class="bar-chart">
              <h3>Top Products</h3>
              <div class="chart-container">
                <canvas :id="'barChart-' + _uid" ref="barChart" role="img" aria-label="Top products sales chart"></canvas>
              </div>
            </div>
          </div>
        </section>

        <!-- Recent Activity -->
        <section class="recent-activity" aria-labelledby="activity-heading">
          <div class="section-header">
            <h3 id="activity-heading">Recent Activity</h3>
            <button class="view-all">View All</button>
          </div>
          <div class="activity-list">
            <div 
              v-for="(activity, index) in activities" 
              :key="index" 
              class="activity-item"
              :aria-labelledby="'activity-' + index"
            >
              <div class="activity-icon" :class="activity.type" aria-hidden="true">
                <span class="material-icons">{{ activity.icon }}</span>
              </div>
              <div class="activity-details">
                <p :id="'activity-' + index" class="activity-title">{{ activity.title }}</p>
                <p class="activity-time">{{ activity.time }}</p>
              </div>
              <span class="activity-amount">{{ activity.amount }}</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';

export default {
  name: 'LuxuryDashboard',
  data() {
    return {
      darkMode: false,
      mobileNavOpen: false,
      isMobile: false,
      activeFilter: 'Monthly',
      timeFilters: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
      stats: [
        { 
          icon: 'attach_money',
          title: 'Total Revenue', 
          value: '$48,569', 
          trend: '+12.5%',
          trendDirection: 'up',
          trendIcon: 'trending_up'
        },
        { 
          icon: 'groups',
          title: 'New Clients', 
          value: '154', 
          trend: '+5.2%',
          trendDirection: 'up',
          trendIcon: 'trending_up'
        },
        { 
          icon: 'inventory',
          title: 'Products Sold', 
          value: '1,248', 
          trend: '+8.1%',
          trendDirection: 'up',
          trendIcon: 'trending_up'
        },
        { 
          icon: 'savings',
          title: 'Profit Margin', 
          value: '32%', 
          trend: '-2.5%',
          trendDirection: 'down',
          trendIcon: 'trending_down'
        }
      ],
      activities: [
        {
          icon: 'payment',
          title: 'Payment received from client #45892',
          time: '10 minutes ago',
          amount: '+$2,500',
          type: 'payment'
        },
        {
          icon: 'inventory',
          title: 'New product added to inventory',
          time: '2 hours ago',
          amount: '12 items',
          type: 'inventory'
        },
        {
          icon: 'groups',
          title: 'New client onboarded',
          time: '1 day ago',
          amount: 'Premium',
          type: 'client'
        },
        {
          icon: 'receipt',
          title: 'Invoice #45892 generated',
          time: '2 days ago',
          amount: '$5,200',
          type: 'invoice'
        }
      ]
    }
  },
  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
    this.initCharts();
    
    // System preference detection
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.darkMode = true;
      document.documentElement.classList.add('dark');
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile);
    if (this.mainChart) this.mainChart.destroy();
    if (this.donutChart) this.donutChart.destroy();
    if (this.barChart) this.barChart.destroy();
  },
  methods: {
    toggleTheme() {
      this.darkMode = !this.darkMode;
      document.documentElement.classList.toggle('dark', this.darkMode);
      this.updateCharts();
    },
    checkMobile() {
      this.isMobile = window.innerWidth < 1024;
      if (!this.isMobile) this.mobileNavOpen = false;
    },
    particleStyle(index) {
      const size = 4 + Math.random() * 6;
      const delay = Math.random() * 5;
      const duration = 10 + Math.random() * 20;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      
      return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${posX}%`,
        top: `${posY}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        opacity: 0.3 + Math.random() * 0.7
      };
    },
    initCharts() {
      Chart.register(...registerables);
      
      // Main Line Chart
      const mainCtx = this.$refs.mainChart.getContext('2d');
      this.mainChart = new Chart(mainCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [{
            label: 'Revenue',
            data: [12500, 18900, 21800, 25400, 18500, 24500, 32400],
            borderColor: '#D4AF37',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#000',
            pointBorderColor: '#D4AF37',
            pointRadius: 5,
            pointHoverRadius: 8,
            pointBorderWidth: 2
          }]
        },
        options: this.getChartOptions('line')
      });

      // Donut Chart
      const donutCtx = this.$refs.donutChart.getContext('2d');
      this.donutChart = new Chart(donutCtx, {
        type: 'doughnut',
        data: {
          labels: ['Product Sales', 'Services', 'Subscriptions', 'Other'],
          datasets: [{
            data: [45, 25, 20, 10],
            backgroundColor: [
              '#D4AF37',
              '#000000',
              '#333333',
              '#555555'
            ],
            borderWidth: 0
          }]
        },
        options: this.getChartOptions('doughnut')
      });

      // Bar Chart
      const barCtx = this.$refs.barChart.getContext('2d');
      this.barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: ['Luxury Watch', 'Gold Chain', 'Diamond Ring', 'Silk Scarf', 'Leather Bag'],
          datasets: [{
            label: 'Sales',
            data: [85, 72, 64, 45, 38],
            backgroundColor: '#D4AF37',
            borderRadius: 4,
            borderWidth: 0
          }]
        },
        options: this.getChartOptions('bar')
      });
    },
    updateCharts() {
      if (this.mainChart) {
        this.mainChart.options = this.getChartOptions('line');
        this.mainChart.update();
      }
      if (this.donutChart) {
        this.donutChart.options = this.getChartOptions('doughnut');
        this.donutChart.update();
      }
      if (this.barChart) {
        this.barChart.options = this.getChartOptions('bar');
        this.barChart.update();
      }
    },
    getChartOptions(type) {
      const gridColor = this.darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
      const textColor = this.darkMode ? '#f5f5f5' : '#333333';
      const fontFamily = "'Montserrat', sans-serif";

      const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: textColor,
              font: {
                family: fontFamily,
                size: 12,
                weight: '500'
              },
              padding: 20,
              usePointStyle: true,
              boxWidth: 8
            }
          },
          tooltip: {
            backgroundColor: this.darkMode ? '#1a1a1a' : '#ffffff',
            titleColor: textColor,
            bodyColor: textColor,
            borderColor: '#D4AF37',
            borderWidth: 1,
            padding: 12,
            usePointStyle: true,
            boxPadding: 6,
            cornerRadius: 8,
            bodyFont: {
              family: fontFamily,
              size: 12,
              weight: '500'
            },
            titleFont: {
              family: fontFamily,
              size: 14,
              weight: '600'
            }
          }
        }
      };

      if (type === 'line') {
        return {
          ...commonOptions,
          scales: {
            y: {
              grid: {
                color: gridColor,
                drawBorder: false
              },
              ticks: {
                color: textColor,
                font: {
                  family: fontFamily,
                  weight: '500'
                },
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            },
            x: {
              grid: {
                color: gridColor,
                drawBorder: false
              },
              ticks: {
                color: textColor,
                font: {
                  family: fontFamily,
                  weight: '500'
                }
              }
            }
          },
          elements: {
            line: {
              tension: 0.4
            }
          }
        };
      } else if (type === 'bar') {
        return {
          ...commonOptions,
          scales: {
            y: {
              grid: {
                color: gridColor,
                drawBorder: false
              },
              ticks: {
                color: textColor,
                font: {
                  family: fontFamily,
                  weight: '500'
                }
              }
            },
            x: {
              grid: {
                color: gridColor,
                drawBorder: false
              },
              ticks: {
                color: textColor,
                font: {
                  family: fontFamily,
                  weight: '500'
                }
              }
            }
          }
        };
      } else {
        return commonOptions;
      }
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

:root {
  /* Luxury Light Theme */
  --bg-primary: #ffffff;
  --bg-secondary: #f8f8f8;
  --bg-card: #ffffff;
  --text-primary: #333333;
  --text-secondary: #666666;
  --gold-primary: #D4AF37;
  --gold-secondary: #F5D07C;
  --gold-accent: rgba(212, 175, 55, 0.2);
  --border-color: #e0e0e0;
  --shadow-color: rgba(0, 0, 0, 0.1);
  --sidenav-width: 280px;
  --mobile-header-height: 60px;
  --transition-duration: 0.3s;
}

.dark {
  /* Luxury Dark Theme */
  --bg-primary: #121212;
  --bg-secondary: #1a1a1a;
  --bg-card: #1e1e1e;
  --text-primary: #f5f5f5;
  --text-secondary: #b0b0b0;
  --border-color: #333333;
  --shadow-color: rgba(0, 0, 0, 0.3);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Montserrat', sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color var(--transition-duration) ease, 
              color var(--transition-duration) ease;
}

/* Accessibility Class */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Main Layout Structure */
.dashboard {
  display: grid;
  grid-template-columns: var(--sidenav-width) 1fr;
  min-height: 100vh;
  position: relative;
}

/* Gold Particle Background */
.gold-particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.particle {
  position: absolute;
  background-color: var(--gold-primary);
  border-radius: 50%;
  animation: float-particle linear infinite;
  z-index: 0;
}

@keyframes float-particle {
  0% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-100px) translateX(20px);
  }
  100% {
    transform: translateY(0) translateX(0);
  }
}

/* Mobile Header */
.mobile-header {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--mobile-header-height);
  padding: 0 1rem;
  background-color: var(--bg-card);
  box-shadow: 0 2px 10px var(--shadow-color);
  z-index: 100;
  align-items: center;
  justify-content: space-between;
}

.mobile-logo {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--gold-primary);
}

.menu-toggle, .theme-toggle-mobile {
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color var(--transition-duration) ease;
}

.menu-toggle:hover, .theme-toggle-mobile:hover {
  background: var(--gold-accent);
}

/* Side Navigation */
.sidenav {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--sidenav-width);
  height: 100vh;
  background-color: var(--bg-card);
  box-shadow: 2px 0 15px var(--shadow-color);
  z-index: 100;
  display: flex;
  flex-direction: column;
  transition: transform var(--transition-duration) ease;
}

.nav-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
}

.logo {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.logo-svg {
  width: 32px;
  height: 32px;
  margin-right: 0.75rem;
}

.close-nav {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color var(--transition-duration) ease;
}

.close-nav:hover {
  color: var(--gold-primary);
}

.nav-menu {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-duration) ease;
  text-align: left;
}

.nav-item span {
  margin-right: 0.75rem;
  color: var(--text-secondary);
  transition: color var(--transition-duration) ease;
}

.nav-item:hover {
  background: var(--gold-accent);
  color: var(--text-primary);
}

.nav-item:hover span {
  color: var(--gold-primary);
}

.nav-item.active {
  background: var(--gold-accent);
  color: var(--gold-primary);
  font-weight: 600;
}

.nav-item.active span {
  color: var(--gold-primary);
}

.gold-bar {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: var(--gold-primary);
  border-radius: 2px 0 0 2px;
}

.user-profile {
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 0.75rem;
  border: 2px solid var(--gold-primary);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.user-info .name {
  font-weight: 600;
  font-size: 0.9rem;
}

.user-info .role {
  font-size: 0.8rem;
  color: var(--gold-primary);
}

/* Main Content */
.main-content {
  grid-column: 2;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin-left: var(--sidenav-width);
  position: relative;
  z-index: 1;
}

.topnav {
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--bg-card);
  box-shadow: 0 2px 10px var(--shadow-color);
  z-index: 10;
}

.topnav h1 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-bar {
  display: flex;
  align-items: center;
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  transition: border-color var(--transition-duration) ease;
}

.search-bar:focus-within {
  border-color: var(--gold-primary);
}

.search-bar input {
  background: transparent;
  border: none;
  color: var(--text-primary);
  padding: 0 0.5rem;
  font-family: 'Montserrat';
  font-weight: 500;
  outline: none;
  width: 180px;
}

.notification-btn, .theme-toggle {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: none;
  cursor: pointer;
  transition: all var(--transition-duration) ease;
}

.notification-btn:hover, .theme-toggle:hover {
  background: var(--gold-accent);
  color: var(--gold-primary);
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ff4757;
  color: white;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

/* Dashboard Content */
.dashboard-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Stats Grid */
.stats-section {
  margin-bottom: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  position: relative;
  background: var(--bg-card);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px var(--shadow-color);
  overflow: hidden;
  transition: all var(--transition-duration) ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px var(--shadow-color);
}

.stat-card.up .gold-accent {
  background: linear-gradient(90deg, var(--gold-primary), var(--gold-secondary));
}

.stat-card.down .gold-accent {
  background: linear-gradient(90deg, #ff4757, #ff6b81);
}

.gold-accent {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
}

.card-content {
  display: flex;
  align-items: center;
}

.icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.5rem;
  background: var(--gold-accent);
  color: var(--gold-primary);
  transition: transform var(--transition-duration) ease;
}

.stat-card:hover .icon {
  transform: scale(1.05);
}

.stat-card.down .icon {
  background: rgba(255, 71, 87, 0.1);
  color: #ff4757;
}

.text-content {
  flex: 1;
}

.title {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.value {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.trend {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 600;
}

.stat-card.up .trend {
  color: var(--gold-primary);
}

.stat-card.down .trend {
  color: #ff4757;
}

.trend .material-icons {
  font-size: 1.2rem;
  margin-right: 0.25rem;
}

/* Charts Section */
.charts-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.main-chart, .donut-chart, .bar-chart {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px var(--shadow-color);
  transition: transform var(--transition-duration) ease;
}

.main-chart:hover, .donut-chart:hover, .bar-chart:hover {
  transform: translateY(-3px);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.chart-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.time-filters {
  display: flex;
  gap: 0.5rem;
}

.time-filters button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-family: 'Montserrat';
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--transition-duration) ease;
}

.time-filters button:hover {
  border-color: var(--gold-primary);
  color: var(--gold-primary);
}

.time-filters button.active {
  background: var(--gold-accent);
  border-color: var(--gold-primary);
  color: var(--gold-primary);
}

.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}

.secondary-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

/* Recent Activity */
.recent-activity {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px var(--shadow-color);
  transition: transform var(--transition-duration) ease;
}

.recent-activity:hover {
  transform: translateY(-3px);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.view-all {
  background: transparent;
  border: none;
  color: var(--gold-primary);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  font-family: 'Montserrat';
  transition: opacity var(--transition-duration) ease;
}

.view-all:hover {
  opacity: 0.8;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  background: var(--bg-secondary);
  transition: all var(--transition-duration) ease;
}

.activity-item:hover {
  transform: translateX(5px);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: white;
  flex-shrink: 0;
}

.activity-icon.payment {
  background: var(--gold-primary);
}

.activity-icon.inventory {
  background: #333333;
}

.activity-icon.client {
  background: #555555;
}

.activity-icon.invoice {
  background: #777777;
}

.activity-details {
  flex: 1;
  min-width: 0;
}

.activity-title {
  font-weight: 500;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.activity-time {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.activity-amount {
  font-weight: 600;
  color: var(--gold-primary);
  margin-left: 1rem;
  flex-shrink: 0;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .dashboard {
    grid-template-columns: 1fr;
  }

  .sidenav {
    transform: translateX(-100%);
    top: var(--mobile-header-height);
    height: calc(100vh - var(--mobile-header-height));
  }

  .sidenav.visible {
    transform: translateX(0);
  }

  .main-content {
    grid-column: 1;
    margin-left: 0;
    width: 100%;
    padding-top: var(--mobile-header-height);
  }

  .mobile-header {
    display: flex;
  }

  .topnav {
    display: none;
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: 1.5rem;
  }

  .header-actions {
    gap: 0.5rem;
  }

  .search-bar input {
    width: 120px;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }

  .secondary-charts {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .time-filters {
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .time-filters button {
    padding: 0.5rem;
    font-size: 0.75rem;
  }

  .activity-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .activity-icon {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }

  .activity-amount {
    align-self: flex-end;
    margin-left: 0;
  }
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: var(--gold-primary);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--gold-secondary);
}

/* Mobile Nav Overlay */
.dashboard.mobile-nav-open::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 90;
  pointer-events: all;
  transition: opacity var(--transition-duration) ease;
}

/* Focus styles for accessibility */
button:focus-visible, 
input:focus-visible, 
[tabindex="0"]:focus-visible {
  outline: 2px solid var(--gold-primary);
  outline-offset: 2px;
}
</style>