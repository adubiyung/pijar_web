<template>
  <section>
    <form @submit.prevent="pushLoca">
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Add Detail Location</p>
        </header>
        <section class="modal-card-body">
          <b-field label="Name" label-position="on-border">
            <b-input v-model="name" placeholder="eg: Barat"></b-input>
          </b-field>

          <p class="content">
            <b>Way Type:</b>
            {{ detailway }}
          </p>
          <b-field>
            <b-radio-button name="radioWay" v-model="radioWay" :native-value="1">
              <span>1 Way</span>
            </b-radio-button>

            <b-radio-button name="radioWay" v-model="radioWay" :native-value="2" >
              <span>2 Way</span>
            </b-radio-button>
          </b-field>

          <p class="content">
            <b>Vehicle Type:</b>
            {{ detailVehicle }}
          </p>
          <b-field>
            <b-radio-button name="radioVehicle" v-model="radioVehicle" :native-value="1">
              <span>Car</span>
            </b-radio-button>

            <b-radio-button name="radioVehicle" v-model="radioVehicle" :native-value="2">
              <span>Motorcycle</span>
            </b-radio-button>

            <b-radio-button name="radioVehicle" v-model="radioVehicle" :native-value="3">
              <span>Both</span>
            </b-radio-button>
          </b-field>

          <p class="content">
            <b>Total Side:</b>
            {{ detailSide }}
          </p>
          <b-field>
            <b-radio-button name="radioSide" v-model="radioSide" :native-value="1">
              <span>1 Side</span>
            </b-radio-button>

            <b-radio-button name="radioSide" v-model="radioSide" :native-value="2">
              <span>2 Sides</span>
            </b-radio-button>
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
  props: ["loc_id", "detailloc_id"],
  data() {
    return {
      name: "",
      radioWay: 1,
      radioVehicle: 1,
      radioSide: 1,
      userID: this.$auth.user.user_officer_id,
      method: "insert",
      location_id : this.loc_id,
      detailLocationID: this.detailloc_id,
    };
  },
  created() {
    this.getlocations();
    console.log(this.location_id);
    
    if (this.detailLocationID) {
      this.getDetail(this.detailLocationID);
    } else {
      this.getReset();
    }
  },
  computed:{
    detailway(){
      if(this.radioWay==1){
        return "One Way";
      } else {
        return "Two Way";
      }
    },
    detailVehicle(){
      if(this.radioVehicle==1){
        return "Car";
      } else if(this.radioVehicle==2){
        return "Motorcycle";
      } else {
        return "Both";
      }
    },
    detailSide(){
      if(this.radioSide==1){
        return "One Side";
      } else {
        return "Two Side";
      }
    },
  },
  methods: {
    async getDetail(id) {
      this.myLocationID = id;
      await this.$axios
        .get("/detailLocation?detail_location_id=" + id)
        .then(response => {
          this.isComponentModalActive = true;
          this.myLocation = response.data.data[0];
          this.name = this.myLocation.detail_location_name;
          this.radioWay = this.myLocation.way_type;
          this.radioVehicle = this.myLocation.vehicle_type_id;
          this.radioSide = this.myLocation.total_side;
          
          this.detailLocationID = this.myLocation.detail_location_id;
          this.method = "update";
        })
        .catch(e => {
          console.log(e);
        });
    },
    getReset() {
      this.name = null;
      this.radioWay = 1;
      this.radioVehicle = 1;
      this.radioSide = 1;
      this.method = "insert";
    },
    pushLoca() {
      this.orderData = {
        location_id: this.location_id,
        detail_location_id: this.detailLocationID,
        detail_location_name: this.name,
        way_type: this.radioWay,
        vehicle_type_id: this.radioVehicle,
        total_side: this.radioSide,
        created_by: this.userID,
        updated_by: this.userID,
        method: this.method
      };
      this.$axios
        .post("/detailLocation", this.orderData)
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
        .get("/detailLocation?detail_location_id=" + 1)
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