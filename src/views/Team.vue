<template>
  <div class="team-container">
    <div class="background-layer"></div>
    <div class="team-header">
      <img src="https://buaaxiaolanshu.oss-cn-beijing.aliyuncs.com/static/aboutus.png" alt="team-bg" class="team-bg" />
    </div>
    <img class="tbmx" src="https://buaaxiaolanshu.oss-cn-beijing.aliyuncs.com/static/tbmx.png">
    <div class="special">
      <img src="https://buaaxiaolanshu.oss-cn-beijing.aliyuncs.com/static/xc-ava.jpg">
      <img src="https://buaaxiaolanshu.oss-cn-beijing.aliyuncs.com/static/whaoe.jpg">
    </div>
    <div class="team-members">
      <a :href="member.github" target="_blank" class="team-member" v-for="member in teamMembers" :key="member.id" :style="{ backgroundImage: `url(${member.bgImage})` }">
        <div class="overlay"></div>
        <img :src="member.avatar" alt="头像" class="avatar" />
        <h2>{{ member.name }}</h2>
        <p>{{ member.description1 }}</p>
        <p>{{ member.description2 }}</p>
        <p>{{ member.description3 }}</p>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Team',
  setup() {
    const teamMembers = [
      {
        id: 1,
        name: '🌈',
        description1: '后端开发',
        description2: '部分前端样式设计',
        description3: 'API测试',
        avatar: 'https://buaaxiaolanshu.oss-cn-beijing.aliyuncs.com/static/yyb-ava.jpg',
        bgImage: 'https://buaaxiaolanshu.oss-cn-beijing.aliyuncs.com/static/yyb-ava.jpg',
        github: 'https://github.com/yyybbbyyyb'
      },
      {
        id: 2,
        name: '鱼籽饭',
        description1: '整体前端框架设计与开发',
        description2: '初始数据集收集和整理',
        description3: 'API设计',
        avatar: 'https://buaaxiaolanshu.oss-cn-beijing.aliyuncs.com/static/fzy-ava.jpg',
        bgImage: 'https://buaaxiaolanshu.oss-cn-beijing.aliyuncs.com/static/fzy-ava.jpg',
        github: 'https://github.com/zz-orb'
      },
      {
        id: 3,
        name: 'Toryn',
        description1: 'API测试',
        description2: '部分前端样式设计',
        description3: '服务器部署',
        avatar: 'https://buaaxiaolanshu.oss-cn-beijing.aliyuncs.com/static/yrj-ava.jpg',
        bgImage: 'https://buaaxiaolanshu.oss-cn-beijing.aliyuncs.com/static/yrj-ava.jpg',
        github: 'https://github.com/Linboyan-trc'
      },
      {
        id: 4,
        name: '梧桉',
        description1: 'API设计',
        description2: '整体前端框架设计与开发',
        description3: '初始数据集收集和整理',
        avatar: 'https://buaaxiaolanshu.oss-cn-beijing.aliyuncs.com/static/fzw-ava.jpg',
        bgImage: 'https://buaaxiaolanshu.oss-cn-beijing.aliyuncs.com/static/fzw-ava.jpg',
        github: 'https://github.com/slkfoiw'
      }
    ];

    return {
      teamMembers
    };
  }
};
</script>

<style scoped>
.team-container {
  position: relative;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #FFFFFF;
  height: 100vh;
  overflow: hidden;
}

.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 103, 255, 0.3), rgba(255, 255, 255, 0.3), rgba(0, 103, 255, 0.3), rgba(255, 255, 255, 0.3));
  z-index: 0; /* 使背景层位于最底层 */
}

.team-header {
  height: 25vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tbmx {
  width: 90%;
  height: 5%;
  object-fit: contain;
}

.special {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.special img {
  height: 8vh;
  width: 8vh;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 20px;
}

.team-bg {
  width: 90%;
  height: 70%;
  object-fit: contain;
}

.team-members {
  height: 65vh;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* 使用 CSS Grid */
  gap: 20px;
  width: 95%;
  padding: 20px;
  overflow-y: auto;
}

.team-member {
  position: relative;
  padding: 20px;
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s, box-shadow 0.3s;
  text-decoration: none; /* 去除链接下划线 */
  color: inherit; /* 继承字体颜色 */
}

.team-member::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3); /* 初始透明度 */
  border-radius: 12px;
  z-index: 1;
}

.team-member .overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.6); /* 初始半透明覆盖层 */
  border-radius: 12px;
  z-index: 2;
  transition: background-color 0.3s; /* 平滑过渡效果 */
}

.team-member:hover .overlay {
  background-color: rgba(255, 255, 255, 0.05); /* 鼠标悬停时更显现 */
}

.team-member:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.team-member:hover h2,
.team-member:hover p {
  color: #fff; /* 鼠标悬停时字体颜色变为白色 */
}

.team-member img,
.team-member h2,
.team-member p {
  position: relative;
  z-index: 3; /* 确保内容在覆盖层之上 */
  color: #000; /* 默认字体颜色为黑色 */
  transition: color 0.3s; /* 平滑过渡效果 */
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
}

h2 {
  font-size: 2em;
  margin: 20px 0;
  font-family: 'Georgia', serif; /* 更改字体 */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2); /* 添加文字阴影 */
}

p {
  font-size: 1.1em; /* 增大字体 */
  font-family: 'Georgia', serif; /* 更改字体 */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2); /* 添加文字阴影 */
  margin: 15px 0; /* 增加上下间距 */
}

@media (max-width: 768px) {
  .team-header {
    height: 50vh;
  }

  .team-members {
    height: 50vh;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  .team-member {
    padding: 10px;
  }

  .avatar {
    width: 80px;
    height: 80px;
  }

  h2 {
    font-size: 1.2em;
  }

  p {
    font-size: 0.9em;
  }
}
</style>
