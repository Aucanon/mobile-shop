<template>
  <van-nav-bar left-arrow fixed @click-left="router.go(-1)"></van-nav-bar>
  <van-tabs scrollspy color="#fbc546">
    <van-tab title="商品">
      <van-swipe :autoplay="3000" width="375" height="375">
        <van-swipe-item v-for="(item, index) in sliderImage" :key="index">
          <img :src="item">
        </van-swipe-item>
      </van-swipe>

      <van-cell class="productHeader" :border="false">
        <template #title>
          <div class="price">
            <span>￥{{ storeInfo?.price }}</span>
            <van-icon name="share-o" size="20" class="share"></van-icon>
          </div>
          <div class="title" v-text="storeInfo?.store_name"></div>
        </template>
        <template #label>
          <span>原价￥{{ storeInfo?.ot_price }}</span>
          <span>库存：{{ storeInfo?.stock + storeInfo?.unit_name }}</span>
          <span>销量：{{ storeInfo?.fsales }}</span>
        </template>
      </van-cell>

      <van-cell is-link class="sku_window" @click="handlePopup">
        <template #title>
          <span>已选择：{{ sku }}</span>
        </template>
      </van-cell>
      <van-popup v-model:show="specState.show" position="bottom" class="popup" :round="true">
        <van-cell-group>
          <van-cell class="popup-header">
            <img :src="specDetails?.image">
            <div class="info">
              <p class="title" v-text="storeInfo?.store_name"></p>
              <p class="price">￥{{ specDetails?.price }}</p>
              <p class="stock">库存：{{ specDetails?.stock }}</p>
            </div>
          </van-cell>
          <van-cell class="spec" v-for="(attr, specIndex) in productAttr" :key="attr.id">
            <p v-text="attr.attr_name"></p>
            <span
            @click="handleTagChange(tag, specIndex)"
            :class="{ active: specState.spec[specIndex] === tag }"
            class="tag"
            v-for="tag in attr.attr_values"
            :key="tag.id"
            v-text="tag">
          </span>
          </van-cell>
          <van-cell title="数量">
            <van-stepper v-model="specState.buyCount" :max="specDetails?.stock" />
          </van-cell>
        </van-cell-group>
      </van-popup>
    </van-tab>
    <van-tab title="评价" class="comment">
      <van-cell-group>
        <van-cell
        is-link
        :title="replyInfo"
        :value="replyRate"
        :to="{
          name: 'comment',
          params: {
            productId: storeInfo?.id
          }
        }">
      </van-cell>
        <comment-item :reply="reply" v-if="replyCount !== 0"></comment-item>
      </van-cell-group>
    </van-tab>
    <van-tab title="推荐">
      <van-cell class="recommend">
        <p class="title">推荐商品</p>
        <van-grid :border="false" :colum-num="3">
          <van-grid-item v-for="item in goodsList" :key="item.id" :to="{
            name: 'product',
            params: {
              productId: item.id
            }
          }">
            <van-image :src="item.image"></van-image>
            <p v-text="item.store_name"></p>
            <span>￥{{ item.price }}</span>
          </van-grid-item>
        </van-grid>
      </van-cell>
    </van-tab>
    <van-tab title="详情">
      <div class="description" v-html="storeInfo?.description"></div>
    </van-tab>
  </van-tabs>
</template>

<script setup>
import CommentItem from '@/components/CommentItem.vue'
import { ref, computed, reactive } from 'vue'
import { getProductDetail } from '@/api/product'
import { useRouter, onBeforeRouteUpdate } from 'vue-router'
const router = useRouter()

const { productId } = defineProps({
  productId: {
    type: String,
    required: true
  }
})

// 存储商品详情所有数据
const productDeail = ref({})

// 请求商品详情数据
const initProductDetail = async () => {
  const { data } = await getProductDetail(productId)
  if (data.status !== 200) {
    router.push({
      name: 'home'
    })
    return
  }
  productDeail.value = data.data
  // 初始化规格的初始化数据
  initSpec(data.data.productAttr)
}
initProductDetail()

