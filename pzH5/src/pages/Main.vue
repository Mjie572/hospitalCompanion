<template>
    <van-tabbar v-model="active">
        <van-tabbar-item v-for="item in router.options.routes[0].children" :key="item.path" :icon="item.meta.icon"
            :url="`#/${item.path}`">
            {{ item.meta.name }}
        </van-tabbar-item>
    </van-tabbar>
    <RouterView />
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
//Tabbar模块
const active = ref(0)
const router = useRouter()
const route = useRoute()
onMounted(() => {
    console.log(router)
    const data = router.options.routes[0]
    active.value = data.children.findIndex(item => '/' + item.path === route.path)
})
</script>
<style scoped></style>
