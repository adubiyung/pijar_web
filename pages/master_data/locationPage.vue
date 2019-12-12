<template>
  <section class="section">
    <h1 class="subtitle">Locations</h1>
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
        <b-table :data="locations" class="is-size-7">
          <template slot-scope="props">
            <b-table-column field="name" label="Name" sortable>{{props.row.location_name}}</b-table-column>
            <b-table-column
              field="address"
              label="Address"
              sortable
            >{{props.row.location_address}} - {{props.row.location_city}}</b-table-column>
            <b-table-column field="email" label="Email" sortable>{{props.row.location_email}}</b-table-column>
            <b-table-column field="phone" label="Phone Number" sortable>{{props.row.location_phone}}</b-table-column>
            <b-table-column
              field="latitude"
              label="Latitude"
              sortable
            >{{props.row.location_latitude}}</b-table-column>
            <b-table-column
              field="longitude"
              label="Longitude"
              sortable
            >{{props.row.location_longitude}}</b-table-column>
            <b-table-column field="action" label="action">
              <b-button type="is-warning" size="is-small" @click="getDetail(props.row.location_id)">
                <b-icon icon="mdi mdi-pencil" size="is-small"></b-icon>
              </b-button>
              <b-button type="is-danger" size="is-small" @click="deleteData(props.row.location_id)">
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
          <myModal :data="myLocationID" @pushLoca="reloadData()" />
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
import myModal from "~/components/LocationModal";
export default {
  components: {
    myFilter,
    // myPagination,
    myModal
  },
  middleware: "auth",
  data() {
    return {
      locations: [],
      isComponentModalActive: false,
      myLocationID: null,
      userID: this.$auth.user.user_id
    };
  },
  created() {
    this.getlocations();
  },
  methods: {
    reloadData() {
      this.isComponentModalActive = false;
      this.getlocations();
    },
    openModal() {
      this.myLocationID = null;
      this.isComponentModalActive = true;
    },
    async getlocations() {
      this.$axios
        .get("/location?location_status=t")
        .then(response => {
          this.locations = response.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    async getDetail(id) {
      this.myLocationID = id;
      this.isComponentModalActive = true;
    },
    deleteData(id) {
      this.orderData = {
        location_id: id,
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
            .post("/location", this.orderData)
            .then(response => {
              this.getlocations();
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
