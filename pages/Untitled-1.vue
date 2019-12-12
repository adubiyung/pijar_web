<template>
  <section class="section">
    <h1 class="subtitle">DASHBOARD</h1>
    <div class="spasi">
      <div class="field is-pulled-right">
        <b-button
          type="is-info is-small"
          @click="openCollapse()"
          aria-controls="contentCollapse"
        >Create Adjustemt</b-button>
      </div>
      <myFilter
        :data="filterdata"
        @pushOutlet="updateOutlet($event)"
        @pushTanggalStart="updateDateStart($event)"
        @pushTanggalEnd="updateDateEnd($event)"
      />
    </div>
    <div class="columns">
      <div class="column">
        <div class="box">
          <p class="subtitle is-7">GROSS SALES</p>
          <p class="is-size-4">RP {{gross_sales}}</p>
        </div>
      </div>
      <div class="column">
        <div class="box">
          <p class="subtitle is-7">NET SALES</p>
          <p class="is-size-4">RP {{net_sales}}</p>
        </div>
      </div>
      <div class="column">
        <div class="box">
          <p class="subtitle is-7">GROSS PROFIT</p>
          <p class="is-size-4">RP {{gross_profit}}</p>
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="column">
        <div class="box">
          <p class="subtitle is-7">TRANSACTION</p>
          <p class="is-size-4">{{count_trans}}</p>
        </div>
      </div>
      <div class="column">
        <div class="box">
          <p class="subtitle is-7">AVERAGE SALES PER TRANSACTION</p>
          <p class="is-size-4">RP {{average_trans}}</p>
        </div>
      </div>
      <div class="column">
        <div class="box">
          <p class="subtitle is-7">GROSS MARGIN</p>
          <p class="is-size-4">{{gross_margin}} %</p>
        </div>
      </div>
    </div>
    <div class="columns is-mobile">
      <div class="column">
        <div class="box">
          <p class="subtitle is-7">DAILY GROSS SALES AMOUNT</p>
          <chart :type="'line'" :data="datacollection2" :options="options"></chart>
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="column is-half">
        <div class="box">
          <p class="subtitle is-7">DAY OF THE WEEK GROSS SALES AMOUNT</p>
          <chart :type="'bar'" :data="datacollection3" :options="options"></chart>
        </div>
      </div>
      <div class="column">
        <div class="box">
          <p class="subtitle is-7">HOURLY GROSS SALES AMOUNT</p>
          <chart :type="'bar'" :data="datacollection4" :options="options"></chart>
        </div>
      </div>
    </div>

    <div class="columns is-mobile">
      <div class="column">
        <div class="box">
          <p class="subtitle is-7">TOP ITEMS</p>
          <b-table :data="mytopitem" class="subtitle is-7">
            <template slot-scope="props">
              <b-table-column field="name" label="Item" sortable>{{ props.row.item[0].item_name }}</b-table-column>
              <b-table-column field="itemsold" label="Item Sold" sortable>{{ props.row.totalqty }}</b-table-column>
              <b-table-column
                field="grosssales"
                label="Gross Sales"
                sortable
              >{{ props.row.grosssales }}</b-table-column>
              <b-table-column field="netsales" label="Net Sales" sortable>{{ props.row.item_id }}</b-table-column>
              <b-table-column
                field="grossprofit"
                label="Gross Profit"
                sortable
              >{{ props.row.item_id }}</b-table-column>
            </template>
          </b-table>
        </div>
      </div>
    </div>
    <div class="columns is-mobile">
      <div class="column is-full">
        <div class="box">
          <p class="subtitle is-7">TOP ITEM BY CATEGORY</p>
          <div class="columns is-multiline">
              <div class="column is-one-third" v-for="(row,key) in data_grafik" :key="key">
                <div class="box">
                  <p class="subtitle is-7">
                    <b>{{row.categoryname}}</b>
                  </p>
                  <chart :type="'bar'" :data="row.datagrafik" :options="option2"></chart>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import myFilter from "~/components/FilterDate";
import chart from "vue-bulma-chartjs";
import Vue from 'vue';
import VueHtmlToPaper from 'vue-html-to-paper';
const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
    'https://unpkg.com/kidlat-css/css/kidlat.css'
  ]
}
 
Vue.use(VueHtmlToPaper, options);
// Vue.use(VueHtmlToPaper);

