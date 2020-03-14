<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick='titleClick' ref="nav"/>
    <scroll class="content" ref="scroll" @scroll='contentScroll' :probe-type='3'>
      <detail-swiper :top-images='topImages'></detail-swiper>
      <detail-base-info :goods='goods'></detail-base-info>
      <detail-shop-info :shop='shop'></detail-shop-info>
      <detail-goods-info :detail-info='detailInfo' @detailImageLoad='detailImageLoad'></detail-goods-info>
      <detail-param-info :param-info='paramInfo' ref="params"></detail-param-info>
      <detail-comment-info :comment-info='commentInfo' ref="comments"></detail-comment-info>
      <goods-list :goods='recommends' ref="recommends"></goods-list>
    </scroll>
    <detail-bottom-bar @addToCart='addToCart'></detail-bottom-bar>
    <back-top @click.native='backClick' v-show='isShowBackTop'></back-top>
    <!-- <toast :message='message' :show='show'/> -->
  </div>
</template>

<script>
  import DetailNavBar from './childcomponents/DetailNavBar'
  import DetailSwiper from './childcomponents/DetailSwiper'
  import DetailBaseInfo from './childcomponents/DetailBaseInfo'
  import DetailShopInfo from './childcomponents/DetailShopInfo'
  import DetailGoodsInfo from './childcomponents/DetailGoodsInfo'
  import DetailParamInfo from './childcomponents/DetailParamInfo'
  import DetailCommentInfo from './childcomponents/DetailCommentInfo'
  import DetailBottomBar from './childcomponents/DetailBottomBar'

  import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from 'components/content/goods/GoodsList'
  // import Toast from 'components/common/toast/Toast'

  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail'
  import {debounce} from 'common/utils'
  import {itemListenerMixins, backTopMixin} from 'common/mixin'

  import { mapActions } from 'vuex'

  export default {
    name: 'Detail',
    mixins: [itemListenerMixins, backTopMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        itemImgListener: null,
        themeTopYs: [],
        getThemeTopYs: null,
        currentIndex: 0,
        // show: false,
        // message: ''
      }
    },
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      Scroll,
      GoodsList,
      // Toast
    },
    created() {
      // 保存商品的iid
      this.iid = this.$route.params.iid

      // 请求商品详情数据
      getDetail(this.iid).then(res => {

        console.log(res)
        // 1.获取数据
        const data = res.result
        // 2.获取轮播图数据
        this.topImages = data.itemInfo.topImages

        // 3.获取商品信息数据
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        // 4.获取商家信息
        this.shop = new Shop(data.shopInfo)

        // 5.获取商品的详情数据
        this.detailInfo = data.detailInfo

        // 6.获取商品参数
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        // 7.获取评论信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }

        // 第一次获取，值不对
        // 值不对的原因，this.$refs.params.$el没有渲染
        // this.themeTopYs = []

        // this.themeTopYs.push(0)
        // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        // this.themeTopYs.push(this.$refs.comments.$el.offsetTop)
        // this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
        // console.log(this.themeTopYs)
        // 第二次获取，值不对
        // 值不对的原因，图片没有计算在内
        // 根据最新的数据，对应的DOM是已经被渲染出来
        // 但是图片依旧没有加载完
        // offsetTop值不对都是图片的问题
        // this.$nextTick(() => {
        //   this.themeTopYs = []
        //   this.themeTopYs.push(0)
        //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        //   this.themeTopYs.push(this.$refs.comments.$el.offsetTop)
        //   this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
        //   console.log(this.themeTopYs)
        // })
      }),

      // 请求推荐数据
      getRecommend().then(res => {
        // console.log(res)
        this.recommends = res.data.list
      })

      // 给getThemeTopYs赋值()
      this.getThemeTopYs = debounce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comments.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)
        // console.log(this.themeTopYs)
      }, 100)
    },
    mounted() {
      
    },
    updated() {
      
    },
    destroyed() {
      this.$bus.$off('itemImgLoad', this.itemImgListener)
    },
    methods: {
      ...mapActions(['addCart']),
      detailImageLoad(){
        this.newRefresh()
        // this.$refs.scroll.refresh()
        this.getThemeTopYs()
      },
      titleClick(index) {
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100)
      },
      contentScroll(position) {
        const positionY = -position.y
        let length = this.themeTopYs.length
        for (let i = 0; i<length - 1; i++) {
          if (this.currentIndex !== i && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) {
            this.currentIndex = i
            console.log(this.currentIndex)
            this.$refs.nav.currentIndex = this.currentIndex 
          }
        }
        
        this.listenShowBackTop(position)
      },
      addToCart() {
        // 1.获取添加商品信息

        const product = {}
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.iid;

        // this.$store.commit('addCart', product)

        this.addCart(product).then(res => {

          this.$toast.show(res, 1500)
          // console.log(this.$toast)
        })

        // this.$store.dispatch('addCart', product).then(res => {
          
        // })
      }
    },
    mounted() {
      
    },
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .content {
    height: calc(100% - 44px - 49px);
  }

</style>