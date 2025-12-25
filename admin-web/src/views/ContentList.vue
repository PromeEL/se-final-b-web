<template>
  <div class="post-list">
    <h2>内容管理</h2>

    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column prop="id" label="帖子ID" width="80" />

      <!-- 文本内容列 -->
      <el-table-column prop="textContent" label="文本内容" show-overflow-tooltip />

      <!-- 媒体预览列 -->
      <el-table-column label="媒体预览" width="180">
        <template #default="scope">
          <!-- 情况1：图片帖子 -->
          <div v-if="scope.row.type === 'IMAGE' && scope.row.mediaList && scope.row.mediaList.length > 0">
            <el-image
                style="width: 80px; height: 80px; border-radius: 4px;"
                :src="getMediaUrl(scope.row.mediaList[0].url)"
                :preview-src-list="scope.row.mediaList.map(item => getMediaUrl(item.url))"
                preview-teleported
                fit="cover"
            >
            </el-image>
            <span v-if="scope.row.mediaList.length > 1" style="font-size: 12px; color: #888; margin-left: 5px;">
              (共{{ scope.row.mediaList.length }}张)
            </span>
          </div>

          <!-- 情况2：视频帖子 -->
          <div v-else-if="scope.row.type === 'VIDEO' && scope.row.mediaList && scope.row.mediaList.length > 0">
            <video
                :src="getMediaUrl(scope.row.mediaList[0].url)"
                controls
                style="width: 140px; height: 80px; background: #000;"
            ></video>
          </div>

          <!-- 情况3：无媒体 -->
          <span v-else style="color: #ccc;">无媒体</span>
        </template>
      </el-table-column>

      <!-- 类型列 -->
      <el-table-column label="类型" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.type === 'TEXT'">纯文本</el-tag>
          <el-tag v-else-if="scope.row.type === 'IMAGE'" type="success">图片</el-tag>
          <el-tag v-else-if="scope.row.type === 'VIDEO'" type="warning">视频</el-tag>
          <el-tag v-else type="danger">混合/未知</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="userInfo.nickname" label="发布者" width="120" />

      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-popconfirm title="确定要强制删除这条帖子吗？" @confirm="handleDelete(scope.row.id)">
            <template #reference>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 【新增】分页组件 -->
    <div class="pagination-container">
      <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '../utils/request'
import { ElMessage } from 'element-plus'

const tableData = ref([])

// 【新增】分页相关变量
const currentPage = ref(1) // 当前页码
const pageSize = ref(10)   // 每页显示条数
const total = ref(0)       // 总条数

const BASE_URL = 'http://111.230.39.246:8080'

const getMediaUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${BASE_URL}${path}`
}

// 【修改】获取数据函数，增加分页参数
const fetchData = async () => {
  try {
    // 注意：这里的 params 参数名 (pageNum, pageSize) 需要和你后端的接收参数名一致
    // 如果后端用的是 'page', 'limit'，请自行修改下方 key 值
    const res = await request.get('/admin/post/list', {
      params: {
        page: currentPage.value,
        size: pageSize.value
      }
    })

    // 兼容处理返回结构，并获取 total
    const dataObj = res.data || res // 防止 request 拦截器处理层级不同

    if (dataObj && dataObj.records) {
      tableData.value = dataObj.records
      total.value = Number(dataObj.total) || 0 // 更新总数
    } else {
      tableData.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('请求失败:', error)
    ElMessage.error('获取列表失败')
  }
}

// 【新增】每页条数改变
const handleSizeChange = (val) => {
  pageSize.value = val
  // 切换大小时通常重置回第一页，或者停留在当前页（视业务需求而定）
  currentPage.value = 1
  fetchData()
}

// 【新增】页码改变
const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchData()
}

const handleDelete = async (id) => {
  try {
    await request.post(`/admin/post/delete/${id}`)
    ElMessage.success('删除成功')

    // 如果当前页只有一条数据且不是第一页，删除后自动跳转到上一页
    if (tableData.value.length === 1 && currentPage.value > 1) {
      currentPage.value--
    }

    fetchData()
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.post-list {
  padding: 20px;
}

/* 【新增】分页栏样式 */
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end; /* 靠右显示，如果想居中改为 center */
}
</style>