<script>
import { ref, computed, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';
import AddDepartmentModal from './modals/AddDepartmentModal.vue';
import AddViolationModal from './modals/AddViolationModal.vue';
import ViolationDetailsModal from './modals/ViolationDetailsModal.vue';

export default {
  name: 'Dashboard',
  components: {
    AddDepartmentModal,
    AddViolationModal,
    ViolationDetailsModal
  },
  setup() {
    // State management
    const activeTab = ref('dashboard');
    const sidebarHidden = ref(false);
    const darkMode = ref(false);
    const searchQuery = ref('');
    const notificationsCount = ref(8);
    const userProfileImage = ref('img/people.png');
    
    // Dashboard data
    const dashboardStats = ref({
      totalStudents: 1250,
      totalViolations: 34,
      totalDepartments: 8
    });
    
    const recentViolations = ref([
      { id: 1, studentName: 'John Doe', studentImage: 'img/people.png', date: new Date(), type: 'Tardiness', status: 'pending' },
      { id: 2, studentName: 'Jane Smith', studentImage: 'img/people.png', date: new Date(Date.now() - 86400000), type: 'Uniform', status: 'resolved' },
      { id: 3, studentName: 'Mike Johnson', studentImage: 'img/people.png', date: new Date(Date.now() - 172800000), type: 'Disrespect', status: 'pending' },
      { id: 4, studentName: 'Sarah Williams', studentImage: 'img/people.png', date: new Date(Date.now() - 259200000), type: 'Cheating', status: 'resolved' }
    ]);
    
    const todos = ref([
      { text: 'Review pending violations', completed: false },
      { text: 'Update department records', completed: true },
      { text: 'Generate monthly report', completed: false },
      { text: 'Meet with department heads', completed: true },
      { text: 'Update student records', completed: false }
    ]);
    
    // Department data
    const departments = ref([
      { id: 1, name: 'Computer Science', head: 'Dr. Smith', studentCount: 320 },
      { id: 2, name: 'Engineering', head: 'Dr. Johnson', studentCount: 280 },
      { id: 3, name: 'Business', head: 'Dr. Williams', studentCount: 250 },
      { id: 4, name: 'Arts', head: 'Dr. Brown', studentCount: 180 }
    ]);
    
    // Violation data
    const violations = ref([
      { id: 1, studentId: '2021-001', studentName: 'John Doe', type: 'Tardiness', date: new Date(), status: 'pending' },
      { id: 2, studentId: '2021-002', studentName: 'Jane Smith', type: 'Uniform', date: new Date(Date.now() - 86400000), status: 'resolved' },
      { id: 3, studentId: '2021-003', studentName: 'Mike Johnson', type: 'Disrespect', date: new Date(Date.now() - 172800000), status: 'pending' },
      { id: 4, studentId: '2021-004', studentName: 'Sarah Williams', type: 'Cheating', date: new Date(Date.now() - 259200000), status: 'resolved' }
    ]);
    
    const violationFilter = ref('all');
    const filteredViolations = computed(() => {
      if (violationFilter.value === 'all') return violations.value;
      return violations.value.filter(v => v.status === violationFilter.value || v.type === violationFilter.value);
    });
    
    // Reports data
    const reportType = ref('violations');
    const reportPeriod = ref('monthly');
    const reportStats = ref([
      { label: 'Total Violations', value: 34 },
      { label: 'Pending Cases', value: 12 },
      { label: 'Resolved Cases', value: 22 },
      { label: 'Repeat Offenders', value: 5 }
    ]);
    
    // Modal controls
    const showAddDepartmentModal = ref(false);
    const showAddViolationModal = ref(false);
    const selectedViolation = ref(null);
    
    // Chart reference
    const reportChart = ref(null);
    let chartInstance = null;
    
    // Methods
    const setActiveTab = (tab) => {
      activeTab.value = tab;
    };
    
    const toggleSidebar = () => {
      sidebarHidden.value = !sidebarHidden.value;
    };
    
    const search = () => {
      // Implement search functionality
      console.log('Searching for:', searchQuery.value);
    };
    
    const logout = () => {
      // Implement logout functionality
      console.log('Logging out...');
    };
    
    const downloadReport = () => {
      // Implement download functionality
      console.log('Downloading report...');
    };
    
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString();
    };
    
    const addNewTodo = () => {
      const newTodo = prompt('Enter new todo:');
      if (newTodo) {
        todos.value.push({ text: newTodo, completed: false });
      }
    };
    
    const showTodoOptions = (index) => {
      // Implement todo options
      console.log('Showing options for todo at index:', index);
    };
    
    const saveDepartment = (newDept) => {
      departments.value.push({
        id: departments.value.length + 1,
        ...newDept,
        studentCount: 0
      });
      showAddDepartmentModal.value = false;
    };
    
    const editDepartment = (dept) => {
      // Implement edit functionality
      console.log('Editing department:', dept);
    };
    
    const confirmDeleteDepartment = (id) => {
      if (confirm('Are you sure you want to delete this department?')) {
        departments.value = departments.value.filter(d => d.id !== id);
      }
    };
    
    const filterViolations = () => {
      // Filtering is handled by computed property
    };
    
    const saveViolation = (newViolation) => {
      violations.value.push({
        id: violations.value.length + 1,
        ...newViolation,
        date: new Date(),
        status: 'pending'
      });
      showAddViolationModal.value = false;
    };
    
    const viewViolationDetails = (id) => {
      selectedViolation.value = violations.value.find(v => v.id === id);
    };
    
    const editViolation = (violation) => {
      // Implement edit functionality
      console.log('Editing violation:', violation);
    };
    
    const updateViolationStatus = (updatedViolation) => {
      const index = violations.value.findIndex(v => v.id === updatedViolation.id);
      if (index !== -1) {
        violations.value[index] = updatedViolation;
      }
      selectedViolation.value = null;
    };
    
    const generateReport = () => {
      // Implement report generation
      console.log('Generating', reportType.value, 'report for', reportPeriod.value);
      
      // Update chart
      if (chartInstance) {
        chartInstance.destroy();
      }
      
      const ctx = reportChart.value.getContext('2d');
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: reportType.value === 'violations' ? 'Violations' : reportType.value === 'students' ? 'Students' : 'Departments',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    };
    
    const printReport = () => {
      window.print();
    };
    
    const exportReport = () => {
      // Implement export functionality
      console.log('Exporting report...');
    };
    
    // Watch for dark mode changes
    watch(darkMode, (newVal) => {
      document.body.classList.toggle('dark', newVal);
    });
    
    // Initialize chart on mount
    onMounted(() => {
      generateReport();
    });
    
    // Computed properties
    const pageTitle = computed(() => {
      switch (activeTab.value) {
        case 'dashboard': return 'Dashboard';
        case 'department': return 'Department Management';
        case 'violation': return 'Student Violation Records';
        case 'reports': return 'System Reports';
        default: return 'Dashboard';
      }
    });
    
    return {
      // State
      activeTab,
      sidebarHidden,
      darkMode,
      searchQuery,
      notificationsCount,
      userProfileImage,
      
      // Data
      dashboardStats,
      recentViolations,
      todos,
      departments,
      violations,
      violationFilter,
      filteredViolations,
      reportType,
      reportPeriod,
      reportStats,
      
      // Refs
      reportChart,
      
      // Modals
      showAddDepartmentModal,
      showAddViolationModal,
      selectedViolation,
      
      // Methods
      setActiveTab,
      toggleSidebar,
      search,
      logout,
      downloadReport,
      formatDate,
      addNewTodo,
      showTodoOptions,
      saveDepartment,
      editDepartment,
      confirmDeleteDepartment,
      filterViolations,
      saveViolation,
      viewViolationDetails,
      editViolation,
      updateViolationStatus,
      generateReport,
      printReport,
      exportReport,
      
      // Computed
      pageTitle
    };
  }
};
</script>


