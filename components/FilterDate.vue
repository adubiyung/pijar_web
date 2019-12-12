<template>
  <section>
    <b-field grouped group-multiline>
      <b-select @input="pushLocation" v-model="location" :disabled="disabled" placeholder="All Data" icon="home" rounded size="is-small">
          <option value='0'>All</option>
        <option
          v-for="option in locations"
          :value="option.location_id"
          :key="option.location_id"
        >{{ option.location_name }}</option>
      </b-select>
       <b-datepicker :mobile-native="false" @input="pushTanggal" v-model="tanggal" placeholder="Click to select..." range rounded size="is-small" :max-date="maxDate"></b-datepicker>
      <!-- <b-input @change.native="pushSearch" v-model="search" placeholder="Search..." type="search" icon="magnify" rounded size="is-small"></b-input> -->
    </b-field>
  </section>
</template>

<script>
export default {
  props: ["data"],
  data() {
    const today = new Date();
    return {
      perPage: 10,
      pagination: {
        current_page: 1
      },
      locations:[],
      statuses:[],
      search:"",
      status : null,
      location:this.data.locationID,
      tanggal: [
        new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        today
      ],
      minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      maxDate: new Date(today.getFullYear(), today.getMonth(), today.getDate())
    };
  },created() {
    this.getLocation();
    this.checkLocation();
  },
  methods: {
    getLocation() {
      this.$axios
        .get("/location?location_status=t")
        .then(response => {
          this.locations = response.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    checkLocation(){
      if (this.location == 0){
        this.disabled = false
      } else {
        this.disabled = true
      }
    }, 
    pushLocation: function() {
      this.$emit("pushLocation", this.location);
    },
    pushSearch: function() {
      this.$emit("pushSearch", this.search);
    },
    pushTanggal: function() {
      this.tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
      this.tglstart = this.tanggal[0]
      this.tglend = this.tanggal[1]
      this.tanggalStart = new Date(this.tglstart - this.tzoffset).toISOString().split("T")[0];
      this.tanggalEnd = new Date(this.tglend - this.tzoffset).toISOString().split("T")[0];
      this.$emit("pushTanggalStart", this.tanggalStart);
      this.$emit("pushTanggalEnd", this.tanggalEnd);
    }
  }
};
</script>
