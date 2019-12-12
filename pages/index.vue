<template>
  <section class="section">
    <h1 class="subtitle">DASHBOARD</h1>
    
  </section>
</template>

<script>
export default {
  middleware:"auth",
  data() {
    return {
      
    };
  },
  created() {
    console.log(this.$auth.user)
    
    // this.location()
  },
  methods: {
    // async location() {
    //   this.$axios
    //     .get("/locationact")
    //     .then(response => {
    //       this.myloc = response.data.data;
    //       console.log(this.myloc)
    //     })
    //     .catch(e => {
    //       console.log(e);
    //     });
    // },
  }
};
</script>