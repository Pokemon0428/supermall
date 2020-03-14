<template>
  <div id="hy-swiper">
    <div class="swiper" @touchStart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
      <slot></slot>
    </div>
    <slot name="indicator"></slot>
    <div class="indicator">
      <slot name="indicator" v-if="showIndicator && slideCount>1">
        <div v-for="(item, index) in slideCount" class="indi-item" :class="{active: index === currentIndex-1}" :key="index.id"></div>
      </slot>
    </div> 
  </div>
</template>


<script>
  export default {
    name: "Swiper",
    props: {
      interval: {  //多久滚动一次
		    type: Number,
        default: 3000
      },
      animDuration: {  //滚动延时
		    type: Number,
        default: 300
      },
      moveRatio: {    //拖动到下一张图片所需的大小
        type: Number,
        default: 0.25
      },
      showIndicator: {  //指示器，图下的圆点
        type: Boolean,
        default: true
      }
    },
    data(){
      return {
        slideCount: 0,  //元素个数
        totalWidth: 0,  //swiper的宽度
        swiperStyle: {}, //swiper样式
        currentIndex: 1, //当前的index
        scrolling: false //是否在滚动
      }
    },
    mounted() {
      // 1.操作DOM, 在前后添加Slide
      setTimeout(() => {
        this.handleDom();

        // 2.开启定时器
        this.startTimer();
      },100)
    },
    methods: {
      /**
       * 定时器操作
       */
      starTimer(){
        this.playTimer = window.setInterval(() => {
          this.currentIndex++;
          this.scrollContent(-this.currentIndex * this.totalWidth)
        }, this.interval)
      },
      stopTimer(){
        window.clearInterval(this.playTimer);
      },

      /**
       * 滚动到正确的位置
       */
      scrollContent(currentPosition){
        // 0.设置正在滚动
        this.scrolling = true;

        // 1.开始滚动动画
        this.swiperStyle.transition = 'transform' + this.animDuration + 'ms';
        this.setTransform(currentPosition)

        // 2.判断滚动到的位置
        this.checkPosition();

        // 4.滚动完成
        this.scrolling = false;
      },

      /**
       * 校验正确的位置
       */
      checkPosition(){
        window.setTimeout(() => {
          // 1.校验正确的位置
          this.swiperStyle.transition = '0ms';
          if (this.currentIndex >= this.slideCount + 1) {
            this.currentIndex = 1;
            this.setTransform(-this.currentIndex * this.totalWidth);
          } else if (this.currentIndex <=0) {
            this.currentIndex = this.slideCount;
            this.setTransform(-this.currentIndex * this.totalWidth);
          }

          // 2.移动结束后的回调
          this.$emit('transitionEnd', this.currentIndex-1)
        }, this.animDuration)
      },

      /**
       * 设置滚动的位置
       */
      setTransform(position){
        this.swiperStyle.transform = `translate3d(${position}px, 0, 0)`;
        this.swiperStyle['-webkit-transform'] = `translate3d(${position}px), 0, 0`;
        this.swiperStyle['-ms-transform'] = `translate3d(${position}px), 0, 0`;
      },

      /**
       * 操作DOM, 在DOM前后添加Slide
       */
      handleDom(){
        // 1.获取要操作的元素
        let swiperE1 = document.querySelector('.swiper');
        let slidesEls = swiperE1.getElementsByClassName('slide');

        // 2.保存个数
        this.slideCount = slidesEls.length;

        // 3.如果大于1个，那么在前后分别添加一个slide
        if (this.slideCount > 1) {
          let cloneFirst = slidesEls[0].cloneNode(true);
          let cloneLast = slidesEls[this.slideCount - 1].cloneNode(true);
          swiperE1.insertBefore(cloneLast, slidesEls[0]);
          swiperE1.appendChild(cloneFirst);
          this.totalWidth = swiperE1.offsetWidth;
          // console.log(this.totalWidth)
          this.swiperStyle = swiperE1.style;
        }

        // 4.让swiper元素，显示第一个(目前是显示前面添加的最后一个元素)
        this.setTransform(-this.totalWidth);
      },

      /**
       * 拖动事件的处理
       */
      touchStart(e) {
        // 1.如果正在滚动， 不可以拖动
        if (this.scrolling) return;

        // 2.停止定时器
        this.stopTimer();

        // 3.保存开始滚动的位置
        this.startX = e.touches[0].pageX
      },

      touchMove(e) {
        // 1.计算用户拖动的距离
        this.currentX = e.touches[0].pageX;
        this.distance = this.currentX - this.startX;
        let currentPosition = -this.currentIndex * this.totalWidth;
        let moveDistance = this.distance + currentPosition;

        // 2.设置当前的位置
        this.setTransform(moveDistance);
      },

      touchEnd(e) {
        // 1.获取移动的距离
        let currrentMove = Math.abs(this.distance);

        // 2.判断最终的距离
        if (this.distance === 0) {
          return
        } else if (this.distance > 0 && currrentMove > this.totalWidth * this.moveRatio) { // 右边移动超过0.5
          this.currentIndex--
        } else if (this.distance > 0 && currrentMove > this.totalWidth * this.moveRatio) { //左边移动超过0.5
          this.currentIndex++
        } 

        // 3.移动到正确的位置
        this.scrollContent(-this.currentIndex * totalWidth);

        // 4.移动完成后重新开启定时器
        this.startTimer();
      },

      /**
       * 控制上一个, 下一个
       */
      previous() {
        this.changeItem(1);
      },
      
      changeItem(num) {
        //  1.移除定时器
        this.stopTimer();

        // 2.修改index和位置
        this.currentIndex == num;
        this.scrollContent(-this.currentIndex * this.totalWidth);

        // 3.添加定时器
        this.startTimer();
      }

    },
  }
</script>

<style scoped>

</style>