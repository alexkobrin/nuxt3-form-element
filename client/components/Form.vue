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
      <el-form-item
        label="Imię"
        prop="name"
        :error="errors && (errors.name ? errors.name : '')"
      >
        <el-input v-model="form.name" placeholder="Podaj imię" />
      </el-form-item>
      <el-form-item
        label="Nazwisko"
        prop="surname"
        :error="errors && (errors.surname ? errors.surname : '')"
      >
        <el-input v-model="form.surname" placeholder="Podaj nazwisko" />
      </el-form-item>
      <el-form-item
        label="Adres e-mail"
        prop="email"
        :error="errors && (errors.email ? errors.email : '')"
      >
        <el-input v-model="form.email" placeholder="Podaj Adres e-mail" />
      </el-form-item>
      <el-form-item
        label="Pesel"
        prop="pesel"
        :error="errors && (errors.pesel ? errors.pesel : '')"
      >
        <el-input
          v-model="form.pesel"
          v-maska
          data-maska="###########"
          placeholder="Podaj pesel"
        >
        </el-input>
      </el-form-item>
      <el-form-item
        label="Telefon"
        prop="tel"
        :error="errors && (errors.tel ? errors.tel : '')"
      >
        <el-input
          v-model="form.tel"
          v-maska
          data-maska="+48 ### ### ###"
          placeholder="Podaj numer telehonu"
        >
        </el-input>
      </el-form-item>
      <el-form-item
        prop="approvalsRegulation"
        label="Regulamin"
        class="mb-5"
        :error="
          errors &&
          (errors.approvalsRegulation ? errors.approvalsRegulation : '')
        "
      >
        <el-checkbox
          label="Akceptuję treść regulaminu programu"
          v-model="form.approvalsRegulation"
          name="approvals"
        >
          zgoda na przetworzenie danych
        </el-checkbox>
      </el-form-item>

      <el-form-item
        v-for="(item, idx) in form.accepts"
        :key="idx"
        :label="`Accept -${idx}`"
        :prop="'accepts.' + idx + '.value'"
        :rules="{
          required: true,
          validator: validateAccept,
          trigger: 'change',
        }"
        class="mb-5"
        :error="errors && (errors.accepts ? errors.accepts[idx] : '')"
      >
        <el-checkbox
          label="Akceptuję treść regulaminu programu"
          v-model="form.accepts[idx].value"
          name="approvals"
        >
          {{ item.label }}
        </el-checkbox>
      </el-form-item>
      <el-button
        :loading="loading"
        @click="checkForm(formLottery)"
        type="primary"
        >Wyślij zgłoszenie
      </el-button>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { vMaska } from "maska";
//import  { FormInstance } from 'element-plus'
const config = useRuntimeConfig();
const strapi = useStrapi();

const fetchLabelAccept = async () => {
  try {
    const { data } = await strapi.find("form-label-accepts");
    if (!data) return;
    let arr = [];
    for (let i = 0; i < data.length; i++) {
      arr.push({
        label: data[i].attributes.label,
        value: "",
      });
    }
    // Added label from API to form
    form.accepts = arr;
    return arr;
  } catch (e) {
    console.log(e, "ERRor");
    // TODO Error handler
  }
};

const form = reactive({
  name: "",
  surname: "",
  email: "",
  pesel: "",
  tel: "",
  approvalsRegulation: "",
  accepts: [],
});

// variables
const formLottery = ref(null);
const errors = {
  name: null,
  surname: null,
  email: null,
  pesel: null,
  tel: "",
  approvalsRegulation: false,
  accepts: [],
};
let loading = ref(false);

onMounted(() => {
  fetchLabelAccept();
});

// validate rules and validator

const validateAccept = (rule, value, callback) => {
  if (!value) return callback(new Error("Zgoda obowiązkowa"));
  return callback();
};
const validateRegulamin = (rule, value, callback) => {
  if (!value) return callback(new Error("Zgoda obowiązkowa"));
  return callback();
};
const validatePhone = (rule, value, callback) => {
  if (!value) return callback();
  const regex = /^\d{9}$/;
  const valueSliceMask = value
    .slice(3, value.length)
    .replaceAll("-", "")
    .replaceAll(" ", "");

  const isPhoneNumber = regex.test(valueSliceMask);
  if (!isPhoneNumber)
    return callback(new Error("Proszę podać prawidlowy numer telefonu"));

  return callback();
};

const pesel = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("Proszę podać pesel"));
  } else {
    let weight = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    let sum = 0;
    let controlNumber = parseInt(value.substring(10, 11));
    //
    for (let i = 0; i < weight.length; i++) {
      sum += parseInt(value.substring(i, i + 1)) * weight[i];
    }
    sum = sum % 10;
    let result = (10 - sum) % 10 === controlNumber;
    if (!result) {
      callback(new Error("Pesel nie jest prawidłowy"));
    } else {
    callback();
    }
  }
};

const rules = reactive({
  name: [
    { required: true, message: "Proszę podać imię", trigger: "blur" },
    {
      min: 3,
      message: "Długość powinna wynosić od 3 liter",
      trigger: "blur",
    },
  ],
  surname: [
    { required: true, message: "Proszę podać nazwisko", trigger: "blur" },
    {
      min: 3,
      message: "Długość powinna wynosić od 3 liter",
      trigger: "blur",
    },
  ],
  email: [
    {
      required: true,
      message: "Proszę podać adres email",
      trigger: "blur",
    },
    {
      type: "email",
      message: "Proszę podać prawidłowy adres email",
      trigger: "blur",
    },
  ],
  tel: [{ validator: validatePhone, trigger: "blur" }],
  pesel: [
    { required: true, message: "Proszę podać pesel", trigger: "blur" },
    { validator: pesel, trigger: "blur" },
  ],
  approvalsRegulation: [
    {
      validator: validateRegulamin,
      trigger: "change",
    },
  ],
});



const checkForm = (form) => {
  form.validate((valid) => {
    if (valid) {
      sendForm(form);
    } else return false;
  });
};
const sendForm = async (formInTemplate) => {
  loading.value = true;
  try {
     await strapi.create("form-lotteries", form);
    loading.value = false;
    formInTemplate.resetFields()
     
  } catch (e) {
    console.log(e, "err");
    loading.value = false;
  }
};
 
</script>

<style>
.container {
  max-width: 400px;
  margin: auto;
}
.el-form-item {
  margin-bottom: 30px;
}
.el-form-item__content {
  line-height: 40px;
  position: relative;
  font-size: 14px;
}
.el-input {
  position: relative;
  font-size: 14px;
  width: 100%;
}

.el-form-item__label {
  font-size: 16px;
}
.el-form-item__error {
  font-size: 13px;
  padding-top: 0.5rem;
}
</style>
