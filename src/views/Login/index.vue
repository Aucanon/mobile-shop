<template>
  <van-form @submit="submitHandle">
    <img
      class="logo"
      :src="state.logoUrl"
    >
    <van-cell-group inset>
      <van-field
        v-model="state.username"
        clearable
        name="用户名"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-if="state.isPassword"
        v-model="state.password"
        clearable
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <van-field
        v-else
        v-model="state.captcha"
        center
        clearable
        name="短信验证码"
        label="验证码"
        placeholder="短信验证码"
      >
        <template #button>
          <van-button
            size="small"
            type="primary"
            @click="sendCaptcha"
            :disabled="state.isSend"
          >
            {{ state.currentText }}
          </van-button>
        </template>
      </van-field>
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button
        round
        block
        type="primary"
        native-type="submit"
      >
        登录
      </van-button>
      <span
        class="changeBtn"
        @click="changeMode"
        v-text="state.changeText"
      />
    </div>
  </van-form>
</template>

<script setup>
import { Button as VanButton, Form as VanForm, CellGroup as VanCellGroup, Field as VanField } from 'vant'
import { reactive, computed } from 'vue'
import { getLogo } from '@/api/index'
import { getVerifyCode, getVerify, loginByPassword, loginByCaptcha } from '@/api/user'
import { Toast } from 'vant'
import { useCountDown } from '@vant/use'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
const store = useStore()
const router = useRouter()
const route = useRoute()

const state = reactive({
  loginMode: 'password',
  username: '17201234567',
  password: 'qwer1234',
  captcha: '',
  isPassword: computed(() => state.loginMode === 'password'),
  changeText: computed(() => state.isPassword ? '快速登录' : '密码登录'),
  // 设置发送状态
  isSend: false,
  // 倒计时实例
  countDown: null,
  // 根据状态设置要显示的内容
  currentText: computed(() => state.isSend ? state.countDown.seconds : '发送验证码'),
  logoUrl: ''
})

// 头像处理
const loadLogo = async () => {
  const { data } = await getLogo()
  state.logoUrl = data.data.logo_url
}
loadLogo()

// 登录处理
const submitHandle = async () => {
  const username = state.username.trim()
  if (username === '') { return Toast('请检查用户名') }
  let data = ''
  if (state.isPassword) {
    const password = state.password.trim()
    if (password === '') { return Toast('请检查密码') }
    ({ data } = await loginByPassword({
      account: username,
      password
    }))
  } else {
    const captcha = state.captcha.trim()
    if (captcha === '') { return Toast('请检查验证码') }
    ({ data } = await loginByCaptcha({
      phone: username,
      captcha
    }))
  }
  if (data.status !== 200) { return Toast('用户名或密码错误') }
  store.commit('user/setUser', data.data.token)
  router.push(route.query.redirect ?? '/user')
}

// 验证码切换
const changeMode = () => {
  state.loginMode = state.isPassword ? 'captcha' : 'password'
  state.password = ''
  state.captcha = ''
}

// 发送验证码请求
const sendCaptcha = async () => {
  // 手机号规则校验
  if (!/^1\d{10}$/.test(state.username)) {
    return Toast('请检查用户名')
  }
  const { data: v1 } = await getVerifyCode()
  if (v1.status !== 200) { return }
  const { data: v2 } = await getVerify({
    type: 'login',
    phone: state.username,
    key: v1.data.key
  })
  if (v2.status !== 200) { Toast('网络开小差了，请稍后再试') }

  // 验证码发送完毕后，设置倒计时实例
  const countDown = useCountDown({
    time: 60 * 1000,
    onFinish () {
      state.isSend = false
    }
  })
  // 开启倒计时
  countDown.start()
  state.countDown = countDown.current
  // 更改发送状态
  state.isSend = true
}

</script>

<style lang="scss" scoped>
  .van-form {
    display: flex;
    flex-direction: column;
    .logo {
      width: 100%;
      // height: 150px;
      align-self: center;
      margin: 70px 0 10px;
    }
    .changeBtn {
      display: block;
      text-align: center;
      font-size: 14px;
      color: #999;
      margin-top: 10px;
    }
  }

</style>
