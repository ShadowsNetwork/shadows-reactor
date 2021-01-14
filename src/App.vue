<template>
  <div id="app">
    <slidebar></slidebar>
    <div class="myNameHome" v-show="!home">
      <img src="./assets/img/connect.png" style=" width:20px;height:20px;position: relative;left: 15px"/>
      <img src="./assets/img/moneyconnect.png" style="width: 60px;margin-left: 40px"/>
    </div>
    <div class="myName" v-show="home">
      <div class="myHead"></div>
      <span style="color: white;margin-left: 20px">{{name | ellipsis}}</span>
    </div>
    <div class="language" @mouseover="onDplOver($event)" @mouseout="onDplOut($event)">
      <img src="./assets/img/language.png"/>
      <div class="languageChoose">
        <span style="color: white;font-size: 15px">{{ language }}</span>
        <div style="width: 25px;height: 25px;background: rgba(46, 49, 60, 1);margin-left: 13px;border-radius: 5px">
          <img src="./assets/img/down.png" style="width: 15px;height: 10px; margin-left: calc((100% - 15px) / 2)"/>
        </div>
      </div>

      <div class="languageSelect" @mouseover="onDplOver($event)" @mouseout="onDplOut($event)" v-show="show" :show="show">
      <!--   语言   -->
        <div class="nationLanguage">
          <span style="font-size: 9px;color: #979797">language</span>
          <span style="font-size: 9px;color: #979797;margin-left: 91px">currency</span>
          <div class="country" @click="chChina">
            <div class="nationFlag">
              <img src="./assets/img/nationFlag/China.jpg"/>
            </div>
            <span style="color: white;font-size: 9px;margin-left: 3px">中文</span>
            <span style="color: white;font-size: 9px;margin-left: 100px">USD</span>
          </div>
          <div class="country" @click="chUSA">
            <div class="nationFlag">
              <img src="./assets/img/nationFlag/USA.jpg"/>
            </div>
            <span style="color: white;font-size: 9px;margin-left: 3px">English</span>
          </div>
        </div>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>

import Slidebar from "@/components/slidebar";
export default {
  name: 'app',
  component: {Slidebar},
  data() {
    return {
      home: true,
      name: '0xDE68943fe857424824B66bb33fb0765cADDd06a7',
      show:false,
      language: '中/CN'
    }
  },
  filters: {
    ellipsis (value) {
      if (!value) return ''
      if (value.length > 12) {
        return value.slice(0,12) + '...'
      }
      return value
    }
  },
  components: {Slidebar},
  created() {
    if (this.$route.name == 'homepageone' || this.$route.name == 'homepagetwo' || this.$route.name == 'homepagethree' || this.$route.name == 'homepagefour'){
      this.home = false
    }else {
      this.home = true
    }
    let us = localStorage.getItem('language')||'us';
    if(us === 'us') {
      this.language = '美/US'
    }
    let cn = localStorage.getItem('language')||'cn';
    if(cn === 'us') {
      this.language = '美/US'
    }
  },
  mounted() {

  },
  methods: {
    onDplOver() {
      this.show = true;
    },
    onDplOut() {
      this.show = false;
    },
    //  切换语言
    chChina() {
      this.language = '中/CN';
      let locale = localStorage.getItem('language')||'us';
      let temp = locale === 'us' ? 'cn' : 'cn';
      this.$i18n.locale=temp;//改变当前语言
      localStorage.language=temp;
    },
    chUSA() {
      this.language = '美/US'
      let locale = localStorage.getItem('language')||'cn';
      let temp = locale === 'cn' ? 'us' : 'us';
      this.$i18n.locale=temp;//改变当前语言
      localStorage.language=temp;
    }
  }
}
</script>

<style>
#app {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: radial-gradient(circle 700px at 50% 0%,#2D1E2B 50%, #171B1D 100%) ;
  margin: 0;
}
.myNameHome {
  width: 160px;
  height: 30px;
  border: 1px solid white;
  border-radius: 20px;
  position: absolute;
  right: 150px;
  top: 10px;
  display: flex;
  align-items: center;
}
.myName {
  width: 170px;
  height: 30px;
  border: 1px solid white;
  border-radius: 20px;
  position: absolute;
  right: 150px;
  top: 10px;
  display: flex;
  align-items: center;
}
.myHead {
  width: 20px;
  height: 20px;
  border-radius: 20px;
  background-color: #70D487;
  position: relative;
  left: 10px;
}
.language {
  width: 130px;
  height: 45px;
  position: absolute;
  right: 10px;
  top: 3px;
  display: flex;
  align-items: center;
}
.language > img {
  width: 20px;
  height: 20px;

}
.languageChoose {
  width: 80px;
  height: 25px;
  position: absolute;
  right: 20px;
  display: flex;
  align-items: center;
}
/*语言选择下拉菜单*/
.languageSelect {
  width: 200px;
  background: #2E313C;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  box-shadow: 0px 0px 20px rgb(0, 0, 0);
  position: absolute;
  top: 45px;
  right: 20px;
  padding: 10px;
}
/*语言选择*/
.nationLanguage {
  width: 100%;
}
.country {
  width: 100%;
  height: 25px;
  margin-top: 10px;
  cursor: pointer;
  display: flex;
}
.nationFlag {
  width: 20px;
  height: 20px;
  background: #2D1E2B;
  border-radius: 20px;
  line-height: 20px;
}
.nationFlag img {
  width: 20px;
  height: 20px;
  background-size: 100%;
  border-radius: 20px;
}
</style>
