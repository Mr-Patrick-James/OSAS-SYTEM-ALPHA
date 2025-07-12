<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Violation Details</h3>
        <button @click="$emit('close')" class="close-btn">
          <i class='bx bx-x'></i>
        </button>
      </div>
      <div class="modal-body">
        <div class="violation-details">
          <div class="detail-row">
            <span class="detail-label">Student ID:</span>
            <span class="detail-value">{{ violation.studentId }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Student Name:</span>
            <span class="detail-value">{{ violation.studentName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Violation Type:</span>
            <span class="detail-value">{{ violation.type }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Date:</span>
            <span class="detail-value">{{ formatDate(violation.date) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status:</span>
            <span class="detail-value">
              <select v-model="updatedStatus">
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>
            </span>
          </div>
          <div class="detail-row full-width">
            <span class="detail-label">Details:</span>
            <span class="detail-value">{{ violation.details || 'No additional details provided' }}</span>
          </div>
        </div>
        <div class="form-actions">
          <button type="button" @click="$emit('close')" class="btn-cancel">Close</button>
          <button type="button" @click="updateStatus" class="btn-save">Update Status</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ViolationDetailsModal',
  props: {
    violation: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      updatedStatus: this.violation.status
    };
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    updateStatus() {
      const updatedViolation = { ...this.violation, status: this.updatedStatus };
      this.$emit('update', updatedViolation);
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
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
  max-width: 600px;
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

.violation-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-row {
  display: flex;
}

.detail-row.full-width {
  flex-direction: column;
}

.detail-label {
  font-weight: 600;
  color: var(--dark);
  width: 150px;
}

.detail-value {
  color: var(--dark);
  flex: 1;
}

.detail-value select {
  padding: 5px 10px;
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