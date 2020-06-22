<template>
  <section class="section">
    <h1 class="subtitle">Data Lot Location</h1>
    <div class="spasi">
      <div class="field">
        <b-button
          type="is-info is-small"
          @click="openModal()"
          aria-controls="contentCollapse"
        >Add Data</b-button>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <b-table :data="locations" class="is-size-7">
          <template slot-scope="props">
            <b-table-column
              v-if="props.row.sign_arrow_id==1"
              field="arrow"
              label="Sign Arrow"
              sortable
            >Up</b-table-column>
            <b-table-column v-else field="arrow" label="Sign Arrow" sortable>Bottom</b-table-column>
            <b-table-column field="name" label="Sign Name" sortable>{{props.row.sign_name}}</b-table-column>
            <b-table-column
              field="right"
              label="Total Right Lot"
              sortable
            >{{props.row.total_right_lot}}</b-table-column>
            <b-table-column
              field="left"
              label="Total Left Lot"
              sortable
            >{{props.row.total_left_lot}}</b-table-column>

            <b-table-column field="action" label="action">
              <b-button
                type="is-warning"
                size="is-small"
                @click="editData(props.row.lot_location_id)"
              >
                <b-icon icon="mdi mdi-pencil" size="is-small"></b-icon>
              </b-button>
              <b-button
                type="is-danger"
                size="is-small"
                @click="deleteData(props.row.lot_location_id)"
              >
                <b-icon icon="mdi mdi-delete" size="is-small"></b-icon>
              </b-button>
              <b-button
                type="is-info"
                size="is-small"
                @click="getDetail(props.row.lot_location_uuid)"
              >
                <b-icon icon="mdi mdi-more" size="is-small"></b-icon>
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
          <myModal
            :loc_id="locID"
            :detailloc_id="detailLocID"
            :lot_id="lotID"
            :wayid="myWayID"
            @pushData="reloadData()"
          />
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
import myModal from "~/components/LotLocationModal";
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
      detailLocID: this.$route.query.id,
      locID: this.$route.query.locid,
      myWayID: this.$route.query.wayid,
      userID: this.$auth.user.user_officer_id,
      lotID: null
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
      this.lotID = null;
      this.isComponentModalActive = true;
    },
    async getlocations() {
      this.$axios
        .get("/lotLocation?detail_location_id=" + this.detailLocID)
        .then(response => {
          this.locations = response.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    async editData(id) {
      this.lotID = id;
      this.isComponentModalActive = true;
    },
    async getDetail(id) {
      this.$router.push("/master_data/locationMap?lotid=" + id);
    },
    deleteData(id) {
      this.orderData = {
        lot_location_id: id,
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
          console.log("delete",this.orderData);
          this.$axios
            .post("/lotLocation", this.orderData)
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
