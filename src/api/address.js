import request from '@/utils/request'

// 获取省市区列表信息
export const getCityList = () => request({ method: 'GET', url: '/city_list' })

// 新增或编辑地址
export const addOrEditAddress = (data) => request({ method: 'POST', url: '/address/edit', data })
