<template>
  <v-dialog v-model="dialog" :width="widthValue" persistent>
    <v-card color="white" class="card">
      <slot />
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: Boolean,
    widthValue: {
      type: Number,
      default: 350,
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  padding: 20px;
}
</style>
