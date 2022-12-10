<template>
  <div class="container">
    <el-form
      :model="form"
      :rules="rules"
      ref="formLottery"
      label-width="120px"
      label-position="top"
      @submit.prevent
    >
      <el-form-item label="Imię" prop="name">
        <el-input v-model="form.name" placeholder="Podaj imię" />
      </el-form-item>
      <el-button
        @click="checkForm(formLottery)"
        :disabled="disabledButton(formLottery)"
        type="primary"
        >Wyślij zgłoszenie
      </el-button>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
//import  { FormInstance } from 'element-plus'

const form = reactive({
  name: "",
});

// variables
const formLottery = ref(null);

const loading = false;

onMounted(() => {});
// validate rules
const rules = reactive({
  name: [
    { required: true, message: "Proszę podać imię", trigger: "blur" },
    {
      min: 3,
      message: "Długość powinna wynosić od 3 liter",
      trigger: "blur",
    },
  ],
});
const checkForm = (form) => {
  form.validate((valid) => {
    if (valid) {
      console.log("submit!");
    } else {
      console.log("error submit!");
      return false;
    }
  });
};
const disabledButton = (formLotterty) => {
  return  form.name == ''
};
</script>

<style>
.container {
  max-width: 450px;
  margin: auto;
}
.el-form-item__error {
  font-size: 13px;
}
</style>
