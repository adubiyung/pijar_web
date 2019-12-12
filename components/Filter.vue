<template>
  <section>
    <b-field grouped group-multiline>
      <b-select @input="pushOutlet" v-model="outlet" placeholder="Outlet" :disabled="disabled" icon="home" rounded size="is-small">
        <option
          v-for="option in outlets"
          :value="option.outlet_id"
          :key="option.outlet_id"
        >{{ option.outlet_name }}</option>
      </b-select>
      <b-select @input="pushCategory" v-model="category" placeholder="Category" rounded size="is-small">
        <option value="all">All Category</option>
        <option
          v-for="option in categories"
          :value="option.category_id"
          :key="option.category_id"
        >{{ option.category_name }}</option>
      </b-select>
      <b-select @input="pushInventory" v-model="inventory" placeholder="inventory"  rounded size="is-small">
        <option value="all">All Inventories</option>
        <option
          v-for="option in inventories"
          :value="option.inventory_id"
          :key="option.inventory_id"
        >{{ option.inventory_name }}</option>
      </b-select>
      <b-input @change.native="pushSearch" v-model="search" placeholder="Search..." type="search" icon="magnify" rounded size="is-small"></b-input>
    </b-field>
  </section>
</template>

<script>
export default {
  props: ["data"],
  data() {
    return {
      perPage: 10,
      pagination: {
        current_page: 1
      },
      outlets:[],
      search:"",
      outlet:this.data.outletid,
      inventory:null,
      category:null,
      categories:[],
      inventories:[
        {
          inventory_id:1,
          inventory_name:"Low Stock Alert"
        },
        {
          inventory_id:2,
          inventory_name:"Out Of Stock Alert"
        },
      ],
      disabled:false
    };
  },created() {
    this.getOutlet();
    this.getCategories();
    this.checkOutlet();
  },
  methods: {
    async getCategories() {
      this.$axios
        .get(
          "/allcategory?outletid=" +
            this.outlet +
            "&page=" +
            this.pagination.current_page +
            "&per_page=" +
            this.perPage
        )
        .then(response => {
          this.categories = response.data.data;
          this.pagination = response.data.meta.pagination;
        })
        .catch(e => {
          console.log(e);
        });
    },
    getOutlet() {
      this.$axios
        .get(
          "/alloutlet?page=" +
            this.pagination.current_page +
            "&per_page=" +
            this.perPage
        )
        .then(response => {
          this.outlets = response.data.data;
          this.pagination = response.data.meta.pagination;
        })
        .catch(e => {
          console.log(e);
        });
    },
    checkOutlet(){
      if (this.outlet == 0){
        this.disabled = false
      } else {
        this.disabled = true
      }
    }, 
    pushOutlet: function() {
      this.$emit("pushOutlet", this.outlet);
      this.getCategories();
    },
    pushSearch: function() {
      this.$emit("pushSearch", this.search);
    },
    pushInventory: function() {
      this.$emit("pushInventory", this.inventory);
    },
    pushCategory: function() {
      this.$emit("pushCategory", this.category);
    }
  }
};
</script>
