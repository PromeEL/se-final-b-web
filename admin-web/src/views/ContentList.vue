<template>
  <div>
    <h2>内容管理</h2>
    <el-table :data="posts" style="width: 100%">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="author" label="作者" width="120" />
      <el-table-column prop="content" label="内容" />
      <el-table-column prop="createdAt" label="发布时间" width="180" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button type="danger" size="small" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 模拟数据，后续可替换为后端接口
const posts = ref([
  { id: 1, author: 'Alice', content: '今天阳光真好 ☀️', createdAt: '2025-01-01' },
  { id: 2, author: 'Bob', content: '学习Vue3真开心！', createdAt: '2025-02-02' },
  { id: 3, author: 'Charlie', content: '我上传了一张新图片', createdAt: '2025-03-03' }
])

// 模拟加载数据
async function fetchPosts() {
  // 后续可以改成：
  // const res = await axios.get('http://后端地址/api/posts')
  // posts.value = res.data
}

// 删除帖子
async function handleDelete(id) {
  posts.value = posts.value.filter(p => p.id !== id)
  // 后续可以改成：
  // await axios.delete(`http://后端地址/api/posts/${id}`)
}

onMounted(fetchPosts)
</script>
