<template>
  <section class="section">
    <h1 class="subtitle">Zones</h1>
    <div class="spasi">
      <div class="field">
        <b-button
          type="is-info is-small"
          @click="openModal()"
          aria-controls="contentCollapse"
        >Add Data</b-button>
      </div>
      <!-- <myFilter
        :data="filterdata"
        @pushOutlet="updateOutlet($event)"
        @pushCategory="updateCategory($event)"
        @pushInventory="updateInventory($event)"
        @pushSearch="updateSearch($event)"
      />-->
    </div>
    <div class="columns">
      <div class="column">
        <b-table :data="zones" class="is-size-7">
          <template slot-scope="props">
            <b-table-column
              field="name"
              label="Location Name"
              sortable
            >{{props.row.location_id.location_name}}</b-table-column>
            <b-table-column
              field="zone"
              label="Zone Name"
              sortable
            >{{props.row.zone_name}}</b-table-column>
            <b-table-column field="type" label="Zone Type" sortable>{{props.row.zone_type_id}}</b-table-column>
            <b-table-column
              field="car"
              label="Car Capacity"
              sortable
            >{{props.row.zone_car_capacity}}</b-table-column>
            <b-table-column
              field="bike"
              label="Bike Capacity"
              sortable
            >{{props.row.zone_motor_capacity}}</b-table-column>
            <b-table-column
              field="booking"
              label="Booking Capacity"
              sortable
            >{{props.row.zone_booking_capacity}}</b-table-column>
            <b-table-column field="action" label="action">
              <b-button type="is-warning" size="is-small" @click="getDetail(props.row.zone_id)">
                <b-icon icon="mdi mdi-pencil" size="is-small"></b-icon>
              </b-button>
              <b-button type="is-danger" size="is-small" @click="deleteData(props.row.zone_id)">
                <b-icon icon="mdi mdi-delete" size="is-small"></b-icon>
              </b-button>
            </b-table-column>
          </template>
        </b-table>
        <hr />
        <b-modal
          :active.sync="isComponentModalActive"
          has-modal-card
          trap-focus
          aria-role="dialog"
          aria-modal
        >
          <myModal :data="zoneID" @pushZone="reloadData()" />
        </b-modal>

        <div class="spasi"></div>
      </div>
    </div>
  </section>
</template>

<script>
import Vue from "vue";
// import VeeValidate from "vee-validate";
// Vue.use(VeeValidate, {
//   events: ""
// });
import myFilter from "~/components/Filter";
// import myPagination from "~/components/Pagination";
import myModal from "~/components/ZoneModal";
export default {
  components: {
    myFilter,
    // myPagination,
    myModal
  },
  middleware: "auth",
  data() {
    return {
      zones: [],
      isComponentModalActive: false,
      zoneID: null,
      userID: this.$auth.user.user_id
    };
  },
  created() {
    this.getZones();
  },
  methods: {
    reloadData() {
      this.isComponentModalActive = false;
      this.getZones();
    },
    openModal() {
      this.zoneID = null;
      this.isComponentModalActive = true;
    },
    async getZones() {
      this.$axios
        .get("/zoneact?zone_status=t&include=location_id")
        .then(response => {
          this.zones = response.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    async getDetail(id) {
      this.zoneID = id;
      this.isComponentModalActive = true;
    },
    deleteData(id) {
      this.orderData = {
        zone_id: id,
        updated_by: this.userID,
        method: "delete"
      };
      this.$buefy.dialog.confirm({
        title: "Attention !",
        message:
          "Are you sure you want to <b>delete</b> data? This action cannot be undone.",
        confirmText: "Delete",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => {
          this.$axios
            .post("/zoneact", this.orderData)
            .then(response => {
              this.getZones();
            })
            .catch(e => {
              console.log(e);
            });
        }
      });
    }
  }
};
</script>
