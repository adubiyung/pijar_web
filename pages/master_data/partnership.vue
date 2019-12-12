<template>
  <section class="section">
    <h1 class="subtitle">Partnership</h1>
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
        <b-table :data="partners" class="is-size-7">
          <template slot-scope="props">
            <b-table-column field="name" label="Company" sortable>{{props.row.partner_company}}</b-table-column>
            <b-table-column field="person" label="PIC Name" sortable>{{props.row.partner_person}}</b-table-column>
            <b-table-column field="address" label="Address" sortable>{{props.row.partner_address}}</b-table-column>
            <b-table-column field="phone" label="Phone Number" sortable>{{props.row.partner_phone}}</b-table-column>
            <b-table-column field="email" label="Email" sortable>{{props.row.partner_email}}</b-table-column>
            <b-table-column field="action" label="action">
              <b-button type="is-warning" size="is-small" @click="getDetail(props.row.partner_id)">
                <b-icon icon="mdi mdi-pencil" size="is-small"></b-icon>
              </b-button>
              <b-button type="is-danger" size="is-small" @click="deleteData(props.row.partner_id)">
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
          <myModal :data="myPartnerID" @pushPartner="reloadData()" />
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
import myModal from "~/components/PartnerModal";
export default {
  components: {
    myFilter,
    // myPagination,
    myModal
  },
  middleware: "auth",
  data() {
    return {
      partners: [],
      isComponentModalActive: false,
      myPartnerID: null
    };
  },
  created() {
    this.getPartner();
  },
  methods: {
    reloadData() {
      this.isComponentModalActive = false;
      this.getPartner();
    },
    openModal() {
      this.myPartnerID = null;
      this.isComponentModalActive = true;
    },
    deleteData(id) {
      this.orderData = {
        partner_id: id,
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
            .post("/partneract", this.orderData)
            .then(response => {
              this.getPartner();
            })
            .catch(e => {
              console.log(e);
            });
        }
      });
    },
    async getPartner() {
      this.$axios
        .get("/partneract")
        .then(response => {
          this.partners = response.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    async getDetail(id) {
      this.myPartnerID = id;
      this.isComponentModalActive = true;
    }
  }
};
</script>
