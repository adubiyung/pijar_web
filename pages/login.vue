<template>
  <section
    class="hero login is-fullheight"
    :style="'background: linear-gradient(-45deg, '+ color1 +', '+ color2 +' 37%, '+ color1 +' 37%) '+ color1 +''"
  >
    <div class="hero-body">
      <div class="container">
        <div class="columns">
          <div class="column is-two-thirds">
            <img :src="logo" alt />
            <p>{{appsdesc}}</p>
          </div>
          <div class="column">
            <form method="post" @submit.prevent="login1">
              <div class="modal-card transparan" style="width: auto">
                <header class="modal-card-head">
                  <p class="modal-card-title">Login</p>
                </header>
                <section class="modal-card-body">
                  <b-field label="Email">
                    <b-input
                      name="email"
                      type="email"
                      v-model="email"
                      :value="email"
                      placeholder="Your email"
                      required
                    ></b-input>
                  </b-field>

                  <b-field label="Password">
                    <b-input
                      name="password"
                      type="password"
                      v-model="password"
                      :value="password"
                      placeholder="Your password"
                      required
                    ></b-input>
                  </b-field>
                  <p v-if="errs" class="help is-danger">{{errs}}</p>
                </section>

                <footer class="modal-card-foot">
                  <button type="submit" class="button is-primary">Login</button>
                </footer>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  layout: "fullscreen",
  middleware: "guest",
  data() {
    return {
      email: "",
      password: "",
      errs: null,
      sts: null,
      appsname: "E-Parking",
      logo: "",
      company: "",
      color1: "black",
      color2: "#4f38a4",
      appsdesc: "E-Parking Web Admin",
      error: null
    };
  },
  created() {},
  methods: {
    async login2() {
      await this.$auth
        .loginWith("local", {
          data: {
            user_email: this.email,
            user_password: this.password
          }
        })
        .then(response => {
          if (this.$auth.user.role_id == 1 || this.$auth.user.role_id == 2 || this.$auth.user.role_id == 5) {
            this.$router.push("/dashboard");
          } else {
            this.$auth.logout();
            this.errs = "Wrong Username & Password";
          }
        })
        .catch(e => {
          console.log(e);
        });
    },

    async login1() {
      await this.$axios
        .post("loginweb", {
          user_email: this.email,
          user_password: this.password
        })
        .then(response => {
          this.sts = response.data.status;
          if (this.sts == 200) {
            this.login2();
          } else {
            this.errs = "Wrong Username & Password";
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>

<style scoped>
.login {
  /* background: linear-gradient(-45deg, #4f38a4, #a244bc 37%, #4f38a4 37%) #4f38a4; */
  min-height: 100vh;
  color: aliceblue;
}
.transparan {
  opacity: 0.8;
  filter: alpha(opacity=50);
}
</style>
