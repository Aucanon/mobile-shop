<template>
  <div class="container">
    <div class="header">
      <img :src="userAvatar">
      <div class="user-info">
        <div
          class="user-name"
          v-text="username"
        />
        <div
          class="user-id"
          v-text="userId"
        />
      </div>
      <van-icon name="setting" />
    </div>
    <van-cell-group
      inset
      class="user-detail"
    >
      <van-cell>
        <van-grid :border="false">
          <van-grid-item :text="collectCount">
            <template #icon>
              收藏
            </template>
          </van-grid-item>
          <van-grid-item :text="integral">
            <template #icon>
              积分
            </template>
          </van-grid-item>
          <van-grid-item :text="couponCount">
            <template #icon>
              优惠券
            </template>
          </van-grid-item>
          <van-grid-item :text="nowMoney">
            <template #icon>
              余额
            </template>
          </van-grid-item>
        </van-grid>
      </van-cell>
    </van-cell-group>
    <van-cell-group inset>
      <van-cell
        title="订单中心"
        value="查看全部"
        is-link
        to="/order"
      />
      <van-grid
        column-num="5"
        :border="false"
      >
        <van-grid-item
          icon="bill-o"
          text="待付款"
        />
        <van-grid-item
          icon="tosend"
          text="待发货"
        />
        <van-grid-item
          icon="logistics"
          text="待收货"
        />
        <van-grid-item
          icon="comment-o"
          text="待评价"
        />
        <van-grid-item
          icon="sign"
          text="已完成"
        />
      </van-grid>
    </van-cell-group>
    <layout-footer />
  </div>
</template>

<script setup>
import {
  Icon as VanIcon,
  CellGroup as VanCellGroup,
  Cell as VanCell,
  Grid as VanGrid,
  GridItem as VanGridItem
} from 'vant'
import LayoutFooter from '@/components/LayoutFooter.vue'
import { getUserInfo } from '@/api/user'
import { ref, computed } from 'vue'

const userData = ref({})
// 用户头像
const userAvatar = computed(() => userData.value?.avatar || 'http://v4.admin.crmeb.net/uploads/attach/2020/11/20201112/f834709c81367d94f5fb67d82a7d34bd.png')
// 昵称
const username = computed(() => userData.value?.nickname || '')
// ID
const userId = computed(() => 'ID:' + (userData.value?.uid || ''))

const collectCount = computed(() => userData.value?.collectCount?.toString() || '')
const integral = computed(() => userData.value?.integral?.toString() || '')
const couponCount = computed(() => userData.value?.couponCount?.toString() || '')
const nowMoney = computed(() => userData.value?.now_money?.toString() || '')

const initUserInfo = async () => {
  const { data } = await getUserInfo()
  if (data.status !== 200) { return }
  userData.value = data.data
}
initUserInfo()

</script>

<style lang="scss" scoped>
  .container {
    height: 600px;
    padding: 15px 0;
    background: radial-gradient(circle at 50% -10%, #fbc546 72%, #f6f7f9 72%) #f6f7f9 no-repeat 0 -300px;

    .header {
      padding: 0 15px 15px;
      display: flex;
      align-items: center;
      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        margin-right: 10px;
      }
      .user-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .user-name {
          font-size: 14px;
          font-weight: 700;
          padding-bottom: 10px;
        }
        .user-id {
          font-size: 10px;
        }
      }
    }
    .van-cell-group {
      margin-bottom: 10px;
    }
    .user-detail {
      .van-cell {
        padding: 0;
        // 避免内容没加载出来的高度塌陷
        min-height: 74px;
      }
    }
  }
</style>
