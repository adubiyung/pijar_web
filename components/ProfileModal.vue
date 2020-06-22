<template>
    <section class="modal-card-body bgcard">
        <div class="columns is-vcentered">
            <div class="column is-narrow">
                <figure class="image is-96x96">
                    <img src="https://bulma.io/images/placeholders/128x128.png">
                </figure>
            </div>

            <div class="column">
                <div class="field">
                    <div class="control is-small is-expanded is-clearfix">
                        <b-field label="Full Name" label-position="on-border">
                            <b-input v-model="name" disabled></b-input>
                        </b-field>
                    </div>
                </div>
                <div class="field">
                    <div class="control is-small is-expanded is-clearfix">
                        <b-field label="Email Address" label-position="on-border">
                            <b-input v-model="email" disabled></b-input>
                        </b-field>
                    </div>
                </div>
                <div class="field">
                    <div class="control is-small is-expanded is-clearfix">
                        <b-field label="Phone Number" label-position="on-border">
                            <b-input v-model="phone" disabled></b-input>
                        </b-field>
                    </div>
                </div>
            </div>
        </div>
        <div class="columns">
            <div class="column">
                <b-field label="Credit Balance" label-position="on-border">
                    <b-input v-model="balance" disabled></b-input>
                </b-field>
            </div>
            <div class="column">
                <b-field label="Credit Point" label-position="on-border">
                    <b-input v-model="point" disabled></b-input>
                </b-field>
            </div>
        </div>
        <b-field label="Identity Number" label-position="on-border">
            <b-input v-model="nik" disabled></b-input>
        </b-field>
        <b-field label="Birth Date" label-position="on-border">
            <b-input v-model="birth" disabled></b-input>
        </b-field>
        <b-field label="Address" label-position="on-border">
            <b-input v-model="address" disabled maxlength="200" type="textarea"></b-input>
        </b-field>
    </section>
</template>

<script>
export default {
    props: ["data"],
    data(){
        return {
            userID: null,
            name: "",
            email: "",
            phone: "",
            balance: "",
            point: "",
            nik: "",
            birth: "",
            address: ""
        };
    },
    created(){
        this.getDetail(this.data);
    },
    methods: {
        async getDetail(id) {
            this.userID = id;
            await this.$axios
            .get(`/reportuser?role_id=3&user_id=${id}`)
            .then(response => {
                this.isComponentModalActive = true;
                this.myData = response.data.data[0];
                console.log("modar", this.myData);
                this.name = this.myData.user_fullname;
                this.email = this.myData.user_email;
                this.phone = this.myData.user_phone;
                this.balance = this.myData.user_balance;
                this.point = this.myData.user_point;
                this.nik = this.myData.user_nik;
                this.birth = this.myData.user_birthdate;
                this.address = this.myData.user_address1;
            })
            .catch(e => {
                console.log(e);
            });
        }
    }
}
</script>