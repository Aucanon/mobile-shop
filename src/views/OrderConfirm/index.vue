<template>
  <van-nav-bar
    @click-left="router.go(-1)"
    title="订单确认"
    left-text="返回"
    left-arrow=""
  />
  <div class="container">
    <div
      class="address-card"
      @click="triggerPopup"
    >
      <p class="info">
        <span
          class="username"
          v-text="currentAddress.name"
        />
        <span v-text="currentAddress.tel" />
      </p>
      <p class="detail">
        <span
          class="default"
          v-if="currentAddress.isDefault"
        >[默认]</span>
        <span v-text="currentAddress.address" />
      </p>
    </div>
    <van-popup
      v-model:show="popupStatus"
      position="bottom"
    >
      <van-address-list
        v-model="chosenAddressId"
        :list="addressList"
        :disabled-list="disabledList"
        default-tag-text="默认"
        @add="onAdd"
        @click-item="changeAddress"
      >
        <template
          #top
          v-if="isEmpty"
        >
          <van-empty description="还没有地址哦.." />
        </template>
      </van-address-list>
    </van-popup>

    <div class="product-list">
      <van-cell-group>
        <van-cell :title="cartItemCount" />
      </van-cell-group>
      <van-cell-group>
        <van-cell
          class="product"
          v-for="item in cartInfo"
          :key="item.id"
        >
          <img :src="item.productInfo.image">
          <div class="info">
            <p
              class="title"
              v-text="item.productInfo.store_name"
            />
            <p class="price">
              ￥{{ item.truePrice }}
            </p>
          </div>
          <span class="count">x{{ item.cart_num }}</span>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
  <van-submit-bar
    label="订单总计："
    :price="totalPrice"
    button-text="立即付款"
    @submit="showPayPanel = true"
  />

  <van-action-sheet
    v-model:show="showPayPanel"
    cancel-text="取消"
    close-on-click-action
    title="请选择支付方式"
  >
    <template #default>
      <van-radio-group v-model="paymentMethod">
        <van-cell-group inset>
          <van-cell
            clickable
            title="微信支付"
            label="微信快捷支付"
            @click="paymentMethod = 'wechat'"
            size="large"
            center
          >
            <template #icon>
              <van-icon
                name="http://www.lgstatic.com/lg-app-fed/pay/images/wechat_b787e2f4.png"
                size="30"
                :style="{ marginRight: '12px' }"
              />
            </template>
            <template #right-icon>
              <van-radio
                name="wechat"
                checked-color="#ee0a24"
              />
            </template>
          </van-cell>
          <van-cell
            clickable
            title="支付宝"
            label="支付宝快捷支付"
            @click="paymentMethod = 'alipay'"
            size="large"
            center
          >
            <template #icon>
              <van-icon
                name="http://www.lgstatic.com/lg-app-fed/pay/images/ali_ed78fdae.png"
                size="30"
                :style="{ marginRight: '12px' }"
              />
            </template>
            <template #right-icon>
              <van-radio
                name="alipay"
                checked-color="#ee0a24"
              />
            </template>
          </van-cell>
          <van-cell
            clickable
            title="余额"
            :label="`可用余额为：${yue}`"
            @click="paymentMethod = 'yue'"
            size="large"
            center
          >
            <template #icon>
              <van-icon
                name="gold-coin"
                color="#FF9900"
                size="30"
                :style="{ marginRight: '12px' }"
              />
            </template>
            <template #right-icon>
              <van-radio
                name="yue"
                checked-color="#ee0a24"
              />
            </template>
          </van-cell>
          <van-cell>
            <van-button
              round
              block
              type="danger"
              @click="handlePay"
            >
              去支付
            </van-button>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </template>
  </van-action-sheet>
</template>

