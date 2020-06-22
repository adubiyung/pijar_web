<template>
  <section class="section">
    <h1 class="subtitle">Promo</h1>
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
        <b-table :data="promo" class="is-size-7">
          <template slot-scope="props">
            <b-table-column field="name" label="Voucher Name" sortable>{{ props.row.voucher_name }}</b-table-column>
            <b-table-column field="location" label="Voucher Location" sortable>{{ props.row.location_id.location_name }}</b-table-column>
            <b-table-column field="typeVehicle" label="Type Vehicle" sortable>
              <div v-if="props.row.vehicle_type_id!='1'">Car</div>
              <div v-else>Bike</div>
            </b-table-column>
            <b-table-column field="code" label="Voucher Code" sortable>{{props.row.voucher_code}}</b-table-column>
            <b-table-column field="percent" label="voucher Percent" sortable>{{props.row.voucher_percent}}%</b-table-column>
            <b-table-column field="maxNominal" label="Maximum Nominal" sortable>
              Rp {{props.row.voucher_max_nominal.toFixed(0).replace(/\d(?=(\d{3})+)/g, "$&.")}}
              </b-table-column>
            <b-table-column
              field="valid"
              label="Start Date"
              sortable
            >{{props.row.voucher_start_date}}</b-table-column>
            <b-table-column
              field="valid"
              label="Valid Date"
              sortable
            >{{props.row.voucher_valid_date}}</b-table-column>
            <b-table-column
              field="desc"
              label="Description"
              sortable
            >{{props.row.voucher_description}}</b-table-column>
            <b-table-column field="action" label="action">
              <b-button type="is-warning" size="is-small" @click="getDetail(props.row.voucher_id)">
                <b-icon icon="mdi mdi-pencil" size="is-small"></b-icon>
              </b-button>
              <b-button type="is-danger" size="is-small" @click="deleteData(props.row.voucher_id)">
                <b-icon icon="mdi mdi-delete" size="is-small"></b-icon>
              </b-button>
            </b-table-column>
          </template>
        </b-table>
        <hr />
        
        <b-modal
          :active.sync="isComponentModalActive"
          has-hard-card
          trap-focus
          arial-role="dialog"
          aria-modal>
          <myModal :data="myPromoID" @pushPromo="reloadData()"/>
        </b-modal>

        <div class="spasi">
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Vue from "vue";
import myFilter from "~/components/Filter";
import myPagination from "~/components/Pagination";
import myModal from "~/components/PromoModal";
export default {
  components: {
    myFilter,
    myPagination,
    myModal
  },
  middleware: "auth",
  data() {
    const tzoffset = new Date().getTimezoneOffset() * 60000;
    return {
      promo: [],
      isComponentModalActive: false,
      myPromoID: null
    };
  },
  created() {
    this.getData();
  },
  methods: {
    openModal(){
      this.isComponentModalActive = true,
      this.myPromoID = null
    },
    reloadData(){
      this.isComponentModalActive = false,
      getData();
    },
    async getData() {
      this.$axios
        .get(`/voucher?include=location_id&city_id=${this.$auth.user.location_id}`)
        .then(response => {
          this.promo = response.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    async getDetail(id) {
      this.myPromoID = id;
      this.isComponentModalActive = true;
    },
    deleteData(id) {
      this.orderData = {
        voucher_id: id,
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
            .post("/voucher", this.orderData)
            .then(response => {
              this.getData();
            })
            .catch(e => {
              console.log(e);
            });
        }
      });
    },
  }
};
</script>
