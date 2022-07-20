/* eslint-disable class-methods-use-this */
import _axios, { get, put, _delete } from '@/lin/plugin/axios'

// 我们通过 class 这样的语法糖使模型这个概念更加具象化，其优点：耦合性低、可维护性。
class Market {
  // constructor() {}

  // 类中的方法可以代表一个用户行为
  async add(data) {
    return _axios({
      method: 'post',
      url: 'v1/market/add',
      data,
    })
  }

  // 在这里通过 async await 语法糖让代码同步执行
  // 1. await 一定要搭配 async 来使用
  // 2. await 后面跟的是一个 Promise 对象
  async info(id) {
    const res = await get(`v1/market/info?market_id=${id}`)
    return res
  }

  async edit(data) {
    return _axios({
      method: 'post',
      url: 'v1/market/edit',
      data,
    })
  }

  async delete(id) {
    const res = await _delete(`v1/market/setStatus?market_id=${id}&status=0`)
    return res
  }

  async lists(data) {
    return _axios({
      method: 'get',
      url: 'v1/market/lists',
      market: true,
      params : data
    })
  }

  async setStatus(marketId, status) {
    const res = await get(`v1/market/setStatus?market_id=${marketId}&status=${status}`)
    return res
  }
}


export default new Market()
