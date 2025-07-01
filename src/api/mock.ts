import Mock from 'mockjs'
import houseApi from './mockData/house.ts'
import request from "../utils/request";
import userApi from './mockData/user.ts'

// 拦截请求
Mock.mock('/house/getData', houseApi.getHouseData())
export const getHouseData = () => request.get('/house/getData')

Mock.mock('/api/auth/userInfo','get', userApi.getUserInfo())
Mock.mock('/api/user/login','get', userApi.userLogin())
export const userLogin = () => request.get('/api/user/login')
