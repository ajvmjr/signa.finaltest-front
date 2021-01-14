<template>
  <div class="container">
    <h1 class="container__title">Repositórios starred do usuário {{ user }}</h1>
    <div class="container__search">
      <v-text-field placeholder="Filtrar por tag" solo v-model="queryFilter" />
    </div>
    <div>
      <table class="container__table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Linguagem</th>
            <th>Tags</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody v-if="getRepositories && getRepositories.length > 0">
          <tr v-for="repository in getRepositories" :key="repository.id">
            <td>{{ repository.repositoryId }}</td>
            <td>
              <v-tooltip color="black" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <a
                    v-bind="attrs"
                    v-on="on"
                    :href="repository.repositoryUrlhttp"
                    >{{ repository.repositoryName }}</a
                  >
                </template>
                <span
                  >Ir para o repositório {{ repository.repositoryUrlhttp }}
                </span>
              </v-tooltip>
            </td>
            <td>{{ repository.repositoryDescription }}</td>
            <td>{{ repository.repositoryLanguage }}</td>
            <td>{{ repository.repositoryTags }}</td>
            <td>
              <v-btn color="success" icon @click="openAddTagModal(repository)">
                <v-icon>
                  add
                </v-icon>
              </v-btn>
              <v-btn
                color="warning"
                icon
                @click="openEditTagModal(repository.repositoryId)"
              >
                <v-icon>
                  create
                </v-icon>
              </v-btn>
              <v-btn color="error" icon @click="openDeleteTagModal(repository)">
                <v-icon>
                  delete
                </v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="getRepositories && getRepositories.length === 0">
        <h2 class="container__notfound-search">
          Ops, não foi possível encontrar nenhum repositório com a tag
          {{ queryFilter }} :(
        </h2>
      </div>
    </div>
    <Modal :dialog="openAddModal" class="container__modal" :widthValue="450">
      <h3 class="container__modal__title">Adicionar tags</h3>
      <v-text-field
        placeholder="Digite o nome das tags desejadas"
        hint="Separe-as por ,"
        v-model="add.tags"
      />
      <v-btn
        text
        color="#3980da"
        outlined
        class="mr-4 mt-2"
        v-for="(sugestion, index) in filterSugestions"
        :key="index"
        @click="updateAddTags(sugestion)"
      >
        {{ sugestion }}
      </v-btn>
      <v-card-actions class="container__modal__actions mt-3">
        <v-btn class="error" @click="closeModals">Cancelar</v-btn>
        <v-btn
          color="#238636"
          class="container__modal__actions__buttons"
          @click="addTag"
          >Adicionar</v-btn
        >
      </v-card-actions>
    </Modal>
    <Modal :dialog="openEditModal" class="container__modal">
      <h3 class="container__modal__title">Editar tags</h3>
      <v-text-field
        placeholder="Digite o nome das tags desejadas"
        hint="Separe-as por ,"
        v-model="edit.tags"
      />
      <v-card-actions class="container__modal__actions">
        <v-btn class="error" @click="closeModals">Cancelar</v-btn>
        <v-btn
          color="#238636"
          class="container__modal__actions__buttons"
          @click="editTag"
          >Confirmar</v-btn
        >
      </v-card-actions>
    </Modal>
    <Modal :dialog="openDeleteModal" class="container__modal" :widthValue="450">
      <h3 class="container__modal__title mb-4">Excluir tags</h3>
      <v-btn
        text
        color="#3980da"
        outlined
        class="mr-4 mt-2"
        v-for="(tag, index) in deleteTags"
        :key="index"
        @click="updateDelTags(tag)"
      >
        {{ tag }}
      </v-btn>
      <v-combobox
        hide-no-data
        clearable
        multiple
        chips
        disabled
        label="Selecione acima as tags que deseja excluir"
        class="mt-4"
        :value="del.tags !== '' ? del.tags.split(',') : ''"
      >
        <template v-slot:selection="{ attrs, item, selected }">
          <v-chip v-bind="attrs" :input-value="selected">
            {{ item }}
          </v-chip>
        </template>
      </v-combobox>
      <v-card-actions class="container__modal__actions">
        <v-btn class="error" @click="closeModals">Cancelar</v-btn>
        <v-btn
          color="#238636"
          class="container__modal__actions__buttons"
          @click="deleteTag"
          >Excluir</v-btn
        >
      </v-card-actions>
    </Modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Modal from "@/components/Modal";

export default {
  data: () => ({
    add: {
      repositoryId: "",
      tags: "",
    },
    edit: {
      repositoryId: "",
      tags: "",
    },
    del: {
      repositoryId: "",
      tags: "",
    },
    user: "",
    queryFilter: "",
    openAddModal: false,
    openEditModal: false,
    openDeleteModal: false,
    deleteTags: [],
    currentAddTags: "",
    repositories: [],
    sugestions: [
      "Javascript",
      "Vue.js",
      "React.js",
      "CSS",
      "HTML",
      "Angular",
      "Typescript",
      "C#",
      "Python",
    ],
  }),
  components: { Modal },
  computed: {
    ...mapGetters(["getRepositories"]),
    filterSugestions() {
      const addTags = this.currentAddTags.split(", ");
      return this.sugestions.filter(
        (sugestion) => !addTags.includes(sugestion)
      );
    },
  },
  watch: {
    queryFilter() {
      this.debouce(this.queryFilter);
    },
  },
  mounted() {
    this.repositories = this.getRepositories;
    this.user = this.$route.params.userName;
  },
  methods: {
    openAddTagModal(repository) {
      this.openAddModal = true;
      this.add.repositoryId = repository.repositoryId;
      if (repository.repositoryTags) {
        this.currentAddTags = repository.repositoryTags;
      }
    },
    async addTag() {
      const info = {
        repositoryId: this.add.repositoryId,
        repositoryTags: this.add.tags,
      };
      try {
        await this.$store.dispatch("addTag", info);
        this.$store.dispatch("setSnackbar", {
          status: true,
          message: "Tag cadastrada com sucesso.",
        });
      } catch (error) {
        this.$store.dispatch("setSnackbar", {
          status: true,
          message: "Erro ao cadastrar tag.",
        });
      }
      this.add.repositoryId = "";
      this.add.tags = "";
      this.openAddModal = false;
    },
    openEditTagModal(id) {
      this.openEditModal = true;
      this.edit.repositoryId = id;
    },
    async editTag() {
      const info = {
        repositoryId: this.edit.repositoryId,
        repositoryTags: this.edit.tags,
      };
      try {
        await this.$store.dispatch("editTag", info);
        this.$store.dispatch("setSnackbar", {
          status: true,
          message: "Tag editada com sucesso.",
        });
      } catch (error) {
        console.log(error);
        this.$store.dispatch("setSnackbar", {
          status: true,
          message: "Erro ao editar tag.",
        });
      }
      this.edit.repositoryId = "";
      this.edit.tags = "";
      this.openEditModal = false;
    },
    openDeleteTagModal(repository) {
      this.openDeleteModal = true;
      this.del.repositoryId = repository.repositoryId;
      this.deleteTags = repository.repositoryTags.split(", ");
    },
    async deleteTag() {
      const info = {
        repositoryId: this.del.repositoryId,
        repositoryTags: this.del.tags,
      };
      try {
        await this.$store.dispatch("deleteTag", info);
        this.$store.dispatch("setSnackbar", {
          status: true,
          message: "Tag deletada com sucesso.",
        });
      } catch (error) {
        this.$store.dispatch("setSnackbar", {
          status: true,
          message: "Erro ao deletar tag.",
        });
      }
      this.del.repositoryId = "";
      this.del.tags = "";
      this.openDeleteModal = false;
    },
    updateDelTags(tag) {
      if (this.del.tags === "") {
        this.del.tags = tag;
      } else {
        this.del.tags = this.del.tags + ", " + tag;
      }
    },
    updateAddTags(tag) {
      if (this.add.tags === "") {
        this.add.tags = tag;
      } else {
        this.add.tags = this.add.tags + ", " + tag;
      }
    },
    closeModals() {
      this.openAddModal = false;
      this.openEditModal = false;
      this.openDeleteModal = false;

      this.add = {
        repositoryId: "",
        tags: "",
      };
      (this.edit = {
        repositoryId: "",
        tags: "",
      }),
        (this.del = {
          repositoryId: "",
          tags: "",
        });
    },
    remove(item) {
      this.deleteTags.splice(this.deleteTags.indexOf(item), 1);
      this.deleteTags = [...this.deleteTags];
    },
    debouce(val) {
      console.log("to entrando, valor é: ", val);
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(async () => {
        await this.$store.dispatch("searchByQuery", val);
      }, 500);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  background: #06090f;
  height: 100%;
  &__title {
    color: #3980da;
    font-size: 30px;
    padding: 25px 0 0 30px;
  }
  &__search {
    padding: 25px 0 0 30px;
    width: 330px;
  }
  &__table {
    text-align: center;
    width: 100%;
    thead {
      th {
        color: #3980da;
      }
    }
    tbody {
      td {
        font-size: 14px;
        color: white;
        a {
          color: white;
          text-decoration: none;
          &:hover {
            color: rgb(126, 126, 172);
          }
        }
      }
    }
  }
  &__notfound-search {
    padding-top: 50px;
    text-align: center;
    color: white;
  }
  &__modal {
    &__title {
      color: #3980da;
    }
    &__actions {
      display: flex;
      justify-content: center;
      &__buttons {
        color: white;
      }
    }
  }
}
</style>
