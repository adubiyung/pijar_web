<template>
  <section>
    <form @submit.prevent="pushPartner">
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Add Partnership</p>
        </header>
        <section class="modal-card-body">
          <b-field label="Company Name" label-position="on-border">
            <b-input v-model="company" placeholder="eg: PT. Sigma Cipta Caraka"></b-input>
          </b-field>
          <b-field label="PIC Name" label-position="on-border">
            <b-input v-model="person" placeholder="eg: John Doe"></b-input>
          </b-field>
          <b-field label="Address" label-position="on-border">
            <b-input v-model="address" placeholder="eg: Jl. Sabang" maxlength="200" type="textarea"></b-input>
          </b-field>
          <b-field label="Email" label-position="on-border">
            <b-input v-model="email" placeholder="eg: location@mail.co.id"></b-input>
          </b-field>
          <b-field label="Phone Number" label-position="on-border">
            <b-input v-model="phone" placeholder="eg: (+62) xxx"></b-input>
          </b-field>
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
      company: "",
      person: "",
      address: "",
      email: "",
      phone: "",
      userID: this.$auth.user.user_id,
      partners: [],
      method: "insert",
      partner_id:null
    };
  },
  created() {
    this.getPartner();
    if (this.data) {
      this.getDetail(this.data);
    } else {
      this.getReset();
    }
  },
  methods: {
    async getDetail(id) {
      this.myPartnerID = id;
      await this.$axios
        .get("/partneract?partner_id=" + id)
        .then(response => {
          this.isComponentModalActive = true;
          this.myPartner = response.data.data[0];
          this.company = this.myPartner.partner_company;
          this.person = this.myPartner.partner_person;
          this.address = this.myPartner.partner_address;
          this.email = this.myPartner.partner_email;
          this.phone = this.myPartner.partner_phone;
          this.updated_by = this.$auth.user.user_id;
          this.partner_id = this.myPartner.partner_id;
          this.method = "update";
        })
        .catch(e => {
          console.log(e);
        });
    },
    getReset() {
      this.company = null;
      this.person = null;
      this.address = null;
      this.email = null;
      this.phone = null;
      this.updated_by = null;
      this.method = "insert";
    },
    pushPartner() {
      this.orderData = {
        partner_id: this.partner_id,
        partner_company: this.company,
        partner_person: this.person,
        partner_address: this.address,
        partner_email: this.email,
        partner_phone: this.phone,
        created_by: this.userID,
        updated_by: this.userID,
        method: this.method
      };
      this.$axios
        .post("/partneract", this.orderData)
        .then(response => {
          this.$emit("pushPartner", this.orderData);
        })
        .catch(e => {
          console.log(e);
        });
    },
    async getPartner() {
      await this.$axios
        .get("/partneract")
        .then(response => {
          this.partners = response.data.data;
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