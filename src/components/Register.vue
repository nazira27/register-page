<template>
  <v-container>
    <h1 style="text-align: center">Регистрация</h1>
    <p>Уже есть аккаунт? <a href="#">Войти</a></p>
    <v-alert type="error" v-if="error">
      Error
    </v-alert>
    <v-alert type="success" v-if="success">
      I'm a success alert.
    </v-alert>
    <v-row v-if="showForm">
      <v-col sm="12" md="6" xs="12">
        <v-text-field
          label="Full Name"
          outlined
          rounded
          filled
          @keypress="validate($event)"
          v-model="form.fullName"
          :rules="[rules.required]"
        ></v-text-field>
        <v-text-field
          label="Nickname"
          outlined
          rounded
          filled
          v-model="form.nickname"
          :rules="[rules.required, rules.nick]"
        ></v-text-field>
        <v-text-field
          v-model="form.password"
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[rules.required, rules.min]"
          :type="show ? 'text' : 'password'"
          name="input-10-1"
          label="Password"
          hint="не менее 8 символов"
          outlined
          rounded
          filled
          @click:append="show = !show"
        ></v-text-field>
        <v-text-field
          v-model="form.repeatPassword"
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[rules.required, rules.min]"
          :type="show ? 'text' : 'password'"
          name="input-10-1"
          label="Repeat Password"
          hint="не менее 8 символов"
          outlined
          rounded
          filled
          @click:append="show = !show"
        ></v-text-field>
      </v-col>
      <v-col sm="12" md="6" xs="12">
        <v-text-field
          label="Phone Number"
          outlined
          rounded
          filled
          v-model="form.phone"
          @input="acceptNumber"
          @keypress="isNumber($event)"
          :rules="[rules.required]"
        ></v-text-field>
        <label>Select Gender</label>
        <v-radio-group v-model="form.gender" row :rules="[rules.required]">
          <v-radio label="Male" value="MALE"></v-radio>
          <v-radio label="Female" value="FEMALE"></v-radio>
        </v-radio-group>
        <v-select
          v-model="form.country"
          :items="countries"
          label="Country"
          rounded
          outlined
          filled
          :rules="[rules.required]"
        ></v-select>
        <v-select
          v-model="form.city"
          :items="cities"
          label="City"
          rounded
          outlined
          filled
          :rules="[rules.required]"
        ></v-select>

        <v-btn rounded color="primary" dark large block @click="submit">
          Submit
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-text-field
        label="Otp Code"
        outlined
        rounded
        filled
        v-model="otp"
        :rules="[rules.required, rules.code]"
      ></v-text-field>
      <v-btn rounded color="primary" dark large block @click="submitCode">
        Submit Code
      </v-btn>
    </v-row>
  </v-container>
</template>
<script>
import { mapActions } from "vuex";
import api from "@/api";
export default {
  data() {
    return {
      countries: ["RUSSIA", "UBEKISTAN", "KOREYA", "AMERIKA"],
      cities: ["MOSCOW", "TASHKENT", "SEUOL", "VASHINGTON"],
      form: {
        fullName: "",
        nickname: "",
        password: "",
        repeatPassword: "",
        phone: "998",
        gender: null,
        country: "",
        city: "",
      },
      phone: "",
      show: false,
      password: "Password",
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 8 || "не менее 8 символов ",
        nick: (v) => v.length >= 5 || "не менее 5 символов ",
        code: (v) => v.length <= 6 || "6 символов ",
      },
      column: null,
      row: null,
      registrationId: "",
      status: "",
      success: false,
      showForm: true,
      otp: "",
      error: false,
    };
  },
  methods: {
    ...mapActions(["saveUser"]),
    validate(e) {
      e = e ? e : window.event;
      const key = e.which || e.keyCode;
      if (
        !(
          (key > 48 && key < 57) ||
          key === 45 ||
          key === 46 ||
          key === 95 ||
          (key > 64 && key < 91) ||
          (key > 96 && key < 123)
        )
      ) {
        alert("Your FullName Can't Have any thing other than a-zA-Z0-9_.-");
        e.preventDefault();
      }
      return true;
    },
    isNumber(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    acceptNumber() {
      var x = this.form.phone
        .replace(/\D/g, "")
        .match(/(\d{0,3})(\d{0,2})(\d{0,3})(\d{0,4})/);
      this.form.phone = !x[2]
        ? x[1]
        : "(" +
          x[1] +
          ") " +
          x[2] +
          (x[3] ? "-" + x[3] : "") +
          (x[4] ? "-" + x[4] : "");
    },
    removeChar(value) {
      let number = "";
      for (let i = 0; i < value.length; i++) {
        if (
          value[i] != "-" &&
          value[i] != "(" &&
          value[i] != ")" &&
          value[i] != " "
        ) {
          number += value[i];
        }
      }
      return number;
    },
    submit() {
      this.error = false;
      this.form.phone = this.removeChar(this.form.phone);
      api
        .post("/user/register", this.form)
        .then((response) => {
          console.log(response);
          const status = response.data.status;
          this.registrationId = response.data.registrationId;
          if (status === 200 || this.registrationId) {
            this.showForm = false;
          }
        })
        .catch((error) => {
          this.error = true;
          console.log(error);
        });
    },
    submitCode() {
      this.error = false;
      api
        .post(`/user/confirm-registration/${this.registrationId}`, {
          otp: this.otp,
        })
        .then((response) => {
          let user = response.data;
          console.log(response.data);
          this.success = true;
          this.saveUser(user);
          this.$router.push("/");
        })
        .catch((error) => {
          this.error = true;
          console.log(error);
        });
    },
  },
};
</script>