<template>
  <div class="dashboard-container">
    <!-- SIDEBAR -->
    <section id="sidebar" :class="{ hide: sidebarHidden }">
      <a href="#" class="brand">
        <i class='bx bxs-smile'></i>
        <span class="text">AdminHub</span>
      </a>
      <ul class="side-menu top">
        <li :class="{ active: activeTab === 'dashboard' }">
          <a href="#" @click.prevent="setActiveTab('dashboard')">
            <i class='bx bxs-dashboard'></i>
            <span class="text">Dashboard</span>
          </a>
        </li>
        <li :class="{ active: activeTab === 'department' }">
          <a href="#" @click.prevent="setActiveTab('department')">
            <i class='bx bxs-group'></i>
            <span class="text">Department</span>
          </a>
        </li>
        <li :class="{ active: activeTab === 'violation' }">
          <a href="#" @click.prevent="setActiveTab('violation')">
            <i class='bx bxs-report'></i>
            <span class="text">Student Violation</span>
          </a>
        </li>
        <li :class="{ active: activeTab === 'reports' }">
          <a href="#" @click.prevent="setActiveTab('reports')">
            <i class='bx bxs-doughnut-chart'></i>
            <span class="text">Reports</span>
          </a>
        </li>
      </ul>
      <ul class="side-menu">
        <li>
          <a href="#">
            <i class='bx bxs-cog'></i>
            <span class="text">Settings</span>
          </a>
        </li>
        <li>
          <a href="#" class="logout" @click.prevent="logout">
            <i class='bx bxs-log-out-circle'></i>
            <span class="text">Logout</span>
          </a>
        </li>
      </ul>
    </section>
    <!-- SIDEBAR -->

    <!-- CONTENT -->
    <section id="content" :style="{ width: sidebarHidden ? 'calc(100% - 60px)' : 'calc(100% - 280px)', left: sidebarHidden ? '60px' : '280px' }">
      <!-- NAVBAR -->
      <nav>
        <i class='bx bx-menu' @click="toggleSidebar"></i>
        <a href="#" class="nav-link">Categories</a>
        <form action="#">
          <div class="form-input">
            <input type="search" placeholder="Search..." v-model="searchQuery">
            <button type="submit" class="search-btn" @click.prevent="search"><i class='bx bx-search'></i></button>
          </div>
        </form>
        <input type="checkbox" id="switch-mode" v-model="darkMode" hidden>
        <label for="switch-mode" class="switch-mode"></label>
        <a href="#" class="notification">
          <i class='bx bxs-bell'></i>
          <span class="num">{{ notificationsCount }}</span>
        </a>
        <a href="#" class="profile">
          <img :src="userProfileImage">
        </a>
      </nav>
      <!-- NAVBAR -->

      <!-- MAIN CONTENT -->
      <main>
        <div class="head-title">
          <div class="left">
            <h1>{{ pageTitle }}</h1>
            <ul class="breadcrumb">
              <li>
                <a href="#">Dashboard</a>
              </li>
              <li><i class='bx bx-chevron-right'></i></li>
              <li>
                <a class="active" href="#">{{ activeTab }}</a>
              </li>
            </ul>
          </div>
          <a href="#" class="btn-download" @click.prevent="downloadReport">
            <i class='bx bxs-cloud-download'></i>
            <span class="text">Download PDF</span>
          </a>
        </div>

        <!-- Dashboard Content -->
        <div v-if="activeTab === 'dashboard'">
          <ul class="box-info">
            <li>
              <i class='bx bxs-calendar-check'></i>
              <span class="text">
                <h3>{{ dashboardStats.totalStudents }}</h3>
                <p>Total Students</p>
              </span>
            </li>
            <li>
              <i class='bx bxs-group'></i>
              <span class="text">
                <h3>{{ dashboardStats.totalViolations }}</h3>
                <p>Violations This Month</p>
              </span>
            </li>
            <li>
              <i class='bx bxs-school'></i>
              <span class="text">
                <h3>{{ dashboardStats.totalDepartments }}</h3>
                <p>Departments</p>
              </span>
            </li>
          </ul>

          <div class="table-data">
            <div class="order">
              <div class="head">
                <h3>Recent Violations</h3>
                <i class='bx bx-search' @click="showViolationSearch = !showViolationSearch"></i>
                <i class='bx bx-filter' @click="showViolationFilter = !showViolationFilter"></i>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Date</th>
                    <th>Violation Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="violation in recentViolations" :key="violation.id">
                    <td>
                      <img :src="violation.studentImage || 'img/people.png'">
                      <p>{{ violation.studentName }}</p>
                    </td>
                    <td>{{ formatDate(violation.date) }}</td>
                    <td>{{ violation.type }}</td>
                    <td><span class="status" :class="violation.status">{{ violation.status }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="todo">
              <div class="head">
                <h3>Pending Actions</h3>
                <i class='bx bx-plus' @click="addNewTodo"></i>
                <i class='bx bx-filter' @click="showTodoFilter = !showTodoFilter"></i>
              </div>
              <ul class="todo-list">
                <li v-for="(todo, index) in todos" :key="index" :class="{ completed: todo.completed }">
                  <p>{{ todo.text }}</p>
                  <i class='bx bx-dots-vertical-rounded' @click="showTodoOptions(index)"></i>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Department Content -->
        <div v-if="activeTab === 'department'">
          <div class="department-management">
            <div class="department-header">
              <h2>Department Management</h2>
              <button class="btn-add" @click="showAddDepartmentModal = true">
                <i class='bx bx-plus'></i> Add Department
              </button>
            </div>
            
            <div class="department-list">
              <div class="department-card" v-for="dept in departments" :key="dept.id">
                <div class="dept-info">
                  <h3>{{ dept.name }}</h3>
                  <p>Head: {{ dept.head }}</p>
                  <p>Students: {{ dept.studentCount }}</p>
                </div>
                <div class="dept-actions">
                  <button class="btn-edit" @click="editDepartment(dept)">
                    <i class='bx bx-edit'></i>
                  </button>
                  <button class="btn-delete" @click="confirmDeleteDepartment(dept.id)">
                    <i class='bx bx-trash'></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Student Violation Content -->
        <div v-if="activeTab === 'violation'">
          <div class="violation-management">
            <div class="violation-header">
              <h2>Student Violation Records</h2>
              <div class="violation-controls">
                <button class="btn-add" @click="showAddViolationModal = true">
                  <i class='bx bx-plus'></i> Add Violation
                </button>
                <select v-model="violationFilter" @change="filterViolations">
                  <option value="all">All Violations</option>
                  <option value="minor">Minor</option>
                  <option value="major">Major</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
            
            <div class="violation-table">
              <table>
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Violation Type</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="violation in filteredViolations" :key="violation.id">
                    <td>{{ violation.studentId }}</td>
                    <td>{{ violation.studentName }}</td>
                    <td>{{ violation.type }}</td>
                    <td>{{ formatDate(violation.date) }}</td>
                    <td><span class="status" :class="violation.status">{{ violation.status }}</span></td>
                    <td class="actions">
                      <button @click="viewViolationDetails(violation.id)">
                        <i class='bx bx-show'></i>
                      </button>
                      <button @click="editViolation(violation)">
                        <i class='bx bx-edit'></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Reports Content -->
        <div v-if="activeTab === 'reports'">
          <div class="reports-section">
            <div class="reports-header">
              <h2>System Reports</h2>
              <div class="report-controls">
                <select v-model="reportType" @change="generateReport">
                  <option value="violations">Violation Reports</option>
                  <option value="students">Student Reports</option>
                  <option value="departments">Department Reports</option>
                </select>
                <select v-model="reportPeriod" @change="generateReport">
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="custom">Custom Range</option>
                </select>
                <button class="btn-generate" @click="generateReport">
                  <i class='bx bx-refresh'></i> Generate
                </button>
              </div>
            </div>
            
            <div class="report-content">
              <div class="report-chart">
                <canvas ref="reportChart"></canvas>
              </div>
              <div class="report-summary">
                <h3>Summary</h3>
                <div class="summary-stats">
                  <div class="stat-card" v-for="stat in reportStats" :key="stat.label">
                    <h4>{{ stat.value }}</h4>
                    <p>{{ stat.label }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="report-actions">
              <button class="btn-print" @click="printReport">
                <i class='bx bx-printer'></i> Print Report
              </button>
              <button class="btn-export" @click="exportReport">
                <i class='bx bx-download'></i> Export as PDF
              </button>
            </div>
          </div>
        </div>
      </main>
      <!-- MAIN CONTENT -->
    </section>
    <!-- CONTENT -->

    <!-- Modals -->
    <AddDepartmentModal 
      v-if="showAddDepartmentModal" 
      @close="showAddDepartmentModal = false"
      @save="saveDepartment"
    />
    
    <AddViolationModal 
      v-if="showAddViolationModal" 
      @close="showAddViolationModal = false"
      @save="saveViolation"
    />
    
    <ViolationDetailsModal 
      v-if="selectedViolation" 
      :violation="selectedViolation"
      @close="selectedViolation = null"
      @update="updateViolationStatus"
    />
  </div>
</template>


<style scoped>
/* Import the same styles from the original HTML */
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Poppins:wght@400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

a {
  text-decoration: none;
}

li {
  list-style: none;
}

:root {
  --poppins: 'Poppins', sans-serif;
  --lato: 'Lato', sans-serif;

  --light: #F9F9F9;
  --blue: #3C91E6;
  --light-blue: #CFE8FF;
  --grey: #eee;
  --dark-grey: #AAAAAA;
  --dark: #342E37;
  --red: #DB504A;
  --yellow: #FFCE26;
  --light-yellow: #FFF2C6;
  --orange: #FD7238;
  --light-orange: #FFE0D3;
}

html {
  overflow-x: hidden;
}

body.dark {
  --light: #0C0C1E;
  --grey: #060714;
  --dark: #FBFBFB;
}

body {
  background: var(--grey);
  overflow-x: hidden;
}

/* SIDEBAR */
#sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100%;
  background: var(--light);
  z-index: 2000;
  font-family: var(--lato);
  transition: .3s ease;
  overflow-x: hidden;
  scrollbar-width: none;
}
#sidebar::--webkit-scrollbar {
  display: none;
}
#sidebar.hide {
  width: 60px;
}
#sidebar .brand {
  font-size: 24px;
  font-weight: 700;
  height: 56px;
  display: flex;
  align-items: center;
  color: var(--blue);
  position: sticky;
  top: 0;
  left: 0;
  background: var(--light);
  z-index: 500;
  padding-bottom: 20px;
  box-sizing: content-box;
}
#sidebar .brand .bx {
  min-width: 60px;
  display: flex;
  justify-content: center;
}
#sidebar .side-menu {
  width: 100%;
  margin-top: 48px;
}
#sidebar .side-menu li {
  height: 48px;
  background: transparent;
  margin-left: 6px;
  border-radius: 48px 0 0 48px;
  padding: 4px;
}
#sidebar .side-menu li.active {
  background: var(--grey);
  position: relative;
}
#sidebar .side-menu li.active::before {
  content: '';
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  top: -40px;
  right: 0;
  box-shadow: 20px 20px 0 var(--grey);
  z-index: -1;
}
#sidebar .side-menu li.active::after {
  content: '';
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  bottom: -40px;
  right: 0;
  box-shadow: 20px -20px 0 var(--grey);
  z-index: -1;
}
#sidebar .side-menu li a {
  width: 100%;
  height: 100%;
  background: var(--light);
  display: flex;
  align-items: center;
  border-radius: 48px;
  font-size: 16px;
  color: var(--dark);
  white-space: nowrap;
  overflow-x: hidden;
}
#sidebar .side-menu.top li.active a {
  color: var(--blue);
}
#sidebar.hide .side-menu li a {
  width: calc(48px - (4px * 2));
  transition: width .3s ease;
}
#sidebar .side-menu li a.logout {
  color: var(--red);
}
#sidebar .side-menu.top li a:hover {
  color: var(--blue);
}
#sidebar .side-menu li a .bx {
  min-width: calc(60px  - ((4px + 6px) * 2));
  display: flex;
  justify-content: center;
}
/* SIDEBAR */

