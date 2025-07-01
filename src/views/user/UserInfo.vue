<script setup lang="ts">
import {ref} from 'vue'
import {useUserInfoStore} from "../../stores/userInfo";
import {ElMessage} from "element-plus";
import {Plus} from "@element-plus/icons-vue";
import {updateUser} from "../../api/user";
import {useRouter} from 'vue-router';

const router = useRouter()

const userInfoStore = useUserInfoStore();

const userInfo = ref({
  ...userInfoStore.userInfo
})
const imageUrl = ref('')
const getImage = ()=>{
  imageUrl.value = userInfo.value.avatar
}
getImage()
const rules = {
  username: [
    {required: true, message: '请输入用户昵称', trigger: 'blur'},
    {
      pattern: /^\S{2,10}$/,
      message: '昵称必须是2-10位的非空字符串',
      trigger: 'blur'
    }
  ],
  email: [
    {required: true, message: '请输入用户邮箱', trigger: 'blur'},
    {type: 'email', message: '邮箱格式不正确', trigger: 'blur'}
  ],
  gender:[
    {required: true, message: '请选择性别', trigger: 'change'},
  ],
  avatar:[
    {required: true, message: '请上传头像', trigger: 'change'},
  ]
}

const updateUserInfo = () => {

  updateUser(userInfo.value).then(res =>{
    if (res.status) {
      userInfoStore.setUserInfo(userInfo.value)
      ElMessage.success("修改成功")
      router.push("/login")
    }
  })
}


const handleAvatarSuccess = (
    response,
    uploadFile
) => {
  imageUrl.value = response.url
  userInfo.value.avatar = response.url
}

const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('图片格式必须JPG格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片大小不超过 2MB!')
    return false
  }
  return true
}
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>基本资料</span>
      </div>
    </template>
    <el-row>
      <el-col :span="12">
        <el-form :model="userInfo" :rules="rules" label-width="100px" size="large">
          <el-form-item label="登录名称" prop="username">
            <el-input v-model="userInfo.username"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="userInfo.email"></el-input>
          </el-form-item>
          <el-form-item label="性别"  prop="gender">
            <el-select v-model="userInfo.gender" placeholder="请选择性别">
              <el-option label="男" value="男" />
              <el-option label="女" value="女" />
            </el-select>
          </el-form-item>
          <el-form-item label="头像" prop="avatar">
            <el-upload
                class="avatar-uploader"
                action="/api/file/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateUserInfo">提交修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>
<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
