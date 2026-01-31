<template>
    <div class="control-container">
        <!-- <panel-head :info="route" /> -->
        <div class="card">
            <div class="user">
                <el-card class="user-card">
                    <template #header>
                        <div class="card-header">
                            <el-image :src="user.user_img" />
                            <span>{{ user.user_name }}</span>
                        </div>
                    </template>
                    <div class=" user-info">
                        <div>当前权限：{{ user.permission }}</div>
                        <div>登录的ip：{{ user.ip }}</div>
                    </div>
                </el-card>
            </div>
            <el-card class="service-list">
                <div class="service-item" v-for="(item, index) in types" :key="index">
                    <div class="img-box" :style="{ 'background-color': color[index] }">
                        <img :src="imgs[index]" alt="">
                    </div>
                    <div class="text">
                        <div class="num">{{ item.num }}</div>
                        <div class="name">{{ item.state }}</div>
                    </div>
                </div>
            </el-card>
        </div>
        <div class="content">
            <div class="echart" ref="echart"></div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { report } from '../../api/index'
import * as echarts from "echarts";

const route = useRoute();
const user = ref({
    user_img: '',
    user_name: '',
    permission: '',
    ip: ''
})
const types = ref([])
const typeList = ref([])
const echart = ref();
const color = ["#F05050", "#7266BA", "#23B7E5", "#27C24C"];
const imgs = ["dzf.png", "dfw.png", "ywc.png", "yqx.png"];

const getData = async () => {
    let res = await report();
    console.log(res, 'res')
    let data = res?.data?.data;
    if (data) {
        user.value = data.user;
        types.value = data.types
        typeList.value = data.typeList
        initEchart();
    }
}
const initEchart = () => {
    let options = {
        grid: {
            left: 40,
            bottom: 0,
            right: 40,
            top: 10,
            containLabel: true,
        },
        color: ["#67CEBC"],
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "line",
            },
            formatter: (a) => {
                return (
                    a[0].seriesName +
                    ":" +
                    a[0].data +
                    "<br />" +
                    "总金额:" +
                    typeList.value[a[0].dataIndex].order_money
                );
            },
        },
        legend: {
            data: ["订单数"],
        },
        xAxis: {
            data: typeList.value.map((item) => item.date),
            axisLine: { show: true, lineStyle: { width: 2, color: "#67CEBC" } },
            boundaryGap: false,
            axisLabel: {
                color: "#999",
            },
            splitLine: {
                show: true,
            },
            axisTick: false,
        },
        yAxis: {
            axisLabel: false,
            axisLine: { show: true, lineStyle: { color: "#999" } },
            splitLine: {
                show: true,
            },
        },
        series: [
            {
                name: "订单数",
                type: "line",
                data: typeList.value.map((item) => item.order_sum),
                symbolSize: 8,
            },
        ],
    }
    var myChart = echarts.init(echart.value)
    myChart.setOption(options);
    let observer = new ResizeObserver((entries) => {
        myChart.resize();
    });
    if (echart.value) {
        observer.observe(echart.value)
    }
}

onMounted(() => {
    getData();
});
</script>



<style lang="less" scoped>
.card {
    display: flex;
}

.user {
    margin: 20px 0;
    width: 45%;

    .user-card {
        .card-header {
            display: flex;

            .el-image {
                width: 120px;
                height: 120px;
                border-radius: 50%;
                margin: 5px;
            }

            span {
                line-height: 120px;
                font-size: 28px;
                font-weight: bold;
            }
        }

        .user-info {
            color: #666;
            line-height: 30px;
        }
    }
}

.service-list {
    background-color: #fff;
    margin: 20px;
    height: 269px;
    width: 50%;
    margin-bottom: 40px;

    ::v-deep(.el-card__body) {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        align-content: center;

        height: 95%;

        .service-item {
            width: 50%;
            height: 50%;
            display: flex;
            justify-content: center;

            .img-box {
                width: 70px;
                height: 70px;
                text-align: center;
                margin-right: 10px;
                border-radius: 5px;

                img {
                    margin: 5px;
                    width: 60px;
                    height: 60px;
                    border-radius: 5px;
                }
            }

            .num {
                font-size: 25px;
                line-height: 40px;
                font-weight: bold;
            }

            .name {
                font-size: 14px;
            }
        }
    }
}

.content {
    padding: 10px;
    background-color: #fff;
    width: 95%;

    .echart {
        height: 400px;
    }
}
</style>