<script setup>
import {
  NavBar as VanNavBar,
  Popup as VanPopup,
  AddressList as VanAddressList,
  Empty as VanEmpty,
  CellGroup as VanCellGroup,
  Cell as VanCell,
  SubmitBar as VanSubmitBar,
  ActionSheet as VanActionSheet,
  Icon as VanIcon,
  Radio as VanRadio,
  Button as VanButton,
  RadioGroup as VanRadioGroup
} from 'vant'
import { useRouter } from 'vue-router'
import { getAddressList, confirmOrder, createOrder } from '@/api/order'
import { ref, computed } from 'vue'
import { Toast } from 'vant'
const router = useRouter()

const { cartId } = defineProps({
  cartId: {
    type: String,
    required: true
  }
})

const popupStatus = ref(false)

const chosenAddressId = ref('')

const addressList = ref([])

const currentAddress = ref([])

const orderConfirmData = ref({})

// 处理数据
const cartInfo = computed(() => orderConfirmData.value?.cartInfo)
const cartItemCount = computed(() => `共${cartInfo.value?.length || 0}件`)
const totalPrice = computed(() => (orderConfirmData.value?.priceGroup?.totalPrice || 0) * 100)

const showPayPanel = ref(false)
const paymentMethod = ref('yue')
const yue = computed(() => orderConfirmData.value?.userInfo.now_money)

const convertData = (data) => {
  return data.map(item => {
    const temp = {
      id: item.id,
      name: item.real_name,
      tel: item.phone,
      address: item.province + item.city + item.district + item.detail,
      isDefault: item.is_default
    }
    // 检测当前数据是否为默认数据
    if (item.is_default === 1) {
      // 记录勾选的 ID
      chosenAddressId.value = item.id
      // 记录当前展示数据
      currentAddress.value = temp
    }
    return temp
  })
}

// 请求地址
const initAddressList = async () => {
  const { data } = await getAddressList()
  if (data.status !== 200) { return }
  addressList.value = convertData(data.data)
}
initAddressList()

const triggerPopup = () => { popupStatus.value = true }
const isEmpty = computed(() => addressList.value.length === 0)
const changeAddress = (item) => {
  // 更改弹出层显示状态
  popupStatus.value = false
  // 更新当前显示数据
  currentAddress.value = item
}
const onAdd = () => {
  router.push({
    name: 'address',
    params: {
      cartId
    }
  })
}
const initOrderInfo = async () => {
  const { data } = await confirmOrder({
    cartId,
    new: 0
  })
  if (data.status !== 200) { return }
  orderConfirmData.value = data.data
}
initOrderInfo()

const handlePay = async () => {
  const { data } = await createOrder(orderConfirmData.value?.orderKey, {
    addressId: currentAddress.value.id,
    payType: paymentMethod.value
  })
  if (data.status !== 200) { return }
  console.log(data)
  if (data.msg === '余额支付成功') {
    Toast.success('支付成功！即将跳转...')
    router.push({
      name: 'order',
      params: {
        cartId
      },
      query: {
        orderId: data.data.result.orderId
      }
    })
  } else {
    Toast('余额不足！')
  }
}

</script>

<style lang="scss" scoped>
  .van-nav-bar {
    position: fixed !important;
    width: 100%;
  }
  .container {
    padding: 50px 0;
    .address-card {
      padding: 20px 25px;
      font-size: 16px;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 2px;
        background: repeating-linear-gradient(90deg, #ff6c6c 0, #ff6c6c 20%, transparent 20%, transparent 25%, #0084ff 25%, #0084ff 45%, transparent 45%, transparent 50%);
        background-size: 80px;
      }

      .info {
        span:first-child {
          padding: 20px;
        }
      }
      .detail {
        .default {
          margin-right: 17px;
          background-color: #d6251f;
          color: #fff;
          font-size: 12px;
          padding: 2px 3px;
          border-radius: 3px;
        }
      }
    }

    .product-list {
      :deep(.van-cell__value) {
        display: flex;
        align-items: center;
        img {
          width: 70px;
          height: 70px;
        }
        .info {
          padding-left: 5px;
          .title {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            padding: 0 15px 5px 0;
          }
          .price {
            color: #f2270c;
          }
        }
        .count {
          color: #aaa;
        }
      }
    }
  }

</style>
