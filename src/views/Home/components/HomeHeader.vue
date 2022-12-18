<template>
  <div class="home-nav">
    <img
      src="@/assets/logo.png"
      height="20"
    >
    <div class="search">
      <van-icon
        name="search"
        size="0.5rem"
      />
    </div>
    <van-icon name="wap-nav" />
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

  .home-nav {
    position: fixed;
    display: flex;
    align-items: center;
    width: 100%;
    height: 50px;
    background-color: #fff;
    padding-right: 10px;
    box-sizing: border-box;
    z-index: 1000;

    img {
      padding: 0 10px;
    }

    .search {
      background-color: #f7f7f7;
      width: 100%;
      border-radius: 25px;
      padding-left: 12px;
      margin-right: 10px;
    }
  }

</style>
