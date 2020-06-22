<template>
  <section>
    <form @submit.prevent="pushLoca">
      <div class="modal-card">
        <header class="modal-card-head" v-if="this.data">
          <p class="modal-card-title">Edit Location</p>
        </header>
        <header class="modal-card-head" v-else>
          <p class="modal-card-title">Add Location</p>
        </header>
        <section class="modal-card-body">
          <b-field label="Name" label-position="on-border">
            <b-input v-model="name" placeholder="eg: Sabang"></b-input>
          </b-field>
          <b-field label="Address" label-position="on-border">
            <b-input v-model="address" placeholder="eg: Jl. Sabang" maxlength="200" type="textarea"></b-input>
          </b-field>
          <div class="columns">
            <div class="column">
              <b-field label="Province" label-position="on-border">
                <b-input :value="province_name" disabled></b-input>
              </b-field>
            </div>
            <div class="column">
              <b-field label="City" label-position="on-border">
                <b-input :value="city_name" disabled></b-input>
              </b-field>
            </div>
            <div class="column">
              <b-field label="District" label-position="on-border">
                <b-select v-model="district" placeholder="Select a district" expanded>
                  <option
                    v-for="option in districts"
                    :value="option.district_id"
                    :key="option.district_id"
                  >{{option.district_name}}</option>
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
export default {
  props: ["data"],
  data() {
    return {
      name: "",
      address: "",
      latitude: "",
      longitude: "",
      district: null,
      districts: [],
      userID: this.$auth.user.user_officer_id,
      locations: [],
      method: "insert",
      location_id: null,
      province_id: "",
      province_name: "",
      city_id: "",
      city_name: ""
    };
  },
  created() {
    this.getlocations();

    this.getDistrict();
    if (this.data) {
      this.getDetail(this.data);
    } else {
      this.getReset();
    }
  },
  methods: {
    async getDistrict() {
      this.districts = [];
      this.$axios
        .get(`/district?city_id=${this.$auth.user.location_id}`)
        .then(response => {
          this.districts = response.data.data;
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
          this.updated_by = this.$auth.user.user_id;
          this.district = this.myLocation.district_id;
          this.city_id = this.myLocation.city_id;
          this.city_name = this.myLocation.city_id;
          this.province_id = this.myLocation.province_id;
          this.province_name = this.myLocation.province_name;
          this.area = this.myLocation.area_id;
          this.location_id = this.myLocation.location_id;
          this.method = "update";
          if (this.prov) {
            this.getCities(this.prov);
          }
          if (this.city) {
            this.getDistrict(this.city);
          }
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
      this.updated_by = null;
      this.district = null;
      this.city = null;
      this.province = null;
      this.method = "insert";
    },
    pushLoca() {
      this.orderData = {
        location_id: this.location_id,
        location_name: this.name,
        location_address: this.address,
        district_id: this.district,
        city_id: this.city_id,
        province_id: this.province_id,
        area_id: 2,
        location_latitude: this.latitude,
        location_longitude: this.longitude,
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
        .get(`/provinceByCity?city_id=${this.$auth.user.location_id}`)
        .then(response => {
          this.locations = response.data.data;
          this.province_id = this.locations[0].province_id;
          this.province_name = this.locations[0].province_name;
          this.city_id = this.locations[0].city_id;
          this.city_name = this.locations[0].city_name;
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