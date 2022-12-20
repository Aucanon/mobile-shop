import request from '@/utils/request'

// 加入购物车
export const addToCart = (data) => request({ method: 'POST', url: '/cart/add', data })

// 购物车数据
export const getCartList = (params) => request({ method: 'GET', url: '/cart/list', params })

// 修改商品个数
export const changeNum = (data) => request({ method: 'POST', url: '/cart/num', data })
