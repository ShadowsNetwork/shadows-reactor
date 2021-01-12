<template>
  <div class="homepagefour" @click="click">
    <div class="center">
      <img src="../assets/img/homepagefour.png"/>
    </div>
  </div>
</template>

<script>
export default {
name: "homepagefour",
  methods: {
    click() {
      this.$router.replace('/myself')
    }
  }
}
</script>

<style scoped>
.center {
  width: 600px;
  height: 210px;
  position: absolute;
  top: calc((100% - 200px) / 2);
  left: calc((100% - 500px) / 2);
  background-color: rgba(34, 35, 44, 1);
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  box-shadow: 0px 0px 20px rgb(0, 0, 0);
}
.center img {
  width: 600px;
  height: 210px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}
</style>