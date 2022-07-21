/* eslint-disable class-methods-use-this */
import _axios, { get, put, _delete } from '@/lin/plugin/axios'

// 我们通过 class 这样的语法糖使模型这个概念更加具象化，其优点：耦合性低、可维护性。
class Goods {
  // constructor() {}

  // 类中的方法可以代表一个用户行为
  async add(data) {
    return _axios({
      method: 'post',
      url: 'v1/goods/add',
      data,
    })
  }

  // 在这里通过 async await 语法糖让代码同步执行
  // 1. await 一定要搭配 async 来使用
  // 2. await 后面跟的是一个 Promise 对象
  async info(id) {
    const res = await get(`v1/goods/info?goods_id=${id}`)
    return res
  }

  async edit(data) {
    return _axios({
      method: 'post',
      url: 'v1/goods/edit',
      data,
    })
  }

  async delete(id) {
    const res = await _delete(`v1/goods/setStatus?goods_id=${id}&status=0`)
    return res
  }

  async lists(data) {
    return _axios({
      method: 'get',
      url: 'v1/goods/lists',
      goods: true,
      params : data
    })
  }

  async setStatus(goodsId, status) {
    const res = await get(`v1/goods/setStatus?goods_id=${goodsId}&status=${status}`)
    return res
  }
}


export default new Goods()
