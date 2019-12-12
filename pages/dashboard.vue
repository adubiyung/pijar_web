<template>
  <section class="section">
    <h1 class="subtitle">DASHBOARD</h1>
    <div id="filter" class="spasi">
      <div v-if="this.roleID == 1">
        <myFilter
          :data="filterdata"
          @pushLocation="updateLocation($event)"
          @pushTanggalStart="updateDateStart($event)"
          @pushTanggalEnd="updateDateEnd($event)"
        />
      </div>

      <div v-else-if="this.roleID == 2">
        <filterArea
          :data="filterArea"
          @pushLocation="updateLocation($event)"
          @pushWarden="updateWarden($event)"
          @pushTanggalStart="updateDateStart($event)"
          @pushTanggalEnd="updateDateEnd($event)"
        />
      </div>
    </div>

    <div id="data" class="columns">
      <div class="column">
        <div class="box">
          <p class="subtitle is-7">Total Transaction</p>
          <p class="is-size-4">{{total_trans}}</p>
        </div>
      </div>
      <div class="column">
        <div class="box">
          <p class="subtitle is-7">Total Income</p>
          <p class="is-size-4">Rp {{total_income}}</p>
        </div>
      </div>
      <div class="column">
        <div class="box">
          <p class="subtitle is-7">Average Income per Day</p>
          <p class="is-size-4">Rp {{average_income}}</p>
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="column is-half">
        <div class="box">
          <p class="subtitle is-7">Peak Day</p>
          <chart :type="'bar'" :data="dataDay" :options="options"></chart>
        </div>
      </div>
      <div class="column">
        <div class="box">
          <p class="subtitle is-7">Peak Hour</p>
          <chart :type="'bar'" :data="dataHour" :options="options"></chart>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import print from "print-js";
import myFilter from "~/components/FilterDate";
import filterArea from "~/components/FilterDashArea";
import chart from "vue-bulma-chartjs";
import Vue from "vue";
import VueHtmlToPaper from "vue-html-to-paper";
const options = {
  name: "_blank",
  specs: ["fullscreen=yes", "titlebar=yes", "scrollbars=yes"],
  styles: [
    "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
    "https://unpkg.com/kidlat-css/css/kidlat.css"
  ]
};

// Vue.use(VueHtmlToPaper, options);

