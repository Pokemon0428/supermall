<template>
  <div id="cart">
    <!-- 导航 -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{Length}})</div>
    </nav-bar>

    <!-- 商品列表 -->
    <cart-list/>

    <!-- 底部总汇 -->
    <cart-button-bar/>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import CartList from './childcomponents/CartList'
  import CartButtonBar from './childcomponents/CartButtonBar'

  import { mapGetters } from 'vuex'
  
  export default {
    name: 'Cart',
    components: {
      NavBar,
      CartList,
      CartButtonBar
    },
    computed: {
      // ...mapGetters(['cartLength', 'cartList'])
      ...mapGetters({
        Length: 'cartLength'
      })
    },
  }

</script>

<style scoped>
  #cart {
    height: 100vh;
  }
  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
    /* font-weight: 700; */
  }
</style>