<template>
  <section class="section">
    <div class="columns">
      <div class="column">
        <b-table :data="dataPay" class="is-size-7">
          <template slot-scope="props">
            <b-table-column field="payment" label="Payment Method" sortable>
              <div v-if="props.row.payment_type_id=='1'">Cash</div>
              <div v-else>Cashless</div>
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
  props:["dataPay"],
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