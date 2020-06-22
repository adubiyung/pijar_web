<template>
  <section class="modal-card-body bgcard">
    <form @submit.prevent="saveData">
      <div class="columns is-vcentered">
        <div class="column is-narrow">
          <figure class="image is-96x96">
            <img src="https://bulma.io/images/placeholders/128x128.png" />
          </figure>
        </div>

        <div class="column">
          <div class="field">
            <div class="columns">
              <div class="column">
                <b-field label="Email" label-position="on-border">
                  <b-input v-model="email"></b-input>
                </b-field>
              </div>
              <div class="column">
                <b-field label="Password" label-position="on-border">
                  <b-input v-model="pass" type="password" maxlength="30"></b-input>
                </b-field>
              </div>
            </div>
          </div>
          <div class="field">
            <div class="control is-small is-expanded is-clearfix">
              <b-field label="Full Name" label-position="on-border">
                <b-input v-model="name"></b-input>
              </b-field>
            </div>
          </div>
          <div class="field">
            <div class="control is-small is-expanded is-clearfix">
              <b-field label="Phone Number" label-position="on-border">
                <b-input v-model="phone"></b-input>
              </b-field>
            </div>
          </div>
        </div>
      </div>
      <b-field label="Identity Number" label-position="on-border">
        <b-input v-model="nik"></b-input>
      </b-field>
      <b-field label="Birth Date" label-position="on-border">
        <b-input v-model="birth"></b-input>
      </b-field>
      <b-field label="Address" label-position="on-border">
        <b-input v-model="address" maxlength="200" type="textarea"></b-input>
      </b-field>
      <b-field label="Alternative Address" label-position="on-border">
        <b-input v-model="address2" maxlength="200" type="textarea"></b-input>
      </b-field>
      <button type="submit" class="button is-primary">Update</button>
    </form>
  </section>
</template>

<script>
import Vue from "vue";
export default {
  middleware: "auth",
  data() {
    return {
      users: [],
      userID: this.$auth.user.user_officer_id,
      name: "",
      email: "",
      pass: "",
      phone: "",
      nik: "",
      birth: "",
      address: "",
      address2: "",
      locationID: this.$auth.user.location_id
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      await this.$axios
        .get(`/user?user=${this.userID}`)
        .then(response => {
          this.myData = response.data.data[0];
          this.name = this.myData.user_fullname;
          this.email = this.myData.user_email;
          this.pass = this.myData.user_password;
          this.phone = this.myData.user_phone;
          this.nik = this.myData.user_nik;
          this.birth = this.myData.user_birthday;
          this.address = this.myData.user_address1;
          this.address2 = this.myData.user_address2;
        })
        .catch(e => {
          console.log(e);
        });
    },
    saveData() {
      this.saveData = {
        user_officer_id: this.userID,
        user_password: this.pass,
        user_email: this.email,
        user_fullname: this.name,
        user_nik: this.nik,
        user_phone: this.phone,
        user_address1: this.address,
        user_address2: this.address2,
        updated_by: this.userID,
        location_id: this.locationID,
        user_ktp: null,
        method: "update"
      };
      this.$axios
        .post("/user", this.saveData)
        .then(response => {
          this.$emit("pushData", this.saveData);
          console.log("hasil", this.saveData);
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>