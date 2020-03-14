<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物车</div></nav-bar>
    <tab-control :title="['流行', '新款', '精选']" 
                    @tabClick='tabClick' 
                    ref="tabControl1"
                    :class='{fixed: isTabFixed}'
                    class="tab-control" v-show='isTabFixed'></tab-control>
    <scroll class="content" 
            ref="scroll" 
            :probe-type=3 
            @scroll='contnetScroll' 
            :pull-up-load='true' 
            @pullingUp='loadMore'>
      <home-swiper :banners='banners' @swiperImageLoad='swiperImageLoad'></home-swiper>
      <recommend-view :recommends='recommends'></recommend-view>
      <feature-views></feature-views>
      <tab-control :title="['流行', '新款', '精选']" 
                    @tabClick='tabClick' 
                    ref="tabControl2"
                    :class='{fixed: isTabFixed}'></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <back-top @click.native='backClick' v-show='isShowBackTop'></back-top>
  </div>
</template>

<script>
  import HomeSwiper from './childcomps/HomeSwiper'
  import RecommendView from './childcomps/RecommendView'
  import FeatureViews from './childcomps/FeatureViews'

  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'

  import {getHomeMultidata, getHomeGoods} from 'network/home'
  import {debounce} from 'common/utils'
  import {itemListenerMixins, backTopMixin} from 'common/mixin'

  export default {
    name: 'Home',
    mixins: [itemListenerMixins, backTopMixin],
    components: {
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureViews,
      TabControl,
      GoodsList,
      Scroll,
    },
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []}
        },
        currentType: 'pop',
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0,
        itemImgListener: null
      }
    },
    activated() {
      this.$refs.scroll.scrollTo(0, this.saveY, 0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      // 保存y轴的位置
      this.saveY = this.$refs.scroll.getScrollY()

      // 取消全局事件的监听
      this.$bus.$off('itemImageLoad', this.itemImgListener)
    },
    created() {
      // 1.获取多个数据
      this.getHomeMultidata()

      // 2.获取商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('sell')
      this.getHomeGoods('new')
    },
    mounted() {
      // 1.图片加载完成的事件监听
      // const refresh = debounce(this.$refs.scroll.refresh, 500)

      // this.itemImgListen = () => {
      //   refresh()
      // }

      // this.$bus.$on('itemImageLoad', this.itemImgListener)

      // 2.获取tabControl的offsetTop
      // 所有组件都有一个属性$el：用于获取组件中的元素

    },
    methods: {
      
      // 事件监听相关方法

      tabClick(index) {
        switch(index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },
      
      contnetScroll(position) {
        // 判断BackTop按钮是否显示
        this.listenShowBackTop(position)

        // 判断TabControl是否吸顶
        this.isTabFixed = (-position.y) > this.tabOffsetTop

      },
      loadMore() {
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad(){
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      },


      // 网络请求相关方法
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          // console.log(res)
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1;
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          // 完成上拉加载更多
          this.$refs.scroll.finishPullUp()
        })
      },
      
    },
    computed: {
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
  }

</script>

<style scoped>
  #home {
    /* padding-top: 44px; */
    height: 100vh;
    position: relative;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    /* 在使用浏览器的原生滚动时，为了让导航不跟随一起滚动 */
    /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 20; */
  }
  .tab-control {
    position: relative;
    z-index: 9;
  }

  /* .content {
    height: calc(100% - 93px);
    overflow: hidden;
    margin-top: 44px;
  } */

  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
</style>