/* CONTENT */
#content {
  position: relative;
  transition: .3s ease;
}

/* NAVBAR */
#content nav {
  height: 56px;
  background: var(--light);
  padding: 0 24px;
  display: flex;
  align-items: center;
  grid-gap: 24px;
  font-family: var(--lato);
  position: sticky;
  top: 0;
  left: 0;
  z-index: 1000;
}
#content nav::before {
  content: '';
  position: absolute;
  width: 40px;
  height: 40px;
  bottom: -40px;
  left: 0;
  border-radius: 50%;
  box-shadow: -20px -20px 0 var(--light);
}
#content nav a {
  color: var(--dark);
}
#content nav .bx.bx-menu {
  cursor: pointer;
  color: var(--dark);
}
#content nav .nav-link {
  font-size: 16px;
  transition: .3s ease;
}
#content nav .nav-link:hover {
  color: var(--blue);
}
#content nav form {
  max-width: 400px;
  width: 100%;
  margin-right: auto;
}
#content nav form .form-input {
  display: flex;
  align-items: center;
  height: 36px;
}
#content nav form .form-input input {
  flex-grow: 1;
  padding: 0 16px;
  height: 100%;
  border: none;
  background: var(--grey);
  border-radius: 36px 0 0 36px;
  outline: none;
  width: 100%;
  color: var(--dark);
}
#content nav form .form-input button {
  width: 36px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--blue);
  color: var(--light);
  font-size: 18px;
  border: none;
  outline: none;
  border-radius: 0 36px 36px 0;
  cursor: pointer;
}
#content nav .notification {
  font-size: 20px;
  position: relative;
}
#content nav .notification .num {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--light);
  background: var(--red);
  color: var(--light);
  font-weight: 700;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}
