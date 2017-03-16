## 基于React打造的我的画廊

### 项目概览
1. 预览地址：http://dodomonster.red/galllery-by-react/
2. 根据慕课网 Materliu老师的在线课程
    React实战--打造画廊应用（上）：http://www.imooc.com/learn/507
    React实践图片画廊应用（下） ： http://www.imooc.com/learn/652

### 项目下载运行
1.下载项目：git clone git@github.com:DodoMonster/galllery-by-react.git
2.下载依赖：进入到目录gallery-by-react 运行 `npm install`。如果有安装cnpm的话用cnpm会快得多，没有的话也可以从现在就安装cnpm
3.npm start 或者 npm run start

### 爬坑
因为Materliu老师在录制视频的时候是比较早，现在版本变更迭代太快，所以看着视频会有很多的不相同，因此就会有很多坑。自己也花了两天的时间趁着上班任务不是很繁重才成功地从坑里爬了起来。

1.首先你从yeoman上安装的react-webpack generator已经和老师用的差很远了。webpack配置文件只剩一个webpack.config.js，没有了webpack.dist.config.js，而且web pack.config.js的内容和老师授课中使用的webpack.config.js中的内容是相差甚远的，但是你打开cfg文件夹中会发现有好几个js，而其中的default.js就是老师授课中的webpack.config.js，dist.js自然就是webpack.dist.config.js。

2.另外老师在查找DOM时有用到React.findDOMNode这个方法，但是没有说明首先需要在Main.js文件中`import ReactDOM form 'react-dom';`然后才使用ReactDOM.findDOMNode()。

3.另外老师也没有讲到翻转背面的样式编写img-back，此处双手奉上:
```css
    .img-back {
      position: absolute;
      /* 相对于img-sec进行定位 */
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: 50px 40px;
      overflow: auto;
      color: #666;
      background: #fff;
      transform: rotateY(180deg) translateZ(1px); // translazeZ(1px) 解决safari浏览器图片翻转显示有问题
    }
```

4.因为新版本中已经移除了grunt，但是老师用的旧版本却还有它的存在，因此老师用的很多bash运运行命令中都是使用的grunt，在此总结一下：
- `grunt serve` 转为使用 `npm start`
- `grunt serve:dist` 转为使用 `npm run serve:dist`

其实这些命令在package.json文件中的scripts都有列出来，只要在前面加上`npm run`即可运行

5.还有因为版本更新迭代太快，老师在课程编写完代码时react.Component中的函数与函数之间间隔是有用到逗号','，但是在新版本中这样做的话会报错，函数与函数之间间隔是不需要逗号','的。
而react.createClass中的函数与函数之间间隔是需要用到逗号','。

### 把项目发布到github-pages上
当npm start的时候已经成功完美地实现需求，接着需要把项目代码在github-pages中预览时，使用的命令和老师也是有些不同的，而且也掉坑里了。

#### git步骤命令
1.git add dist
2.git commit -m "publish project to github-pages"
3.git subtree push --prefix=dist origin gh-pages

#### 继续爬坑

1.成功发布到gh-pages,打开gh-pages的预览地址，发现app.js文件找不到404了。
    解决方法：
        - 修改default.js中的`publicPath:'/assets'` 为：`publicPath:'galler-by-react/assets'.            

        - 修改index.html中的
        ```
           `<script type="text/javascript" src="/assets/app.js"></script>`
            为：`<script type="text/javascript" src="assets/app.js"></script>` 
        ```
        - 再重新运行上面列出的git步骤命令即可。

2.app.js找到之后，却又发现图片都找不到404了。我们在package.json文件中的scripts可以看到：

```
 "serve:dist": "node server.js --env=dist",
  "dist": "npm run copy & webpack --env=dist",
  "copy": "copyfiles -f ./src/index.html ./src/favicon.ico ./src/images ./dist",
```

 这三个脚本命令，老师课程上说的`grunt serve:dist` 实际就是 "serve:dist" ，输入 `npm run serve:dist`。

 而把项目发布到githbu-pages上的内容实际是dist文件夹下的内容，而我们再回看package.json文件中的"dist":"npm run copy"，因此我们再看看"copy"脚本命令中copy的内容只有./src/index.html ./src/favicon.ico，可是我们还需要展示图片。因此问题就是在运行`npm run dist`时没有把images目录复制到dist目录中。

解决方法：
    - 直接手动操作复制images粘贴到dist目录下
    - 也可以修改"copy"命令为:"copy": "copyfiles -f ./src/index.html ./src/favicon.ico ./src/images ./dist"，即添加./src/images。后再运行一遍上述列出的git步骤命令即可。


### 收获以及感想
1. 在macOS的浏览器上使用灰阶渲染字体，修复字体过粗问题：
    - 灰阶渲染是通过控制字体轮廓上像素点的亮度，达到字体原始形状的方法
    - 亚像素渲染则利用了LCD屏幕中每个像素是由RGB三个亚像素的颜色和亮度混合而成一个完整像素的颜色这一原理，将字体上的轮廓点由三个亚像素体现达到原始形状的方法，与灰阶渲染相比，分辨率在垂直方向上放大了三倍，因此，渲染效果更好。但是，所消耗的内存也更多。

因此在手机屏幕上，为了减少CPU的开销，使用灰阶渲染。但是在macOS操作系统上，采用的是亚像素渲染这种方式。

这会导致白色、亮色的字体，在深色背景下会显得过粗，严重情况下看上去会模糊。 
但是我们可以通过修改浏览器上的属性，告诉浏览器怎么来渲染字体。

```
-webkit-font-smoothing: antialiased; //开启chrome在macOS上的灰阶平滑
-moz-osx-font-smoothing: grayscale; //开启firefox在macOS上的灰阶平滑
```

2. CSS3属性 perspective ，设置元素被查看位置的视图。但是目前浏览器都不支持 perspective 属性。只有Chrome 和 Safari 支持替代的 -webkit-perspective 属性。

3. Safari浏览器transform兼容性问题。`transform: rotateY(180deg) translateZ(1px);` 在transform中使块在Z轴上2D旋转1px，使块突出来一点点，才可以正常覆盖另一面。
4. 进一步了解了React以及终于开始了React实战动手做了第一个小demo