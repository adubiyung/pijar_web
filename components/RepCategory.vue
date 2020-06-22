<template>
  <section class="section">
    <div class="columns">
      <div class="column">
        <b-table :data="dataCat" class="is-size-7">
          <template slot-scope="props">
            <b-table-column field="category" label="Category Parking" sortable>
              <div v-if="props.row.feature_type_id=='1'">On The Spot</div>
              <div v-else-if="props.row.feature_type_id=='2'">Booking</div>
              <div v-else>Other</div>
            </b-table-column>
            <b-table-column field="trans" label="Number of Transaction" sortable>{{props.row.total_trans}}</b-table-column>
            <b-table-column field="total" label="Total Collected" sortable>Rp {{props.row.total_billing}}</b-table-column>
          </template>
        </b-table>
        <hr />
      </div>
    </div>
  </section>
</template>

<script>
import Vue from "vue";
import myFilter from "~/components/Filter";
export default {
  props:["dataCat"],
  components: {
    myFilter
  },
  middleware: "auth",
  data() {
    return {
      payments: [],
      userID: this.$auth.user.user_officer_id,
      roleID: this.$auth.user.role_id,
      paramID: "",
      filename: "report.xls"
    };
  },
  created() {
    
  },
  methods: {
    
  }
};
</script>