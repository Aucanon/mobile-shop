<template>
  <div
    class="order-item"
    @click="handleRouter"
  >
    <div class="link">
      <img :src="itemInfo.attrInfo.image">
      <div class="info">
        <p
          class="title"
          v-text="itemInfo.store_name"
        />
        <p class="detail">
          <span class="price">￥{{ itemData.total_price }}</span>
          <span class="count">x{{ itemData.total_num }}</span>
        </p>
      </div>
    </div>
    <div class="pay-price">
      实付款：￥{{ itemData.pay_price }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const { itemData } = defineProps({
  itemData: {
    type: Object,
    required: true
  }
})

const itemInfo = computed(() => itemData.cartInfo[0].productInfo)

const handleRouter = () => {
  router.push({
    name: 'order-detail',
    params: {
      orderId: itemData.order_id
    }
  })
}

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
  }
</style>
