<template>
  <section>
    <form @submit.prevent="pushData">
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Admin Area</p>
        </header>
        <section class="modal-card-body">
          <b-field label="Name" label-position="on-border">
            <b-input v-model="name" placeholder="eg: John Doe"></b-input>
          </b-field>
          <b-field label="Identity Number" label-position="on-border">
            <b-input v-model="nik" placeholder="eg: 1234567890"></b-input>
          </b-field>
          <b-field label="Address" label-position="on-border">
            <b-input
              v-model="address1"
              placeholder="eg: Jl. Sabang"
              maxlength="200"
              type="textarea"
            ></b-input>
          </b-field>
          <b-field label="Alternative Address" label-position="on-border">
            <b-input
              v-model="address2"
              placeholder="eg: Jl. Sabang"
              maxlength="200"
              type="textarea"
            ></b-input>
          </b-field>
          <b-field label="Email" label-position="on-border">
            <b-input v-model="email" placeholder="eg: user@mail.co.id"></b-input>
          </b-field>
          <b-field label="Phone Number" label-position="on-border">
            <b-input v-model="phone" placeholder="eg: (+62) xxx"></b-input>
          </b-field>
          <b-field>
            <b-upload v-model="ktp" multiple drag-drop>
              <section class="section">
                <div class="content has-text-centered">
                  <p>
                    <b-icon icon="upload" size="is-large"></b-icon>
                  </p>
                  <p>Drop your files here or click to upload</p>
                </div>
              </section>
            </b-upload>
          </b-field>
          <div class="tags">
            <span v-for="(file, index) in dropFiles" :key="index" class="tag is-primary">
              {{file.name}}
              <button
                class="delete is-small"
                type="button"
                @click="deleteDropFile(index)"
              ></button>
            </span>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-small" type="button" @click="$parent.close()">Cancel</button>
          <button type="submit" class="button is-primary is-small">Confrim</button>
        </footer>
      </div>
    </form>
  </section>
</template>

<script>
// import Vue from "vue";
// import VeeValidate from "vee-validate";
// Vue.use(VeeValidate, {
//   events: ""
// });
export default {
  props: ["data"],
  data() {
    return {
      name: "",
      nik: "",
      address1: "",
      address2: "",
      email: "",
      phone: "",
      ktp: "",
      userID: this.$auth.user.user_id,
      users: [],
      method: "insert"
    };
  },
  created() {
    this.getData();
    if (this.data) {
      this.getDetail(this.data);
    } else {
      this.getReset();
    }
  },
  methods: {
    deleteDropFile(index) {
      this.dropFiles.splice(index, 1);
    },
    async getDetail(id) {
      this.myUserID = id;
      await this.$axios
        .get("/user?user_id=" + id)
        .then(response => {
          this.isComponentModalActive = true;
          this.myUser = response.data.data[0];
          this.name = this.myUser.user_fullname;
          this.address1 = this.myUser.user_address1;
          this.address2 = this.myUser.user_address2;
          this.nik = this.myUser.user_nik;
          this.email = this.myUser.user_email;
          this.phone = this.myUser.user_phone;
          this.ktp = this.myUser.user_ktp;
          this.updated_by = this.$auth.user.user_id;
          this.user_id = this.myUser.user_id;
          this.method = "update";
        })
        .catch(e => {
          console.log(e);
        });
    },
    getReset() {
      this.nik = null;
      this.name = null;
      this.address1 = null;
      this.address2 = null;
      this.longitude = null;
      this.email = null;
      this.phone = null;
      this.ktp = null;
      this.updated_by = null;
      this.method = "insert";
    },
    pushData() {
      this.orderData = {
        user_nik: this.nik,
        user_id: this.user_id,
        user_fullname: this.name,
        user_address1: this.address1,
        user_address2: this.address2,
        user_email: this.email,
        user_phone: this.phone,
        user_ktp: this.ktp,
        created_by: this.userID,
        updated_by: this.userID,
        method: this.method
      };
      this.$axios
        .post("/user", this.orderData)
        .then(response => {
          this.$emit("pushData", this.orderData);
        })
        .catch(e => {
          console.log(e);
        });
    },
    async getData() {
      await this.$axios
        .get("/user")
        .then(response => {
          this.users = response.data.data;
          console.log(this.locations);
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>

<style scoped>
.center {
  text-align: center;
  vertical-align: middle;
}
</style>