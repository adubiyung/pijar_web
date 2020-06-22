<template>
  <section>
    <form v-if="wayType==1" @submit.prevent="pushData1">
      <div class="modal-card">
        <header class="modal-card-head" v-if="this.lotID">
          <p class="modal-card-title">Edit Data</p>
        </header>
        <header class="modal-card-head" v-else>
          <p class="modal-card-title">Add Data</p>
        </header>

        <section class="modal-card-body">
          <div class="columns">
            <div class="column is-4">
              <b-field label="Sign Arrow" label-position="on-border">
                <b-select v-model="arrow" placeholder="Select a sign arrow" expanded>
                  <option :value="1">UP</option>
                  <option :value="2">BOTTOM</option>
                </b-select>
              </b-field>
            </div>
            <div class="column">
              <b-field label="Address Name" label-position="on-border">
                <b-input v-model="address" placeholder="eg: Jl. Sabang"></b-input>
              </b-field>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <b-field label="Left-Side Lot" label-position="on-border">
                <b-input v-model="left" placeholder="0"></b-input>
              </b-field>
            </div>
            <div class="column">
              <b-field label="Right-Side Lot" label-position="on-border">
                <b-input v-model="right" placeholder="0"></b-input>
              </b-field>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-small" type="button" @click="$parent.close()">Cancel</button>
          <button type="submit" class="button is-primary is-small">Confirm</button>
        </footer>
      </div>
    </form>
    <form v-else @submit.prevent="pushData2">
      <div class="modal-card">
        <header class="modal-card-head" v-if="this.lotID">
          <p class="modal-card-title">Edit Detail Lot</p>
        </header>
        <header class="modal-card-head" v-else>
          <p class="modal-card-title">Add Detail Lot</p>
        </header>

        <section class="modal-card-body">
          <div class="columns">
            <div class="column">
              <b-field label="Sign Arrow" label-position="on-border">
                <b-input v-model="upName" placeholder="UP" disabled></b-input>
              </b-field>
            </div>
            <div class="column is-7">
              <b-field label="Address Name" label-position="on-border">
                <b-input v-model="addressU" placeholder="eg: Jl. Sabang"></b-input>
              </b-field>
            </div>
            <div class="column">
              <b-field label="Left-Side Lot" label-position="on-border">
                <b-input v-model="leftU" placeholder="0"></b-input>
              </b-field>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <b-field label="Sign Arrow" label-position="on-border">
                <b-input v-model="bottomName" placeholder="Bottom" disabled></b-input>
              </b-field>
            </div>
            <div class="column is-7">
              <b-field label="Address Name" label-position="on-border">
                <b-input v-model="addressB" placeholder="eg: Jl. Sabang"></b-input>
              </b-field>
            </div>
            <div class="column">
              <b-field label="Left-Side Lot" label-position="on-border">
                <b-input v-model="leftB" placeholder="0"></b-input>
              </b-field>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-small" type="button" @click="$parent.close()">Cancel</button>
          <button type="submit" class="button is-primary is-small">Confirm</button>
        </footer>
      </div>
    </form>
  </section>
</template>

<script>
export default {
  props: ["loc_id","detailloc_id","lot_id","wayid"],
  data() {
    return {
      wayType: Number(this.wayid),
      upName: "UP",
      bottomName: "BOTTOM",
      arrow: "",
      address: "",
      addressU: "",
      addressB: "",
      leftU: "",
      leftB: "",
      left: "",
      right: "",
      userID: this.$auth.user.user_officer_id,
      method: "insert",
      detailLocationID: Number(this.detailloc_id),
      lotID: Number(this.lot_id),
      orderDataway1:"",
    };
  },
  created() {
    if (this.lotID) {
      this.getDetail(this.lotID);
    } else {
      this.getReset();
    }
  },
  computed: {
    detailway() {
      if (this.radioWay == 1) {
        return "One Way";
      } else {
        return "Two Way";
      }
    },
    detailVehicle() {
      if (this.radioVehicle == 1) {
        return "Car";
      } else if (this.radioVehicle == 2) {
        return "Motorcycle";
      } else {
        return "Both";
      }
    },
    detailSide() {
      if (this.radioSide == 1) {
        return "One Side";
      } else {
        return "Two Side";
      }
    }
  },
  methods: {
    async getDetail(id) {
      this.myLocationID = id;
      await this.$axios
        .get("/lotLocation?lot_location_id=" + id)
        .then(response => {
          this.isComponentModalActive = true;
          this.myLocation = response.data.data[0];
          this.detailLocationID = this.myLocation.detail_location_id;
          this.arrow = this.myLocation.sign_arrow_id;
          this.address = this.myLocation.sign_name;
          this.left = this.myLocation.total_left_lot;
          this.right = this.myLocation.total_right_lot;
          if (this.arrow == 1) {
            this.addressU = this.myLocation.sign_name;
            this.leftU = this.myLocation.total_left_lot; 
          } else {
            this.addressB = this.myLocation.sign_name;
            this.leftB = this.myLocation.total_left_lot; 
          }
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
    pushData1() {
      this.orderDataway1 = {
        lot_location_id: this.lotID,
        detail_location_id: this.detailLocationID,
        location_id: this.locID,
        sign_arrow_id: this.arrow,
        sign_name: this.address,
        total_right_lot: Number(this.right),
        total_left_lot: Number(this.left),
        created_by: this.userID,
        updated_by: this.userID,
        method: this.method
      };
      console.log("masuk1 ", this.orderDataway1);
      this.axiospush(this.orderDataway1);
    },
    pushData2() {
      this.orderDatawayUp = {
        lot_location_id: this.lotID,
        detail_location_id: this.detailLocationID,
        sign_arrow_id:1,
        sign_name: this.addressU,
        total_right_lot: 0,
        total_left_lot: Number(this.leftU),
        created_by: this.userID,
        updated_by: this.userID,
        method: this.method
      };

      this.orderDatawayBottom = {
        lot_location_id: this.lotID,
        detail_location_id: this.detailLocationID,
        sign_arrow_id:2,
        sign_name: this.addressB,
        total_right_lot: 0,
        total_left_lot: Number(this.leftB),
        created_by: this.userID,
        updated_by: this.userID,
        method: this.method
      };
      console.log("masuk2 ", this.orderDatawayUp);
      console.log("masuk3 ", this.orderDatawayBottom);
      this.axiospush(this.orderDatawayUp);
      this.axiospush(this.orderDatawayBottom);
    },
    axiospush(dataOrder){
      this.$axios
        .post("/lotLocation",dataOrder)
        .then(response => {
          this.$emit("pushData", dataOrder);
        })
        .catch(e => {
          console.log(e);
        });
    },
  }
};
</script>

<style scoped>
.center {
  text-align: center;
  vertical-align: middle;
}
</style>