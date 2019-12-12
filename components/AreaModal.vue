<template>
  <section>
    <form @submit.prevent="pushLoca">
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Add Location</p>
        </header>
        <section class="modal-card-body">
          <b-field label="Name" label-position="on-border">
            <b-input v-model="name" placeholder="eg: Sabang"></b-input>
          </b-field>
          <b-field label="Identity Number" label-position="on-border">
            <b-input v-model="nik" placeholder="eg: 1234567890"></b-input>
          </b-field>
          <b-field label="Address" label-position="on-border">
            <b-input v-model="address" placeholder="eg: Jl. Sabang" maxlength="200" type="textarea"></b-input>
          </b-field>
          <b-field label="Alternative Address" label-position="on-border">
            <b-input v-model="address2" placeholder="eg: Jl. Sabang" maxlength="200" type="textarea"></b-input>
          </b-field>
          <b-field label="Email" label-position="on-border">
            <b-input v-model="email" placeholder="eg: location@mail.co.id"></b-input>
          </b-field>
          <b-field label="Phone Number" label-position="on-border">
            <b-input v-model="phone" placeholder="eg: (+62) xxx"></b-input>
          </b-field>
          <b-field>
            <b-upload v-model="dropFiles"
                multiple
                drag-drop>
                <section class="section">
                    <div class="content has-text-centered">
                        <p>
                            <b-icon
                                icon="upload"
                                size="is-large">
                            </b-icon>
                        </p>
                        <p>Drop your files here or click to upload</p>
                    </div>
                </section>
            </b-upload>
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
      address: "",
      latitude: "",
      longitude: "",
      email: "",
      phone: "",
      userID: this.$auth.user.user_id,
      locations: [],
      district: null,
      method: "insert",
      location_id:null
    };
  },
  created() {
    this.getlocations();
    if (this.data) {
      this.getDetail(this.data);
    } else {
      this.getReset();
    }
  },
  methods: {
    async getDetail(id) {
      this.myLocationID = id;
      await this.$axios
        .get("/location?location_id=" + id)
        .then(response => {
          this.isComponentModalActive = true;
          this.myLocation = response.data.data[0];
          this.name = this.myLocation.location_name;
          this.address = this.myLocation.location_address;
          this.latitude = this.myLocation.location_latitude;
          this.longitude = this.myLocation.location_longitude;
          this.email = this.myLocation.location_email;
          this.phone = this.myLocation.location_phone;
          this.updated_by = this.$auth.user.user_id;
          this.district = this.myLocation.location_district;
          this.subdistrict = this.myLocation.location_subdistrict;
          this.city = this.myLocation.location_city;
          this.province = this.myLocation.location_province;
          this.area = this.myLocation.location_area;
          this.location_id = this.myLocation.location_id;
          this.method = "update";
        })
        .catch(e => {
          console.log(e);
        });
    },
    getReset() {
      this.name = null;
      this.address = null;
      this.latitude = null;
      this.longitude = null;
      this.email = null;
      this.phone = null;
      this.updated_by = null;
      this.district = null;
      this.subdistrict = null;
      this.city = null;
      this.province = null;
      this.method = "insert";
    },
    pushLoca() {
      this.orderData = {
        location_id: this.location_id,
        location_name: this.name,
        location_address: this.address,
        location_district: "test",
        location_subdistrict: "test",
        location_city: "test",
        location_province: "test",
        location_area: 2,
        location_latitude: this.latitude,
        location_longitude: this.longitude,
        location_email: this.email,
        location_phone: this.phone,
        created_by: this.userID,
        updated_by: this.userID,
        method: this.method
      };
      this.$axios
        .post("/location", this.orderData)
        .then(response => {
          this.$emit("pushLoca", this.orderData);
        })
        .catch(e => {
          console.log(e);
        });
    },
    async getlocations() {
      await this.$axios
        .get("/location")
        .then(response => {
          this.locations = response.data.data;
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