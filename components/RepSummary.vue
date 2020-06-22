<template>
  <section class="section">
    <div id="data" class="columns">
      <div class="column">
        <div class="box">
          <p class="subtitle is-7">Total Transaction</p>
          <p class="is-size-4">{{tTrans}} </p>
        </div>
      </div>
      <div class="column">
        <div class="box">
          <p class="subtitle is-7">Total Income</p>
          <p class="is-size-4">Rp {{tIncome}}</p>
        </div>
      </div>
      <div class="column">
        <div class="box">
          <p class="subtitle is-7">Average Income per Day</p>
          <p class="is-size-4">Rp {{aIncome}}</p>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <b-table :data="dataSum" class="is-size-7">
          <template slot-scope="props">
            <b-table-column field="code" label="Transaction Code" sortable>{{props.row.transaction_code}}</b-table-column>
            <b-table-column field="location" label="Location" sortable>{{props.row.location_name}}</b-table-column>
            <b-table-column field="vehType" label="Vehicle Type" sortable>
              <div v-if="props.row.vehicle_type_id=='1'">Car</div>
              <div v-else>Bike</div>
            </b-table-column>
            <b-table-column field="featType" label="Feature_type" sortable>{{props.row.feature_name}}</b-table-column>
            <b-table-column field="payType" label="Payment Type" sortable>{{props.row.payment_type_name}}</b-table-column>
            <b-table-column field="checkin" label="Checkin By" sortable>{{props.row.checkin_by}}</b-table-column>
            <b-table-column field="checkout" label="Checkout By" sortable>{{props.row.checkout_by}}</b-table-column>
            <b-table-column field="billing" label="Total Billing" sortable>{{props.row.total_billing}}</b-table-column>
            <b-table-column field="status" label="Status" sortable>
              <div v-if="props.row.transaction_status=='4'">Check Out</div>
              <div v-else>Close Order</div>
            </b-table-column>
            
          </template>
        </b-table>
        <hr />
      </div>
    </div>
  </section>
</template>

<script>
import Vue from "vue";
export default {
  props:["dataSum", "tTrans", "tIncome", "aIncome"],
  components: {

  },
  middleware: "auth",
  data() {
    return {
      
    };
  }
  
};
</script>