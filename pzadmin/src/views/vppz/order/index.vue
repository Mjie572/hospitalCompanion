<template>
    <panel-head :route="route" />
    <div class="form">
        <el-form :inline="true" :model="searchForm">
            <el-form-item prop="out_trade_no">
                <el-input v-model="searchForm.out_trade_no" placeholder="订单号" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :data="tableData.list">
        <el-table-column prop="out_trade_no" label="订单号" width="150" fixed="left"></el-table-column>
        <el-table-column prop="hospital_name" label="就诊医院"></el-table-column>
        <el-table-column prop="service_name" label="陪诊服务"></el-table-column>
        <el-table-column label="陪护师头像">
            <template #default="scope">
                <el-image style="width: 40px;height: 40px;" :src="scope.row?.companion?.avatar || ''" alt="头像" />
            </template>
        </el-table-column>
        <el-table-column label="陪护师手机号" width="120">
            <template #default="scope">
                {{ scope.row?.companion?.mobile || '暂无手机号' }}
            </template>
        </el-table-column>
        <el-table-column prop="price" label="总价"></el-table-column>
        <el-table-column prop="paidPrice" label="已付"></el-table-column>
        <el-table-column label="下单时间" width="120">
            <template #default="scope">
                {{ dayjs(scope.row.order_start_time).format('YYYY-MM-DD') }}
            </template>
        </el-table-column>
        <el-table-column label="订单状态">
            <template #default="scope">
                <el-tag :type="statusMap(scope.row.trade_state)">{{ scope.row.trade_state }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="service_state" label="接单状态"></el-table-column>
        <el-table-column prop="tel" label="联系人手机号"></el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
            <template #default="scope">
                <el-popconfirm v-if="scope.row.trade_state === '待服务'" confirm-button-text="是" cancel-button-text="否"
                    :icon="InfoFilled" icon-color="#626AEF" title="是否确认完成？"
                    @confirm="confirmEvent(scope.row.out_trade_no)">
                    <template #reference>
                        <el-button type="primary" link>服务完成</el-button>
                    </template>
                </el-popconfirm>
                <el-button v-else type="primary" link disabled>暂无服务</el-button>

            </template>
        </el-table-column>
    </el-table>
    <div class="pagination-info">
        <el-pagination v-model:current-page="paginationData.pageNum" :page-size="paginationData.pageSize"
            :background="false" layout="total, prev, pager, next" :total="tableData.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" size="small" />
    </div>
</template>

<script setup>
import { InfoFilled } from '@element-plus/icons-vue'
import { onMounted, reactive } from 'vue'
import { adminOrder, updateOrder } from '../../../api/index'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
const route = useRoute()
//搜索框
const searchForm = reactive({
    out_trade_no: ''
})
//查询功能
const onSubmit = () => {
    getListData(searchForm)
}
//页面数据展示
//列表数据
// 生成调试数据
const generateMockData = () => {
    // 模拟3条测试数据
    return [
        {
            out_trade_no: 'PAY' + Date.now() - 10000,
            hospital_name: '北京协和医院',
            service_name: '全程陪诊服务',
            companion: {
                avatar: 'https://cube.elemecdn.com/3/7c/3ea629374bc241beb58c26fd80c74fde.png',
                mobile: '13800138000'
            },
            price: 399,
            paidPrice: 399,
            order_start_time: new Date().toISOString(),
            trade_state: '待服务',
            service_state: '已接单',
            tel: '13900139000'
        },
        {
            out_trade_no: 'PAY' + Date.now() - 5000,
            hospital_name: '上海瑞金医院',
            service_name: 'VIP陪诊服务',
            companion: {
                avatar: 'https://p11-flow-imagex-download-sign.byteimg.com/tos-cn-i-a9rns2rl98/690a72c8c1be45e4836929ae481115be.png',
                mobile: '13700137000'
            },
            price: 599,
            paidPrice: 599,
            order_start_time: new Date(Date.now() - 86400000).toISOString(),
            trade_state: '已完成',
            service_state: '已接单',
            tel: '13600136000'
        },
        {
            out_trade_no: 'PAY' + Date.now(),
            hospital_name: '广州中山医院',
            service_name: '基础陪诊服务',
            companion: {
                avatar: 'https://p26-flow-imagex-download-sign.byteimg.com/tos-cn-i-a9rns2rl98/3ea629374bc241beb58c26fd80c74fde.png',
                mobile: '13500135000'
            },
            price: 299,
            paidPrice: 299,
            order_start_time: new Date(Date.now() - 172800000).toISOString(),
            trade_state: '待支付',
            service_state: '未接单',
            tel: '13400134000'
        }
    ]
}
const tableData = reactive({
    list: [],
    total: 0
})
const paginationData = reactive({
    pageNum: 1,
    pageSize: 10,
})
const getListData = (params) => {
    adminOrder({ ...paginationData, ...params }).then(({ data }) => {
        const { list, total } = data.data
        // 若接口返回数据为空，则使用调试数据
        if (list.length === 0 && total === 0) {
            console.log('接口返回空数据，使用调试数据')
            const mockData = generateMockData()
            tableData.list = mockData
            tableData.total = mockData.length
        } else {
            tableData.list = list
            tableData.total = total
        }
    }).catch(err => {
        console.error('接口请求失败', err)
        // 可选：请求失败时也使用调试数据
        const mockData = generateMockData()
        tableData.list = mockData
        tableData.total = mockData.length
    })
}
onMounted(() => {
    getListData()
})
const statusMap = (key) => {
    const obj = {
        '已取消': 'info',
        '待支付': 'warning',
        '已完成': 'success',
        '待服务': 'primary',
    }
    return obj[key] || 'info';
}
//服务状态更改
const confirmEvent = (id) => {
    updateOrder({ id }).then(({ data }) => {
        if (data.code === 10000) {
            getListData()
        }
    })
}
//分页逻辑
const handleSizeChange = (val) => {
    paginationData.pageSize = val
    getListData()
}

const handleCurrentChange = (val) => {
    paginationData.pageNum = val
    getListData()
}
</script>



<style lang="less" scoped>
.form {
    display: flex;
    justify-content: flex-end;
    padding: 10px 0 10px 10px;
    background-color: #fff;
}
</style>
