<template>
  <div>
    <slidebar></slidebar>
    <div class="myNameHome" v-show="!home">
      <img src="../../assets/img/connect.png" style=" width:20px;height:20px;position: relative;left: 15px"/>
      <img src="../../assets/img/moneyconnect.png" style="width: 60px;margin-left: 40px"/>
    </div>
    <div class="myName" v-show="home">
      <div class="myHead"></div>
      <span style="color: white;margin-left: 20px">{{name | ellipsis}}</span>
    </div>
    <div class="language">
      <img src="../../assets/img/language.png"/>
      <div class="languageChoose">
        <span style="color: white;font-size: 15px">中/CN</span>
        <div style="width: 25px;height: 25px;background: rgba(46, 49, 60, 1);margin-left: 13px">
          <img src="../../assets/img/down.png" style="width: 15px;height: 10px;margin-right: 4px"/>
        </div>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
import Slidebar from "@/components/slidebar";
export default {
  name: "home",
  data() {
    return {
      home: true,
      name: '0xDE68943fe857424824B66bb33fb0765cADDd06a7'
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
    console.log(this.$route)
  }
}
</script>

<style scoped>
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
  height: 25px;
  position: absolute;
  right: 10px;
  top: 13px;
  display: flex;
  align-items: center;
}
.language img {
  width: 20px;
  height: 20px;
  margin-left: 5px;
}
.languageChoose {
  width: 80px;
  height: 25px;
  position: absolute;
  right: 20px;
  display: flex;
  align-items: center;
}
</style>