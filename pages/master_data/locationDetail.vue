<template>
  <section class="section">
    <h1 class="subtitle">Detail Location</h1>
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
            <b-table-column field="name" label="Name" sortable>{{props.row.detail_location_name}}</b-table-column>
            <b-table-column v-if="props.row.way_type==1" field="way" label="Way Type" sortable>1 Way</b-table-column>
            <b-table-column v-else field="way" label="Way Type" sortable>2 Way</b-table-column>
            <b-table-column
              v-if="props.row.vehicle_type_id==1"
              field="vehicle"
              label="Vehicle Type"
              sortable
            >Car</b-table-column>
            <b-table-column
              v-else-if="props.row.vehicle_type_id==2"
              field="vehicle"
              label="Vehicle Type"
              sortable
            >Motor</b-table-column>
            <b-table-column v-else field="vehicle" label="Vehicle Type" sortable>Both</b-table-column>
            <b-table-column field="side" label="Total Side" sortable>{{props.row.total_side}}</b-table-column>
            <b-table-column field="action" label="action">
              <b-button
                type="is-warning"
                size="is-small"
                @click="editData(props.row.detail_location_id)"
              >
                <b-icon icon="mdi mdi-pencil" size="is-small"></b-icon>
              </b-button>
              <b-button
                type="is-danger"
                size="is-small"
                @click="deleteData(props.row.detail_location_id)"
              >
                <b-icon icon="mdi mdi-delete" size="is-small"></b-icon>
              </b-button>
              <b-button
                type="is-info"
                size="is-small"
                @click="getDetail(props.row.detail_location_id, props.row.way_type)"
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
          <myModal :loc_id="myLocationID" :detailloc_id="myDetailID" @pushLoca="reloadData()" />
        </b-modal>

        <div class="spasi"></div>
      </div>
    </div>
  </section>
</template>

<script>
import Vue from "vue";
import myFilter from "~/components/Filter";
import myModal from "~/components/DetailLocationModal";
export default {
  components: {
    myFilter,
    myModal
  },
  middleware: "auth",
  data() {
    return {
      locations: [],
      isComponentModalActive: false,
      myLocationID: this.$route.query.id,
      myDetailID: "",
      userID: this.$auth.user.user_officer_id
    };
  },
  created() {
    console.log("myloc", this.myLocationID);

    this.getlocations();
  },
  methods: {
    reloadData() {
      this.isComponentModalActive = false;
      this.getlocations();
    },
    openModal() {
      this.isComponentModalActive = true;
    },
    async getlocations() {
      this.$axios
        .get("/detailLocation?location_id=" + this.myLocationID)
        .then(response => {
          this.locations = response.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    async editData(id) {
      this.myDetailID = id;
      this.isComponentModalActive = true;
    },
    async getDetail(id, wayid) {
      this.$router.push(
        "/master_data/locationLot?id=" +
          id +
          "&locid=" +
          this.myLocationID +
          "&wayid=" +
          wayid
      );
    },
    deleteData(id) {
      this.orderData = {
        detail_location_id: id,
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
            .post("/detailLocation", this.orderData)
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
