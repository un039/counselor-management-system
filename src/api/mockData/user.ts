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
    }
}
