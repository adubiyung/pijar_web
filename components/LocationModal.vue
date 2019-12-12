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
          <b-field label="Address" label-position="on-border">
            <b-input v-model="address" placeholder="eg: Jl. Sabang" maxlength="200" type="textarea"></b-input>
          </b-field>
          <!-- <div class="columns">
            <div class="column">
              <b-field label="Sub-District" label-position="on-border">
                <b-select placeholder="Select a sub-district" expanded>
                  <option value="1">Option 1</option>
                  <option value="2">Option 2</option>
                </b-select>
              </b-field>
            </div>
            <div class="column">
              <b-field label="District" label-position="on-border">
                <b-select v-model="district" placeholder="Select a district" expanded>
                  <option
                    v-for="option in locations"
                    :value="option.location_id"
                    :key="option.location_id"
                  >{{ option.location_name }}</option>
                </b-select>
              </b-field>
            </div>
          </div>-->
          <div class="columns">
            <div class="column">
              <b-field label="Province" label-position="on-border">
                <b-select v-model="prov" @change.native="getCities(prov)" placeholder="Select a province" expanded>
                  <option
                    v-for="(prov, index) in provinces"
                    :value="prov.province_id"
                    :key="index"
                  >{{prov.province_name}}</option>
                </b-select>
              </b-field>
            </div>
            <div class="column">
              <b-field label="City" label-position="on-border">
                <b-select v-model="city" placeholder="Select a city" expanded>
                  <option
                    v-for="option in cities"
                    :value="option.city_id"
                    :key="option.city_id"
                  >{{option.city_name}}</option>
                </b-select>
              </b-field>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <b-field label="Latitude" label-position="on-border">
                <b-input v-model="latitude" placeholder="eg: 106.668286"></b-input>
              </b-field>
            </div>
            <div class="column">
              <b-field label="Longitude" label-position="on-border">
                <b-input v-model="longitude" placeholder="eg: -6.297994"></b-input>
              </b-field>
            </div>
          </div>
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
      address: "",
      latitude: "",
      longitude: "",
      email: "",
      phone: "",
      prov: "",
      city: "",
      cities: [],
      provinces: [],
      userID: this.$auth.user.user_id,
      locations: [],
      district: null,
      method: "insert",
      location_id: null
    };
  },
  created() {
    this.getlocations();
    
    this.getProvinces();
    if (this.data) {
      this.getDetail(this.data);
    } else {
      this.getReset();
    }
  },
  methods: {
    getCities(prov) {
      this.cities=[]
      this.$axios
        .get("/city?province_id=" + prov)
        .then(response => {
          this.cities = response.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    getProvinces() {
      this.$axios
        .get("/province")
        .then(response => {
          this.provinces = response.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
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
        location_district: "-",
        location_subdistrict: "-",
        location_city: this.city,
        location_province: this.prov,
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
          console.log("loca", this.orderData);
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