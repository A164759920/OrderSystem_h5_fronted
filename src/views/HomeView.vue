<template>
  <div class="container">
    <div class="left">
      <div class="left-item" :class="{ 'active': activeNav === index ? true : false }" v-for="(item, index) in typeList"
        :key="index" @click="changeActiveNav(index)">{{ item }}</div>
    </div>
    <div class="right">
      <div class="menu-list">
        <div class="list-item" v-for="(item, index) in dishList[this.activeNav]">
          <img class="item-left" src="" alt="">
          <div class="item-right">
            <div class="right-title">{{ item.Dname }}</div>
            <div class="right-price">￥{{ item.Dprice }}</div>
            <div class="right-control">
              <div :class="{
                'el-icon-remove': buyCount[activeNav][index] > 0 ? true : false
              }" @click="removeFromCount(item, index)"></div>
              <div class="right-count" :class="{
                'active': buyCount[activeNav][index] > 0 ? true : false
              }">{{ buyCount[activeNav][index] }}</div>
              <div class="el-icon-circle-plus" @click="addToCount(item, index)"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer" @click="showCar">

      <div class="carButton" :class="{ 'activeCar': shoppingCar.length > 0 ? true : false }">
        <div class="carButton-left">
          <div class="el-icon-dish"></div>
          <div :class="isShowTotalPrice">￥{{ totalPrice }}</div>
        </div>
        <div class="carButton-text">
          未选购餐品
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

import axios from 'axios';
import * as BUS from '@/eventBus/index.js'
import MenuViewVue from './MenuView.vue';
export default {
  name: 'HomeView',
  components: {
    MenuViewVue
  },
  data: function () {
    return {
      domain: BUS.DOMAIN,
      typeList: [],
      dishList: [],
      activeNav: 0,
      activeNavName: "",
      buyCount: [],
      shoppingCar: [],
      totalPrice: 0,
    }
  },
  computed: {
    isShowTotalPrice: function () {
      return this.totalPrice > 0 ? `carButton-price-on` : `carButton-price-off`
    }
  },
  methods: {
    changeActiveNav: function (index) {
      console.log(index)
      this.activeNav = index
    },
    addToCount: function (item, index) {
      console.log(item)
      this.$set(this.buyCount[this.activeNav], index, this.buyCount[this.activeNav][index] + 1)
      this.updateShoppingCar(0, {
        Dname: item.Dname,
        Dcount: this.buyCount[this.activeNav][index],
        Dprice: item.Dprice
      })
      // this.shoppingCar.push({
      //   Dname: item.Dname,
      //   Dcount: this.buyCount[this.activeNav][index],
      //   Dprice: item.Dprice
      // })
    },
    removeFromCount: function (item, index) {
      this.$set(this.buyCount[this.activeNav], index, this.buyCount[this.activeNav][index] - 1)
      this.updateShoppingCar(1, {
        Dname: item.Dname,
        Dcount: this.buyCount[this.activeNav][index],
        Dprice: item.Dprice
      })
      // this.shoppingCar.push({
      //   Dname: item.Dname,
      //   Dcount: this.buyCount[this.activeNav][index],
      //   Dprice: item.Dprice
      // })
    },
    /**
     * 计算总价
     */
    computeTotalPrice: function () {
      let totalPrice = 0
      this.shoppingCar.forEach(item => {
        totalPrice = totalPrice + item.Dcount * item.Dprice
      })
      return totalPrice
    },
    updateShoppingCar: function (type, dishObj) {
      const that = this
      console.log(dishObj)
      // 获取索引
      function getDishIndex(Dname) {
        let flagIndex = -1
        that.shoppingCar.forEach((item, index) => {
          if (item.Dname === Dname) {
            flagIndex = index
          }
        })
        return flagIndex
      }

      if (type === 0) {
        const addIndex = getDishIndex(dishObj.Dname)
        if (addIndex >= 0) {
          that.shoppingCar[addIndex].Dcount = dishObj.Dcount
        } else {
          that.shoppingCar.push(dishObj)
        }
      }
      if (type === 1) {
        const removeIndex = getDishIndex(dishObj.Dname)
        that.shoppingCar[removeIndex].Dcount = dishObj.Dcount
        // 数据小于等于0时，将菜品从购物车移除
        if (that.shoppingCar[removeIndex].Dcount <= 0) {
          that.shoppingCar.splice(removeIndex, 1)
        }
      }
      // 更新总价
      this.totalPrice = this.computeTotalPrice()
    },
    showCar: function () {
      console.log("购物车", this.shoppingCar)
      console.log("总价", typeof this.totalPrice)
    }
  },
  mounted: function () {
    const that = this
    // 获取菜品分类
    axios.get(`${this.domain}/DishTypeAll`).then(value => {
      if (value.data.code === 0) {
        that.typeList = value.data.data
      } else {
        console.log("渲染错误", value.data)
      }
    }, error => {
      console.log("渲染错误", error)
    })
    // 获取菜品详细信息
    axios.get(`${this.domain}/DishAll`).then(value => {
      if (value.data.code === 0) {
        that.dishList = value.data.data
        that.dishList.forEach(item => {
          const buyCountPart = new Array(item.length).fill(0)
          that.buyCount.push(buyCountPart)
          // that.buyCount.push({
          //   Dname: item.Dname,
          //   Dcount: 0
          // })
        })
      } else {
        console.log("渲染错误", value.data)
      }
    }, error => {
      console.log("渲染错误", error)
    })
  }
}
</script>

