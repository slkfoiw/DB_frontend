<template>
    <div>
        <sidebar-menu :menu="menu" :collapsed="true" width="200px" theme="white-theme" />
    </div>
</template>

<script>
import '@fortawesome/fontawesome-free/css/all.css';
import { SidebarMenu } from 'vue-sidebar-menu';
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css';
import { useUserStore } from '@/store/user';
import { ref, computed } from 'vue';

export default {
    components: {
        SidebarMenu,
    },
    data() {
        return {
            menu: [] // 初始为空，后续动态填充
            
        };
    },
    setup() {
        const userStore = useUserStore();
        const name = computed(() => userStore.userInfo.name);
        const userId = computed(() => userStore.userInfo.userId);
        const identityLevel = computed(() => userStore.userInfo.identityLevel);

        return {
            userId,
            name,
            identityLevel
        };
    },
    mounted() {
        this.menu = [
            // 首页
            {
                href: '/home',
                title: '首页',
                icon: 'fa-solid fa-house'
            },
            // 用户管理
            {
                title: '用户管理',
                icon: 'fa-solid fa-user',
                hidden: this.identityLevel === 2,
                child: [
                    {
                        href: '/dormManagerInfo',
                        title: '宿管信息',
                        hidden: this.identityLevel !== 0
                    },
                    {
                        href: '/stuInfo',
                        title: '学生信息'
                    }
                ]
            },
            // 宿舍管理
            {
                title: '宿舍管理',
                icon: 'fa-solid fa-city',
                hidden: this.identityLevel === 2,
                child: [
                    { href: '/dormitoryInfo', title: '公寓信息' },
                    { href: '/roomInfo', title: '房间信息' }
                ]
            },
            // 信息管理
            {
                title: '信息管理',
                icon: 'fa-solid fa-message',
                hidden: this.identityLevel === 2,
                child: [
                    { href: '/announcementList', title: '公告列表' },
                    { href: '/repairList', title: '报修记录' },
                    { href: '/changeRoomList', title: '调宿记录' }
                ]
            },
            // 我的消息
            {
                href: '/notifications',
                title: '我的消息',
                icon: 'fa-solid fa-bell'
            },
            // 学生身份专属菜单
            {
                href: '/announcementBoard',
                title: '公告栏',
                icon: 'fa-solid fa-bullhorn',
                hidden: this.identityLevel !== 2
            },
            {
                href: '/myRoomInfo',
                title: '我的宿舍',
                icon: 'fa-solid fa-bed',
                hidden: this.identityLevel !== 2
            },
            {
                href: '/applyChangeRoom',
                title: '申请调宿',
                icon: 'fa-solid fa-exchange-alt',
                hidden: this.identityLevel !== 2
            },
            {
                href: '/applyRepairInfo',
                title: '报修申请',
                icon: 'fa-solid fa-wrench',
                hidden: this.identityLevel !== 2
            },
            // 个人信息
            {
                href: `/user/${this.userId}`,
                title: '个人信息',
                icon: 'fa-solid fa-user-circle'
            }
        ];
    }
};
</script>
