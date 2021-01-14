<template>
  <div>
    <div class="compose">
      <span>{{ $t('compose.title') }}</span>
      <span>{{ $t('compose.balance') }}：20DOS</span>
      <div class="composeAmount">
        <img style="margin-left: 10px" src="../../assets/img/butter.png"/>
        <span>xUSD</span>
        <input></input>
        <button>{{ $t('compose.all') }}</button>
      </div>
      <span>Staking：00 DOS</span><br>
      <span>{{ $t('compose.Debt') }}：0.0 %</span>

      <div class="composeBtn">
        <span>{{ $t('compose.network') }}：00Gas</span>
        <button>{{ $t('compose.Start') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "compose"
}
</script>

<style scoped>
/** {*/
/*  position: relative;*/
/*}*/
.compose {
  width: 330px;
  height: 340px;
  position: absolute;
  top: calc((100% - 340px) / 4);
  left: calc((100% - 330px) / 2);
  background-color: #22232C;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  box-shadow: 0px 0px 20px rgb(0, 0, 0);
}
.compose > span:nth-of-type(1) {
  color: white;
  font-size: 19px;
  position: relative;
  top: 20px;
  left: 20px;
}
.compose > span:nth-of-type(2) {
  color: rgba(255, 255, 255, 0.8);;
  font-size: 12px;
  position: absolute;
  top: 55px;
  left: 20px;
}
.composeAmount {
  width: 289px;
  height: 42px;
  border-radius: 5px;
  margin-top: 60px;
  margin-left: 20px;
  border: 1px solid #979797;
  display: flex;
  align-items: center;
  position: relative;
}
.composeAmount > span:nth-of-type(1) {
  color: #979797;
  font-size: 13px;
  margin-left: 10px;
}
.composeAmount > input {
  width: 120px;
  height: 40px;
  border: 0;
  margin-left: 10px;
  color: #7E7E7E;
  background: #22232C;
  outline: none;
}
.composeAmount button {
  width: 50px;
  height: 30px;
  background-color: #22232C;
  border: 1px solid white;
  color: white;
  font-size: 12px;
  border-radius: 20px;
  position: absolute;
  top: 6px;
  right: 10px;
  outline: none
}
.compose > span:nth-of-type(3) {
  color: rgba(255, 255, 255, 0.8);;
  font-size: 12px;
  position: relative;
  top: 20px;
  left: 20px;
}
.compose > span:nth-of-type(4) {
  color: rgba(255, 255, 255, 0.8);;
  font-size: 12px;
  position: relative;
  top: 20px;
  left: 20px;
}
.composeBtn {
  width: 100%;
  height: 60px;
  margin-top: 100px;
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