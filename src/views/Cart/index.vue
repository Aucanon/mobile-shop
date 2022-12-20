<template>
  <van-nav-bar
    @click-left="router.go(-1)"
    title="购物车"
    left-arrow
  />

  <div
    v-if="hasItem"
    class="cart-list"
  >
    <cart-item
      v-for="item in cartList"
      :key="item.id"
      :item-data="item"
    />
  </div>
  <van-empty
    v-else
    description="购物车空空如也..."
  />

  <van-submit-bar
    :price="store.getters['cart/totalPrice'] * 100"
    button-text="去结算"
    @submit="onSubmit"
  >
    <van-checkbox
      v-model="checkedAll"
      checked-color="#ee0a24"
    >
      全选
    </van-checkbox>
  </van-submit-bar>

  <layout-footer />
</template>

<script setup>
import {
  NavBar as VanNavBar,
  Empty as VanEmpty,
  SubmitBar as VanSubmitBar,
  Checkbox as VanCheckbox
} from 'vant'
import LayoutFooter from '@/components/LayoutFooter.vue'
import { useRouter } from 'vue-router'
import { computed, nextTick } from 'vue'
import { getCartList } from '@/api/cart'
import CartItem from './components/CartItem.vue'
import { useStore } from 'vuex'
const router = useRouter()
const store = useStore()

const cartList = computed(() => store.state.cart.cartList)
const hasItem = computed(() => cartList.value.length)
const checkedAll = computed({
  get: () => store.getters['cart/checkedAll'],
  set (newStatus) {
    store.commit('cart/changeAll', { checked: newStatus })
  }
})

// 初始化购物车数据
const initCartList = async () => {
  const { data } = await getCartList()
  if (data.status !== 200) { return }
  // 请求到新数据后先将原数据清空
  store.commit('cart/clear')
  await nextTick()
  // 数据处理 将处理后需要的数据存储
  data.data.valid.forEach(item => {
    store.commit('cart/addToCart', {
      id: item.id,
      checked: true,
      count: item.cart_num,
      image: item.productInfo.image,
      title: item.productInfo.store_name,
      price: item.truePrice,
      stock: item.trueStock,
      productId: item.product_id
    })
  })
}
initCartList()

const onSubmit = () => {
  router.push({
    name: 'order-confirm',
    // cartId 指的是要结算的所有 sku 的集合，以逗号连接后传递即可
    params: {
      cartId: store.getters['cart/checkedItems'].map(item => item.id).toString()
    }
  })
}

</script>

<style lang="scss" scoped>

.van-nav-bar {
  position: fixed !important;
  width: 100%;
  top: 0;
}

.cart-list {
  margin: 50px 0 100px;
  background-color: #f2f2f2;
}

.van-submit-bar {
  bottom: 50px;
}

.van-empty {
  margin: 150px 0;
}

</style>
