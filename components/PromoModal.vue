<template>
  <section>
    <form @submit.prevent="pushPromo">
      <div class="modal-card">
        <header class="modal-card-head" v-if="this.data">
          <p class="modal-card-title">Edit Data</p>
        </header>
        <header class="modal-card-head" v-else>
          <p class="modal-card-title">Add Data</p>
        </header>
        <section class="modal-card-body">
          <b-field label="Voucher Partner" label-position="on-border">
            <b-select
                  v-model="vPartner"
                  placeholder="Select a partner"
                  expanded
                >
                  <option
                    v-for="(a, index) in partners"
                    :value="a.partner_id"
                    :key="index"
                  >{{a.partner_company}}</option>
                </b-select>
          </b-field>
          <b-field label="Voucher Name" label-position="on-border">
            <b-input v-model="vName" placeholder="eg: Promo Akhir Zaman"></b-input>
          </b-field>
          <b-field label="Payment Type" label-position="on-border">
            <b-select
                  v-model="vPayment"
                  placeholder="Select a payment type"
                  expanded
                >
                  <option :value="1">Cash</option>
                  <option :value="2">LinkAja</option>
                </b-select>
          </b-field>
          <div class="columns">
            <div class="column">
              <b-field label="Voucher Location" label-position="on-border">
                <b-select
                  v-model="vLocation"
                  placeholder="Select a location"
                  expanded
                >
                  <option
                    v-for="(a, index) in locations"
                    :value="a.location_id"
                    :key="index"
                  >{{a.location_name}}</option>
                </b-select>
              </b-field>
            </div>
            <div class="column">
              <b-field label="Type Vehicle" label-position="on-border">
                <b-select v-model="tVehicle" placeholder="Select Vehicle Type" expanded>
                  <option :value="1">Car</option>
                  <option :value="2">Bike</option>
                </b-select>
              </b-field>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <b-field label="Voucher Code" label-position="on-border">
                <b-input v-model="vCode" placeholder="eg: JOHN"></b-input>
              </b-field>
            </div>
            <div class="column">
              <b-field label="Voucher Percent" label-position="on-border">
                <b-input v-model="vPercent" type="number" placeholder="eg: 30"></b-input>
              </b-field>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <b-field label="Voucher Max. Nominal" label-position="on-border">
                <b-input v-model="vMax" type="number" placeholder="eg: 3000"></b-input>
              </b-field>
            </div>
            <div class="column">
              <b-field label="Valid Date" label-position="on-border">
                <b-datepicker
                    :show-week-number="true"
                    :min-date="minDate"
                    v-model="vDate"
                    placeholder="Click to select..."
                    icon="calendar-today"
                    trap-focus
                    range>
                </b-datepicker>
              </b-field>
            </div>
          </div>
          <b-field label="Description" label-position="on-border">
            <b-input v-model="desc" placeholder="Your Description" maxlength="200" type="textarea"></b-input>
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
export default {
  props: ["data"],
  data() {
    const today = new Date();
    const tzoffset = new Date().getTimezoneOffset() * 60000;
    return {
      vPartner: null,
      vName: "",
      vLocation: null,
      tVehicle: null,
      vCode: "",
      vPercent:"",
      vMax: "",
      vPayment: [],
      vDate:[
        new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        today
      ],
      desc:"",
      userID: this.$auth.user.user_officer_id,
      promo: [],
      method: "insert",
      voucher_id:null,
      locations: [],
      partners: [],
      minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      startDate: new Date(),
      validDate: new Date
    };
  },
  created() {
    this.getPartner();
    this.getPromo();
    this.getLocations();

    if (this.data) {
      this.getDetail(this.data);
    } else {
      this.getReset();
    }
  },
  methods: {
    async getDetail(id) {
      this.voucher_id = id;
      console.log("id",id);
      await this.$axios
        .get(`/voucher?voucher_id=${id}&city_id=${this.$auth.user.location_id}`)
        .then(response => {
          this.isComponentModalActive = true;
          this.myPromo = response.data.data[0];
          console.log("data", this.myPromo);
          this.vPartner = this.myPromo.partner_id;
          this.vName = this.myPromo.voucher_name;
          this.vLocation = this.myPromo.location_id;
          this.tVehicle = this.myPromo.vehicle_type_id;
          this.vPayment = this.myPromo.payment_type_id;
          this.vCode = this.myPromo.voucher_code;
          this.vPercent = this.myPromo.voucher_percent;
          this.vMax = this.myPromo.voucher_max_nominal;
          this.startDate = this.myPromo.voucher_start_date;
          this.validDate = this.myPromo.voucher_valid_date;
          this.vDate = [
            new Date(this.myPromo.voucher_start_date),
            new Date(this.myPromo.voucher_valid_date)
          ];
          this.desc = this.myPromo.voucher_description;
          this.updated_by = this.$auth.user.user_officer_id;
          this.method = "update";
        })
        .catch(e => {
          console.log("error", e);
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
    pushPromo() {
      this.tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
      this.orderData = {
        voucher_id: this.voucher_id,
        partner_id: this.vPartner,
        vehicle_type_id: this.tVehicle,
        location_id: this.vLocation,
        payment_type_id: this.vPayment,
        voucher_name: this.vName,
        voucher_code: this.vCode,
        voucher_description: this.desc,
        voucher_percent: this.vPercent,
        voucher_max_nominal: this.vMax,
        voucher_start_date: new Date(this.vDate[0] - this.tzoffset).toISOString().split("T")[0],
        voucher_valid_date: new Date(this.vDate[1] - this.tzoffset).toISOString().split("T")[0],
        created_by: this.userID,
        updated_by: this.userID,
        method: this.method
      };
      this.$axios
        .post("/voucher", this.orderData)
        .then(response => {
          this.$emit('promo', this.orderData);
          console.log('update', response);
        })
        .catch(e => {
          console.log(e);
        });
    },
    async getPromo() {
      await this.$axios
        .get("/voucher?include=location_id")
        .then(response => {
          this.promo = response.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    async getLocations() {
      this.$axios
        .get("/location?city_id="+this.$auth.user.location_id)
        .then(response => {
          this.locations = response.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    async getPartner() {
      this.$axios
        .get("/partneract?city_id="+this.$auth.user.location_id)
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