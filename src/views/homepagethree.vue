<template>
  <div class="homepagethree" @click.tab="click">
    <div class="center">
      <span>{{ $t('pagethree.title') }}</span>
      <div class="centertext">
        <span>{{ $t('pagethree.text') }}</span>
      </div>
      <img src="../assets/img/homepagethree.png"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "homepagethree",
  methods: {
    click() {
      this.$router.replace('/homepagefour')
    }
  }
}
</script>

<style scoped>
.center {
  width: 600px;
  height: 210px;
  position: absolute;
  top: calc((100% - 200px) / 4);
  left: calc((100% - 500px) / 2);
  background-color: rgba(34, 35, 44, 1);
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  box-shadow: 0px 0px 20px rgb(0, 0, 0);
}
.center > span:nth-of-type(1) {
  font-size: 25px;
  color: white;
  position: relative;
  top: 40px;
  left: 30px;
}
.centertext {
  width: 340px;
  height: 100px;
  margin-left: 30px;
  margin-top: 45px;
}
.centertext > span {
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
}
.center img {
  width: 190px;
  height: 211px;
  position: absolute;
  top: 0;
  right: 0;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}
</style>