#content nav .profile img {
  width: 36px;
  height: 36px;
  object-fit: cover;
  border-radius: 50%;
}
#content nav .switch-mode {
  display: block;
  min-width: 50px;
  height: 25px;
  border-radius: 25px;
  background: var(--grey);
  cursor: pointer;
  position: relative;
}
#content nav .switch-mode::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  bottom: 2px;
  width: calc(25px - 4px);
  background: var(--blue);
  border-radius: 50%;
  transition: all .3s ease;
}
#content nav #switch-mode:checked + .switch-mode::before {
  left: calc(100% - (25px - 4px) - 2px);
}
/* NAVBAR */

/* MAIN */
#content main {
  width: 100%;
  padding: 36px 24px;
  font-family: var(--poppins);
  max-height: calc(100vh - 56px);
  overflow-y: auto;
}
#content main .head-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  grid-gap: 16px;
  flex-wrap: wrap;
}
#content main .head-title .left h1 {
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--dark);
}
#content main .head-title .left .breadcrumb {
  display: flex;
  align-items: center;
  grid-gap: 16px;
}
#content main .head-title .left .breadcrumb li {
  color: var(--dark);
}
#content main .head-title .left .breadcrumb li a {
  color: var(--dark-grey);
  pointer-events: none;
}
#content main .head-title .left .breadcrumb li a.active {
  color: var(--blue);
  pointer-events: unset;
}
#content main .head-title .btn-download {
  height: 36px;
  padding: 0 16px;
  border-radius: 36px;
  background: var(--blue);
  color: var(--light);
  display: flex;
  justify-content: center;
  align-items: center;
  grid-gap: 10px;
  font-weight: 500;
}