<style lang="scss" scoped>
$leftWidth: 75px;
$bottomHeight: 60px;
$activeColor: #03A9F4;

.container {
  width: 100%;
  height: 100%;
  background-color: white;
  position: relative;

  .left {
    position: absolute;
    left: 0;
    top: 0;
    width: $leftWidth;
    height: 100%;
    // height: calc(100% - 50px);
    background-color: whitesmoke;
    position: absolute;
    z-index: 99;

    .left-item {
      width: 100%;
      height: 60px;
      line-height: 60px;
      text-align: center;
      color: #212121;
      font-family: Arial, Helvetica, sans-serif;
    }

    .active {
      background-color: #03A9F4;
      color: white
    }
  }

  .right {
    position: absolute;
    top: 0;
    right: 0;
    width: calc(100% - $leftWidth);
    // height: calc(100% - $bottomHeight);
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;

    .menu-list {
      width: 100%;

      .list-item {
        width: calc(100% - 16px);
        height: 100px;
        display: flex;
        padding-top: 5px;
        padding-bottom: 5px;
        padding-left: 8px;
        padding-right: 8px;
        border-bottom: 3px solid whitesmoke;

        .item-left {
          width: 90px;
          height: 100%;
          background-color: aqua;
        }

        .item-right {
          height: 100%;
          flex-grow: 1;
          position: relative;

          .right-title {
            position: absolute;
            top: 5px;
            left: 5px;
          }

          .right-price {
            position: absolute;
            bottom: 5px;
            left: 5px;
            height: 30px;
            line-height: 30px;
            font-size: 18px;
            font-weight: 550;
            color: $activeColor;
          }

          .right-control {
            position: absolute;
            bottom: 5px;
            right: 5px;
            height: 30px;
            width: 100px;
            display: flex;
            justify-content: space-around;
            align-items: center;

            .right-count {
              display: none;
            }

            .active {
              display: block;
            }

            .el-icon-remove {
              color: $activeColor;
              font-size: 20px;
            }

            .el-icon-circle-plus {
              color: $activeColor;
              font-size: 20px;
            }
          }
        }
      }
    }
  }

  .footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: $bottomHeight;
    background: rgba(245, 245, 245, 0.8);
    z-index: 100;

    .carButton {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 85%;
      height: 90%;
      background-color: #9E9E9E;
      border-radius: 20px;
      color: white;
      font-size: 20px;
      font-family: Arial, Helvetica, sans-serif;
      font-weight: 550;

      .carButton-left {
        margin-left: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        .carButton-price-off {
          display: none;
        }
        .carButton-price-on{
          display: block;
        }
      }

      .carButton-text {
        margin-left: 10px;
        margin-right: 20px;
      }
    }

    .activeCar {
      background-color: #03A9F4;
      justify-content: space-between;
    }
  }
}
</style>