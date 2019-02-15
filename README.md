## 前言
首先感谢 ```iview-admin``` 作者，项目是基于 iview 官方群 里一位可爱的小伙伴 分享的动态路由 ```iview-admin2.0``` 改的。因 官方版 用 ```Vuex``` 管理状态，刷新 页面，状态数据都会初始化。所以改动了代码，使用 ```localStorage``` 来存储一些用户数据。 做了登录和登出的实现，仅供参考。

## api 路由格式 JSON
模拟数据在 ```/src/mock/router.js```
大致格式如何：
```
[
	{
        "path": "/components",
        "name": "components",
        "meta": {
          "icon": "logo-buffer",
          "title": "组件"
        },
        "component": "Main",
        "children": [
          {
            "path": "markdown_page",
            "name": "markdown_page",
            "meta": {
              "icon": "logo-markdown",
              "title": "Markdown编辑器"
            },
            "component": "Markdown"
          },
          {
            "path": "editor_page",
            "name": "editor_page",
            "meta": {
              "icon": "ios-create",
              "title": "富文本编辑器"
            },
            "component": "Editor"
          }
        ]
    }
]
```

## 基于版本：v2.0-beta.4
官方版 => [在线访问](https://github.com/iview/iview-admin)
更多用法，请参照官方文档。



## install
```
// install dependencies
npm install
```

## Run
```
npm run dev
```

Development
```
npm run dev
```

Production(Build)
```
npm run build
```
打包注意事项：
```
iview-admin是用的cli3.0，所以之前的的build文件夹以及里面经常配置的文件是没有的，这些配置可以在项目根目
录的vue.config.js中配置。

首先，baseUrl是要修改的，clone下来的iview-admin中的vue.config.js中有写到
// 项目部署基础
const BASE_URL = '/iview-admin/'//将baseUrl的值设为 ‘./’即可，修改如下：baseUrl: './ '

接下来还需要配置router文件夹下的index.js中router的mode为hash
　　　const router = new Router({
　　　　routes,
　　　　mode: 'hash'                     // 项目中本来mode: 'history'
　　　})

此时可以进行打包了，打包完毕后可以在本地打开你的index.html文件预览，但是发现，图片字体等资源都是未找到，通过f12查看css里的图片路径发现，引入的路径是css/img/xxx.png，但是打包完毕的img文件夹和css文件夹是在一个目录里，自行移动一下就解决了。
```
