<template>
  <section class="section">
    <h1 class="subtitle">Area</h1>
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
            <b-table-column field="name" label="Name" sortable>{{ props.row.location_name }}</b-table-column>
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
            <b-table-column field="action" label="action" sortable>
              <b-button type="is-warning" size="is-small" @click="getDetail(props.row.location_id)">
                <b-icon icon="mdi mdi-pencil" size="is-small"></b-icon>
              </b-button>
              <b-button type="is-danger" size="is-small">
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
      myLocationID: null
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
        .get("/location")
        .then(response => {
          this.locations = response.data.data;
          console.log(this.locations);
        })
        .catch(e => {
          console.log(e);
        });
    },
    async getDetail(id) {
      this.myLocationID = id;
      this.isComponentModalActive = true;
    },

    saveItem() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.dataitem = [
            {
              item_id: this.item_id,
              item_name: this.item_name,
              category_id: this.category,
              outlet_id: this.outlet_id,
              photo: this.photo,
              create_by: this.userid,
              description: this.description,
              update_by: this.userid,
              delete_by: this.userid,
              method: this.method,
              unit_id: this.unit_id,
              variants: this.VariantRows1
            }
          ];
          if (this.method == "delete") {
            this.$buefy.dialog.confirm({
              title: "Deleting",
              message:
                "Are you sure you want to <b>delete</b> data? This action cannot be undone.",
              confirmText: "Delete",
              type: "is-danger",
              hasIcon: true,
              onConfirm: () => {
                this.$axios
                  .post("/items", this.dataitem)
                  .then(response => {
                    this.closeCollapse();
                    this.getitems();
                    this.$toast.open({
                      message: "Data deleted!",
                      type: "is-success",
                      position: "is-bottom"
                    });
                  })
                  .catch(e => {
                    console.log(e);
                  });
              }
            });
          } else {
            this.$axios
              .post("/items", this.dataitem)
              .then(response => {
                //   this.$router.push("/items/itemlist");
                this.closeCollapse();
                this.getitems();
              })
              .catch(e => {
                console.log(e);
                this.error.push(e);
              });
            this.$buefy.notification.open({
              message: "Success!",
              type: "is-success"
            });
            return;
            this.$buefy.notification.open({
              message: "Failed!",
              type: "is-danger"
            });
          }
        }
      });
    },
    activeditem() {
      this.actived_item = [
        {
          item_id: this.item_id,
          actived: this.actived
        }
      ];
      console.log(this.actived_item);

      this.$axios
        .post("/item", this.actived_item)
        .then(response => {
          //   this.$router.push("/items/itemlist");
          this.closeCollapse();
          this.getitems();
        })
        .catch(e => {
          console.log(e);
          this.error.push(e);
        });
      this.$toast.open({
        message: "Form is valid!",
        type: "is-success",
        position: "is-bottom"
      });
      return;
    },

    openCollapse() {
      this.isOpen = true;
      this.columnCollapse = "column is-two-fifths";
      this.hasil_select = null;
      this.category = null;
      this.unit = null;
      this.variantrows = [];
      this.VariantRows1 = [
        {
          variant_id: null,
          variant_name: "",
          price: null,
          cogs: null,
          cogs_tracked: false,
          stock: [
            {
              stock_id: null,
              stock_amount_tracked: false,
              stock_amount: null,
              stock_alert_tracked: false,
              stock_alert: null
            }
          ]
        }
      ];
      this.item_id = "";
      this.item_name = "";
      this.variant_name = "";
      this.price = "";
      this.sku = "";
      this.stock = "";
      this.cogs = "";
      this.description = "";
      this.method = "insert";
    },
    closeCollapse() {
      this.isOpen = false;
      this.columnCollapse = "";
      this.hasil_select = null;
    },
    updateVariant(updateVariant) {
      this.VariantRows1 = updateVariant;
      this.isComponentPriceModal = false;
      this.isComponentInventoryModal = false;
      this.isComponentCostModal = false;
    },
    closePriceModal: function(isComponentPriceModal) {
      this.isComponentPriceModal = isComponentPriceModal;
    },
    updateOutlet(updateOutlet) {
      this.outlet_id = updateOutlet;
      this.getitems();
      this.getmyCategories();
      this.closeCollapse();
    },
    updateSearch(updatesearch) {
      this.search = updatesearch;
      this.getitems();
      this.closeCollapse();
    },
    updateCategory(updateCategory) {
      this.category_id = updateCategory;
      this.getitems();
      this.closeCollapse();
    },
    updateInventory(updateInventory) {
      this.inventory_id = updateInventory;
      this.getitems();
      this.closeCollapse();
    },
    PriceModal() {
      this.isComponentPriceModal = true;
    }
  }
};
</script>
