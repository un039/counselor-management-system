<script setup lang="ts">
import {Delete, Edit} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import {getHouseData} from "../../api/mock";
import {ref} from "vue";
import {useUserInfoStore} from "../../stores/userInfo";
import request from '../../utils/request';

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(5)//每页条数
const tableData = ref([])
const form = ref(null)
const dialogFormVisible = ref(false)
const titleName = ref('')
const userInfoStore = useUserInfoStore();
const formLabelWidth = '140px'
const imageUrl = ref('')
// 商品添加、编辑表单数据模型
const formData = ref({
  garden: '',
  campus: '',
  buildNum:'',
  roomNum: '',
  bedNum:'',
})
const formParams = ref({
  garden: '',
})

// 当每页条数发生了变化，会调用
const handleSizeChange = (val) => {
  pageSize.value = val
  getHouseList()
}
// 当当前页面发生变化，会调用
const handleCurrentChange = (val) => {
  pageNum.value = val
  getHouseList()
}
const getHouseList = ()=>{
  const params = {
    pageNum : pageNum.value,
    pageSize: pageSize.value,
    ...formParams.value,
  }
  getHouseData(params).then(res=>{
    if (res.status) {
      tableData.value = res.data.tableData
      total.value = res.data.total
    }
  })
}
getHouseList()
const resetParams = ()  =>{
  formParams.value = {
    garden: '',
  }
  getHouseList()
}
const addGoods= ()  =>{
  form.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await insertGoods(formData.value)
        if (res.status) {
          getHouseList()
          dialogFormVisible.value = false
          ElMessage.success('添加成功')
        }
      } catch (error) {
        ElMessage.error('添加失败，请重试')
      }
    }
  })
}

const editGoods = () =>{
  form.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await updateGoods(formData.value)
        if (res.status) {
          getHouseList()
          dialogFormVisible.value = false
          ElMessage.success('修改成功')
        }
      } catch (error) {
        ElMessage.error('修改失败，请重试')
      }
    }
  })
}
const  showAddDialog = (title)=>{
  // 清空表单
  titleName.value = title
  resetFormData()
  dialogFormVisible.value = true
}
const resetFormData = ()=>{
  formData.value = {
    garden: '',
    campus: '',
    buildNum:'',
    roomNum: '',
    bedNum:'',
  }
}
// 表单校验
const rules = {
  name: [
    {required: true, message: '请输入商品名', trigger: 'blur'},
    {min: 5, max: 16, message: '长度为5-16位', trigger: 'blur'},
  ],
  intro: [
    {required: true, message: '请输入简介', trigger: 'blur'},
  ],
  price: [
    {required: true, message: '请输入价格', trigger: 'blur'},
  ],
  pubdate: [
    {required: true, message: '请选择时间', trigger: 'change'},
  ],
  typeId: [
    {required: true, message: '请选择时间', trigger: 'change'},
  ],
  // picture: [
  //   {required: true, message: '请上传图片', trigger: 'change'},
  // ],
  flag:[
    {required: true, message: '请选择状态', trigger: 'change'},
  ]
}
// 定义缺少的函数
const showEditDialog = (row, title) => {
  titleName.value = title
  formData.value = {
    ...row
  }
  dialogFormVisible.value = true
}

const deleteById = async (id) => {
  try {
    await request.delete(`/api/house/${id}`)
    ElMessage.success('删除成功')
    getHouseList()
  } catch (error) {
    ElMessage.error('删除失败，请重试')
  }
}

// 模拟 insertGoods 和 updateGoods 函数
const insertGoods = async (data) => {
  try {
    const res = await request.post('/api/house', data)
    return res.data
  } catch (error) {
    throw error
  }
}

const updateGoods = async (data) => {
  try {
    const res = await request.put('/api/house', data)
    return res.data
  } catch (error) {
    throw error
  }
}
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>房源管理</span>
        <div class="extra">
          <el-button type="primary" @click="showAddDialog('添加房源')">添加商品</el-button>
        </div>
      </div>
    </template>
    <!-- 搜索表单 -->
    <el-form inline  :model="formParams">
      <el-form-item label="园区：">
        <el-input v-model="formParams.garden" placeholder="请输入园区名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getHouseList">搜索</el-button>
        <el-button @click="resetParams">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 商品列表 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="园区名称"  prop="garden"></el-table-column>
      <el-table-column label="所在校区" prop="campus"></el-table-column>
      <el-table-column label="楼栋数量" prop="buildNum"></el-table-column>
      <el-table-column label="房间总数" prop="roomNum" show-overflow-tooltip></el-table-column>
      <el-table-column label="床位总数" prop="bedNum"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="showEditDialog(row,'编辑用户')"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="deleteById(row.id)"></el-button>
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

  <el-drawer v-model="dialogFormVisible" direction="rtl">
    <template #header>
      <h4>{{titleName}}</h4>
    </template>
    <template #default>
      <el-form ref="form" :model="formData"  label-position="top" :rules="rules">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="formData.name" autocomplete="off" placeholder="请输入商品名" />
        </el-form-item>
        <el-form-item label="价格" :label-width="formLabelWidth" prop="price">
          <el-input v-model="formData.price" autocomplete="off" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="时间：" prop="pubdate" :label-width="formLabelWidth">
          <el-date-picker
              v-model="formData.pubdate"
              type="date"
              placeholder="请选择时间"
              size="default"
              value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="状态：" prop="flag" :label-width="formLabelWidth">
          <el-select placeholder="请选择" v-model="formData.flag" >
            <el-option label="上架" value="1"></el-option>
            <el-option label="下架" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="简介" :label-width="formLabelWidth" prop="intro">
          <el-input type="textarea" v-model="formData.intro" autocomplete="off" placeholder="请输入简介" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="dialogFormVisible =false">取消</el-button>
        <el-button type="primary" @click="titleName==='添加商品'?addGoods():editGoods()">确认</el-button>
      </div>
    </template>
  </el-drawer>
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
