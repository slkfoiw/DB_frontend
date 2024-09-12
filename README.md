# buaa-cafeterias
src/api里有很多地方把原本调用后端api的地方注释掉换成返回测试数据了，正式使用时记得替换掉

侧边栏登录和注册按钮只在未登录时显示，"我的"按钮只在登录后显示，前端模拟登录可以调整src/store/user.js里//temp下的代码

### 一些额外安装的库
```sh
npm install unplugin-auto-import
npm install unplugin-vue-components
npm install -D sass
npm install vue-infinite-scroll
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