export default {
  components: {
    myFilter,
    chart
  },
  middleware: "auth",
  data() {
    const today = new Date();
    const tzoffset = new Date().getTimezoneOffset() * 60000;
    return {
      data_grafik: [],
      datagrafik: {},
      myDaily: [],
      tanggal: [],
      revenue: [],
      dateStart: new Date(
        new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5) -
          tzoffset
      )
        .toISOString()
        .split("T")[0],
      dateEnd: new Date(today - tzoffset).toISOString().split("T")[0],
      filterdata: {
        outletid: this.$auth.user.outlet_id
      },
      // planetChartData: planetChartData,
      mytopitem: [],
      hasil_select: {},
      outletid: this.$auth.user.outlet_id,
      perPage: 10,
      pagination: { current_page: 1 },
      gross_sales: 0,
      net_sales: 0,
      gross_profit: 0,
      count_trans: 0,
      average_trans: 0,
      gross_margin: 0,
      datacollection3: {},
      datacollection4: {},
      datacollection2: {},
      options: {},
      option2: {}
    };
  },
  // mounted() {
  //   this.topitems();
  //   this.getDailyTransaction();
  // },
  async created() {
    await this.topitems();
    await this.getDailyTransaction();
  },
  methods: {
    // createChart(chartId, chartData) {
    //   const ctx = document.getElementById(chartId);
    //   const myChart = new Chart(ctx, {
    //     type: chartData.type,
    //     data: chartData.data,
    //     options: chartData.options
    //   });
    // },
    openCollapse(){
      Android.showToast('Halloooo ini dari web loooh');
      // alert('Halloooo');

    },
    async topitems() {
      await this.$axios
        .get(
          "/ordertopitem?outletid=" +
            this.outletid +
            "&startdate=" +
            this.dateStart +
            "&enddate=" +
            this.dateEnd
        )
        .then(response => {
          this.mytopitem = response.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    async getDailyTransaction() {
      await this.$axios
        .get(
          "/dashboardtransaction?outletid=" +
            this.outletid +
            "&startdate=" +
            this.dateStart +
            "&enddate=" +
            this.dateEnd
        )
        .then(response => {
          this.gross_sales = 0;
          this.net_sales = 0;
          this.gross_profit = 0;
          this.count_trans = 0;
          this.average_trans = 0;
          this.gross_margin = 0;

          if (response.data.data2.length > 0){
            this.gross_sales = response.data.data2[0].gross_sales.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
          this.net_sales = response.data.data2[0].net_sales.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
          this.gross_profit = response.data.data2[0].gross_profit.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
          this.count_trans = response.data.data2[0].count_trans;
          this.average_trans = Math.round(response.data.data2[0].average_trans).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
          this.gross_margin = Math.round(response.data.data2[0].gross_margin);
          } 
          
          this.data_grafik = [];
          this.categoryname = [];
          response.data.data3.forEach(element => {
            this.category_name = element.category_name;
            this.categoryname.push(element.category_name);
            this.itemname = [];
            this.jmlorder = [];
            this.jumlah = [];
            element.item.forEach(row => {
              this.itemname.push(row.item_name);
              if (row.odr.length > 0) {
                this.jumlah.push(row.odr[0].jml);
              } else {
                this.jumlah.push(0);
              }
            });
            this.data_grafik.push({
              categoryname: this.category_name,
              datagrafik: {
                labels: this.itemname,
                datasets: [
                  {
                    data: this.jumlah,
                    label: "",
                    backgroundColor: "#1fc8db",
                    pointBackgroundColor: "white",
                    borderWidth: 1,
                    pointBorderColor: "#1fc8db"
                  }
                ]
              }
            });
          });

          this.option2 = {
            segmentShowStroke: false
          };
          this.day = response.data.data.day;
          this.revenue = response.data.data.revenue;
          this.datacollection2 = {
            //Data to be represented on x-axis
            labels: this.day,
            datasets: [
              {
                label: "",
                backgroundColor: "#1fc8db",
                pointBackgroundColor: "white",
                borderWidth: 1,
                pointBorderColor: "#1fc8db",
                //Data to be represented on y-axis
                data: this.revenue
              }
            ]
          };

          this.datahari = [];
          this.totallength = response.data.data.day.length;
          for (let index = 0; index < this.totallength; index++) {
            this.datahari.push({
              hari: response.data.data.day_name[index],
              tgl: response.data.data.day[index],
              counttrans: response.data.data.count_trans[index],
              revenue: response.data.data.revenue[index]
            });
          }

          this.sumhari = [0, 0, 0, 0, 0, 0, 0];
          this.datahari.forEach((hari, key) => {
            this.sumhari[hari.hari] += parseFloat(hari.revenue);
          });

          this.datacollection3 = {
            labels: [
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday"
            ],
            datasets: [
              {
                label: "Check In",
                backgroundColor: "#1fc8db",
                pointBackgroundColor: "white",
                borderWidth: 1,
                pointBorderColor: "#1fc8db",
                data: this.sumhari
              }
            ]
          };

          this.sumjam = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          response.data.data_jam.forEach(element => {
            this.jam = Number(element.mytime.substring(0,2))
            this.sumjam[this.jam] += parseFloat(element.r)
          });
          this.datacollection4 = {
            labels: ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
            datasets: [
              {
                label: "",
                backgroundColor: "#1fc8db",
                pointBackgroundColor: "white",
                borderWidth: 1,
                pointBorderColor: "#1fc8db",
                data: this.sumjam
              }
            ]
          };

          console.log(this.sumjam)

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
    updateOutlet(outlet) {
      this.outletid = outlet;
      this.filterdata = {
        outletid: this.outletid,
        dateStart: this.dateStart,
        dateEnd: this.dateEnd
      };
      this.getDailyTransaction();
      this.topitems();
    },
    updateDateStart(tanggalStart) {
      this.dateStart = tanggalStart;
      this.filterdata = {
        outletid: this.outletid,
        dateStart: this.dateStart,
        dateEnd: this.dateEnd
      };
    },
    updateDateEnd(tanggalEnd) {
      this.dateEnd = tanggalEnd;
      this.filterdata = {
        outletid: this.outletid,
        dateStart: this.dateStart,
        dateEnd: this.dateEnd
      };
      this.getDailyTransaction();
      this.topitems();
    }
  }
};
</script>
