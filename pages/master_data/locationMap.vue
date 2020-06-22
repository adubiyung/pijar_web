<template>
  <section class="section">
    <h1 class="subtitle">Map Lot Location</h1>
    <div class="columns">
      <div class="column has-text-centered">
        <!-- {{checkboxGroupLeft}} -->
        <div class="block">
          <b-checkbox
            v-for="(b,key) in boxLeft"
            :key="key"
            v-model="checkboxGroupLeft"
            :native-value="b"
          >{{b.detail_lot_id}}</b-checkbox>
        </div>
      </div>
    </div>
    <!-- <hr /> -->
    <div class="column has-text-centered">
      <img src="~assets/street.png" width="260px" v-for="(b,key) in pjg" :key="key" />
    </div>
    <!-- <hr /> -->
    <div class="columns">
      <div class="column has-text-centered">
        <div class="block">
          <b-checkbox
            v-for="(b,key) in boxRight"
            :key="key"
            v-model="checkboxGroupRight"
            :native-value="b"
          >{{b.detail_lot_id}}</b-checkbox>
        </div>
        <!-- {{checkboxGroupRight}} -->
      </div>
    </div>
    <div class="column has-text-centered">
      <div class="field">
        <b-button
          type="is-info is-small"
          @click="saveData()"
          aria-controls="contentCollapse"
        >Save Data</b-button>
        <b-button type="is-info is-small" @click="saveData()" aria-controls="contentCollapse">Reset</b-button>
      </div>
    </div>
  </section>
</template>

<script>
import Vue from "vue";
export default {
  components: {},
  middleware: "auth",
  data() {
    return {
      boxLeft: [],
      boxRight: [],
      checkLeft: [],
      checkRight: [],
      uuID: this.$route.query.lotid,
      pjg: [1, 1, 1, 1],
      checkboxGroupLeft: [],
      checkboxGroupRight: [],
      dataLeft: [],
      dataRight: [],
      dataOrder: []
    };
  },
  created() {
    this.getDataLeft();
    this.getDataRight();
    this.getCheckLeft();
    this.getCheckRight();
  },
  methods: {
    reloadData() {
      this.getDataLeft();
      this.getDataRight();
      this.getCheckLeft();
      this.getCheckRight();
    },

    async getDataLeft() {
      this.$axios
        .get("/lotMap?lot_location_uuid=" + this.uuID + "&side_id=1")
        .then(response => {
          this.boxLeft = response.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    async getDataRight() {
      this.$axios
        .get("/lotMap?lot_location_uuid=" + this.uuID + "&side_id=2")
        .then(response => {
          this.boxRight = response.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    async getCheckLeft() {
      this.$axios
        .get(
          "/lotMap?lot_location_uuid=" + this.uuID + "&side_id=1&is_booking=t"
        )
        .then(response => {
          this.checkLeft = response.data.data;

          this.checkboxGroupLeft = [];
          this.checkLeft.forEach(element => {
            this.checkboxGroupLeft.push(element);
          });
          console.log(this.checkboxGroupLeft);
        })
        .catch(e => {
          console.log(e);
        });
    },
    async getCheckRight() {
      this.$axios
        .get(
          "/lotMap?lot_location_uuid=" + this.uuID + "&side_id=2&is_booking=t"
        )
        .then(response => {
          this.checkRight = response.data.data;

          this.checkboxGroupRight = [];
          this.checkRight.forEach(element => {
            this.checkboxGroupRight.push(element);
          });
          console.log(this.checkboxGroupRight);
        })
        .catch(e => {
          console.log(e);
        });
    },

    async saveData(id) {
      this.dataLeft = [];
      this.dataRight = [];
      this.dataOrder = [];

      this.checkboxGroupLeft.forEach(row => {
        this.dataLeft.push({
          detail_lot_id: row.detail_lot_id,
          is_booking: true
        });
      });
      this.checkboxGroupRight.forEach(row => {
        this.dataRight.push({
          detail_lot_id: row.detail_lot_id,
          is_booking: true
        });
      });
      this.dataOrder.push(
        {
          lot_location_uuid: this.uuID,
          side_id: 1,
          updated_by: 1,
          method: "update",
          datacheck: this.dataLeft
        },
        {
          lot_location_uuid: this.uuID,
          side_id: 2,
          updated_by: 1,
          method: "update",
          datacheck: this.dataRight
        }
      );
      console.log("apacoba", this.dataOrder);

      this.$axios
        .post("/lotMap", this.dataOrder)
        .then(response => {
          console.log(this.dataOrder);
          this.reloadData();
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>
