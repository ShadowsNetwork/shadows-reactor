<template>
  <div>
    <div class="destory">
      <span>销毁</span>
      <button>调整至目标抵押率</button>
      <button>全部销毁</button>
      <div class="dos">
        <span>余额：20DOS</span>
        <div class="composeAmount">
          <img style="margin-left: 10px" src="../../assets/img/butter.png"/>
          <span>xUSD</span>
          <input></input>
        </div>
      </div>

      <div class="clear">
        <span>可解锁的数量</span>
        <div class="composeAmount">
          <img style="margin-left: 10px" src="../../assets/img/butter.png"/>
          <span>xUSD</span>
          <input></input>
        </div>
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
name: "destory"
}
</script>

<style scoped>
/** {*/
/*  position: relative;*/
/*}*/
.destory {
  width: 330px;
  height: 360px;
  position: absolute;
  top: calc((100% - 360px) / 4);
  left: calc((100% - 330px) / 2);
  background-color: #22232C;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  box-shadow: 0px 0px 20px rgb(0, 0, 0);
}
.destory > span:nth-of-type(1) {
  color: white;
  font-size: 19px;
  position: relative;
  top: 20px;
  left: 20px;
}
.destory > button:nth-of-type(1) {
  width: 120px;
  height: 20px;
  background: #2E313C;
  color: #FFFFFF;
  font-size: 9px;
  border: 0;
  outline: none;
  border-radius: 10px;
  position: absolute;
  top: 60px;
  left: 20px;
}
.destory > button:nth-of-type(2) {
  width: 80px;
  height: 20px;
  background: #2E313C;
  color: #FFFFFF;
  font-size: 9px;
  border: 0;
  outline: none;
  border-radius: 10px;
  position: absolute;
  top: 60px;
  right: 90px;
}
.dos {
  width: 100%;
  height: 80px;
  margin-top: 70px;
}
.dos > span {
  color: rgba(255, 255, 255, 0.8);;
  font-size: 12px;
  display: flex;
  margin-left: 20px;
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
}
.clear > span {
  color: rgba(255, 255, 255, 0.8);;
  font-size: 12px;
  display: flex;
  margin-left: 20px;
}
.composeBtn {
  width: 100%;
  height: 60px;
  margin-top: 40px;
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