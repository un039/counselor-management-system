import { defineStore } from 'pinia';

interface UserState {
    isLoggedIn: boolean;
    token: string;
    userRole: 'admin' | 'counselor';
    userName: string;
    staffNo: string;
    staffId: number | null;
}

/** 从 localStorage 恢复登录态，保证刷新页面不掉线 */
function restore(): UserState {
    const token = localStorage.getItem('token') || '';
    let info: any = {};
    try {
        info = JSON.parse(localStorage.getItem('user_info') || '{}');
    } catch {
        info = {};
    }
    return {
        isLoggedIn: !!token,
        token,
        userRole: info.role || 'counselor',
        userName: info.name || '',
        staffNo: info.staffNo || '',
        staffId: info.staffId ?? null
    };
}

export const useUserInfoStore = defineStore('userInfo', {
    state: (): UserState => restore(),
    getters: {
        roleName: (state) => (state.userRole === 'admin' ? '系统管理员' : '辅导员'),
        isAdmin: (state) => state.userRole === 'admin'
    },
    actions: {
        loginSuccess(token: string, user: any) {
            this.isLoggedIn = true;
            this.token = token;
            this.userName = user.name;
            this.userRole = user.role;
            this.staffNo = user.staffNo;
            this.staffId = user.staffId;
            localStorage.setItem('token', token);
            localStorage.setItem('user_info', JSON.stringify(user));
        },
        logout() {
            this.isLoggedIn = false;
            this.token = '';
            this.userName = '';
            this.staffNo = '';
            this.staffId = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user_info');
        }
    }
});
