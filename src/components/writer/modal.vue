<template>
  <div class="dialog" v-if="visible" @click="hideDialog">
    <div class="dialog__content">
      <p>Подтвердите ваше действие</p>
      <button type="button" class="btn btn-primary" @click="orderConf(book_id,order_id)">Выдать книгу</button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'my-dialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    order_id: {
      type: Number,
      required: true
    },
    book_id: {
      type: Number,
      required: true
    }
  },
  emits: [
      'close',
      'update'
  ],
  methods: {
    hideDialog() {
      this.$emit('close')
    },
    async orderConf (idb,ido)  {
      await axios.post('//localhost:8080/api/api/statuses', {
        book_id: idb,
        status_id: 3,
        order_id: ido
      })
      this.$emit('update')
    }
  }
}
</script>

<style scoped>
.dialog {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgb(0, 0, 0, 0.5);
  position: fixed;
  display: flex;
}
.dialog__content {
  margin: auto;
  background: white;
  border-radius: 12px;
  min-height: 50px;
  min-width: 300px;
  padding: 20px;
}
</style>