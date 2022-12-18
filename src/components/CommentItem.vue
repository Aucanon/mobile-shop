<template>
  <van-cell class="comment-item">
    <!-- 用户信息 -->
    <div class="user-info">
      <img :src="reply?.avatar">
      <span class="nickname" v-text="reply.nickname"></span>
      <van-rate v-model="star" readonly size="12" />
    </div>
    <!-- 商品信息与时间 -->
    <p class="time">{{ reply?.add_time }} {{ reply?.sku }}</p>
    <!-- 评价内容 -->
    <p class="comment-content" v-text="reply?.comment"></p>
    <!-- 图片列表 -->
    <ul class="pic">
      <li v-for="(item, index) in pics" :key="index"><img :src="item"></li>
    </ul>
  </van-cell>
</template>

<script setup>
import { computed } from '@vue/reactivity';
const { reply } = defineProps({
  reply: {
    type: Object,
    required: true
  }
})

const star = computed(() => Number(reply?.star))
const pics = computed(() => reply?.pics)

</script>

<style lang="scss" scoped>
.comment-item {
  padding: 10px 15px 20px;

  .user-info {
    display: flex;
    align-items: center;
    font-size: 13px;
    padding: 7px 0;
    img {
      width: 28px;
      height: 28px;
    }
    .nickname {
      padding: 0 10px 0 6px
    };
  }
  .time {
    font-size: 12px;
    color: #82848f;
    padding: 5px 0;
  }
  .comment-content {
    font-size: 13px;
    margin-bottom: 10px;
  }
  .pic {
    li {
      float: left;
      padding-right: 7px;
      img {
        width: 78px;
        height: 78px;
      }
    }
  }
}
</style>