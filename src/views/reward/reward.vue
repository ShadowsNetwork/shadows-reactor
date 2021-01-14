<template>
  <div>
    <div class="reward">
      <span>{{ $t('reward.title') }}</span>
      <div class="center">
        <div class="composeAmount">
          <span>{{ $t('reward.Transaction') }}</span>
          <span>0.00</span>
        </div>
        <div class="composeAmount">
          <span>{{ $t('reward.Synthetic') }}</span>
          <span>0.00</span>
        </div>
      </div>
      <div class="remind">
        <span>{{ $t('reward.remind') }}</span><br>
      </div>

      <div class="composeBtn">
        <span>{{ $t('reward.network') }}：00Gas</span>
        <button>{{ $t('reward.receive') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
name: "reward"
}
</script>

<style scoped>
/** {*/
/*  position: relative;*/
/*}*/
.reward {
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
.reward > span:nth-of-type(1) {
  color: white;
  font-size: 19px;
  position: relative;
  top: 20px;
  left: 20px;
}
.center {
  width: 100%;
  height: 100px;
  margin-top: 30px;
}
.composeAmount {
  width: 289px;
  height: 42px;
  border: 1px solid #979797;
  border-radius: 5px;
  margin-top: 10px;
  margin-left: 20px;
  display: flex;
  align-items: center;
}
.composeAmount > span:nth-of-type(1) {
  color: #979797;
  font-size: 13px;
  margin-left: 10px;
}
.composeAmount > span:nth-of-type(2) {
  color: #7E7E7E;
  font-size: 14px;
  margin-left: 150px;
}
.remind {
  width: 289px;
  height: 80px;
  margin-left: 20px;
  font-size: 6px;
  color: #7E7E7E;
}
.composeBtn {
  width: 100%;
  height: 60px;
  margin-top: 65px;
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