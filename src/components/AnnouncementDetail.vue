<template>
    <div>
      <h3>{{ announcement.title }}</h3>
      <p>发布人: {{ announcement.author }}</p>
      <p>日期: {{ announcement.date }}</p>
      <p class="content-text">内容: {{ announcement.content }}</p>
  
      <el-button v-if="!announcement.isRead" type="primary" @click="$emit('mark-read', announcement)">
        标记为已读
      </el-button>
      <el-tag v-if="announcement.isRead" type="success">已读</el-tag>
    </div>
  </template>
  
  <script setup>
  defineProps(['announcement']);
  </script>
  
  <style scoped>
  .content-text {
    line-height: 1.8;
    font-size: 1em;
  }
  </style>
  