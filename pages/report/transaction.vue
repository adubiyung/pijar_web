<template>
  <section class="section">
    <h1 class="subtitle">Data Transaction Report</h1>

    <div class="spasi">
      <div class="field is-pulled-right">
        <JsonExcel
          class="btn btn-default"
          :data="exceldata"
          worksheet="sheet1"
          :name="filename"
        >
          <b-button type="is-info is-small" icon-left="mdi mdi-printer">Export</b-button>
        </JsonExcel>
      </div>
      <myFilter
        :data="myFilter"
        @setData="updateData($event)"
        @setDateStart="updateDateStart($event)"
        @setDateEnd="updateDateEnd($event)"
      />
    </div>

    <div class="columns">
      <div class="column is-2">
        <b-menu>
          <b-menu-list>
            <b-menu-item
              class="is-size-7"
              :active="isActSummary"
              @click.native="ActSummary()"
              label="Transaction Summary"
            ></b-menu-item>
            <b-menu-item
              class="is-size-7"
              :active="isActPayment"
              @click.native="ActPayment()"
              label="Payment Method"
            ></b-menu-item>
            <b-menu-item
              class="is-size-7"
              :active="isActCategory"
              @click.native="ActCategory()"
              label="Category Parking"
            ></b-menu-item>
            <b-menu-item
              class="is-size-7"
              :active="isActVehicle"
              @click.native="ActVehicle()"
              label="Vehicle Type"
            ></b-menu-item>
            <b-menu-item
              class="is-size-7"
              :active="isActCheckin"
              @click.native="ActCheckin()"
              label="Checkin By"
            ></b-menu-item>
            <b-menu-item
              class="is-size-7"
              :active="isActCollected"
              @click.native="ActCollected()"
              label="Collecting By"
            ></b-menu-item>
          </b-menu-list>
        </b-menu>
      </div>
      <div class="column">
        <div v-if="isActSummary">
          <repSummary
            :dataSum="summary"
            :tTrans="total_trans"
            :tIncome="total_income"
            :aIncome="average_income"
          />
        </div>
        <div v-if="isActPayment">
          <repPayment :dataPay="payments" />
        </div>
        <div v-if="isActCategory">
          <repCategory :dataCat="categories" />
        </div>
        <div v-if="isActVehicle">
          <repVehicle :dataVeh="vehicles" />
        </div>
        <div v-if="isActCheckin">
          <repCheckin :dataIn="checkin" />
        </div>
        <div v-if="isActCollected">
          <repCollecting :dataCol="collects" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Vue from "vue";
