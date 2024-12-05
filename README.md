# DB_frontend

## api
src/api里有很多地方把原本调用后端api的地方注释掉换成返回测试数据了，正式使用时记得替换掉

1. 管理员相关的api在api/admin.js
2. 宿管相关的api在api/dormManager.js
3. 学生相关的api在api/student.js
4. 登录、注册的api在user.js里（这个还没开始写，用的原来的，后面再修改、补充）

### 一些额外安装的库
```sh
npm install unplugin-auto-import
npm install unplugin-vue-components
npm install -D sass
npm install vue-infinite-scroll
npm install xlsx

npm install echarts vue-echarts
npm install file-saver
npm install echarts-gl --save

```
不全，可以根据控制台运行的报错提示安装相应的库

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production
```sh
npm run build
```
