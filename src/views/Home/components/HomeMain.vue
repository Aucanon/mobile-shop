<template>
  <van-pull-refresh
    class="home-main"
    v-model="refreshing"
    @refresh="onRefresh"
  >
    <van-swipe
      class="my-swipe"
      :autoplay="3000"
      indicator-color="white"
    >
      <van-swipe-item
        v-for="(item, index) in swipeData"
        :key="index"
      >
        <img :src="item.img">
      </van-swipe-item>
    </van-swipe>

    <van-grid>
      <van-grid-item
        v-for="(item, index) in menuData"
        :key="index"
        :icon="item.img"
        :text="item.info[0].value"
      />
    </van-grid>

    <van-notice-bar
      left-icon="volume-o"
      :scrollable="false"
    >
      <span>热点咨询公告：</span>
      <van-swipe
        vertical
        class="notice-swipe"
        :autoplay="3000"
        :touchable="false"
        :show-indicators="false"
      >
        <van-swipe-item
          v-for="(item, index) in newsData"
          :key="index"
        >
        {{ item.chiild[0].val }}
        </van-swipe-item>
      </van-swipe>
    </van-notice-bar>

    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="initProductsData"
    >
      <product-list :products-data="productsData" />
    </van-list>
  </van-pull-refresh>
</template>

<script setup>
import ProductList from '@/components/ProductList.vue'
import { ref, computed } from 'vue'
import { getDefaultData } from '@/api/index'
import { getProductsData } from '@/api/product'

// ---------------

// 声明响应式数据 存储数据
const indexData = ref({})

// 首页数据初始化
const initIndexData = async () => {
  const { data } = await getDefaultData()
  if (data.status !== 200) { return }
  indexData.value = data.data
  refreshing.value = false
}
initIndexData()

// 通过计算属性保存使用的数据
// 1.轮播图数据
const swipeData = computed(() => indexData.value.swiperBg?.default.imgList.list)
// 2.菜单列表
const menuData = computed(() => indexData.value.menus?.default.imgList.list)
// 3.公告
const newsData = computed(() => indexData.value.news?.default.newList.list)

// -----------------------
const loading = ref(false)
const finished = ref(false)

const productsData = ref([])
let page = 1
const limit = 4

const initProductsData = async () => {
  const { data } = await getProductsData({
    limit,
    page
  })
  if (data.status !== 200) { return }
  productsData.value.push(...data.data)
  // 更改加载状态
  loading.value = false
  // 判断是否加载全部数据
  if (data.data.length < limit) {
    finished.value = true
  }
  page++
}
// 使用 List 组件自动根据触底进行首屏加载

// -----------------------
const refreshing = ref(false)

const onRefresh = () => {
  indexData.value = {}
  productsData.value = []
  page = 1
  loading.value = false
  finished.value = false
  initIndexData()
  initProductsData()
}

</script>

<style lang="scss" scoped>

  .home-main {
    .my-swipe {
      img {
        width: 100%;
        height: 170px;
      }
    }
    :deep(.van-notice-bar__content) {
      display: flex;
      align-items: center;
    }
    .notice-swipe {
      height: 40px;
      line-height: 40px;
    }
  }

</style>