// 商品数据处理
const storeInfo = computed(() => productDeail.value.storeInfo)
const sliderImage = computed(() => storeInfo.value?.slider_image)
// 评价数据信息
const replyCount = computed(() => productDeail.value.replyCount || 0)
const replyInfo = computed(() => `用户评价（${ replyCount.value }）`)
const replyChange = computed(() => productDeail.value.replyChance || 0)
const replyRate = computed(() => replyChange.value + '%好评率')
const reply = computed(() => productDeail.value.reply)

// 推荐商品信息
const goodsList = computed(() => productDeail.value.good_list)

// 通过导航守卫监听路由变化并请求商品数据
onBeforeRouteUpdate((to) => {
  // 清除旧的数据
  productDeail.value = {}
  // 回到顶部
  document.body.scrollTop = 0
  document.documentElement.scrollTop = 0
  // 重新根据最新 ID 请求商品数据
  initProductDetail(to.params.productId)
})

// 规格弹出层处理
const value = ref(3)
const productAttr = computed(() => productDeail.value.productAttr)
const productValue = computed(() => productDeail.value.productValue)
const specState = reactive({
  show: false,
  spec: [], // 选中的规格数据
  buyCount: 0
})

// sku 数据处理
const sku = computed(() => specState.spec.toString())
// 根据 sku 获取对应商品信息
const specDetails = computed(() => productValue.value?.[sku.value])

const handlePopup = () => {
  specState.show = !specState.show
}
// 初始化规格默认选择数据
const initSpec = (spec) => {
  specState.spec = spec.map(item => item.attr_values[0])
}
// 规格切换处理
const handleTagChange = (tag, specIndex) => {
  specState.spec[specIndex] = tag
}

</script>

<style lang="scss" scoped>

.van-nav-bar {
  position: fixed !important;
}

.van-tabs {
  background-color: #f2f2f2;
  :deep(.van-tabs__wrap) {
    width: 80%;
    position: fixed;
    top: 0;
    z-index: 999;
    left: 50%;
    transform: translate(-50%);
  }
  :deep(.van-tabs__content) {
    padding-top: 46px;
  }
  .van-swipe-item {
    img {
      width: 375px;
      height: 375px;
    }
  }
  :deep(.productHeader) {
    margin-bottom: 10px;
  }
  .van-cell__title {
    .price {
      span {
        color: #f2270c;
        font-size: 24px;
        font-weight: 700;
      }
      .share {
        float: right;
      }
    }
    .title {
      font-size: 16px;
      font-weight: 700;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      overflow: hidden;
      -webkit-box-orient: vertical;
      margin: 5px 0 10px;
    }
  }
  :deep(.van-cell__label) {
    display: flex;
    justify-content: space-between;
  }
  .sku_window {
    margin-bottom: 10px;
  }

  .comment {
    margin-bottom: 10px;
  }
  :deep(.recommend) {
    margin-bottom: 10px;
    .title {
      font-size: 16px;
      font-weight: 700;
      padding: 5px 0;
    }
    .van-grid-item__content {
      padding: 0;
    }
    .van-grid-item {
      img {
        width: 107px;
        height: 107px;
      }
      p {
        padding: 0 3px;
        font-size: 14px;
        font-weight: 700;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 2;
      }
      span {
        color: #f2270c;
        font-size: 12px;
        font-weight: 700;
        align-self: flex-start;
      }
    }
  }
  .description {
    width: 100%;
    :deep(img) {
      width: 100%;
    }
  }
  :deep(.van-popup) {
    // border-radius: 10px 10px 0 0;
    max-height: 70%;
    margin-bottom: 50px;
    .popup-header {
      .van-cell__value {
        display: flex;
        img {
          width: 75px;
          height: 75px;
          align-self: center;
        }
        .info {
          padding: 10px;
          .title {
            font-size: 16px;
            font-weight: 700;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            -webkit-line-clamp: 1;
            margin-bottom: 10px;
          }
          .price {
            font-size: 16px;
            color: #f2270c;
          }
          .stock {
            font-size: 12px;
            color: #999;
          }
        }
      }
    }
    .spec {
      p {
        margin-bottom: 5px;
      }
      .tag {
        display: inline-block;
        min-width: 25px;
        padding: 0 12px;
        border: 1px solid #ccc;
        border-radius: 20px;
        text-align: center;
        background-color: #f2f2f2;
        margin-right: 8px;
      }
      .tag.active {
        border-color: #f2270c;
        color: #f2270c;
        background-color: #fcedeb;
      }
    }
  }
}

</style>