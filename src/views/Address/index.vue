<template>
  <van-nav-bar
    @click-left="router.go(-1)"
    title="新增收货地址"
    left-text="返回"
    left-arrow=""
  />
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
        v-model="realName"
        name="姓名"
        label="姓名"
        placeholder="姓名"
        :rules="[{ required: true, message: '请填写姓名' }]"
      />
      <van-field
        v-model="phone"
        name="电话"
        label="电话"
        placeholder="收货人手机号"
        :rules="[{ required: true, message: '请填写电话号' }]"
      />
      <van-field
        v-model="fieldValue"
        is-link
        readonly
        label="地区"
        placeholder="请选择所在地区"
        @click="show = true"
      />
      <van-popup
        v-model:show="show"
        round
        position="bottom"
      >
        <van-cascader
          v-model="area"
          title="请选择所在地区"
          :field-names="fidldNames"
          :options="options"
          @close="show = false"
          @finish="onFinish"
        />
      </van-popup>
      <van-field
        v-model="detail"
        name="详细地址"
        label="详细地址"
        placeholder="详细地址"
        :rules="[{ required: true, message: '请填写详细地址' }]"
      />
    </van-cell-group>
    <van-cell-group inset>
      <van-field
        name="switch"
        label="设为默认地址"
        input-align="right"
      >
        <template #input>
          <van-switch
            v-model="isDefault"
            size="20"
          />
        </template>
      </van-field>
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button
        round
        block
        type="primary"
        native-type="submit"
        @click="handleAdd"
      >
        提交
      </van-button>
    </div>
  </van-form>
</template>

<script setup>
import {
  NavBar as VanNavBar,
  Form as VanForm,
  CellGroup as VanCellGroup,
  Field as VanField,
  Popup as VanPopup,
  Cascader as VanCascader,
  Switch as VanSwitch,
  Button as VanButton
} from 'vant'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { getCityList, addOrEditAddress } from '@/api/address'
const router = useRouter()

const { cartId } = defineProps({
  cartId: String
})

const realName = ref('')
const phone = ref('')
const area = ref('')
const detail = ref('')
const isDefault = ref(false)
const show = ref(false)
const fieldValue = ref('')
// 选项列表，children 代表子选项，支持多级嵌套
const options = ref([])

const fidldNames = {
  text: 'n',
  value: 'v',
  children: 'c'
}

let address = {}

// 全部选项选择完毕后，会触发 finish 事件
const onFinish = ({ selectedOptions }) => {
  show.value = false
  fieldValue.value = selectedOptions.map((option) => option.n).join('/')
  address = {
    province: selectedOptions[0].n,
    city: selectedOptions[1].n,
    city_id: selectedOptions[1].v,
    district: selectedOptions[2].n
  }
}

const initCityList = async () => {
  const { data } = await getCityList()
  if (data.status !== 200) { return }
  options.value = processData(data.data)
}
initCityList()

const processData = (data) => {
  data.forEach(item => {
    if (item.c.length === 0) {
      delete item.c
    } else {
      processData(item.c)
    }
  })
  return data
}

const handleAdd = async () => {
  const { data } = await addOrEditAddress({
    // 新增设置 ID 为 0
    id: 0,
    real_name: realName.value,
    phone: phone.value,
    isDefault: isDefault.value,
    detail: detail.value,
    address
  })
  if (data.status !== 200) { return }
  // 检测是否跳转回订单
  if (cartId) {
    router.push({
      name: 'order-confirm',
      params: {
        cartId
      }
    })
  } else {
    router.push('/user')
  }
}

</script>

<style lang="scss" scoped>
  .van-form {
    padding-top: 30px;
    background-color: #f7f7f7;
    .van-cell-group {
      margin-bottom: 10px;
    }
  }
</style>
