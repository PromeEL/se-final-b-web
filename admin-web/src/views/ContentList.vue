<template>
  <div class="post-list">
    <h2>内容管理</h2>

    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column prop="id" label="帖子ID" width="80" />

      <!-- 文本内容列 -->
      <el-table-column prop="textContent" label="文本内容" show-overflow-tooltip />

      <!-- 【新增】媒体预览列 -->
      <el-table-column label="媒体预览" width="180">
        <template #default="scope">

          <!-- 情况1：图片帖子 -->
          <div v-if="scope.row.type === 'IMAGE' && scope.row.mediaList && scope.row.mediaList.length > 0">
            <!-- 只显示第一张作为封面 -->
            <el-image
                style="width: 80px; height: 80px; border-radius: 4px;"
                :src="getMediaUrl(scope.row.mediaList[0].url)"
                :preview-src-list="scope.row.mediaList.map(item => getMediaUrl(item.url))"
                preview-teleported
                fit="cover"
            >
            </el-image>
            <!-- 如果图片多于1张，显示数量提示 -->
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '../utils/request'
import { ElMessage } from 'element-plus'

const tableData = ref([])

// 【重要】后端图片的基准地址
// 如果你的后端端口是 8080，请保持如下；如果是其他端口请修改
const BASE_URL = 'http://111.230.39.246:8080'

// 工具函数：拼接完整的图片/视频 URL
const getMediaUrl = (path) => {
  if (!path) return ''
  // 如果已经是 http 开头的完整路径，直接返回
  if (path.startsWith('http')) return path
  // 否则拼接后端地址
  return `${BASE_URL}${path}`
}

const fetchData = async () => {
  try {
    const res = await request.get('/admin/post/list')
    if (res.data && res.data.records) {
      tableData.value = res.data.records
    } else if (res.records) {
      tableData.value = res.records
    } else {
      tableData.value = []
    }
  } catch (error) {
    console.error('请求失败:', error)
  }
}

const handleDelete = async (id) => {
  try {
    await request.post(`/admin/post/delete/${id}`)
    ElMessage.success('删除成功')
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
</style>