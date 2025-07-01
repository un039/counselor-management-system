import request from "../utils/request";

export const userInfoService = () => request.get('/api/auth/userInfo')
export const userLogin = (loginData)=> request.get("/api/user/login",{
    params:{
        ...loginData   // 对象解构  （数组解构）
    }
})

export const userList = (params) => request.get('/api/user/list',{params})
export const deleteUser = (id) => request.delete('/api/user/'+id)
export const insertUser = (obj) => request.post('/api/user',obj)
export const updateUser = (obj) => request.put('/api/user',obj)
