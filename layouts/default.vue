<template>
  <div>
    <myCss/>

    <!-- <div v-if="windowWidth >= 1024" class="is-hidden-touch">
      <b-navbar class="is-primary">
        <template slot="brand">
          <b-navbar-item tag="router-link" :to="{ path: '/' }">
            <img src="~assets/buefy.png" alt="Buefy" height="28">
          </b-navbar-item>
        </template>
      </b-navbar>
      <section class="main-content columns">
        <aside class="column is-2 section">
          <mymenu style="position:absolute;"/>
        </aside>
        <div class="container column is-10">
          <nuxt/>
        </div>
      </section>
    </div> -->

    <div>
      <mynavbar/>
      <section class="main-content columns">
        <div class="container column is-full">
          <nuxt/>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import mynavbar from "~/components/Navbar";
import myCss from "~/components/MyCss";
export default {
  components: {
    mynavbar,
    myCss
  },

  data() {
    const heightOutput = document.querySelector("#height");
    const widthOutput = document.querySelector("#width");
    return {
      windowWidth: 0,
      windowHeight: 0
    };
  },
  mounted() {
    this.$nextTick(function() {
      window.addEventListener("resize", this.getWindowWidth);
      window.addEventListener("resize", this.getWindowHeight);

      //Init
      this.getWindowWidth();
      this.getWindowHeight();
    });
  },
  methods: {
    getWindowWidth(event) {
      this.windowWidth = document.documentElement.clientWidth;
    },

    getWindowHeight(event) {
      this.windowHeight = document.documentElement.clientHeight;
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getWindowWidth);
    window.removeEventListener("resize", this.getWindowHeight);
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body {
  overflow-x: hidden;
}
</style>