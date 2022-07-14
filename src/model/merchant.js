/* eslint-disable class-methods-use-this */
import _axios, { get, put, _delete } from '@/lin/plugin/axios'

// 我们通过 class 这样的语法糖使模型这个概念更加具象化，其优点：耦合性低、可维护性。
class Merchant {
  // constructor() {}

  // 类中的方法可以代表一个用户行为
  async createMerchant(data) {
    return _axios({
      method: 'post',
      url: 'v1/merchant/add',
      data,
    })
  }

  // 在这里通过 async await 语法糖让代码同步执行
  // 1. await 一定要搭配 async 来使用
  // 2. await 后面跟的是一个 Promise 对象
  async getMerchant(id) {
    const res = await get(`v1/merchant/info?merchant_id=${id}`)
    return res
  }

  async editMerchant(id, info) {
    const res = await put(`v1/merchant/edit?merchant_id=${id}`, info)
    return res
  }

  async deleteMerchant(id) {
    const res = await _delete(`v1/merchant/setStatus?merchant_id=${id}&status=0`)
    return res
  }

  async getMerchantList(data) {
    return _axios({
      method: 'get',
      url: 'v1/merchant/lists',
      Merchant: true,
      params : data
    })
  }

  async setStatus(merchatId, status) {
    const res = await get(`v1/merchant/setStatus?merchant_id=${id}&status=${status}`)
    return res
  }
}

export function getMerchantList(data){
  return _axios({
    url: 'v1/merchant/lists',
    method: 'get',
    data,
  })
}

export default new Merchant()
