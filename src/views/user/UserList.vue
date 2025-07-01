<script setup lang="ts">

import {Delete, Edit, Plus} from "@element-plus/icons-vue";
import {ref} from "vue";
import {deleteUser, insertUser, updateUser, userList} from "../../api/user";
import {ElMessage, ElMessageBox} from "element-plus";
import {useUserInfoStore} from "../../stores/userInfo";
//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(5)//每页条数
const userListData = ref([])
const gender = ref('')
const username = ref('')
const dialogFormVisible = ref(false)
const titleName = ref('')
const userInfoStore = useUserInfoStore();
// 用户添加、编辑表单数据模型
const formData = ref({
  username: '',
  email: '',
  gender:'',
  role: 0
})
const form = ref(null)
const formLabelWidth = '140px'
// 获取用户列表
const getUserList = ()=>{
  const params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    username : username.value,
    gender: gender.value
  }
  userList(params).then(res=>{
    if (res.status) {
      userListData.value = res.data.records
      total.value = res.data.total
    }
  })
}
getUserList()
// 重置
const resetParams = ()=>{
  username.value = ''
  gender.value = ''
  getUserList()
}

// 当每页条数发生了变化，会调用
const handleSizeChange = (val) => {
  pageSize.value = val
  getUserList()
}
// 当当前页面发生变化，会调用
const handleCurrentChange = (val) => {
  pageNum.value = val
  getUserList()
}
// 删除用户
const deleteById = (id)=>{
  ElMessageBox.confirm(
      '确认删除吗，删除后不可恢复?',
      '温馨提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        deleteUser(id).then(res=>{
          if (res.status) {
            ElMessage.success('删除成功')
            getUserList()
          }
        })
      })
      .catch(() => {})
}

// 用户添加打开dialog
const showAddDialog = (title)=>{
  resetForm()
  titleName.value = title
  dialogFormVisible.value = true
}
// 用户添加
const addUser = () => {
  form.value.validate((valid)=>{
    if (valid) {
      insertUser(formData.value).then(res=>{
        if (res.status) {
          getUserList()
          ElMessage.success("添加成功")
          dialogFormVisible.value = false
        }
      })
    }
  })
};
// 清空表单
const resetForm=()=>{
  formData.value = {
    username :'',
    email:'',
    gender:'',
    role:1
  }
}
// 打开编辑dialog
const showEditDialog = (row,tile)=>{
  titleName.value = tile
  formData.value = {
    ...row
  }
  dialogFormVisible.value = true
}
// 更新用户
const editUser= ()=>{
  updateUser(formData.value).then(res =>{
    if (res.status) {
      getUserList()
      ElMessage.success("更新成功")
      dialogFormVisible.value = false
    }
  })
}
// 表单校验
const rules = {
  username: [
    {required: true, message: '请输入用户名', trigger: 'blur'},
    {min: 5, max: 16, message: '长度为5-16位', trigger: 'blur'},
  ],
  email: [
    {required: true, message: '请输入邮箱', trigger: 'blur'},
    {type: "email", message: '邮箱格式不正确', trigger: 'blur'},
  ],
  gender:[
    {required: true, message: '请选择性别', trigger: 'change'},
  ]
}
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>用户管理</span>
        <div class="extra">
          <el-button type="primary" @click="showAddDialog('添加用户')">添加用户</el-button>
        </div>
      </div>
    </template>
    <!-- 搜索表单 -->
    <el-form inline>
      <el-form-item label="用户名：">
        <el-input v-model="username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="性别：">
        <el-select placeholder="请选择" v-model="gender">
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getUserList">搜索</el-button>
        <el-button @click="resetParams">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 文章列表 -->
    <el-table :data="userListData" style="width: 100%">
      <el-table-column label="用户名" width="400" prop="username"></el-table-column>
      <el-table-column label="角色" prop="role">
        <template #default="{row}">
          <el-tag :type="row.role===1?'danger':'success'">{{row.role===1?'超管':'会员'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="性别" prop="gender"></el-table-column>
      <el-table-column label="添加时间" prop="createtime"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="showEditDialog(row,'编辑用户')"></el-button>
          <el-button :disabled="userInfoStore.userInfo.id===row.id" :icon="Delete" circle plain type="danger" @click="deleteById(row.id)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"/>
      </template>
    </el-table>
    <!-- 分页条 -->
    <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[5 ,10, 15]"
                   layout="jumper, total, sizes, prev, pager, next" background :total="total"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end"/>
  </el-card>
  <el-dialog v-model="dialogFormVisible" :title="titleName" width="500">
    <el-form ref="form" :model="formData"  label-position="top" :rules="rules">
      <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
        <el-input v-model="formData.username" autocomplete="off" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
        <el-input v-model="formData.email" autocomplete="off" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="性别" :label-width="formLabelWidth" prop="gender">
        <el-select v-model="formData.gender" placeholder="请选择性别">
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="titleName ==='添加用户'?addUser():editUser()">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>


</template>

<style scoped lang="scss">
.page-container {
  min-height: 100%;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>