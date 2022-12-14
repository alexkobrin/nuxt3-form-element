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
        v-for="(item , idx) in form.accepts"
        :key="idx"
        :prop="'accepts.' + idx + '.value'"
        :rules="{required: true, message: 'Zgoda jest obowiązkowa', trigger: 'blur'}"

        class="mb-5"
        :error="
          errors &&
          (errors.accepts ? errors.accepts[idx] : '')
        "
      >
        <el-checkbox
          label="Akceptuję treść regulaminu programu"
          v-model="form.accepts[idx].value"
          name="approvals"
        >
           {{item.label}}   
        </el-checkbox>
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
import { vMaska } from "maska";
//import  { FormInstance } from 'element-plus'

const form = reactive({
  name: "",
  surname: "",
  email: "",
  pesel: "",
  tel: "",
  approvalsRegulation: "",
  accepts: [
   { label: "zgoda na coś 1" , value: "" },
   { label: "zgoda na coś 2", value: ""},
   {label: "zgoda na coś 3", value: "" }
   ],
});

// variables
const formLottery = ref(null);
const errors = {
  name: null,
  surname: null,
  email: null,
  pesel: null,
  tel: "" ,
  approvalsRegulation: null,
  accepts: []
};
const loading = false;

onMounted(() => {});

// validate rules and validator

const validateApproval = (rule, value, callback) => {
  if (value === false) {
    callback(new Error("Zgoda obowiązkowa"));
  } else {
    callback();
  }
};
const validatePhone = (rule,value,callback) => {
     if (!value  ) return  callback();
     const regex = /^\d{9}$/;
     const valueSliceMask = value.slice(3 , value.length).replaceAll('-' , '').replaceAll(' ' , '') ;

      const isPhoneNumber = regex.test(valueSliceMask);
        if (!isPhoneNumber) return  callback(new Error("Proszę podać prawidlowy numer telefonu"));

}

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
  tel: [
    { validator: validatePhone, trigger: "blur" }
  ],
  pesel: [
    { required: true, message: "Proszę podać pesel", trigger: "blur" },
    { validator: pesel, trigger: "blur" },
  ],
  approvalsRegulation: [
    {
      required: true,
      message: "Zgoda jest obowiązkowa",
      trigger: "change",
    },
  ],
});
const checkForm = (form) => {

  form.validate((valid) => {
    if (valid) {
      sendForm()
    } else {
      console.log(valid , 'valid');
      console.log("error submit!");
      return false;
    }
  });
};
const sendForm = () => {
  let formToSend = form 
  formToSend.steo = 'EEEEE'
     console.log(formToSend , 'formToSend');
     
}

const disabledButton = (formLotterty) => {
  // TODO  disabled button
  return false
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
