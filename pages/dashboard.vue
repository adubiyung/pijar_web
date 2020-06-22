<template>
  <section class="section">
    <h1 class="subtitle">DASHBOARD</h1>
    <div id="filter" class="spasi">
      <div>
        <filterDashboard
          :data="filterDashboard"
          @setData="updateData($event)"
          @setDateStart="updateDateStart($event)"
          @setDateEnd="updateDateEnd($event)"
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
import filterDashboard from "~/components/FilterDashboard";
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
    filterDashboard,
    chart
  },
  middleware: "auth",
  data() {
    const today = new Date();
    const tzoffset = new Date().getTimezoneOffset() * 60000;
    return {
      roleID: this.$auth.user.role_id,
      tanggal: [],
      filterProv: "",
      filterCity: "",
      filterDistrict: "",
      filterLocation: "",
      filterStart: "",
      filterEnd: "",
      dateStart: new Date(today - tzoffset).toISOString().split("T")[0],
      dateEnd: new Date(today - tzoffset).toISOString().split("T")[0],
      filterdata: {
        typeID: 0,
        dateStart: 0,
        dateEnd: 0,
        paramID: 0
      },
      cityID: 0,
      districtID: 0,
      locationID: 0,
      wardenID: 0,
      filterDashboard: {
        cityID: 0,
        districtID: 0,
        locationID: 0,
        wardenID: 0
      },
      typeID:"",
      paramID:"",
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
    this.getData();
  },
  methods: {
    async getData() {
      if (this.typeID == "") {
        if (this.roleID == 1) {
          this.typeID = "1";
          this.paramID = this.$auth.user.province_id
        } else if (this.roleID == 2) {
          this.typeID = "2";
          this.paramID = this.$auth.user.city_id
        } else if (this.roleID == 5) {
          this.typeID = "3";
          this.paramID = this.$auth.user.district_id
        }
      }
      
      this.$axios
        .get(
          `/summary?type=${this.typeID}&startDate=${this.dateStart}&endDate=${this.dateEnd}&paramID=${this.paramID}`
        )
        .then(response => {
          this.total_trans = 0;
          this.total_income = 0;
          this.average_income = 0;
          this.summary = response.data.data;

          if (this.summary.length > 0) {
            this.total_trans = this.summary[0].total_transaction;
            this.total_income = this.summary[0].total_billing
              .toFixed(0)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            this.average_income = parseInt(this.summary[0].average)
              .toFixed(0)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          }
        })

        this.$axios.get(`/days?type=${this.typeID}&startDate=${this.dateStart}&endDate=${this.dateEnd}&paramID=${this.paramID}`)
        .then(response => {
          this.TheDay = response.data.data;
          this.date_day = [];
          this.count_day = [];
          this.TheDay.forEach(element => {
            this.date_day.push(element.name_days);
            this.count_day.push(element.transaction_checkin);
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
        })

        this.$axios.get(`/hours?type=${this.typeID}&startDate=${this.dateStart}&endDate=${this.dateEnd}&paramID=${this.paramID}`)
        .then(response => {
          this.TheHour = response.data.data;
          this.date_hour = [];
          this.count_hour = [];
          this.TheHour.forEach(element => {
            this.date_hour.push(element.hours);
            this.count_hour.push(element.transaction_checkin);
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
        })

        .catch(e => {
          console.log(e);
        });
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
      this.getData();
    },

    updateDateStart(tanggal) {
      this.dateStart = tanggal;
      this.filterdata = {
        typeID: this.typeID,
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
        paramID: this.paramID
      };
      this.getData();
    },
    updateDateEnd(tanggal) {
      this.dateEnd = tanggal;
      this.filterdata = {
        typeID: this.typeID,
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
        paramID: this.paramID
      };
      this.getData();
    }
  }
};
</script>
