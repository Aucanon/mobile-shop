<template>
  <van-nav-bar
    @click-left="router.go(-1)"
    title="订单详情"
    left-arrow
  />
  <van-cell-group>
    <van-cell>
      <div class="status">
        <div class="title">
          发货状态：{{ orderStatus?._title }}
        </div>
        <div
          class="msg"
          v-text="orderStatus?._msg"
        />
        <div class="pay-type">
          支付方式：{{ orderStatus?._payType }}
        </div>
      </div>
    </van-cell>
    <van-cell title="地址信息">
      <div class="user-info">
        <span
          class="user-name"
          v-text="name"
        />
        <span
          class="tel"
          v-text="phone"
        />
        <p
          class="address"
          v-text="address"
        />
      </div>
    </van-cell>
    <van-cell>
      <div class="order-item">
        <div class="link">
          <img :src="image">
          <div class="info">
            <p
              class="title"
              v-text="title"
            />
            <p class="detail">
              <span class="price">￥{{ price }}</span>
              <span class="count">x{{ count }}</span>
            </p>
          </div>
        </div>
        <div class="pay-price">
          实付款：￥{{ payPrice }}
        </div>
      </div>
    </van-cell>
    <van-cell>
      <p class="add-time">
        订单创建时间： {{ addTime }}
      </p>
      <p class="pay-time">
        订单支付时间： {{ payTime }}
      </p>
    </van-cell>
  </van-cell-group>
</template>

<script setup>
import { NavBar as VanNavBar, Cell as VanCell, CellGroup as VanCellGroup } from 'vant'
import { getOrderInfo } from '@/api/order'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const { orderId } = defineProps({
  orderId: {
    type: String,
    required: true
  }
})

const orderInfo = ref({})

const orderStatus = computed(() => orderInfo.value?._status)
const name = computed(() => orderInfo.value?.real_name)
const phone = computed(() => orderInfo.value?.user_phone)
const address = computed(() => orderInfo.value?.user_address)
const itemInfo = computed(() => orderInfo.value?.cartInfo[0]?.productInfo)
const addTime = computed(() => orderInfo.value?._add_time)
const payTime = computed(() => orderInfo.value?._pay_time)
const payPrice = computed(() => orderInfo.value?.pay_price)
const price = computed(() => orderInfo.value?.total_price)
const count = computed(() => orderInfo.value?.total_num)
const title = computed(() => itemInfo.value?.store_name)
const image = computed(() => itemInfo.value?.attrInfo?.image)

const initOrderInfo = async () => {
  const { data } = await getOrderInfo(orderId)
  if (data.status !== 200) { return }
  orderInfo.value = data.data
}
initOrderInfo()

</script>

<style lang="scss" scoped>
.order-item {
    padding: 10px 20px;
    background-color: #fff;
    margin-bottom: 1px;
    box-sizing: border-box;

    .link {
      display: flex;
      width: 100%;
      img {
        height: 88px;
        width: 88px;
        align-self: center;
      }

      .info {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        flex: 1;
        .detail {
          .price {
            font-size: 16px;
          }
        }
      }
    }
    .pay-price {
      font-size: 16px;
      font-weight: 700;
      color: #f2270c;
      direction: rtl;
    }
    .pay-price {
      float: right;
    }
  }
</style>