export default {
  components: {
    myFilter,
    filterArea,
    chart
  },
  middleware: "auth",
  data() {
    const today = new Date();
    const tzoffset = new Date().getTimezoneOffset() * 60000;
    return {
      roleID: this.$auth.user.role_id,
      tanggal: [],
      dateStart: new Date(today - tzoffset).toISOString().split("T")[0],
      dateEnd: new Date(today - tzoffset).toISOString().split("T")[0],
      filterdata: {
        locationID: 0
      },
      locationID: 0,
      filterArea: {
        locationID: 0,
        userID: 0
      },
      userID: 0,
      dataDashboard: [],
      total_trans: 0,
      total_income: 0,
      average_income: 0,
      dataDay: {},
      date_day: [],
      count_day: [],
      dataHour: {},
      date_hour: [],
      count_hour: [],
      options: {}
    };
  },
  created() {
    // await this.topitems();
    // await this.getDailyTransaction();
    this.getData();
  },
  methods: {
    async getFilter() {
      if (this.roleID == 1) {
        //pusat
        if (this.locationID == "all") {
          this.filter_loc = "0=0";
          this.filter_user = "0=0";
        } else {
          this.filter_loc = "location =" + this.locationID;
          this.filter_user = "0=0";
        }
      } else if (this.roleID == 2) {
        // area
        if (this.userID == "all") {
          this.filter_loc = "location =" + this.locationID;
          this.filter_user = "0=0";
        } else {
          this.filter_user = "&warden =" + this.userID;
          this.filter_loc = "location =" + this.locationID;
        }
      }
      await this.$axios
        .get(
          "/dasboard?" +
            this.filter_loc +
            this.filter_user +
            "&startDate=" +
            this.dateStart +
            "&endDate=" +
            this.dateEnd
        )
        .then(response => {
          this.TheDay = response.data.total_day;
          this.date_day = [];
          this.count_day = [];
          this.TheDay.forEach(element => {
            this.date_day.push(element.date_checkin);
            this.count_day.push(element.total);
          });

          this.dataDay = {
            //Data to be represented on x-axis
            labels: this.date_day,
            datasets: [
              {
                label: "",
                backgroundColor: "#1fc8db",
                pointBackgroundColor: "white",
                borderWidth: 1,
                pointBorderColor: "#1fc8db",
                //Data to be represented on y-axis
                data: this.count_day
              }
            ]
          };

          this.TheHour = response.data.peak_hour;
          this.date_hour = [];
          this.count_hour = [];
          this.TheHour.forEach(element => {
            this.date_hour.push(element.time_checkin);
            this.count_hour.push(element.total);
          });

          this.dataHour = {
            //Data to be represented on x-axis
            labels: this.date_hour,
            datasets: [
              {
                label: "",
                backgroundColor: "#1fc8db",
                pointBackgroundColor: "white",
                borderWidth: 1,
                pointBorderColor: "#1fc8db",
                //Data to be represented on y-axis
                data: this.count_hour
              }
            ]
          };

          this.options = {
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true
                  },
                  gridLines: {
                    display: true
                  }
                }
              ],
              xAxes: [
                {
                  gridLines: {
                    display: false
                  }
                }
              ]
            },
            legend: {
              display: true
            },
            responsive: true
          };
          this.total_trans = 0;
          this.total_income = 0;
          this.average_income = 0;

          if (response.data.dash_vehicle.length > 0) {
            this.total_trans = response.data.dash_transaction[0].total;
            this.total_income = response.data.dash_income[0].total
              .toFixed(0)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            this.average_income = response.data.dash_average[0].rata
              .toFixed(0)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    async getData() {
      if (this.roleID == 1) {
        //pusat
        if (this.locationID == "all") {
          this.filter_loc = "0=0";
          this.filter_user = "0=0";
        } else {
          this.filter_loc = "location =" + this.locationID;
          this.filter_user = "0=0";
        }
      } else if (this.roleID == 2) {
        // area
        if (this.userID == "all") {
          this.filter_loc = "location =" + this.locationID;
          this.filter_user = "0=0";
        } else {
          this.filter_user = "&warden =" + this.userID;
          this.filter_loc = "location =" + this.locationID;
        }
      }

      this.$axios
        .get(
          "/dashboard?" +
            this.filter_loc +
            this.filter_user +
            "&startDate=" +
            this.dateStart +
            "&endDate=" +
            this.dateEnd
        )
        .then(response => {
          this.TheDay = response.data.total_day;
          this.date_day = [];
          this.count_day = [];
          this.TheDay.forEach(element => {
            this.date_day.push(element.date_checkin);
            this.count_day.push(element.total);
          });

          this.dataDay = {
            //Data to be represented on x-axis
            labels: this.date_day,
            datasets: [
              {
                label: "",
                backgroundColor: "#1fc8db",
                pointBackgroundColor: "white",
                borderWidth: 1,
                pointBorderColor: "#1fc8db",
                //Data to be represented on y-axis
                data: this.count_day
              }
            ]
          };

          this.TheHour = response.data.peak_hour;
          this.date_hour = [];
          this.count_hour = [];
          this.TheHour.forEach(element => {
            this.date_hour.push(element.time_checkin);
            this.count_hour.push(element.total);
          });

          this.dataHour = {
            //Data to be represented on x-axis
            labels: this.date_hour,
            datasets: [
              {
                label: "",
                backgroundColor: "#1fc8db",
                pointBackgroundColor: "white",
                borderWidth: 1,
                pointBorderColor: "#1fc8db",
                //Data to be represented on y-axis
                data: this.count_hour
              }
            ]
          };

          this.options = {
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true
                  },
                  gridLines: {
                    display: true
                  }
                }
              ],
              xAxes: [
                {
                  gridLines: {
                    display: false
                  }
                }
              ]
            },
            legend: {
              display: true
            },
            responsive: true
          };
          this.total_trans = 0;
          this.total_income = 0;
          this.average_income = 0;

          if (response.data.dash_vehicle.length > 0) {
            this.total_trans = response.data.dash_transaction[0].total;
            this.total_income = response.data.dash_income[0].total
              .toFixed(0)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            this.average_income = response.data.dash_average[0].rata
              .toFixed(0)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    updateLocation(location) {
      this.locationID = location;
      this.filterdata = {
        locationID: this.locationID,
        dateStart: this.dateStart,
        dateEnd: this.dateEnd
      };
      this.getData();
    },
    updateWarden(warden) {
      this.userID = user;
      this.locationID = location;
      this.filterdata = {
        locationID: this.locationID,
        userID: this.userID,
        dateStart: this.dateStart,
        dateEnd: this.dateEnd
      };
      this.getData();
    },
    updateDateStart(tanggalStart) {
      this.dateStart = tanggalStart;
      this.filterdata = {
        locationID: this.locationID,
        dateStart: this.dateStart,
        dateEnd: this.dateEnd
      };
    },
    updateDateEnd(tanggalEnd) {
      this.dateEnd = tanggalEnd;
      this.filterdata = {
        locationID: this.locationID,
        dateStart: this.dateStart,
        dateEnd: this.dateEnd
      };
      this.getData();
    }
  }
};
</script>
