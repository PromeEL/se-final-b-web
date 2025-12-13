<template>
  <div class="user-list-container">
    <!-- 顶部工具栏 -->
    <el-card class="filter-card" shadow="hover">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input 
            v-model="searchForm.username" 
            placeholder="请输入用户名" 
            clearable 
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon> 查询
          </el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
        <el-form-item style="margin-left: auto;">
          <el-button type="success" plain>
            <el-icon><Plus /></el-icon> 新增用户
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card" shadow="hover">
      <el-table 
        :data="tableData" 
        style="width: 100%" 
        border 
        stripe
        v-loading="loading"
        header-cell-class-name="table-header"
      >
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="username" label="用户名" width="180">
          <template #default="scope">
            <div class="user-info">
              <el-avatar :size="24" :src="scope.row.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
              <span style="margin-left: 10px">{{ scope.row.username }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="180" sortable />
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              link
              size="small"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              link
              size="small"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'
import axios from 'axios'

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

const searchForm = reactive({
  username: ''
})

// 模拟原始数据（数据库）
const mockUsers = [
  {
    id: 1,
    username: 'user_001',
    email: 'user001@example.com',
    createTime: '2023-12-01 10:00:00',
    status: 'active'
  },
  {
    id: 2,
    username: 'test_admin',
    email: 'admin@test.com',
    createTime: '2023-12-02 11:30:00',
    status: 'active'
  },
  {
    id: 3,
    username: 'student_a',
    email: 'student@school.edu',
    createTime: '2023-12-05 09:15:00',
    status: 'banned'
  },
  {
    id: 4,
    username: 'guest_99',
    email: 'guest@temp.com',
    createTime: '2023-12-10 14:20:00',
    status: 'active'
  },
]

// 表格显示的数据
const tableData = ref([])

const fetchUsers = async () => {
  loading.value = true
  
  // 模拟网络延迟
  setTimeout(() => {
    // 模拟后端查询逻辑
    const keyword = searchForm.username ? searchForm.username.trim().toLowerCase() : ''
    
    if (keyword) {
      tableData.value = mockUsers.filter(user => 
        user.username.toLowerCase().includes(keyword)
      )
    } else {
      tableData.value = [...mockUsers]
    }
    
    total.value = tableData.value.length
    loading.value = false
  }, 300)
}

const handleSearch = () => {
  ElMessage.success('执行搜索: ' + searchForm.username)
  fetchUsers()
}

const resetSearch = () => {
  searchForm.username = ''
  fetchUsers()
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除用户 "${row.username}" 吗?`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      // 模拟后端删除：从原始数据中移除
      const index = mockUsers.findIndex(item => item.id === row.id)
      if (index !== -1) {
        mockUsers.splice(index, 1)
      }
      
      // 重新获取数据以更新表格
      fetchUsers()
      
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

const handleSizeChange = (val) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`)
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.user-list-container {
  /* padding: 20px; */
}

.filter-card {
  margin-bottom: 20px;
}

.table-card {
  min-height: 500px;
}

.user-info {
  display: flex;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.table-header) {
  background-color: #f5f7fa !important;
  color: #606266;
  font-weight: 600;
}
</style>