#content main .box-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  grid-gap: 24px;
  margin-top: 36px;
}
#content main .box-info li {
  padding: 24px;
  background: var(--light);
  border-radius: 20px;
  display: flex;
  align-items: center;
  grid-gap: 24px;
}
#content main .box-info li .bx {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  font-size: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
}
#content main .box-info li:nth-child(1) .bx {
  background: var(--light-blue);
  color: var(--blue);
}
#content main .box-info li:nth-child(2) .bx {
  background: var(--light-yellow);
  color: var(--yellow);
}
#content main .box-info li:nth-child(3) .bx {
  background: var(--light-orange);
  color: var(--orange);
}
#content main .box-info li .text h3 {
  font-size: 24px;
  font-weight: 600;
  color: var(--dark);
}
#content main .box-info li .text p {
  color: var(--dark);  
}

#content main .table-data {
  display: flex;
  flex-wrap: wrap;
  grid-gap: 24px;
  margin-top: 24px;
  width: 100%;
  color: var(--dark);
}
#content main .table-data > div {
  border-radius: 20px;
  background: var(--light);
  padding: 24px;
  overflow-x: auto;
}
#content main .table-data .head {
  display: flex;
  align-items: center;
  grid-gap: 16px;
  margin-bottom: 24px;
}
#content main .table-data .head h3 {
  margin-right: auto;
  font-size: 24px;
  font-weight: 600;
}
#content main .table-data .head .bx {
  cursor: pointer;
}

