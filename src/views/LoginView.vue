<template>
    <div class="container">
        <div class="header">
            点 餐 应 用
        </div>
        <div class="login" :class="{ 'input': isFocus }">
            <div class="login-title">登 录</div>
            <CusInput class="username" v-model="username" type="text" custom="outline" placeholder="Username" clearable
                prefix-icon="el-icon-user" @focus="inputFocus" @blur="inputBlur"></CusInput>
            <CusInput class="password" v-model="password" type="text" custom="outline" placeholder="Password" clearable
                prefix-icon="el-icon-lock" style="margin-top:10px" @focus="inputFocus" @blur="inputBlur"></CusInput>
            <div class="login-button" @click="login">
                登录
            </div>
            <div class="register-button" @click="toRegister">
                注册
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios"
import CusInput from "@/components/CusInput.vue"
import * as BUS from "@/eventBus/index.js"
export default {
    components: {
        CusInput
    },
    data: function () {
        return {
            isFocus: false,
            username: '',
            password: '',
            domain: BUS.DOMAIN
        }
    },
    methods: {

        login: async function () {
            if (this.username === "" || this.password === "") {
                this.$notify.error({
                    title: "登录失败",
                    message: "用户名/密码不能为空"
                })
            } else {
                try {
                    const res = await axios.post(`${this.domain}/login`,
                        {
                            "Cname": this.username,
                            "Cpwd": this.password
                        })
                    if (res) {
                        if (res.data.code === 0) {
                            this.$router.push("/home")
                            // 保存用户名
                            BUS.Cname = this.username
                        }
                        else {
                            console.log(res.data.msg)
                            this.$notify.error({
                                title: "登录失败",
                                message: res.data.error
                            })
                        }
                    }
                } catch (error) {
                    this.$notify.error({
                        title: "登录失败",
                        message: error
                    })
                }
            }
        },
        toRegister: function () {
            this.$router.push('/register')
        },
        inputFocus: function () {
            const login = document.getElementsByClassName("login")
            login[0].classList.add('input')

        },
        inputBlur: function () {
            this.isFocus = false
            const login = document.getElementsByClassName("login")
            login[0].classList.remove("input")
        },
    },
    mounted: function () {

    }
}
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;

    .header {
        width: 100%;
        height: 50px;
        background-color: #1976D2;
        position: absolute;
        top: 0;
        line-height: 50px;
        text-align: center;
        font-family: Arial, Helvetica, sans-serif;
        color: white;
        font-weight: 550;
    }

    .login {
        width: 375px;
        height: 300px;
        background-color: whitesmoke;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        max-width: 375px;
        min-width: 315px;

        .login-title {
            color: #03A9F4;
            font-size: 20px;
            font-family: Arial, Helvetica, sans-serif;
            font-weight: 550;
            margin-bottom: 10px;
        }

        .login-button {
            margin-top: 20px;
            width: 230px;
            height: 35px;
            line-height: 35px;
            text-align: center;
            background-color: #03A9F4;
            border-radius: 5px;
            color: white;
        }

        .login-button:hover {
            cursor: pointer;
        }

        .register-button {
            margin-top: 10px;
            width: 230px;
            height: 35px;
            line-height: 35px;
            text-align: center;
            background-color: #03A9F4;
            border-radius: 5px;
            color: white;
        }

        .register-button:hover {
            cursor: pointer;
        }
    }

    .input {
        position: absolute;
        top: 0;
        z-index: 999;
    }
}
</style>