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
      <p v-if="showFeedback">{{ errorFeedback }}</p>
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
export default {
  data: () => ({
    searchQuery: "",
    errorFeedback: "Por favor, insira um usuário.",
    showFeedback: false,
  }),
  methods: {
    async searchRepositories() {
      if (this.searchQuery === "") {
        this.showFeedback = true;
        return;
      }
      this.showFeedback = false;
      try {
        await this.$store.dispatch("setRepositories", this.searchQuery);
        this.$router.push({
          name: "Dashboard",
          params: { userName: this.searchQuery },
        });
      } catch (error) {
        console.log(error);
        this.$store.dispatch("setSnackbar", {
          status: true,
          message: `Erro ao buscar repositórios starred do usuário ${this.searchQuery}.`,
        });
      }
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
    p {
      text-align: center;
      color: rgb(163, 69, 69);
    }
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
