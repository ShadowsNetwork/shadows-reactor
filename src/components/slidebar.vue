<template>
  <div class="slidebar" @mouseenter="onMouseOver" @mouseleave="onMouseOut">
    <el-col :span="3">
      <el-menu
          default-active="4"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          :collapse="isCollapse"
          background-color="#22232C"
          text-color="#fff"
          router>
<!--        <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">-->
          <img src="../assets/img/logo.png"  style="width: 20px;height:20px;position: relative;top: 20px;left: 20px" @click="toHome">
          <img src="../assets/img/logotext.png" v-show="!isCollapse" @click="toHome"  style="width: 90px;height: 15px;position: absolute;top: 22px;left: 50px"/>
<!--        </el-radio-group>-->
        <el-menu-item index="myself">
            <i class="el-icon-user"></i>
            <span slot="title">{{ $t('slidebar.Personal') }}</span>
        </el-menu-item>
        <el-menu-item index="compose">
          <i class="el-icon-connection"></i>
          <span slot="title">{{ $t('slidebar.synthesis') }}</span>
        </el-menu-item>
        <el-menu-item index="exchange" >
          <i class="el-icon-set-up"></i>
          <span slot="title">{{ $t('slidebar.transaction') }}</span>
        </el-menu-item><br><br>
        <el-menu-item index="destory">
          <i class="el-icon-delete"></i>
          <span slot="title">{{ $t('slidebar.destroy') }}</span>
        </el-menu-item>
        <el-menu-item index="reward">
          <i class="el-icon-present"></i>
          <span slot="title">{{ $t('slidebar.reward') }}</span>
        </el-menu-item>
      </el-menu>
    </el-col>
  </div>
</template>

<script>
export default {
name: "slidebar",
  data() {
    return {
      isCollapse: true,
      isshow:false,
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    // 鼠标移入移出菜单栏
    onMouseOver() {
      this.isCollapse = false;
    },
    onMouseOut() {
      this.isCollapse = true;
    },
    toHome() {
      this.$router.replace('/homepageone')
    }
  }
}
</script>

<style scoped>
.slidebar .el-menu-item {
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
  border-bottom-left-radius: 30px;
}
.slidebar .el-menu-item:nth-of-type(1) {
  margin-top: 30px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 150px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: 0;
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
  border-bottom-left-radius: 30px;
}
.el-menu--collapse {
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
  border-bottom-left-radius: 30px;
  border: 0;
}
</style>