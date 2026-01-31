<template>
    <div class="container">
        <div class="header">
            <van-icon @click="goBack" name="arrow-left" class="header-left" size="30" />
            填写服务订单
        </div>
        <status-bar item="0" />
        <van-cell class="cell">
            <template #title>
                <van-image width="25" height="25" :src="createInfo.service.serviceImg" />
                <span class="server-name">{{ createInfo.service.serviceName }}</span>
            </template>
            <template #default>
                <div class="service-text">
                    服务内容
                </div>
            </template>
        </van-cell>
        <van-cell-group class="cell">
            <van-cell>
                <template #title>就诊医院</template>
                <template #default>
                    <div @click="showHospital = true">
                        {{ form.hospital_name || "请选择就诊医院" }}
                        <van-icon name="arrow" />
                    </div>
                </template>
            </van-cell>
            <van-cell>
                <template #title>就诊时间</template>
                <template #default>
                    <div @click="showStartTime = true">
                        {{ currentDate || "请选择就诊时间" }}
                        <van-icon name="arrow" />
                    </div>
                </template>
            </van-cell>
            <van-cell>
                <template #title>陪诊师</template>
                <template #default>
                    <div @click="showCompanion = true">
                        {{ companionName || "请选择陪诊师" }}
                        <van-icon name="arrow" />
                    </div>
                </template>
            </van-cell>
            <van-cell>
                <template #title>接送地址</template>
                <template #default>
                    <van-field class="text" input-align="right" v-model="form.receiveAddress" placeholder="请填写就诊人地址" />
                </template>
            </van-cell>
            <van-cell>
                <template #title>联系电话</template>
                <template #default>
                    <van-field class="text" input-align="right" v-model="form.tel" placeholder="请填写联系电话" />
                </template>
            </van-cell>
        </van-cell-group>
        <van-cell-group title="服务需求" class="cell">
            <van-field class="text" style="height: 100px;" v-model="form.demand" placeholder="请简单描述您要就诊的科室" />
        </van-cell-group>
        <van-button class="submit" type="primary" @click="sumbit" size="large">提交订单</van-button>

        <van-popup v-model:show="showHospital" position="bottom" :style="{ height: '30%' }">
            <van-picker :columns="showHospColumns" @confirm="showHospConfirm" @cancel="showHospColumns = false" />
        </van-popup>
        <van-popup v-model:show="showStartTime" position="bottom" :style="{ height: '30%' }">
            <van-date-picker @confirm="showTimeConfirm" @cancel="showStartTime = false" title="选择日期"
                :min-date="minDate" />
        </van-popup>
        <van-popup v-model:show="showCompanion" position="bottom" :style="{ height: '30%' }">
            <van-picker :columns="companionColumns" @confirm="showCompanionConfirm" @cancel="showCompanion = false" />
        </van-popup>
        <!-- 支付弹窗 -->
        <van-dialog :showConfirmButton="false" v-model:show="showCode">
            <van-icon name="cross" class="close" @click="closeCode" />
            <div>微信支付</div>
            <van-image width="150" height="150" :src="codeImage" />
            <div>请使用本人微信扫描二维码</div>
        </van-dialog>
    </div>
