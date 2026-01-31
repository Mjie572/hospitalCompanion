<template>
    <div>
        <el-row class="login-container" justify="center" :align="middle">
            <el-card style="max-width: 480px;">
                <template #header>
                    <div class="card-header">
                        <img :src="imgUrl" alt="">
                    </div>
                </template>
                <div class="jump-link">
                    <el-link type="primary" @click="handleChange">{{ formType ? '返回登录' : '立即注册' }}</el-link>
                </div>
                <el-form class="demo-ruleForm" ref="loginFormRef" :rules="rules" :model="loginForm" label-width="auto"
                    style="max-width: 600px">
                    <el-form-item prop="userName">
                        <el-input v-model="loginForm.userName" placeholder="手机号" :prefix-icon="UserFilled" />
                    </el-form-item>
                    <el-form-item prop="passWord">
                        <el-input v-model="loginForm.passWord" type="password" placeholder="密码" :prefix-icon="Lock" />
                    </el-form-item>
                    <el-form-item v-if="formType" prop="validCode">
                        <el-input v-model="loginForm.validCode" placeholder="验证码" :prefix-icon="Lock">
                            <template #append>
                                <span @click="countdownChange()">{{ countdown.validText }}</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :style="{ width: '100%' }" @click="submitForm(loginFormRef)">
                            {{ formType ? '注册账号' : '登录' }}
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-row>
    </div>
</template>
<script setup>
import { Lock, UserFilled } from '@element-plus/icons-vue';
import { ref, reactive, computed, toRaw } from 'vue'
import { getCode, userAuthentication, login, menuPermissions } from '../../api/index.js';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
const imgUrl = new URL('../../../public/login-head.png', import.meta.url).href
const loginForm = reactive({
    userName: '',
    passWord: '',
    validCode: ''
})
const loginFormRef = ref()
//切换表单(登录界面0 注册界面1)
const formType = ref(0);
const router = useRouter()
const store = useStore()
const routerList = computed(() => store.state.menu.routerList)
//提交逻辑
const submitForm = async (formEl) => {

    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            // console.log(loginForm, 'submit!')

            //注册界面
            if (formType.value) {
                userAuthentication(loginForm).then(({ data }) => {
                    if (data.code === 10000) {
                        ElMessage.success('注册成功，请登录')
                        formType.value = 0
                    }
                })
            } else {
                //登录页面
                login(loginForm).then(({ data }) => {
                    console.log('登录接口完整响应：', data)
                    //////////////问题出在传入then的参数格式

                    if (data.code === 10000) {
                        ElMessage({
                            message: '登陆成功',
                            type: 'success',
                        })
                        localStorage.setItem('pz_token', data.data.token);
                        localStorage.setItem('pz_userInfo', JSON.stringify(data.data.userInfo));
                        menuPermissions().then(({ data }) => {
                            store.commit('dynamicMenu', data.data)
                            console.log(routerList, 'routerList')
                            toRaw(routerList.value).forEach(item => {
                                router.addRoute('main', item)
                            });
                            router.push('/')
                        })


                    } else {
                        ElMessage.error('Oops, this is a error message.')
                    }
                })


            }
        } else {
            console.log('error submit!', fields)
        }
    })
}


const validateUser = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入手机号'))
    } else {
        const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
        phoneReg.test(value) ? callback() : callback(new Error('手机号格式有误，请输入正确的手机号'))
    }
}

const validatePass = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入密码'))
    } else {
        const reg = /^[a-zA-Z0-9_-]{4,16}$/
        reg.test(value) ? callback() : callback(new Error('密码格式有误,请输入4-16位字母数字下划线组合的密码'))
    }
}


//验证表单
const rules = reactive({
    userName: [{ validator: validateUser, trigger: 'blur' }],
    passWord: [{ validator: validatePass, trigger: 'blur' }],
});
//点击登录和注册
const handleChange = () => {
    formType.value = formType.value ? 0 : 1;
}
const countdown = reactive({
    validText: '获取验证码',
    time: 60
})
let flag = false
const countdownChange = () => {
    //如果已经点击过，则不处理
    if (flag) { return }
    const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
    //校验手机号
    if (!loginForm.userName || !phoneReg.test(loginForm.userName)) {
        return ElMessage({
            message: '请检查手机号是否正确',
            type: 'warning',
        })
    }
    //倒计时
    const time = setInterval(() => {
        if (countdown.time <= 0) {
            countdown.time = 60;
            countdown.validText = '获取验证码';
            flag = false
            clearInterval(time);
        } else {
            countdown.time -= 1;
            countdown.validText = `剩余${countdown.time}s`;
        }
    }, 1000)
    flag = true
    getCode({ tel: loginForm.userName }).then(({ data }) => {
        console.log(data);
        if (data.code === 10000) {
            ElMessage.success('发送成功')
        }
    })
}
</script>

<style lang="less" scoped>
:deep(.el-card__header) {
    padding: 0
}

.login-container {
    height: 100vh;
    display: flex;
    /* 手动触发 Flex 布局，确保对齐逻辑生效 */
    align-items: center;
    justify-content: center;

    .card-header {
        background-color: #899fe1;

        img {
            width: 430px;
        }
    }

    .jump-link {
        text-align: right;
        margin-bottom: 10px;
    }
}
</style>