<template>
  <div>
    简历详情
  </div>
</template>

<script>
export default {
  name: 'resumeInfo',
  data() {
    return {
      resumeInfo: {}
    }
  },

  computed: {
    resumeID() {
      return this.$route.query.resumeID
    }
  },
  created() {
    this.getResumeInfo();
  },
  methods: {
    async getResumeInfo() {
      try {
        const { data, code, message } = await this.$http.get('/jobApplication/getResumeByResumeID', {
          params: {
            resumeID: this.resumeID
          }
        })
        if (code === 200) {
          this.resumeInfo = data
        } else {
          this.$message.warning(message)
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
