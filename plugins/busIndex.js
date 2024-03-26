import Vue from 'vue'

export default function(_ctx, inject) {
  const notify = function(msg) {
    setInterval(() => {
      this.$bus.$emit('add', msg)
    }, 500)
  }
    .bind(new Vue())

  inject('notify', notify)
}
