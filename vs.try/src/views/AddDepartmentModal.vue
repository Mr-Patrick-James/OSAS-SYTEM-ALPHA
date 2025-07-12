<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Add New Department</h3>
        <button @click="$emit('close')" class="close-btn">
          <i class='bx bx-x'></i>
        </button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="deptName">Department Name</label>
            <input type="text" id="deptName" v-model="department.name" required>
          </div>
          <div class="form-group">
            <label for="deptHead">Department Head</label>
            <input type="text" id="deptHead" v-model="department.head" required>
          </div>
          <div class="form-actions">
            <button type="button" @click="$emit('close')" class="btn-cancel">Cancel</button>
            <button type="submit" class="btn-save">Save Department</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddDepartmentModal',
  data() {
    return {
      department: {
        name: '',
        head: ''
      }
    };
  },
  methods: {
    submitForm() {
      this.$emit('save', this.department);
      this.department = { name: '', head: '' };
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

.form-group input {
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