import request from '@/utils/request'

// 商品列表
export const getProductsData = (params) => request({ method: 'GET', url: '/products', params })

// 根据 ID 获取商品详情数据
export const getProductDetail = (productId) => request({ method: 'GET', url: `/product/detail/${productId}` })

// 获取商品评论数量
export const getCommentCount = (productId) => request({ method: 'GET', url: `/reply/config/${productId}` })

// 根据分类获取评价
export const getCommentByTag = (productId, params) => request({ method: 'GET', url: `/reply/list/${productId}`, params })
