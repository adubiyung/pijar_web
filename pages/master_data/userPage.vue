<template>
  <section class="section">
    <h1 class="subtitle">Admin Area</h1>
    <div class="spasi">
      <div class="field">
        <b-button
          type="is-info is-small"
          @click="openModal()"
          aria-controls="contentCollapse"
        >Add User</b-button>
      </div>
      <!-- <myFilter
        :data="filterdata"
        @pushOutlet="updateOutlet($event)"
        @pushCategory="updateCategory($event)"
        @pushInventory="updateInventory($event)"
        @pushSearch="updateSearch($event)"
      />-->
    </div>
    <div class="columns">
      <div class="column">
        <b-table :data="users" class="is-size-7">
          <template slot-scope="props">
            <b-table-column field="nik" label="NIK" sortable>{{props.row.user_nik}}</b-table-column>
            <b-table-column field="name" label="Full Name" sortable>{{props.row.user_fullname}}</b-table-column>
            <b-table-column field="address" label="Address" sortable>{{props.row.user_address1}}</b-table-column>
            <b-table-column
              field="address2"
              label="Alternative Address"
              sortable
            >{{props.row.user_address2}}</b-table-column>
            <b-table-column field="email" label="Email" sortable>{{props.row.user_email}}</b-table-column>
            <b-table-column field="phone" label="Phone Number" sortable>{{props.row.user_phone}}</b-table-column>
            <b-table-column field="ktp" label="KTP image" sortable>
              <div v-if="props.row.user_ktp!='NULL'">Uploaded</div>
              <div v-else>Not Uploaded Yet</div>
            </b-table-column>
            <b-table-column field="action" label="action">
              <b-button type="is-warning" size="is-small" @click="getDetail(props.row.user_id)">
                <b-icon icon="mdi mdi-pencil" size="is-small"></b-icon>
              </b-button>
              <b-button type="is-danger" size="is-small" @click="deleteData(props.row.user_id)">
                <b-icon icon="mdi mdi-delete" size="is-small"></b-icon>
              </b-button>
            </b-table-column>
          </template>
        </b-table>
        <hr />
        <b-modal
          :active.sync="isComponentModalActive"
          has-modal-card
          trap-focus
          aria-role="dialog"
          aria-modal
        >
          <myModal :data="myUserID" @pushData="reloadData()" />
        </b-modal>

        <div class="spasi">
          <!-- <pre>{{ hasil_select }}</pre> -->
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Vue from "vue";
// import VeeValidate from "vee-validate";
// Vue.use(VeeValidate, {
//   events: ""
// });
import myFilter from "~/components/Filter";
// import myPagination from "~/components/Pagination";
import myModal from "~/components/AdminModal";
export default {
  components: {
    myFilter,
    // myPagination
    myModal
  },
  middleware: "auth",
  data() {
    return {
      users: [],
      isComponentModalActive: false,
      myUserID: null,
      userID: this.$auth.user.user_id
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
    openModal() {
      this.myUserID = null;
      this.isComponentModalActive = true;
    },
    async getUser() {
      this.$axios
        .get("/user?role_id=2")
        .then(response => {
          this.users = response.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    async getDetail(id) {
      this.myUserID = id;
      this.isComponentModalActive = true;
    },
    deleteData(id) {
      this.orderData = {
        user_id: id,
        updated_by: this.userID,
        method: "delete"
      };
      this.$buefy.dialog.confirm({
        title: "Attention !",
        message:
          "Are you sure you want to <b>delete</b> data? This action cannot be undone.",
        confirmText: "Delete",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => {
          this.$axios
            .post("/user", this.orderData)
            .then(response => {
              this.getUser();
            })
            .catch(e => {
              console.log(e);
            });
        }
      });
    }
  }
};
</script>
