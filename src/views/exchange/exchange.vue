<template>
  <div>
    <div class="exchange">
      <span>交易</span>
      <div class="dos">
        <span>支付</span>
        <span>可用：0</span>
        <div class="composeAmount">
          <img style="margin-left: 10px" src="../../assets/img/butter.png"/>
          <span>xUSD</span>
          <input></input>
        </div>
      </div>
      <img class="exchangeimg" src="../../assets/img/exchange.png" />
      <div class="clear">
        <span>接收</span>
        <span>估计的</span>
        <div class="composeAmount">
          <img style="margin-left: 10px" src="../../assets/img/butter.png"/>
          <span>xDOS</span>
          <input></input>
        </div>
        <span>交易手续费：0.3%</span>
      </div>

      <div class="composeBtn">
        <span>网络费用：00Gas</span>
        <button>销毁</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
name: "exchange"
}
</script>

<style scoped>
/** {*/
/*  position: relative;*/
/*}*/
.exchange {
  width: 330px;
  height: 390px;
  position: absolute;
  top: calc((100% - 390px) / 4);
  left: calc((100% - 330px) / 2);
  background-color: #22232C;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  box-shadow: 0px 0px 20px rgb(0, 0, 0);
}
.exchange > span:nth-of-type(1) {
  color: white;
  font-size: 19px;
  position: relative;
  top: 20px;
  left: 20px;
}
.exchangeimg {
  width: 30px;
  height: 30px;
  position: absolute;
  left: calc((100% - 30px) / 2);
  z-index: 100;
}
.dos {
  width: 100%;
  height: 70px;
  margin-top: 35px;
  position: relative;
}
.dos > span:nth-of-type(1) {
  color: rgba(255, 255, 255, 0.8);;
  font-size: 12px;
  display: flex;
  margin-left: 20px;
}
.dos > span:nth-of-type(2) {
  color: rgba(255, 255, 255, 0.8);;
  font-size: 12px;
  display: flex;
  position: absolute;
  right: 20px;
  top: 0;
}
.composeAmount {
  width: 289px;
  height: 42px;
  border: 1px solid #979797;
  border-radius: 5px;
  margin-top: 5px;
  margin-left: 20px;
  display: flex;
  align-items: center;
}
.composeAmount > span:nth-of-type(1) {
  color: #979797;
  font-size: 13px;
  margin-left: 10px;
}
.composeAmount > input {
  width: 190px;
  height: 40px;
  border: 0;
  margin-left: 10px;
  color: #7E7E7E;
  background: #22232C;
  outline: none;
}
.clear {
  width: 100%;
  height: 80px;
  margin-top: 15px;
  position: relative;
}
.clear > span:nth-of-type(1) {
  color: rgba(255, 255, 255, 0.8);;
  font-size: 12px;
  display: flex;
  margin-left: 20px;
}
.clear > span:nth-of-type(2) {
  color: rgba(255, 255, 255, 0.8);;
  font-size: 12px;
  display: flex;
  position: absolute;
  right: 20px;
  top: 0;
}
.clear > span:nth-of-type(3) {
  color: #7E7E7E;
  font-size: 12px;
  margin-left: 20px;
}
.composeBtn {
  width: 100%;
  height: 60px;
  margin-top: 85px;
  display: flex;
  justify-content: center;
}
.composeBtn > span {
  color: rgba(255, 255, 255, 0.8);;
  font-size: 12px;
}
.composeBtn button {
  width: 150px;
  height: 30px;
  background-color: #FF2C77;
  border: 0;
  color: white;
  font-size: 12px;
  border-radius: 7px;
  outline: none;
  position: absolute;
  bottom: 10px;
}
</style>