</template>
<script setup>
import { showNotify } from 'vant';
import 'vant/es/notify/style';
import { useRouter } from 'vue-router';
import StatusBar from '../../components/statusBar.vue'
import { computed, getCurrentInstance, onMounted, reactive, ref } from 'vue';
import Qrcode from 'qrcode';
//获取vue实例
const { proxy } = getCurrentInstance();
const router = useRouter();
const createInfo = reactive({
    companion: [],
    hospitals: [],
    service: {}
})
//获取后端数据
onMounted(async () => {
    try {
        const { data } = await proxy.$api.h5Companion()
        // 接口返回正常时，用接口数据覆盖模拟数据
        Object.assign(createInfo, data.data || {});
        console.log("接口返回数据：", data);
    } catch (error) {
        console.log("接口请求失败，使用模拟数据：", error);
    } finally {
        // 🔥 关键：如果接口返回的陪诊师数据为空，注入模拟数据
        if (createInfo.companion.length === 0) {
            createInfo.companion = mockCompanionData;
        }
    }
})
//返回上一页
const goBack = () => {
    router.go(-1)
}
//表单模块
//弹出层选项
const showHospital = ref(false)
const showHospColumns = computed(() => {
    return createInfo.hospitals.map(item => {
        return { text: item.name, value: item.id }
    })
})
//选中医院后
const form = reactive({
    hospital_id: '',
    hospital_name: '',
    demand: '',
    companion_id: '',
    receiveAddress: '',
    tel: '',
    starttime: ''
})
const showHospConfirm = (item) => {
    console.log(item)
    form.hospital_id = item.selectedOptions[0].value;
    form.hospital_name = item.selectedOptions[0].text;
    //关闭picker
    showHospital.value = false
}
//选择就诊时间
const showStartTime = ref(false)
const currentDate = ref()
const minDate = ref(new Date());
const showTimeConfirm = (item) => {
    console.log(item)
    const dateStr = item.selectedValues.join('-')
    currentDate.value = dateStr
    form.starttime = new Date(dateStr).getTime()
    showStartTime.value = false
}
//选择陪诊师
// 🔥 手动添加陪护师模拟数据（可按需修改/扩展）
const mockCompanionData = [
    { id: '1', name: '张护士', experience: '5年', skill: '擅长内科、儿科陪诊', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg' },
    { id: '2', name: '李护士', experience: '3年', skill: '擅长外科、妇科陪诊', avatar: 'https://img.yzcdn.cn/vant/dog.jpeg' },
    { id: '3', name: '王护士', experience: '7年', skill: '全能型陪诊师，熟悉各类科室', avatar: 'https://img.yzcdn.cn/vant/rabbit.jpeg' },
    { id: '4', name: '赵护士', experience: '4年', skill: '擅长老年病、慢性病陪诊', avatar: 'https://img.yzcdn.cn/vant/fox.jpeg' }
];
const showCompanion = ref(false)
const companionName = ref()
const companionColumns = computed(() => {
    if (createInfo.companion.length === 0) {
        return [{ text: '暂无可用陪护师，请联系客服', value: '' }]; // 空数组时返回提示列
    }
    // 2. 数组有数据时，正常遍历生成选择列
    return createInfo.companion.map(item => ({
        text: item.name,
        value: item.id
    }));
})
const showCompanionConfirm = (item) => {
    if (!item.selectedOptions || item.selectedOptions.length === 0) {
        showNotify({ type: 'warning', message: '暂无可用陪护师' });
        showCompanion.value = false;
        return;
    }

    // 给响应式变量赋值（注意：若 form 是 ref，需加 .value）
    form.companion_id = Number(item.selectedOptions[0].value);
    companionName.value = item.selectedOptions[0].text; // 若 companionName 是 ref，需加 .value
    showCompanion.value = false;
}
//支付弹窗
const showCode = ref(false)
const codeImage = ref('')
//关闭弹窗
const closeCode = () => {
    showCode.value = false
    router.push('/order')
}
//提交表单
const sumbit = async () => {
    const params = [
        'hospital_id',
        'hospital_name',
        'demand',
        'companion_id',
        'receiveAddress',
        'tel',
        'starttime'
    ]
    for (const i of params) {
        if (!form[i]) {
            showNotify({ type: 'danger', message: '请填写完整信息' });
            return
        }
    }
    if (isNaN(form.companion_id)) {
        showNotify({ type: 'danger', message: '陪诊师ID类型错误，请重新选择' });
        return;
    }
    try {
        const { data: orderRes } = await proxy.$api.createOrder(form)
        console.log("订单创建成功：", orderRes)
        Qrcode.toDataURL(orderRes.data.wx_code).then((url) => {
            showCode.value = true
            codeImage.value = url
        })
    } catch (error) {
        showNotify({ type: 'danger', message: '订单提交失败，请重试' });
        console.error("订单提交错误：", error);
    }
}
</script>
<style lang="less" scoped>
.container {
    background-color: #f0f0f0;
    height: 100vh;
}

.header {
    padding: 10px 0;
    text-align: center;
    line-height: 30px;
    font-size: 15px;

    .header-left {
        float: left;
    }
}

.cell {
    width: 95%;
    margin: 5px auto;
    background-color: #fff;

    ::v-deep(.van-field_control) {
        color: var(--van-cell-value-color);
    }

    ::v-deep(.van-cell__title) {
        display: flex;
        align-items: center;
    }

    .server-name {
        margin-left: 10px;
    }
}

.service-text {
    background: url(data:image/png;base64,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) no-repeat center center;
    background-size: 20px;
}

.submit {
    position: absolute;
    bottom: 0;
}

::v-deep(.van-dialog__content) {
    text-align: center;
    padding: 20px;

    .close {
        position: absolute;
        left: 20px;
    }
}
</style>
