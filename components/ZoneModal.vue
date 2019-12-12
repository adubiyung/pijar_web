<template>
  <section>
    <form @submit.prevent="pushZone">
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Add Zone</p>
        </header>
        <section class="modal-card-body">
          <div class="columns">
            <div class="column">
              <b-field label="Location" label-position="on-border">
                <b-select v-model="loca" placeholder="Select a location" expanded>
                  <option
                    v-for="option in locations"
                    :value="option.location_id"
                    :key="option.location_id"
                  >{{option.location_name}}</option>
                </b-select>
              </b-field>
            </div>
            <div class="column">
              <b-field label="Type" label-position="on-border">
                <b-select v-model="types" placeholder="Select a type" expanded>
                  <option>1</option>
                  <option>2</option>
                </b-select>
              </b-field>
            </div>
          </div>

          <b-field label="Name" label-position="on-border">
            <b-input v-model="name" placeholder="eg: Barat"></b-input>
          </b-field>
          <div class="columns">
            <div class="column">
              <b-field label="Bike Capacity" label-position="on-border">
                <b-input v-model="bike" placeholder="eg: 50"></b-input>
              </b-field>
            </div>
            <div class="column">
              <b-field label="Car Capacity" label-position="on-border">
                <b-input v-model="car" placeholder="eg: 50"></b-input>
              </b-field>
            </div>
            <div class="column">
              <b-field label="Booking Capacity" label-position="on-border">
                <b-input v-model="booking" placeholder="eg: 50"></b-input>
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
      loca: "",
      types: "",
      bike: "",
      car: "",
      booking: "",
      userID: this.$auth.user.user_id,
      locations: [],
      method: "insert",
      zone_id: null
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
      this.zoneID = id;
      await this.$axios
        .get("/zoneact?include=location_id&zone_id=" + id)
        .then(response => {
          this.isComponentModalActive = true;
          this.zone = response.data.data[0];
          this.name = this.zone.zone_name;
          this.types = this.zone.type_id;
          this.loca = this.zone.location_id.location_name;
          console.log("hmm", this.zone.location_id.location_id);
          this.bike = this.zone.zone_motor_capacity;
          this.car = this.zone.zone_car_capacity;
          this.booking = this.zone.zone_booking_capacity;
          this.updated_by = this.$auth.user.user_id;
          this.zone_id = this.zone.zone_id;
          this.method = "update";
        })
        .catch(e => {
          console.log(e);
        });
    },
    getReset() {
      this.name = null;
      this.types = null;
      this.loca = null;
      this.bike = null;
      this.car = null;
      this.booking = null;
      this.updated_by = null;
      this.method = "insert";
    },
    pushZone() {
      console.log("myloca " + this.loca);

      this.orderData = {
        location_id: this.loca,
        zone_parent_id: 0,
        zone_type_id: this.types,
        zone_name: this.name,
        zone_motor_capacity: this.bike,
        zone_car_capacity: this.car,
        zone_booking_capacity: this.booking,
        created_by: this.userID,
        updated_by: this.userID,
        method: this.method
      };
      this.$axios
        .post("/zoneact", this.orderData)
        .then(response => {
          this.$emit("pushZone", this.orderData);
        })
        .catch(e => {
          console.log(e);
        });
    },
    async getlocations() {
      await this.$axios
        .get("/location?location_status=t")
        .then(response => {
          this.locations = response.data.data;
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