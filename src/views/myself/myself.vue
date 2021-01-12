<template>
  <div>
    <div class="myself">
      <span>个人信息</span>
      <div class="oneline">
        <div v-for="(item,index) in myselfMont" :key="index">
          <span>{{ item.name }}</span><br>
          <span>{{ item.num }}</span>
        </div>
      </div>
      <div class="twoline">
        <div v-for="(item,index) in pledge" :key="index">
          <span>{{ item.type }}</span><br>
          <span>{{ item.number }}</span>
        </div>
      </div>
      <span style="font-size: 12px;color: #979797;margin-left: 2px">总SNK</span>
      <span style="margin-left: 20px;font-size: 16px">{{ snk }}</span><br>
      <div class="split"></div>

      <div class="progress">
        <div class="progressText">
          <span>已锁定：0</span>
          <span>可转账：0</span>
        </div>
        <el-progress :text-inside="true" color="#FF2C77" :stroke-width="16" :percentage="50" status="exception"></el-progress>
      </div>
      <div class="progress">
        <div class="progressText">
          <span>已锁定：0</span>
          <span>可转账：0</span>
        </div>
        <el-progress :text-inside="true" color="#FF2C77" :stroke-width="16" :percentage="50" status="exception" ></el-progress>
      </div>
      <div class="progress">
        <div class="progressText">
          <span>已锁定：0</span>
          <span>可转账：0</span>
        </div>
        <el-progress :text-inside="true" color="#FF2C77" :stroke-width="16" :percentage="50" status="exception"></el-progress>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "myself",
  data() {
    return {
      myselfMont: [
        {
          name: 'xUSD',
          num: '00000000'
        },
        {
          name: 'xUSD',
          num: '00000000'
        },
        {
          name: 'xUSD',
          num: '00000000'
        },
        {
          name: 'xUSD',
          num: '00000000'
        },
      ],
      pledge: [
        {
          type: '我的抵押率',
          number: '50%'
        },
        {
          type: '目标抵押率',
          number: '50%'
        }
      ],
      snk: '50%'
    }
  },
  methods: {

  }
}
</script>

<style scoped>
/** {*/
/*  position: relative;*/
/*}*/
.myself {
  width: 623px;
  height: 410px;
  position: absolute;
  top: calc((100% - 410px) / 4);
  left: calc((100% - 623px) / 2);
  background-color: #22232C;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  box-shadow: 0px 0px 20px rgb(0, 0, 0);
}
.myself > span {
  color: white;
  font-size: 19px;
  position: relative;
  top: 20px;
  left: 20px;
}
.oneline {
  width: 100%;
  height: 60px;
  border-radius: 5px;
  margin-top: 35px;
  display: flex;
  justify-content: left;
}
.oneline > div {
  width: 136px;
  height: 60px;
  float: left;
  border: 1px solid #979797;
  border-radius: 5px;
  margin-left: 14px;
}
.oneline > div > span:nth-of-type(1) {
  color: #979797;
  font-size: 12px;
  position: relative;
  top: 5px;
  left: 10px;
}
.oneline > div > span:nth-of-type(2) {
  color: white;
  position: relative;
  top: 5px;
  left: 10px;
}
.twoline {
  width: 100%;
  height: 60px;
  border-radius: 5px;
  margin-top: 14px;
  display: flex;
  justify-content: left;
}
.twoline > div {
  width: 136px;
  height: 60px;
  float: left;
  border: 1px solid #979797;
  border-radius: 5px;
  margin-left: 14px
}
.twoline > div > span:nth-of-type(1) {
  color: #979797;
  font-size: 12px;
  position: relative;
  top: 5px;
  left: 10px;
}
.twoline > div > span:nth-of-type(2) {
  color: white;
  position: relative;
  top: 5px;
  left: 10px;
}
.split {
  width: 94%;
  border-bottom: 1px solid #979797;
  position: relative;
  top: 30px;
  left: 20px;
}
.progress {
  width: 94%;
  height: 50px;
  position: relative;
  top:40px;
  left: 20px;
}
.progressText {
  position: relative;
}

.progressText > span:nth-of-type(1) {
  font-size: 12px;
  color: #7E7E7E;
}
.progressText > span:nth-of-type(2) {
  font-size: 12px;
  color: #7E7E7E;
  position: absolute;
  right: 0;
}
</style>