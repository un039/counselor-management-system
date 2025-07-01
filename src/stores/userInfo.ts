import { defineStore } from 'pinia';

export const useUserInfoStore = defineStore('userInfo', {
    state: () => ({
        isLoggedIn: false,
        userRole: 'counselor',
        userName: ''
    }),
    actions: {
        loginSuccess(name: string) {
            this.isLoggedIn = true;
            this.userName = name;
        },
        logout() {
            this.isLoggedIn = false;
            this.userName = '';
        }
    },
    persist: false // 禁用状态持久化，确保刷新后状态重置
});