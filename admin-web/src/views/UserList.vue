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

        <el-table-column prop="username" label="用户名" width="200">
          <template #default="scope">
            <div class="user-info">
              <!-- 头像显示 -->
              <el-avatar :size="24" :src="scope.row.avatar">
                {{ scope.row.username ? scope.row.username.charAt(0).toUpperCase() : 'U' }}
              </el-avatar>
              <span style="margin-left: 10px">{{ scope.row.username }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="nickname" label="昵称" width="180" />

        <el-table-column prop="role" label="角色" width="120" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.role === 'ADMIN' ? 'danger' : 'info'">
              {{ scope.row.role === 'USER' ? '普通用户' : (scope.row.role === 'ADMIN' ? '管理员' : scope.row.role) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="150" align="center">
          <template #default="scope">
            <!-- 状态切换开关 -->
            <el-switch
                v-model="scope.row.status"
                inline-prompt
                active-text="正常"
                inactive-text="封禁"
                active-value="NORMAL"
                inactive-value="BANNED"
                :loading="scope.row.statusLoading"
                @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="注册时间" min-width="180" sortable />
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
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import request from "../utils/request.js";

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const searchForm = reactive({
  username: ''
})

const tableData = ref([])

// 1. 获取用户列表
const fetchUserList = async () => {
  loading.value = true
  try {
    // 接口文档: GET /admin/user/list
    // 参数: page, size, username
    const res = await request.get('/admin/user/list', {
      params: {
        page: currentPage.value,
        size: pageSize.value,
        username: searchForm.username || undefined
      }
    })

    console.log('用户列表:', res)

    if (res.code === 200) {
      // 假设 res.data 包含了 records 和 total
      // 如果你的后端直接返回 res.data = { records: [...], total: 10 }
      const pageData = res.data
      tableData.value = pageData.records || []
      total.value = pageData.total || 0
    } else {
      ElMessage.error(res.msg || '获取列表失败')
    }
  } catch (error) {
    console.error('获取用户列表错误:', error)
    ElMessage.error('网络请求失败')
  } finally {
    loading.value = false
  }
}

// 2. 更新用户状态
const handleStatusChange = async (row) => {
  row.statusLoading = true

  // 接口文档: POST /admin/user/status
  // Body: { userId, status }
  const params = {
    userId: row.id,
    status: row.status
  }

  try {
    const res = await request.post('/admin/user/status', params)

    if (res.code === 200) {
      ElMessage.success('状态更新成功')
    } else {
      throw new Error(res.msg || '更新失败')
    }
  } catch (error) {
    // 失败回滚
    row.status = row.status === 'NORMAL' ? 'BANNED' : 'NORMAL'
    ElMessage.error(error.message || '状态更新失败')
  } finally {
    row.statusLoading = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchUserList()
}

// 重置
const resetSearch = () => {
  searchForm.username = ''
  handleSearch()
}

// 分页条数改变
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchUserList()
}

// 页码改变
const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchUserList()
}

// 初始化
onMounted(() => {
  fetchUserList()
})
</script>

<style scoped>
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