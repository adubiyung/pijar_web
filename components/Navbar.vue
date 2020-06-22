<template>
  <b-navbar class="is-primary">
    <template slot="brand">
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <img src="~assets/buefy.png" alt="Buefy" height="28" />
      </b-navbar-item>
    </template>
    <template slot="start" v-for="(menu,key) of menus">
      <b-navbar-item
        v-if="menu.submenu.length == 0"
        :key="key"
        tag="router-link"
        :to="'/'+ menu.menu_url"
        class="is-size-7"
      >{{menu.menu_name}}</b-navbar-item>
      <b-navbar-dropdown
        v-if="menu.submenu.length > 0"
        :label="menu.menu_name"
        :key="key"
        class="is-size-7"
      >
        <div v-for="(submenu,key) of menu.submenu" :key="key">
          <b-navbar-item
          v-if="submenu.role_id == roleID"
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
          menu_name: "Dashboard",
          menu_url: "dashboard",
          submenu: []
        },
        {
          menu_name: "Master Data",
          submenu: [
            {
              menu_name: "Location",
              menu_url: "master_data/locationPage",
              role_id: 2
            },
            {
              menu_name: "Promo/Voucher",
              menu_url: "master_data/promoPage",
              role_id: 2
            },
            {
              menu_name: "Partnership",
              menu_url: "master_data/partnership",
              role_id: 2
            },
            {
              menu_name: "User Data",
              menu_url: "master_data/userPage",
              role_id:1
            },
            {
              menu_name: "User Data",
              menu_url: "master_data/userPage",
              role_id:2
            },
            {
              menu_name: "User Data",
              menu_url: "master_data/userPage",
              role_id:5
            }
          ]
        },
        {
          menu_name: "Reporting",
          submenu: [
            {
              menu_name: "User Report",
              menu_url: "report/user",
              role_id:1
            },
            {
              menu_name: "Transaction Report",
              menu_url: "report/transaction",
              role_id:1
            },
            {
              menu_name: "User Report",
              menu_url: "report/user",
              role_id:2
            },
            {
              menu_name: "Transaction Report",
              menu_url: "report/transaction",
              role_id:2
            },
            {
              menu_name: "User Report",
              menu_url: "report/user",
              role_id:5
            },
            {
              menu_name: "Transaction Report",
              menu_url: "report/transaction",
              role_id:5
            }
          ]
        },
        {
          menu_name: "Profile",
          menu_url:"profile",
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
