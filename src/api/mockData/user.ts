export default {
    getUserInfo: () => {
        return {
            "status": true,
            "code": 0,
            "message": null,
            "data": {
                "id": 1,
                "username": "admin",
                "role": 1,
                "email": "admin",
                "gender": "男",
                "avatar": null
            },
            "otherData": {}
        }
    },
    userLogin:()=>{
        return{
            status: true,
            code: 0,
            message: "登录成功",
            data: {
                id: 1,
                username: "admin",
                role: 1,
                email: "admin",
                gender: "男",
                avatar: null
            },
            "otherData": {}
        }
    },
    getMemberList: () => {
        return {
            status: true,
            code: 0,
            data: [
                { id: '10001', name: '姓名1', role: 'admin', status: 'active' },
                { id: '10002', name: '姓名2', role: 'counselor', status: 'active' },
                { id: '10003', name: '姓名3', role: 'admin', status: 'active' },
                { id: '10004', name: '姓名4', role: 'counselor', status: 'inactive' },
                { id: '10005', name: '姓名5', role: 'admin', status: 'active' }
            ]
        }
    }
}
