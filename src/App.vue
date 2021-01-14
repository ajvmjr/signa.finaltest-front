<template>
  <v-app>
    <v-main>
      <router-view />
      <v-snackbar v-model="snackbar">{{ getSnackbarMsg }}</v-snackbar>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data: () => ({
    snackbar: false,
  }),
  computed: {
    ...mapGetters(["getSnackbar", "getSnackbarMsg"]),
  },
  watch: {
    getSnackbar() {
      this.snackbar = this.getSnackbar;
    },
    snackbar() {
      if (!this.snackbar) {
        this.$store.dispatch("setSnackbar", {
          status: false,
          msg: "",
        });
      }
    },
  },
};
</script>