import JsonExcel from "vue-json-excel";
import myFilter from "~/components/FilterReport";
import repSummary from "~/components/RepSummary";
import repPayment from "~/components/RepPayment";
import repCategory from "~/components/RepCategory";
import repVehicle from "~/components/RepVehicle";
import repCheckin from "~/components/RepCheckin";
import repCollecting from "~/components/RepCollecting";
export default {
  components: {
    myFilter,
    repSummary,
    repPayment,
    repCategory,
    repVehicle,
    repCheckin,
    repCollecting,
    JsonExcel
  },
  middleware: "auth",
  data() {
    const today = new Date();
    const tzoffset = new Date().getTimezoneOffset() * 60000;
    return {
      myFilter: {
        cityID: 0,
        districtID: 0,
        locationID: 0,
        wardenID: 0
      },
      exceldata: [],
      filename: "Report.xls",
      isActSummary: true,
      isActPayment: false,
      isActCategory: false,
      isActVehicle: false,
      isActCheckin: false,
      isActCollected: false,
      users: [],
      summary: [],
      dataDash: [],
      total_trans: 0,
      total_income: 0,
      average_income: 0,
      payments: [],
      categories: [],
      vehicles: [],
      checkin: [],
      collects: [],
      isComponentModalActive: false,
      myUserID: null,
      userID: this.$auth.user.user_officer_id,
      roleID: this.$auth.user.role_id,
      paramID: "",
      dateStart: new Date(today - tzoffset).toISOString().split("T")[0],
      dateEnd: new Date(today - tzoffset).toISOString().split("T")[0],
      filterdata: {
        typeID: 0,
        dateStart: 0,
        dateEnd: 0,
        paramID: 0
      },
      typeID: "",
      paramID: ""
    };
  },
  created() {
    this.DataReport();
    this.ActSummary();
  },
  methods: {
    async getDetail(id) {
      this.myUserID = id;
      this.isComponentModalActive = true;
    },
    async ActReset() {
      this.isActSummary = false;
      this.isActPayment = false;
      this.isActCategory = false;
      this.isActVehicle = false;
      this.isActCheckin = false;
      this.isActCollected = false;
    },
    async DataReport() {
      if (this.typeID == "") {
        if (this.roleID == 1) {
          this.typeID = "1";
          this.paramID = this.$auth.user.province_id;
        } else if (this.roleID == 2) {
          this.typeID = "2";
          this.paramID = this.$auth.user.city_id;
        } else if (this.roleID == 5) {
          this.typeID = "3";
          this.paramID = this.$auth.user.district_id;
        }
      }
      //summary
      await this.$axios
        .get(
          `/reportsummary?type=${this.typeID}&startDate=${this.dateStart}&endDate=${this.dateEnd}&paramID=${this.paramID}`
        )
        .then(response => {
          this.summary = response.data.data;
        });

      await this.$axios
        .get(
          `/summary?type=${this.typeID}&startDate=${this.dateStart}&endDate=${this.dateEnd}&paramID=${this.paramID}`
        )
        .then(response => {
          this.total_trans = 0;
          this.total_income = 0;
          this.average_income = 0;
          this.dataDash = response.data.data;

          if (this.dataDash.length > 0) {
            this.total_trans = this.dataDash[0].total_transaction;
            this.total_income = this.dataDash[0].total_billing
              .toFixed(0)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            this.average_income = parseInt(this.dataDash[0].average)
              .toFixed(0)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          }
        });
        //payment method
        await this.$axios
        .get(
          `/reportpayment?type=${this.typeID}&startDate=${this.dateStart}&endDate=${this.dateEnd}&paramID=${this.paramID}`
        )
        .then(response => {
          this.payments = response.data.data;
        });
        // category
        await this.$axios
        .get(
          `/reportcategory?type=${this.typeID}&startDate=${this.dateStart}&endDate=${this.dateEnd}&paramID=${this.paramID}`
        )
        .then(response => {
          this.categories = response.data.data;
        });
        // vehicle
        await this.$axios
        .get(
          `/reportvehicle?type=${this.typeID}&startDate=${this.dateStart}&endDate=${this.dateEnd}&paramID=${this.paramID}`
        )
        .then(response => {
          this.vehicles = response.data.data;
        });
        //checkin
        await this.$axios
        .get(
          `/reportcheckin?type=${this.typeID}&startDate=${this.dateStart}&endDate=${this.dateEnd}&paramID=${this.paramID}`
        )
        .then(response => {
          this.checkin = response.data.data;
        });

        await this.$axios
        .get(
          `/reportcollect?type=${this.typeID}&startDate=${this.dateStart}&endDate=${this.dateEnd}&paramID=${this.paramID}`
        )
        .then(response => {
          this.collects = response.data.data;
        })
        .catch(e => {
          console.log(e);
        });

        if (this.isActSummary == true) {
          this.exceldata = this.summary;
        } else if (this.isActPayment == true) {
          this.exceldata = this.payments;
        } else if (this.isActCategory == true) {
          this.exceldata = this.categories;
        } else if (this.isActVehicle == true) {
          this.exceldata = this.vehicles;
        } else if (this.isActCheckin == true) {
          this.exceldata = this.checkin;
        } else if (this.isActCollected == true) {
          this.exceldata = this.collects;
        } 
    },
    async ActSummary() {
      await this.ActReset();
      this.isActSummary = true;
      this.filename = "SummaryReport.xls";
      this.exceldata = this.summary;
      console.log("data", this.exceldata);
    },
    async ActPayment() {
      await this.ActReset();
      this.isActPayment = true;
      this.filename = "PaymentMethod.xls";
      this.exceldata = this.payments;
    },
    async ActCategory() {
      await this.ActReset();
      this.isActCategory = true;
      this.filename = "ParkingCategory.xls";
      this.exceldata = this.categories;
    },

    async ActVehicle() {
      await this.ActReset();
      this.isActVehicle = true;
      this.filename = "VehicleType.xls";
      this.exceldata = this.vehicles;
    },
    async ActCheckin() {
      await this.ActReset();
      this.isActCheckin = true;
      this.filename = "WardenCheckin.xls";
      this.exceldata = this.checkin;
    },
    async ActCollected() {
      await this.ActReset();
      this.isActCollected = true;
      this.filename = "WardenCollect.xls";
      this.exceldata = this.collects;
    },

    updateData(data) {
      this.typeID = data[0];
      this.paramID = data[1];
      this.filterdata = {
        typeID: this.typeID,
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
        paramID: this.paramID
      };
      this.DataReport();
    },
    updateDateStart(tanggal) {
      this.dateStart = tanggal;
      this.filterdata = {
        typeID: this.typeID,
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
        paramID: this.paramID
      };
      this.DataReport();
    },
    updateDateEnd(tanggal) {
      this.dateEnd = tanggal;
      this.filterdata = {
        typeID: this.typeID,
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
        paramID: this.paramID
      };
      this.DataReport();
    }
  }
};
</script>