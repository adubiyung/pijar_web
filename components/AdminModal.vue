<template>
  <section>
    <form @submit.prevent="pushData">
      <div class="modal-card">
        <header class="modal-card-head" v-if="this.data">
          <p class="modal-card-title">Edit Location</p>
        </header>
        <header class="modal-card-head" v-else>
          <p class="modal-card-title">Add Location</p>
        </header>
        <section class="modal-card-body">
          <b-field label="Location" label-position="on-border" v-if="this.roleID == 1">
                <b-select
                  v-model="loc"
                  placeholder="Select a location"
                  expanded
                >
                  <option
                    v-for="(loc, index) in cities"
                    :value="loc.city_id"
                    :key="index"
                  >{{loc.city_name}}</option>
                </b-select>
          </b-field>
          <b-field label="Location" label-position="on-border" v-else-if="this.roleID == 2">
                <b-select
                  v-model="loc"
                  placeholder="Select a location"
                  expanded
                >
                  <option
                    v-for="(dist, index) in districts"
                    :value="dist.district_id"
                    :key="index"
                  >{{dist.district_name}}</option>
                </b-select>
          </b-field>
          <b-field label="Location" label-position="on-border" v-else>
                <b-select
                  v-model="loc"
                  placeholder="Select a location"
                  expanded
                >
                  <option
                    v-for="(a, index) in locations"
                    :value="a.location_id"
                    :key="index"
                  >{{a.location_name}}</option>
                </b-select>
          </b-field>
          <b-field label="Name" label-position="on-border">
            <b-input v-model="name" placeholder="eg: John Doe"></b-input>
          </b-field>
          <b-field label="Identity Number" label-position="on-border">
            <b-input v-model="nik" placeholder="eg: 1234567890"></b-input>
          </b-field>
          <b-field label="Address" label-position="on-border">
            <b-input
              v-model="address1"
              placeholder="eg: Jl. Sabang"
              maxlength="200"
              type="textarea"
            ></b-input>
          </b-field>
          <b-field label="Alternative Address" label-position="on-border">
            <b-input
              v-model="address2"
              placeholder="eg: Jl. Sabang"
              maxlength="200"
              type="textarea"
            ></b-input>
          </b-field>
          <b-field label="Email" label-position="on-border">
            <b-input v-model="email" placeholder="eg: user@mail.co.id"></b-input>
          </b-field>
          <b-field label="Phone Number" label-position="on-border">
            <b-input v-model="phone" placeholder="eg: (+62) xxx"></b-input>
          </b-field>
          <b-field>
            <b-upload v-model="dropFiles" drag-drop>
              <section class="section">
                <div class="content has-text-centered">
                  <p>
                    <b-icon icon="upload" size="is-large"></b-icon>
                  </p>
                  <p>Drop your files here or click to upload</p>
                </div>
              </section>
            </b-upload>
          </b-field>
          <div class="tags">
            <span v-for="(file, index) in dropFiles" :key="index" class="tag is-primary">
              {{file.name}}
              <button
                class="delete is-small"
                type="button"
                @click="deleteDropFile(index)"
              ></button>
            </span>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-small" type="button" @click="$parent.close()">Cancel</button>
          <button type="submit" class="button is-primary is-small">Confrim</button>
        </footer>
      </div>
    </form>
  </section>
</template>

<script>
export default {
  props: ["data"],
  data() {
    return {
      loc: null,
      districts: [],
      cities: [],
      locations: [],
      name: "",
      nik: "",
      address1: "",
      address2: "",
      email: "",
      phone: "",
      ktp: "",
      userID: this.$auth.user.user_officer_id,
      roleID: this.$auth.user.role_id,
      role_id: "",
      users: [],
      method: "insert",
      dropFiles: [],
      imageData: ""
    };
  },
  created() {
    this.getData();
    if (this.data) {
      this.getDetail(this.data);
    } else {
      this.getReset();
    }

    if (this.roleID == 1) {
      this.getCities();
    } else if (this.roleID == 2) {
      this.getDistrict();
    } else {
      this.getLocations();
    }
  },
  methods: {
    previewImage: function(event) {
      // Reference to the DOM input element
      var input = event.target;
      // Ensure that you have a file before attempting to read it
      if (input.files && input.files[0]) {
        // create a new FileReader to read this image and convert to base64 format
        var reader = new FileReader();
        // Define a callback function to run, when FileReader finishes its job
        reader.onload = e => {
          // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
          // Read image as base64 and set to imageData
          this.imageData = e.target.result;
        };
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsDataURL(input.files[0]);
      }
    },
    deleteDropFile(index) {
      this.dropFiles.splice(index, 1);
    },
    async getDetail(id) {
      this.myUserID = id;
      await this.$axios
        .get("/user?user=" + id)
        .then(response => {
          this.isComponentModalActive = true;
          this.myUser = response.data.data[0];
          this.name = this.myUser.user_fullname;
          this.address1 = this.myUser.user_address1;
          this.address2 = this.myUser.user_address2;
          this.nik = this.myUser.user_nik;
          this.email = this.myUser.user_email;
          this.phone = this.myUser.user_phone;
          this.ktp = this.myUser.user_ktp;
          this.updated_by = this.$auth.user.user_officer_id;
          this.user_id = this.myUser.user_officer_id;
          this.loc = this.myUser.location_id;
          this.method = "update";
        })
        .catch(e => {
          console.log(e);
        });
    },
    getReset() {
      this.loc = null;
      this.nik = null;
      this.name = null;
      this.address1 = null;
      this.address2 = null;
      this.longitude = null;
      this.email = null;
      this.phone = null;
      this.ktp = null;
      this.updated_by = null;
      this.method = "insert";
    },
    pushData() {
      if (this.roleID == 1) {
        this.role_id = "2";
      } else if (this.roleID == 2) {
        this.role_id = "5";
      } else{
        this.role_id = "4";
      }
      this.orderData = {
        location_id: this.loc,
        user_nik: this.nik,
        user_officer_id: this.user_id,
        role_id: this.role_id,
        user_fullname: this.name,
        user_address1: this.address1,
        user_address2: this.address2,
        user_email: this.email,
        user_phone: this.phone,
        user_ktp: this.ktp,
        created_by: this.userID,
        updated_by: this.userID,
        method: this.method
      };
      this.$axios
        .post("/user", this.orderData)
        .then(response => {
          this.$emit("pushData", this.orderData);
        })
        .catch(e => {
          console.log(e);
        });
    },
    async getData() {
      await this.$axios
        .get("/user")
        .then(response => {
          this.users = response.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    async getCities() {
      this.cities = [];
      this.$axios
        .get("/city?province_id=" + this.$auth.user.location_id)
        .then(response => {
          this.cities = response.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    async getDistrict() {
      this.districts = [];
      this.$axios
        .get("/district?city_id=" + this.$auth.user.location_id)
        .then(response => {
          this.districts = response.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    async getLocations() {
      this.$axios
        .get("/location?district_id="+this.$auth.user.location_id)
        .then(response => {
          this.locations = response.data.data;
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>

<style scoped>
.center {
  text-align: center;
  vertical-align: middle;
}
</style>