<template>
  <section>
    <b-field grouped group-multiline>
      <b-select @input="pushJukir" v-model="jukir" placeholder="All Data" icon="home" rounded size="is-small">
          <option value='0'>All</option>
        <option
          v-for="option in jukirs"
          :value="option.user_id"
          :key="option.user_id"
        >{{ option.user_fullname }}</option>
      </b-select>
       <b-datepicker :mobile-native="false" @input="pushTanggal" v-model="tanggal" placeholder="Click to select..." range rounded size="is-small" :max-date="maxDate"></b-datepicker>
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
      jukirs:[],
      statuses:[],
      search:"",
      status : null,
      jukir:this.data.jukirID,
      tanggal: [
        new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        today
      ],
      minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      maxDate: new Date(today.getFullYear(), today.getMonth(), today.getDate())
    };
  },created() {
    this.getJukir();
    this.checkJukir();
  },
  methods: {
    getJukir() {
      this.$axios
        .get("/user?role_id=3")
        .then(response => {
          this.jukirs = response.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    checkJukir(){
      if (this.jukir == 0){
        this.disabled = false
      } else {
        this.disabled = true
      }
    }, 
    pushJukir: function() {
      this.$emit("pushJukir", this.jukir);
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
