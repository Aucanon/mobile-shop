<template>
  <van-nav-bar
    @click-left="router.go(-1)"
    title="订单中心"
    left-arrow
  />
  <div
    v-if="hasItem"
    class="order-list"
  >
    <order-item
      v-for="item in orderList"
      :key="item.id"
      :item-data="item"
    />
  </div>
  <van-empty
    v-else
    description="暂时没有订单..."
  />
</template>

<script setup>
import { NavBar as VanNavBar, Empty as VanEmpty } from 'vant'
import { useRouter } from 'vue-router'
import { getOrderList } from '@/api/order'
import { ref, computed } from 'vue'
import OrderItem from './components/OrderItem.vue'
const router = useRouter()

const orderList = ref([])
const hasItem = computed(() => orderList.value.length)

const initOrderList = async () => {
  const { data } = await getOrderList()
  if (data.status !== 200) { return }
  orderList.value = data.data
}
initOrderList()

</script>

<style lang="scss" scoped>
  .van-nav-bar {
    position: fixed !important;
    width: 100%;
  }
  .order-list {
    padding-top: 46px;
    background-color: #f2f2f2;
  }
</style>
