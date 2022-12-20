import { changeNum } from '@/api/cart'

const state = {
  cartList: []
}
const getters = {
  // 筛选选中的选项
  checkedItems: (state) => {
    return state.cartList.filter(item => item.checked === true)
  },
  // 计算总价
  totalPrice (state, getters) {
    return getters.checkedItems.reduce((sum, item) => sum + item.count * item.price, 0).toFixed(2)
  },
  // 全选
  checkedAll (state, getters) {
    return state.cartList.length === getters.checkedItems.length
  }
}
const mutations = {
  addToCart (state, payload) {
    state.cartList.push(payload)
  },
  clear (state) {
    state.cartList = []
  },
  checkedChange (state, payload) {
    state.cartList.find(item => item.id === payload.id).checked = payload.checked
  },
  countChange (state, { id, count }) {
    state.cartList.find(item => item.id === id).count = count
  },
  changeAll (state, { checked }) {
    state.cartList.forEach(item => item.checked = checked)
  }
}
const actions = {
  async countChange (context, payload) {
    context.commit('countChange', payload)
    const { data } = await changeNum({
      id: payload.id,
      number: payload.count
    })
    if (data.status !== 200) { }
  }
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
