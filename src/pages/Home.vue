<template>
  <div class="container">
    <v-card
      height="200"
      width="500"
      class="container__card"
      flat
      color="#06090f"
    >
      <v-card-title class="container__card__title"
        >Busque aqui repositórios curtidos por um usuário.</v-card-title
      >
      <v-card-text>
        <v-text-field
          placeholder="Digite aqui o usuário desejado"
          hide-details
          autofocus
          solo
          class="container__card__input"
          v-model="searchQuery"
        />
      </v-card-text>
      <v-card-actions class="container__card__actions">
        <v-btn
          color="#238636"
          width="150"
          class="container__card__actions__button"
          @click="searchRepositories"
          >Buscar</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data: () => ({
    searchQuery: "",
  }),
  computed: {
    ...mapGetters(["getRepositories"]),
  },
  methods: {
    async searchRepositories() {
      await this.$store.dispatch("setRepositories", this.searchQuery);
      this.$router.push({ name: "Dashboard" });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  background: #06090f;
  align-items: center;
  display: flex;
  justify-content: center;
  height: 100%;
  &__card {
    &__title {
      color: white;
      font-size: 30px;
    }
    &__input {
      color: white !important;
    }
    &__actions {
      display: flex;
      justify-content: center;
      &__button {
        color: white !important;
      }
    }
  }
}
</style>