#content main .table-data .order {
  flex-grow: 1;
  flex-basis: 500px;
}
#content main .table-data .order table {
  width: 100%;
  border-collapse: collapse;
}
#content main .table-data .order table th {
  padding-bottom: 12px;
  font-size: 13px;
  text-align: left;
  border-bottom: 1px solid var(--grey);
}
#content main .table-data .order table td {
  padding: 16px 0;
}
#content main .table-data .order table tr td:first-child {
  display: flex;
  align-items: center;
  grid-gap: 12px;
  padding-left: 6px;
}
#content main .table-data .order table td img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}
#content main .table-data .order table tbody tr:hover {
  background: var(--grey);
}
#content main .table-data .order table tr td .status {
  font-size: 10px;
  padding: 6px 16px;
  color: var(--light);
  border-radius: 20px;
  font-weight: 700;
}
#content main .table-data .order table tr td .status.completed,
#content main .table-data .order table tr td .status.resolved {
  background: var(--blue);
}
#content main .table-data .order table tr td .status.process {
  background: var(--yellow);
}
#content main .table-data .order table tr td .status.pending {
  background: var(--orange);
}

#content main .table-data .todo {
  flex-grow: 1;
  flex-basis: 300px;
}
#content main .table-data .todo .todo-list {
  width: 100%;
}
#content main .table-data .todo .todo-list li {
  width: 100%;
  margin-bottom: 16px;
  background: var(--grey);
  border-radius: 10px;
  padding: 14px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#content main .table-data .todo .todo-list li .bx {
  cursor: pointer;
}
#content main .table-data .todo .todo-list li.completed {
  border-left: 10px solid var(--blue);
}
#content main .table-data .todo .todo-list li.not-completed {
  border-left: 10px solid var(--orange);
}
#content main .table-data .todo .todo-list li:last-child {
  margin-bottom: 0;
}

