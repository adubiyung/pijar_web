<template>
  <b-navbar class="is-primary">
    <template slot="brand">
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <img src="~assets/buefy.png" alt="Buefy" height="28" />
      </b-navbar-item>
    </template>
    <template slot="start" v-for="(menu,key) of menus">
      <b-navbar-item
        v-if="menu.submenu.length == 0 && menu.role == roleID"
        :key="key"
        tag="router-link"
        :to="'/'+ menu.menu_url"
        class="is-size-7"
      >{{menu.menu_name}}</b-navbar-item>
      <b-navbar-dropdown
        v-if="menu.submenu.length > 0 && menu.role == roleID"
        :label="menu.menu_name"
        :key="key"
        class="is-size-7"
      >
        <div v-for="(submenu,key) of menu.submenu" :key="key">
          <b-navbar-item
            v-if="submenu.role == roleID"
            tag="router-link"
            :to="'/'+ submenu.menu_url"
            class="is-size-7"
          >{{submenu.menu_name}}</b-navbar-item>
        </div>
      </b-navbar-dropdown>
    </template>

    <template slot="end">
      <b-navbar-item tag="div">
        <div class="buttons is-size-7">
          <a @click="logout" class="button is-light is-size-7">Log Out</a>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
export default {
  data() {
    return {
      hello: "hayo",
      roleID: this.$auth.user.role_id,
      menus: [
        {
          menu_name: "Home",
          menu_url: "dashboard",
          role: 1,
          submenu: []
        },
        {
          menu_name: "Master Data",
          role: 1,
          submenu: [
            {
              menu_name: "Location",
              menu_url: "master_data/locationPage",
              role: 1
            },
            {
              menu_name: "Zone",
              menu_url: "master_data/zone",
              role: 1
            },
            {
              menu_name: "Promo/Voucher",
              menu_url: "master_data/promoPage",
              role: 1
            },
            {
              menu_name: "Partnership",
              menu_url: "master_data/partnership",
              role: 1
            },
            {
              menu_name: "Admin Area",
              menu_url: "master_data/userPage",
              role: 1
            },
            {
              menu_name: "Warden",
              menu_url: "master_data/userPage",
              role: 2
            }
          ]
        },
        {
          menu_name: "Reporting",
          menu_url: "inspire",
          role: 1,
          submenu: []
        }
      ]
    };
  },
  created() {
    console.log("sdf", this.roleID);
  },
  methods: {
    async logout() {
      await this.$auth.logout();
      this.$router.push("/login");
    }
  }
};
</script>
