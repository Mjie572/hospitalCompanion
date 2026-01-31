<template>
    <div class="common-layout">
        <el-container>
            <!-- <el-aside width="200px">Aside</el-aside> -->
            <Aside></Aside>
            <el-container>
                <!-- <el-header>Header</el-header> -->
                <navHeader />
                <el-main>
                    <RouterView />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script setup>
import Aside from '../components/aside.vue'
import navHeader from '../components/navHeader.vue';
</script>

<style lang="less" scoped>
.common-layout {
    height: 100%;
}

.el-container {
    height: 100%;


    display: flex;
    // flex-direction: row;
    /* 显式指定横向排列（默认就是 row，可省略） */


}

/* 在 Main.vue 的 style 中补充 */
.el-container>.el-container {
    flex-direction: column;
    /* 内部容器纵向排列 */
}
</style>