/* Department Management Styles */
.department-management {
  background: var(--light);
  border-radius: 20px;
  padding: 24px;
  margin-top: 24px;
}

.department-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.department-header h2 {
  font-size: 24px;
  color: var(--dark);
}

.btn-add {
  background: var(--blue);
  color: var(--light);
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.department-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.department-card {
  background: var(--grey);
  padding: 16px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
}

.dept-info h3 {
  color: var(--dark);
  margin-bottom: 8px;
}

.dept-info p {
  color: var(--dark-grey);
  font-size: 14px;
}

.dept-actions {
  display: flex;
  gap: 8px;
}

.btn-edit, .btn-delete {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.btn-edit {
  background: var(--light-blue);
  color: var(--blue);
}

.btn-delete {
  background: var(--light-orange);
  color: var(--orange);
}

/* Violation Management Styles */
.violation-management {
  background: var(--light);
  border-radius: 20px;
  padding: 24px;
  margin-top: 24px;
}

.violation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.violation-header h2 {
  font-size: 24px;
  color: var(--dark);
}

.violation-controls {
  display: flex;
  gap: 16px;
  align-items: center;
}

.violation-controls select {
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid var(--grey);
  background: var(--light);
  color: var(--dark);
}

.violation-table table {
  width: 100%;
  border-collapse: collapse;
}

.violation-table th {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--grey);
  color: var(--dark-grey);
}

.violation-table td {
  padding: 12px;
  border-bottom: 1px solid var(--grey);
}

.violation-table .actions {
  display: flex;
  gap: 8px;
}

.violation-table .actions button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: var(--grey);
  color: var(--dark);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* Reports Section Styles */
.reports-section {
  background: var(--light);
  border-radius: 20px;
  padding: 24px;
  margin-top: 24px;
}

.reports-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.reports-header h2 {
  font-size: 24px;
  color: var(--dark);
}

.report-controls {
  display: flex;
  gap: 16px;
  align-items: center;
}

.report-controls select {
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid var(--grey);
  background: var(--light);
  color: var(--dark);
}

.btn-generate, .btn-print, .btn-export {
  background: var(--blue);
  color: var(--light);
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.report-content {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.report-chart {
  flex: 2;
  background: var(--grey);
  border-radius: 10px;
  padding: 16px;
  height: 400px;
}

.report-summary {
  flex: 1;
  background: var(--grey);
  border-radius: 10px;
  padding: 16px;
}

.report-summary h3 {
  color: var(--dark);
  margin-bottom: 16px;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-card {
  background: var(--light);
  padding: 16px;
  border-radius: 10px;
  text-align: center;
}

.stat-card h4 {
  font-size: 24px;
  color: var(--blue);
  margin-bottom: 8px;
}

.stat-card p {
  color: var(--dark-grey);
  font-size: 14px;
}

.report-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

/* Responsive Styles */
@media screen and (max-width: 768px) {
  #sidebar {
    width: 200px;
  }

  #content {
    width: calc(100% - 60px);
    left: 200px;
  }

  #content nav .nav-link {
    display: none;
  }
  
  .report-content {
    flex-direction: column;
  }
  
  .department-list {
    grid-template-columns: 1fr;
  }
}

@media screen and (max-width: 576px) {
  #content nav form .form-input input {
    display: none;
  }

  #content nav form .form-input button {
    width: auto;
    height: auto;
    background: transparent;
    border-radius: none;
    color: var(--dark);
  }

  #content nav form.show .form-input input {
    display: block;
    width: 100%;
  }
  #content nav form.show .form-input button {
    width: 36px;
    height: 100%;
    border-radius: 0 36px 36px 0;
    color: var(--light);
    background: var(--red);
  }

  #content nav form.show ~ .notification,
  #content nav form.show ~ .profile {
    display: none;
  }

  #content main .box-info {
    grid-template-columns: 1fr;
  }

  #content main .table-data .head {
    min-width: 420px;
  }
  #content main .table-data .order table {
    min-width: 420px;
  }
  #content main .table-data .todo .todo-list {
    min-width: 420px;
  }
  
  .violation-header, .reports-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .violation-controls, .report-controls {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .report-actions {
    justify-content: center;
  }
}
</style>