<template>
  <div class="homepagetwo" @click="click">
    <div class="center">
      <span>抵押DOS奖励</span>
      <div class="centertext">
        <span>DOS抵押人可以获得3种奖励:</span><br>
        <span>1.交易所手续费奖励</span><br>
        <span>2.Stakiing奖励</span><br>
        <span>3.借贷池收益</span>
      </div>
      <img src="../assets/img/homepagetwo.png"/>
    </div>
  </div>
</template>

<script>
export default {
name: "homepagetwo",
  methods: {
    click() {
      this.$router.replace('/homepagethree')
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
.center > span:nth-of-type(1) {
  font-size: 25px;
  color: white;
  position: relative;
  top: 40px;
  left: 30px;
}
.centertext {
  width: 375px;
  height: 100px;
  margin-left: 30px;
  margin-top: 45px;
}
.centertext > span {
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
}
.center img {
  width: 300px;
  height: 195px;
  position: absolute;
  top: 15px;
  right: 0;
  border-radius: 10px;
}
</style>