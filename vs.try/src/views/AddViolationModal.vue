<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Add New Violation</h3>
        <button @click="$emit('close')" class="close-btn">
          <i class='bx bx-x'></i>
        </button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="studentId">Student ID</label>
            <input type="text" id="studentId" v-model="violation.studentId" required>
          </div>
          <div class="form-group">
            <label for="studentName">Student Name</label>
            <input type="text" id="studentName" v-model="violation.studentName" required>
          </div>
          <div class="form-group">
            <label for="violationType">Violation Type</label>
            <select id="violationType" v-model="violation.type" required>
              <option value="Tardiness">Tardiness</option>
              <option value="Uniform">Uniform Violation</option>
              <option value="Disrespect">Disrespect</option>
              <option value="Cheating">Cheating</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div class="form-group">
            <label for="violationDetails">Details</label>
            <textarea id="violationDetails" v-model="violation.details" rows="3"></textarea>
          </div>
          <div class="form-actions">
            <button type="button" @click="$emit('close')" class="btn-cancel">Cancel</button>
            <button type="submit" class="btn-save">Record Violation</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddViolationModal',
  data() {
    return {
      violation: {
        studentId: '',
        studentName: '',
        type: 'Tardiness',
        details: ''
      }
    };
  },
  methods: {
    submitForm() {
      this.$emit('save', this.violation);
      this.violation = {
        studentId: '',
        studentName: '',
        type: 'Tardiness',
        details: ''
      };
    }
  }
};
</script>

<style scoped>
/* Similar styles to AddDepartmentModal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}

.modal-content {
  background: var(--light);
  border-radius: 10px;
  width: 100%;
  max-width: 500px;
  padding: 24px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-header h3 {
  color: var(--dark);
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--dark-grey);
  cursor: pointer;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: var(--dark);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--grey);
  border-radius: 5px;
  background: var(--light);
  color: var(--dark);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
}

.btn-cancel {
  background: var(--grey);
  color: var(--dark);
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-save {
  background: var(--blue);
  color: var(--light);
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}
</style>