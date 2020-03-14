import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutations-types'

export default {
  // mutations的唯一目的是修改state中的状态
  // mutations中的每个方法尽可能完成的事件比较单一
  [ADD_COUNTER](state, payLoad) {
    payLoad.count++
  },
  [ADD_TO_CART](state, payLoad) {
    state.cartList.push(payLoad)
  }
}