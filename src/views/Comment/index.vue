<template>
  <van-nav-bar left-arrow fixed @click-left="router.go(-1)" title="评论"></van-nav-bar>
  <van-cell-group class="comment">
    <van-cell title="商品评价" :value="`好评率：${ replyChance }%`"></van-cell>
    <van-cell class="tags">
      <van-button @click="tagHandle('0')" :class="{ active: state.isSum }"  size="small">全部({{ sumCount }})</van-button>
      <van-button @click="tagHandle('1')" :class="{ active: state.isGood }" size="small">好评({{ goodCount }})</van-button>
      <van-button @click="tagHandle('2')" :class="{ active: state.isIn }" size="small">中评({{ inCount }})</van-button>
      <van-button @click="tagHandle('3')" :class="{ active: state.isPoor }" size="small">差评({{ poorCount }})</van-button>
    </van-cell>
    <comment-item v-for="item in state.commentList" :key="item.id" :reply="item"></comment-item>
    <van-empty v-if="!hasComment" description="暂时没有评论..." />
  </van-cell-group>
</template>

<script setup>
import { getCommentCount, getCommentByTag } from '@/api/product'
import { reactive, computed } from 'vue'
import CommentItem from '@/components/CommentItem.vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const { productId } = defineProps({
  productId: {
    type: String,
    required: true
  }
})

// 存储评论数据
const state = reactive({
  // 个数信息
  commentCounts: {},
  // 存储评价信息
  commentList: [],
  // 控制显示品论状态
  active: '0',
  isSum: computed(() => state.active === '0'),
  isGood: computed(() => state.active === '1'),
  isIn: computed(() => state.active === '2'),
  isPoor: computed(() => state.active === '3'),
})
// 通过计算属性处理不同类别评论个数
const goodCount = computed(() => state.commentCounts?.good_count || 0)
const poorCount = computed(() => state.commentCounts?.poor_count || 0)
const inCount = computed(() => state.commentCounts?.in_count || 0)
const sumCount = computed(() => state.commentCounts?.sum_count || 0)
const replyChance = computed(() => state.commentCounts?.reply_chance || 100)

// 判断是否存在评论
const hasComment = computed(() => state.commentList.length || 0)

// 请求商品信息
async function initReplyData () {
  const { data } = await getCommentCount(productId)
  if (data.status !== 200) { return }
  state.commentCounts = data.data
}
initReplyData()

// 请求分类评价
async function initCommentByTag (type) {
  const { data } = await getCommentByTag(productId, { type })
  if (data.status !== 200) { return }
  state.commentList = data.data
}
/*
* 0 - 全部
* 1 - 好评
* 2 - 中评
* 3 - 差评
*/
initCommentByTag('0')

function tagHandle (tagKey) {
  state.active = tagKey
  // 发送新类型的评价请求
  initCommentByTag(tagKey)
}

</script>

<style lang="scss" scoped>

  .tags {
    .van-button {
      border-radius: 15px;
      margin-right: 10px;
    }
    .active {
      background-color: #fbc546;
    }
  }

</style>