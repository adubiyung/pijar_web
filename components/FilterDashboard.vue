<template>
  <section>
    <!-- role admin province -->
    <b-field grouped group-multiline v-if="this.$auth.user.role_id==1">
      <b-select
        @input="setCity"
        @click.native="getDistrict(vCity)"
        v-model="vCity"
        placeholder="All Cities"
        icon="home"
        rounded
        size="is-small"
      >
        <option>All Cities</option>
        <option
          v-for="option in cities"
          :value="option.city_id"
          :key="option.city_id"
        >{{ option.city_name }}</option>
      </b-select>

      <b-select
        @input="setDistrict"
        @click.native="getLocation(vDistrict)"
        v-model="vDistrict"
        placeholder="All Districts"
        icon="home"
        rounded
        size="is-small"
      >
        <option value="0">All Districts</option>
        <option
          v-for="option in districts"
          :value="option.district_id"
          :key="option.district_id"
        >{{ option.district_name }}</option>
      </b-select>

      <b-select
        @input="setLocation"
        v-model="vLocation"
        placeholder="All Locations"
        icon="home"
        rounded
        size="is-small"
      >
        <option value="0">All Locations</option>
        <option
          v-for="option in locations"
          :value="option.location_id"
          :key="option.location_id"
        >{{ option.location_name }}</option>
      </b-select>

      <b-datepicker
        :mobile-native="false"
        @input="setTanggal"
        v-model="tanggal"
        placeholder="Click to select..."
        range
        rounded
        size="is-small"
        :max-date="maxDate"
      ></b-datepicker>
    </b-field>

    <!-- role admin kota/kab -->
    <b-field grouped group-multiline v-if="this.$auth.user.role_id==2">
      <b-select
        @input="setDistrict"
        @click.native="getLocation(vDistrict)"
        v-model="vDistrict"
        placeholder="All Districts"
        icon="home"
        rounded
        size="is-small"
      >
        <option value="0">All Districts</option>
        <option
          v-for="option in districts"
          :value="option.district_id"
          :key="option.district_id"
        >{{ option.district_name }}</option>
      </b-select>

      <b-select
        @input="setLocation"
        v-model="vLocation"
        placeholder="All Locations"
        icon="home"
        rounded
        size="is-small"
      >
        <option value="0">All Locations</option>
        <option
          v-for="option in locations"
          :value="option.location_id"
          :key="option.location_id"
        >{{ option.location_name }}</option>
      </b-select>
      <b-datepicker
        :mobile-native="false"
        @input="setTanggal"
        v-model="tanggal"
        placeholder="Click to select..."
        range
        rounded
        size="is-small"
        :max-date="maxDate"
      ></b-datepicker>
    </b-field>

    <!-- role admin area/pengelola -->
    <b-field grouped group-multiline v-if="this.$auth.user.role_id==5">
      <b-select
        @input="setLocation"
        @click.native="getWarden(vLocation)"
        v-model="vLocation"
        placeholder="All Locations"
        icon="home"
        rounded
        size="is-small"
      >
        <option value="0">All Locations</option>
        <option
          v-for="option in locations"
          :value="option.location_id"
          :key="option.location_id"
        >{{ option.location_name }}</option>
      </b-select>

      <b-select
        @input="setWarden"
        v-model="vWarden"
        placeholder="All Warden"
        icon="home"
        rounded
        size="is-small"
      >
        <option value="0">All Warden</option>
        <option
          v-for="option in wardens"
          :value="option.user_officer_id"
          :key="option.user_officer_id"
        >{{ option.user_fullname }}</option>
      </b-select>
      <b-datepicker        
        @input="setTanggal"
        v-model="tanggal"
        placeholder="Click to select..."
        :max-date="maxDate"
      ></b-datepicker>
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
      vCity: "",
      vDistrict: "",
      vLocation: "",
      vWarden: "",
      cities: [],
      districts: [],
      locations: [],
      wardens: [],
      statuses: [],
      search: "",
      status: null,
      jukir: this.data.jukirID,
      tanggal: [
        new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
        new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
      ],
      minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      maxDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
    };
  },
  created() {
    if (this.$auth.user.role_id==1) {
      this.getCity();
    } else if(this.$auth.user.role_id==2){
      this.getDistrict(this.$auth.user.city_id);
    } else {
      this.getLocation(this.$auth.user.district_id);
    }
    this.checkJukir();
  },
  methods: {
    getCity() {
      this.$axios
        .get(`/city?province_id=${this.$auth.user.province_id}`)
        .then(response => {
          this.cities = response.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    getDistrict(vCity) {
      console.log("district", vCity);
      this.$axios
        .get(`/district?city_id=${vCity}`)
        .then(response => {
          this.districts = response.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    getLocation(vDistrict) {
      this.$axios
        .get(`/location?location_status=t&district_id=${vDistrict}`)
        .then(response => {
          this.locations = response.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    getWarden(vLocation) {
      this.$axios
        .get(`/user?role=4&location=${vLocation}`)
        .then(response => {
          this.wardens = response.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    checkJukir() {
      if (this.jukir == 0) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    setCity: function() {
      const tampung = [];
      tampung.push("2", this.vCity);
      this.$emit("setData", tampung);
    },
    setDistrict: function() {
      const tampung = [];
      tampung.push("3", this.vDistrict);
      this.$emit("setData", tampung);
    },
    setLocation: function() {
      const tampung = [];
      tampung.push("4", this.vLocation);
      this.$emit("setData", tampung);
    },
    setWarden: function() {
      const tampung = [];
      tampung.push("5", this.vWarden);
      this.$emit("setData", tampung);
    },
    setTanggal: function() {
      this.tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
      this.tglstart = this.tanggal[0];
      this.tglend = this.tanggal[1];
      this.tanggalStart = new Date(this.tglstart - this.tzoffset)
        .toISOString()
        .split("T")[0];
      this.tanggalEnd = new Date(this.tglend - this.tzoffset)
        .toISOString()
        .split("T")[0];
      this.$emit("setDateStart", this.tanggalStart);
      this.$emit("setDateEnd", this.tanggalEnd);
    }
  }
};
</script>
