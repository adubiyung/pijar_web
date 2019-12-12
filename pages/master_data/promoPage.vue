<template>
  <section class="section">
    <h1 class="subtitle">Promo</h1>
    <!-- <div v-on:closeVaraintModal="closePriceModal($event)">{{isComponentPriceModal}}</div> -->
    <div class="spasi">
      <div class="field">
        <b-button
          type="is-info is-small"
          @click="openCollapse()"
          aria-controls="contentCollapse"
        >Add Partnership</b-button>
        <b-button
          type="is-info is-small"
          @click="openCollapse()"
          aria-controls="contentCollapse"
        >Add Promo</b-button>
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
            <b-table-column field="name" label="Voucher Name" sortable>{{ props.row.voucher_name }}</b-table-column>
            <b-table-column field="location" label="Voucher Location" sortable>{{ props.row.location_id.location_name }}</b-table-column>
            <b-table-column field="typeVehicle" label="Type Vehicle" sortable>{{ props.row.voucher_name }}</b-table-column>
            <b-table-column field="code" label="Voucher Code" sortable>{{props.row.voucher_code}}</b-table-column>
            <b-table-column field="percent" label="voucher Percent" sortable>{{props.row.voucher_percent}}%</b-table-column>
            <b-table-column field="maxNominal" label="Maximum Nominal" sortable>
              Rp {{props.row.voucher_max_nominal.toFixed(0).replace(/\d(?=(\d{3})+)/g, "$&.")}}
              </b-table-column>
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
          </template>
        </b-table>
        <hr />
        <!-- <myPagination
          v-if="pagination.total_pages > 1"
          :pagination="pagination"
          :offset="3"
          @paginate="locations()"
        />-->

        <div class="spasi">
          <!-- <pre>{{ hasil_select }}</pre> -->
        </div>
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
import myPagination from "~/components/Pagination";
// import myPriceModal from "~/components/PriceModal";
// import myInventoryModal from "~/components/InventoryModal";
// import myCostModal from "~/components/CostModal";
// import myItemForm from "~/components/ItemForm";
export default {
  components: {
    myFilter,
    myPagination
    // myPriceModal,
    // myInventoryModal,
    // myCostModal
    // myItemForm
  },
  middleware: "auth",
  data() {
    return {
      locations: []
    };
  },
  created() {
    this.getlocations();
  },
  methods: {
    async getlocations() {
      this.$axios
        .get("/voucher?include=location_id")
        .then(response => {
          this.locations = response.data.data;
          console.log(this.locations);
        })
        .catch(e => {
          console.log(e);
        });
    },
    async getitems(category_id) {
      if (this.category_id == "all") {
        this.filtercategory = "&1=1";
      } else if (this.category_id != null) {
        this.filtercategory = "&category=" + this.category_id;
      } else {
        this.filtercategory = "&1=1";
      }

      if (this.search) {
        this.filtersearch = "&search=" + this.search;
      } else {
        this.filtersearch = "&0=0";
      }

      if (this.inventory_id == "all") {
        this.filterinventory = "&1=1";
      } else if (this.inventory_id != null) {
        if (this.inventory_id == 2) {
          this.filterinventory = "&inventory=out";
        } else if (this.inventory_id == 1) {
          this.filterinventory = "&inventory=low";
        }
      } else {
        this.filterinventory = "&1=1";
      }

      this.$axios
        .get(
          "/allitems?outletid=" +
            this.outlet_id +
            this.filtercategory +
            this.filtersearch +
            this.filterinventory +
            "&page=" +
            this.pagination.current_page +
            "&per_page=" +
            this.perPage
        )
        .then(response => {
          this.myitems = response.data.data;
          this.pagination = response.data.meta.pagination;
          this.totaldata = this.pagination.total;
          console.log(this.myitems);
        })
        .catch(e => {
          console.log(e);
        });
    },
    async getmyCategories() {
      this.$axios
        .get(
          "/allcategory?outletid=" +
            this.outlet_id +
            "&page=" +
            this.pagination.current_page +
            "&per_page=" +
            this.perPage
        )
        .then(response => {
          this.categories = response.data.data;
          this.pagination = response.data.meta.pagination;
          console.log(this.categories);
        })
        .catch(e => {
          console.log(e);
        });
    },
    async getDetail(hasil_select) {
      this.item_id = hasil_select.item_id;
      this.item_name = hasil_select.item_name;
      this.unit = hasil_select.unit_id;
      this.description = hasil_select.description;
      this.image = hasil_select.photo;
      this.category = hasil_select.category_id;
      this.method = "update";

      this.variant = hasil_select.variant; //isinya array

      this.VariantRows1 = [];
      this.variant.forEach((vari, key) => {
        this.StockRows = [];
        vari.stock.forEach((stck, key) => {
          this.StockRows.push({
            stock_id: stck.stock_id,
            stock_amount_tracked: stck.stock_amount_tracked,
            stock_amount: stck.stock_amount,
            stock_alert_tracked: stck.stock_alert_tracked,
            stock_alert: stck.stock_alert
          });
        });
        this.VariantRows1.push({
          variant_id: vari.variant_id,
          variant_name: vari.variant_name,
          price: vari.price,
          cogs: vari.cogs,
          cogs_tracked: vari.cogs_tracked,
          stock: this.StockRows
        });
      });

      this.variant_name = hasil_select.variant[0].variant_name;
      this.price = hasil_select.variant[0].price;
      this.cogs = hasil_select.variant[0].cogs;
      this.sku = hasil_select.variant[0].sku;

      if ((this.stock = hasil_select.variant[0].stock.length > 0)) {
        this.stock = hasil_select.variant[0].stock[0].stock_amount;
      } else {
        this.stock = null;
      }

      this.isOpen = true;
      this.columnCollapse = "column is-two-fifths";
      this.detailUnit();
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
