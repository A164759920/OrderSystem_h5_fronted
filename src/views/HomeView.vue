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
      <div class="menu-footer">
        已经到底了～
      </div>
    </div>
    <div :class="isShowCarClass">
      <div class="car-header">
        <div class="header-text">我的购物车 ({{ shoppingCar.length }})</div>
        <div class="header-right" @click="cleanShopCar">
          <div class="el-icon-delete"></div>
          清空购物车
        </div>
      </div>
      <div class="car-list">
        <div class="car-list-item" v-for="(item, index) in shoppingCar">
          <img class="car-item-left" src="" alt="">
          <div class="car-item-right">
            <div class="car-item-right-title">{{ item.Dname }}</div>
            <div class="car-item-right-price">￥{{ item.Dprice * item.Dcount }}</div>
            <div class="car-item-right-count">x{{ item.Dcount }}</div>
            <div class="car-item-right-control">
              <div class="el-icon-remove" @click="removeFromCount(item, item.countIndex)"></div>
              <div class="car-right-control-count">{{ item.Dcount }}</div>
              <div class="el-icon-circle-plus" @click="addToCount(item, item.countIndex)"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="carButton" :class="{ 'activeCar': shoppingCar.length > 0 ? true : false }">
        <div class="carButton-left" @click="showCar">
          <div class="el-icon-dish"></div>
          <div :class="isShowTotalPrice">￥{{ totalPrice }}</div>
        </div>
        <div class="carButton-text" @click="createNewOrder">
          {{ carButtonText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

import axios from 'axios';
import * as BUS from '@/eventBus/index.js'
export default {
  name: 'HomeView',
  data: function () {
    return {
      domain: BUS.DOMAIN,
      typeList: [],
      dishList: [],
      activeNav: 0,
      buyCount: [], // 每个商品的购买数量
      shoppingCar: [], // 购物车信息
      totalPrice: 0,  // 总价
      isShowCar: false // 是否显示购物车
    }
  },
  computed: {
    isShowTotalPrice: function () {
      return this.totalPrice > 0 ? `carButton-price-on` : `carButton-price-off`
    },
    carButtonText: function () {
      return this.totalPrice > 0 ? `选好了` : `未选购餐品`
      // return this.shoppingCar.length > 0 ? `选好了` : `未选购餐品`
    },
    isShowCarClass: function () {
      return this.isShowCar ? `show-car-on` : `show-car-off`
    }
  },
  methods: {
    changeActiveNav: function (index) {
      this.activeNav = index
    },
    addToCount: function (item, index) {
      this.$set(this.buyCount[this.activeNav], index, this.buyCount[this.activeNav][index] + 1)
      this.updateShoppingCar(0, {
        Dname: item.Dname,
        Dcount: this.buyCount[this.activeNav][index],
        Dprice: item.Dprice,
        countIndex: index
      })
    },
    removeFromCount: function (item, index) {
      // 更新二维数组
      this.$set(this.buyCount[this.activeNav], index, this.buyCount[this.activeNav][index] - 1)
      this.updateShoppingCar(1, {
        Dname: item.Dname,
        Dcount: this.buyCount[this.activeNav][index],
        Dprice: item.Dprice,
        countIndex: index
      })
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
    /**
     * 更新购物车信息
     * @param {Number} type 0:添加餐品 1:删除餐品 
     * @param {Object} dishObj 餐品对象
     */
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
    /**
     *  展示购物车详细信息
     */
    showCar: function () {
      this.isShowCar = !this.isShowCar;
    },
    /**
     *  清除购物车
     */
    cleanShopCar: function () {
      this.shoppingCar = []
      this.totalPrice = 0
      this.isShowCar = false
      this.buyCount[this.activeNav] = new Array(this.dishList[this.activeNav].length).fill(0)
    },
    /**
     * 创建新订单
     */
    createNewOrder: async function () {
      if (this.shoppingCar.length > 0) {
        const orderData = {
          Cname: BUS.Cname,
          Ototal: this.totalPrice,
          dishList: this.shoppingCar
        }
        try {
          const res = await axios.post(`${this.domain}/OrderAdd`,
            orderData
          )
          if (res.data.code === 0) {
            console.log("订单创建成功")
            alert("✅订单已提交")
          }
          else {
            alert("❎订单提交失败")
          }
        } catch (error) {
          alert("❎订单提交失败")
        }

      }


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
      color: white;
      font-family: 500;
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
              // color: $activeColor;
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
    .menu-footer{
      width: 100%;
      height: $bottomHeight;
      line-height: $bottomHeight;
      text-align: center;
      color: #9E9E9E;
    }
  }

  .show-car-on {
    position: absolute;
    bottom: $bottomHeight;
    z-index: 99;
    padding-top: 20px;
    padding-left: 10px;
    padding-right: 10px;
    max-height: 250px;
    width: calc(100% - 20px);
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    background-color: white;


    .car-header {
      display: flex;
      justify-content: space-between;
      color: #757575;
      font-size: 14px;
    }

    .car-list {
      width: 100%;
      margin-top: 10px;
      max-height: 220px;
      overflow-y: scroll;
      overflow-x: hidden;

      .car-list-item {
        width: 100%;
        height: 75px;
        display: flex;

        .car-item-left {
          width: 60px;
          height: 60px;
          background-color: #212121;
        }

        .car-item-right {
          position: relative;
          flex-grow: 1;
          height: 100%;

          .car-item-right-title {
            position: absolute;
            top: 0;
            left: 10px;
            font-size: 16px;
            font-weight: 550;
            color: #212121;
          }

          .car-item-right-price {
            position: absolute;
            left: 10px;
            bottom: 0;
            color: #03A9F4;
            font-weight: 550;
          }

          .car-item-right-count {
            position: absolute;
            left: 15px;
            top: 30px;
            color: #757575;
            font-size: 13px;
          }

          .car-item-right-control {
            position: absolute;
            right: 0;
            bottom: 0;
            display: flex;
            justify-content: space-around;
            align-items: center;
            width: 80px;
            height: 30px;

            .el-icon-remove {
              // color: $activeColor;
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

  .show-car-off {
    display: none;
  }

  .footer {
    position: absolute;
    bottom: 0;
    z-index: 100;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: $bottomHeight;
    background: rgba(245, 245, 245, 0.8);


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

        .carButton-price-on {
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