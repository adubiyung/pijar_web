<template>
  <section class="section">
    <h1 class="subtitle">Data User Report</h1>
    <div class="spasi">
      <div class="field">
        <JsonExcel :data="users" :name="filename">
          <b-button
          type="is-info is-small" icon-left="mdi mdi-printer">
          Print Report
          </b-button>
        </JsonExcel>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <b-table :data="users" class="is-size-7">
          <template slot-scope="props">
            <b-table-column field="name" label="Full Name" sortable>{{props.row.user_fullname}}</b-table-column>
            <b-table-column field="email" label="Email" sortable>{{props.row.user_email}}</b-table-column>
            <b-table-column field="balance" label="Credit Balance" sortable>{{props.row.user_balance}}</b-table-column>
            <b-table-column field="point" label="Point Reward" sortable>{{props.row.user_point}}</b-table-column>
            <b-table-column field="status" label="Status" sortable>{{props.row.user_status}}</b-table-column>
            <b-table-column field="action" label="action">
              <b-button type="is-info" size="is-small" @click="getDetail(props.row.user_id)">
                <b-icon icon="mdi mdi-more" size="is-small"></b-icon>
              </b-button>
            </b-table-column>
          </template>
        </b-table>
        <hr />

        <b-modal
          :active.sync="isComponentModalActive"
          has-hard-card
          trap-focus
          arial-role="dialog"
          aria-modal>
          <myModal :data="myUserID" @pushData="reloadData()"/>
        </b-modal>

      </div>
    </div>
  </section>
</template>

<script>
import Vue from "vue";
import JsonExcel from "vue-json-excel";
import myFilter from "~/components/Filter";
import myModal from "~/components/ProfileModal";
export default {
  components: {
    myFilter,
    myModal,
    JsonExcel
  },
  middleware: "auth",
  data() {
    return {
      users: [],
      isComponentModalActive: false,
      myUserID: null,
      userID: this.$auth.user.user_officer_id,
      roleID: this.$auth.user.role_id,
      paramID: "",
      filename: "report.xls"
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    reloadData() {
      this.isComponentModalActive = false;
      this.getUser();
    },
    async getUser() {
      this.$axios
        .get('/reportuser?role_id=3')
        .then(response => {
          this.users = response.data.data;
          console.log("data user", this.users);
        })
        .catch(e => {
          console.log(e);
        });
    },
    async getDetail(id) {
      this.myUserID = id;
      this.isComponentModalActive = true;
    }
  }
};
</script>
