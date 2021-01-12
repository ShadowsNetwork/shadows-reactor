<template>
  <div class="homepageone" @click="click">
    <div class="center">
      <span>风险提示</span>
      <div class="centertext">
        <span>抵押DOS合成资产时，会产生一笔“债务”。“债务”是他们初始铸造的xUSD数量，接下来，债务将随着其他合成资产持有人的收益和损失而波动。当有人持有的合成资产增值时，那部分收益将按比例来自于所有DOS持有人的债务。每个持有人都必须付清他们的债务才能解锁他们质押的DOS。  </span>
      </div>
      <img src="../assets/img/homepageone.png"/>
    </div>
  </div>
</template>

<script>
import Slidebar from "@/components/slidebar";
export default {
name: "homepageone",
  components: {Slidebar},
  methods: {
    click() {
      this.$router.replace('/homepagetwo')
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
  margin-top: 40px;
}
.centertext > span {
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
}
.center img {
  width: 150px;
  height: 210px;
  position: absolute;
  top: 0;
  right: 10px;
  border-radius: 10px;
}
</style>