<template>
  <div class="cart-item">
    <van-checkbox
      v-model="itemChecked"
      checked-color="#ee0a24"
    />
    <div
      class="link"
      @click="handleRouter"
    >
      <img :src="itemData.image">
      <div class="info">
        <p
          class="title"
          v-text="itemData.title"
        />
        <p class="detail">
          <span class="price">￥{{ itemData.price }}</span>
          <van-stepper
            v-model="itemCount"
            @click.stop
            :max="itemData.stock"
            button-size="26px"
          />
        </p>
        <p class="del">
          <span>删除</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Checkbox as VanCheckbox,
  Stepper as VanStepper
} from 'vant'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useStore } from 'vuex'
const router = useRouter()
const store = useStore()

const { itemData } = defineProps({
  itemData: {
    type: Object,
    required: true
  }
})

// 通过计算属性分别处理 v-modle 的获取与设置
const itemChecked = computed({
  get: () => itemData.checked,
  set: (newChecked) => {
    store.commit('cart/checkedChange', { checked: newChecked, id: itemData.id })
  }
})

const itemCount = computed({
  get: () => itemData.count,
  set: (newCount) => {
    store.dispatch('cart/countChange', { count: newCount, id: itemData.id })
  }
})

const handleRouter = () => {
  router.push({
    name: 'product',
    params: {
      productId: itemData.productId
    }
  })
}

</script>

<style lang="scss" scoped>
  .cart-item {
    padding: 10px 20px;
    display: flex;
    background-color: #fff;
    margin-bottom: 1px;
    width: 100%;
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
        font-size: 14px;
        flex: 1;
        .title {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          -webkit-line-clamp: 1;
          margin: 5px 0 15px;
        }
        .detail {
          margin-bottom: 10px;
          .price {
            font-size: 16px;
            color: #f2270c;
          }
          .van-stepper {
            float: right;
          }
        }
        .del {
          direction: rtl;
        }
      }
    }
  }
</style>
