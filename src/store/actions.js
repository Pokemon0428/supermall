import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutations-types'

export default {
  addCart(context, payLoad) {
    return new Promise((resolve, reject) => {
      // 查找之前数组是否有该商品②
      let oldProduct = context.state.cartList.find(item => item.iid === payLoad.iid)

      // 判断oldProduct
      if (oldProduct) {
        // oldProduct.count += 1
        context.commit(ADD_COUNTER, oldProduct)
        resolve('商品数量加一')
      } else {
        payLoad.count = 1
        payLoad.checked = true
        // context.state.cartList.push(payLoad)
        context.commit(ADD_TO_CART, payLoad)
        resolve('添加新的商品')
      }
    })
  }
}