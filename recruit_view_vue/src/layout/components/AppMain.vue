<template>
  <section
    class="app-main"
    :style="{
      height: height
    }"
  >
    <transition name="fade-transform" mode="out-in">
      <div>
        <router-view :key="key" />
      </div>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    },
    height() {
      return ['/company', '/resume'].includes(this.key) ? '100VH' : 'auto'
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: 100vh;
  width: 100%;
  background-color: rgba(220, 216, 216, 0.5);
  padding: 10px;
  position: relative;
  overflow: hidden;
  & > div {
    height: 100%;
    box-sizing: border-box;
    padding: 10px;
    background: #FFFFFF;
    & > div {
      height: 100%;
    }
  }
}
.fixed-header+.app-main {
  padding-top: 70px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
