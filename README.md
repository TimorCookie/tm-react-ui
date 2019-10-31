### 一、什么是webpack，为什么使用它？
#### 1.1 什么是webpack？
简单来说，它其实就是一个模块打包器。  
#### 1.2 为什么使用它？
如果像以前开发时一个html文件可能会引用十几个js文件,而且顺序还不能乱，因为它们存在依赖关系，同时对于ES6+等新的语法，less, sass等CSS预处理都不能很好的解决……，此时就需要一个处理这些问题的工具。
Webpack就是为处理这些问题而生的，它就是把你的项目当成一个整体，通过一个入口主文件（如：index.js）,从这个文件开始找到你的项目所有的依赖文件并处理它们，最后打包成一个（或多个）浏览器可识别的JavaScript文件。

### 二、一个简单的打包例子
#### 2.1 准备工作
首先新建一个空文件夹，用于创建项目，在终端中进入文件夹，如下我在桌面建了一个名为webpack4.x的文件夹，使用终端进入文件夹后使用npm init命令创建一个package.json文件。

```
npm init
```
输入这个命令后，终端会问你一系列诸如项目名称，项目描述，作者等信息，不过如果你不打算发布这个模块，直接一路回车就好。（也可以使用npm init -y这个命令来一次生成package.json文件，这样终端不会询问你问题）。
#### 2.2 安装webpack
如果你想一步到位的话，就把全局webpack、webpack-cli和本地项目webpack、webpack-cli全都先装了，因为后面一些模块会用到。安装webapck时把webpack-cli也装上是因为在webpack4.x版本后webpack模块把一些功能分到了webpack-cli模块，所以两者都需要安装，安装方法如下：

```
npm install webpack webpack-cli --global
 //这是安装全局webpack及webpack-cli模块

npm install webpack webpack-cli --save-dev  //这是安装本地项目模块
```

#### tips:
上述命令可采用简写，install可简写为i,--global可简写为-g,--save-dev可简写为-D(这个命令是用于把配置添加到package.json的开发环境配置列表中，后面会提到)，--save可简写为-S，同时国内我们可以采用cnpm，配置方法可去这里查看，这样安装速度会相对较快。如下：

```
npm i webpack -g               //这是安装全局webpack命令
npm i webpack webpack-cli -D   //这是安装本地项目模块
```

#### 2.3 新建文件
在webpack-project文件夹中新建两个文件夹，分别为src文件夹和dist文件夹，接下来再创建三个文件:
-     index.html --放在dist文件夹中；
-     hello.js --放在src文件夹中；
-     index.js --放在src文件夹中；
我们在index.html中写下html代码，它的作用是为了引入我们打包后的js文件：

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Webpack Project</title>
</head>
<body>
    <div id='root'></div>
    <script src="bundle.js"></script>   <!--这是打包之后的js文件，我们暂时命名为bundle.js-->
</body>
</html>
```


我们在hello.js中导出一个模块：

```
// hello.js
module.exports = function() {
    let hello = document.createElement('div');
    hello.innerHTML = "Long time no see!";
    return hello;
  };
```



然后在index.js中引入这个模块（hello.js）:


```
//index.js 
const hello = require('./hello.js');
document.querySelector("#root").appendChild(hello());
```



上述操作就相当于我们把hello.js模块合并到了index.js模块，之后我们打包时就只需把index.js模块打包成bundle.js，然后供index.html引用即可，这就是最简单的webpack打包原理。  

#### 2.4 开始进行webpack打包
在终端中使用如下命令进行打包：

```
// webpack全局安装的情况下
webpack src/index.js --output dist/bundle.js  
// --output可简写为-o
```


上述就相当于把src文件夹下的index.js文件打包到dist文件下的bundle.js，这时就生成了bundle.js供index.html文件引用。

#### 2.5 通过配置文件来使用webpack
其实webpack是有很多功能的，也是很方便的，我们可以在当前项目的根目录下新建一个配置文件webpack.config.js，我们写下如下简单配置代码，目前只涉及入口配置（相当于我们的index.js，从它开始打包）和出口配置（相当于我们打包生成的bundle.js）。

```
// webpack.config.js
module.exports = {
    entry: __dirname + "/src/index.js", // 入口文件
    output: {
        path: __dirname + "/dist", //打包后的文件存放的地方
        filename: "bundle.js" //打包后输出文件的文件名
    }
}
```

注：__dirname是node.js中的一个全局变量，它指向当前执行脚本所在的目录但平时我们看到的脚手架配置也比较喜欢采用node.js的path模块来处理绝对路径，所以我们也可以采用如下的写法，和上述的效果是一样的：

```
// webpack.config.js
const path = require('path');
module.exports = {
    entry: path.join(__dirname, "/src/index.js"), // 入口文件
    output: {
        path: path.join( __dirname, "/dist"), //打包后的文件存放的地方
        filename: "bundle.js" //打包后输出文件的文件名
    }
}
```

注：path.join的功能是拼接路径片段。
有了这个配置文件，我们只需在终端中运行webpack命令就可进行打包，这条命令会自动引用webpack.config.js文件中的配置选项。


#### 2.6 更智能的打包方式
我们现在只在终端中使用webpack命令来进行打包，要是以后在打包的同时还有更多的操作呢，那不是还得写上更多的命令？所以我们得想办法把这些命令都集成起来，这时候之前的package.json文件就派上用场了。 现在的package.json文件大概就是如下这样：

```
{
  "name": "webpack4x",
  "version": "1.0.0",
  "description": "base config for webpack",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1" //我们要修改的是这里，JSON文件不支持注释，引用时请清除
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
   "webpack": "^4.41.1",
   "webpack-cli": "^3.3.9",
  }
}
```


修改如下：

```
{
  "name": "webpack4x",
  "version": "1.0.0",
  "description": "base config for webpack",
  "main": "index.js",
  "scripts": {
    "start": "webpack", //改成这样，注意使用时把注释删掉
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
   "webpack": "^4.41.1",
   "webpack-cli": "^3.3.9",
  }
}
```



注：package.json中的script会按你设置的命令名称来执行对应的命令。
这样我们就可以在终端中直接执行npm start命令来进行打包，start命令比较特殊，可以直接npm加上start就可以执行，如果我们想起其他的名称，如build时，就需要使用npm run加上build，即npm run build命令。  

### 三、构建本地服务器
现在我们是通过打开本地文件来查看页面的，看起来总感觉比较low，看别人用vue，react框架时都是运行在本地服务器上的，那我们能不能也那样呢？那必须的！  
#### 3.1 webpack-dev-server配置本地服务器
Webpack提供了一个可选的本地开发服务器，这个本地服务器基于node.js构建，它是一个单独的组件，在webpack中进行配置之前需要单独安装它作为项目依赖：

```
npm i webpack-dev-server -D
```


devServer作为webpack配置选项中的一项，以下是它的一些配置选项:
- contentBase ：设置服务器所读取文件的目录，当前我们设置为"./dist"
- port ：设置端口号，如果省略，默认为8080
- inline ：设置为true，当源文件改变时会自动刷新页面
- historyApiFallback ：设置为true，所有的跳转将指向index.html
现在我们把这些配置加到webpack.config.js文件上，如下：

```
// webpack.config.js
const path = require('path');
module.exports = {
    entry: path.join(__dirname, "/src/index.js"), // 入口文件
    output: {
        path: path.join( __dirname, "/dist"), //打包后的文件存放的地方
        filename: "bundle.js" //打包后输出文件的文件名
    },
    devServer: {
        contentBase: "./dist", // 本地服务器所加载文件的目录
        port: "8088",   // 设置端口号为8088
        inline: true, // 文件修改后实时刷新
        historyApiFallback: true, //不跳转
    }
}
```


我们继续在package.json文件中添加启动命令：

```
{
  "name": "webpack4x",
  "version": "1.0.0",
  "description": "base config for webpack",
  "main": "index.js",
  "scripts": {
    "build": "webpack",
    "dev": "webpack-dev-server --open"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^4.41.1",
    "webpack-cli": "^3.3.9",
    "webpack-dev-server": "^3.8.2",
  }
}
```



我们把start命令名称改为了build，这样比较语义化，平时的脚手架也多数采用这个名称，我们用dev（development的缩写，意指开发环境）来启动本地服务器，webpack-dev-server就是启动服务器的命令，--open是用于启动完服务器后自动打开浏览器，这时候我们自定义命令方式的便捷性就体现出来了，可以多个命令集成在一起运行，即我们定义了一个dev命令名称就可以同时运行了webpack-dev-server和--open两个命令。
现在在终端输入npm run dev运行服务器：
这样我们即可在http://localhost:8088/中查看页面(退出服务器，可使用ctrl+c后，再按y确认，即可退出服务器运行)  
#### 3.2 Source Maps调试配置
作为开发，代码调试当然少不了，那么问题来了，经过打包后的文件，你是不容易找到出错的地方的，Source Map就是用来解决这个问题的。
通过如下配置，我们会在打包时生成对应于打包文件的.map文件，使得编译后的代码可读性更高，更易于调试。

```
// webpack.config.js
const path = require('path');
module.exports = {
    entry: path.join(__dirname, "/src/index.js"), // 入口文件
    output: {
        path: path.join( __dirname, "/dist"), //打包后的文件存放的地方
        filename: "bundle.js" //打包后输出文件的文件名
    },
    devServer: {
        contentBase: "./dist", // 本地服务器所加载文件的目录
        port: "8088",  // 设置端口号为8088
        inline: true, // 文件修改后实时刷新
        historyApiFallback: true, //不跳转
    },
    devtool: 'source-map'  // 会生成对于调试的完整的.map文件，但同时也会减慢打包速度
}
```


配置好后，我们再次运行npm run build进行打包，这时我们会发现在dist文件夹中多出了一个bundle.js.map文件
如果我们的代码有bug，在浏览器的调试工具中会提示错误出现的位置，这就是devtool: 'source-map'配置项的作用。  

### 四、Loaders
loaders是webpack最强大的功能之一，通过不同的loader，webpack有能力调用外部的脚本或工具，实现对不同格式的文件的处理，例如把scss转为css，将ES66、ES7等语法转化为当前浏览器能识别的语法，将JSX转化为js等多项功能。
Loaders需要单独安装并且需要在webpack.config.js中的modules配置项下进行配置，Loaders的配置包括以下几方面：
- test：一个用以匹配loaders所处理文件的拓展名的正则表达式（必须）
- loader：loader的名称（必须）
- include/exclude：手动添加必须处理的文件（文件夹）或屏蔽不需要处理的文件（文件夹）（可选）；
- options：为loaders提供额外的设置选项（可选）
 
#### 4.1 配置css-loader
如果我们要加载一个css文件，需要安装配置style-loader和css-loader:

```
npm i style-loader css-loader -D
```




```
// webpack.config.js
const path = require('path');
module.exports = {
    entry: path.join(__dirname, "/src/index.js"), // 入口文件
    output: {
        path: path.join( __dirname, "/dist"), //打包后的文件存放的地方
        filename: "bundle.js" //打包后输出文件的文件名
    },
    devServer: {
        contentBase: "./dist", // 本地服务器所加载文件的目录
        port: "8088",  // 设置端口号为8088
        inline: true, // 文件修改后实时刷新
        historyApiFallback: true, //不跳转
    },
    devtool: 'source-map',  // 会生成对于调试的完整的.map文件，但同时也会减慢打包速度
    module: {
        rules: [
            {
                test: /\.css$/,   // 正则匹配以.css结尾的文件
                use: ['style-loader', 'css-loader']  // 需要用的loader，一定是这个顺序，因为调用loader是从右往左编译的
            }
        ]
    }
}
```



我们在src文件夹下新建css文件夹，该文件夹内新建style.css文件：

```
/* style.css */
body {
    background: gray;
}
```

在index.js中引用它：

```
//index.js 
import './css/style.css';  //导入css

const hello = require('./hello.js');
document.querySelector("#root").appendChild(hello());
```


这时我们运行npm run dev，会发现页面背景变成了灰色。
如果是要编译sass文件呢？  
#### 4.2 配置sass

```
npm i sass-loader node-sass -D // 因为sass-loader依赖于node-sass，所以还要安装node-sass
```


增加sass的rules:

```
// webpack.config.js
const path = require('path');
module.exports = {
    entry: path.join(__dirname, "/src/index.js"), // 入口文件
    output: {
        path: path.join( __dirname, "/dist"), //打包后的文件存放的地方
        filename: "bundle.js" //打包后输出文件的文件名
    },
    devServer: {
        contentBase: "./dist", // 本地服务器所加载文件的目录
        port: "8088",  // 设置端口号为8088
        inline: true, // 文件修改后实时刷新
        historyApiFallback: true, //不跳转
    },
    devtool: 'source-map',  // 会生成对于调试的完整的.map文件，但同时也会减慢打包速度
    module: {
        rules: [
            {
                test: /\.css$/,   // 正则匹配以.css结尾的文件
                use: ['style-loader', 'css-loader']  // 需要用的loader，一定是这个顺序，因为调用loader是从右往左编译的
            },
            {
                test: /\.(scss|sass)$/,   // 正则匹配以.scss和.sass结尾的文件
                use: ['style-loader', 'css-loader', 'sass-loader']  // 需要用的loader，一定是这个顺序，因为调用loader是从右往左编译的
            }
        ]
    }
}
```

在css文件夹中新建blue.scss文件：

```
/* blue.scss */
$blue: blue;
body{
    color: $blue;
}
```


在index.js中引入blue.scss：

```
//index.js 
import './css/style.css';   // 导入css
import './css/blue.scss';   // 导入scss

const hello = require('./hello.js');
document.querySelector("#root").appendChild(hello());
```




还有诸如图片loader、字体loader等就不一一列出来了，感兴趣的可前往[webpack官网](https://www.webpackjs.com/guides/asset-management/)查看，都是一样的套路。

### 五、Babel
Babel其实是一个编译JavaScript的平台，它可以编译代码帮你达到以下目的：
让你能使用最新的JavaScript代码（ES6，ES7...），而不用管新标准是否被当前使用的浏览器完全支持；
让你能使用基于JavaScript进行了拓展的语言，比如React的JSX；  
#### 5.1 Babel的安装与配置
Babel其实是几个模块化的包，其核心功能位于称为babel-core的npm包中，webpack可以把其不同的包整合在一起使用，对于每一个你需要的功能或拓展，你都需要安装单独的包（用得最多的是解析ES6的babel-preset-env包和解析JSX的babel-preset-react包）。

```
npm i babel-core babel-loader babel-preset-env babel-preset-react -D
// babel-preset-env的env表示是对当前环境的预处理，而不是像以前使用babel-preset-es2015只能针对某个环境
```




```
// webpack.config.js
const path = require('path');
module.exports = {
    entry: path.join(__dirname, "/src/index.js"), // 入口文件
    output: {
        path: path.join( __dirname, "/dist"), //打包后的文件存放的地方
        filename: "bundle.js" //打包后输出文件的文件名
    },
    devServer: {
        contentBase: "./dist", // 本地服务器所加载文件的目录
        port: "8088",  // 设置端口号为8088
        inline: true, // 文件修改后实时刷新
        historyApiFallback: true, //不跳转
    },
    devtool: 'source-map',  // 会生成对于调试的完整的.map文件，但同时也会减慢打包速度
    module: {
        rules: [
            {
                test: /\.css$/,   // 正则匹配以.css结尾的文件
                use: ['style-loader', 'css-loader']  // 需要用的loader，一定是这个顺序，因为调用loader是从右往左编译的
            },
            {
                test: /\.(scss|sass)$/,   // 正则匹配以.scss和.sass结尾的文件
                use: ['style-loader', 'css-loader', 'sass-loader']  // 需要用的loader，一定是这个顺序，因为调用loader是从右往左编译的
            },
            {                             // jsx配置
                test: /(\.jsx|\.js)$/,   
                use: {                    // 注意use选择如果有多项配置，可写成这种对象形式
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "env", "react"
                        ]
                    }
                },
                exclude: /node_modules/
            }
        ]
    }
}
```


现在我们已经可以支持ES6及JSX的语法了，我们用react来试试，但使用react还得先安装两个模块react和react-dom。

```
npm i react react-dom -S
```


接下来我们把hello.js文件修改一下：

```
// hello.js
import React, {Component} from 'react'; // 这两个模块必须引入

let name = 'Alan';

export default class Hello extends Component{
    render() {
        return (
            <div>
                {name}
            </div>
        );
    }
}
```

修改index.js文件：

```
//index.js 
import './css/style.css';  // 导入css
import './css/blue.scss';  // 导入scss

import React from 'react';
import {render} from 'react-dom';
import Hello from './hello'; // 可省略.js后缀名

render(<Hello />, document.getElementById('root'));
```


此时运行npm run dev后你可能会发现如下结果：
这是因为官方默认babel-loader | babel对应的版本需要一致: 即babel-loader需要搭配最新版本babel，详细可参考这篇博客。
两种解决方案:
回退低版本

```
npm i babel-loader@7 babel-core babel-preset-env -D
```



更新到最高版本:

```
npm i babel-loader @babel/core @babel/preset-env @babel/preset-react webpack -D
```


我这里采取的是第二个方案，升级后，
修改webpack.config.js

```
//webpack.config.js
const path = require('path');

module.exports = {
    entry: path.join(__dirname, '/src/index.js'), // 入口文件
    output: {
        filename: 'bundle.js',//打包后输出文件的文件名
        path: path.join(__dirname, '/dist'),//打包后的文件存放的地方
    },
    devServer: {
        contentBase: "./dist", // 本地服务器所加载文件的目录
        port: "8088",   // 设置端口号为8088
        inline: true, // 文件修改后实时刷新
        historyApiFallback: true, //不跳转
    },
    devtool: 'source-map', // 会生成对于调试的完整的.map文件，但同时也会减慢打包速度
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(scss|.sass)$/,
                use: ['style-loader', 'css-loader', 'sass-loader']// 需要用的loader，一定是这个顺序，因为调用loader是从右往左编译的
            },
            {
                test: /(\.jsx|\.js)$/,   
                use: {                    // 注意use选择如果有多项配置，可写成这种对象形式
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react'
                        ]
                    }
                },
                exclude: /node_modules/
            }
        ]
    }

}
```


再此运行npm run dev，得到如下结果：
到这里了是不是感觉很爽，不就是配置嘛，想要使用什么就配置什么。  
#### 5.2 优化babel配置
虽然babel完全可以在webpack.config.js中进行配置，但现在不是都提倡模块化嘛，也许之后babel膨胀了，增加了更多的配置项呢？ 那我们不如把它提取出来，把它放到根目录下的.babelrc文件下（webpack会自动调用.babelrc里的babel配置选项）。
我们在项目根目录下新建.babelrc文件：


```
// webpack.config.js
const path = require('path');
module.exports = {
    entry: path.join(__dirname, "/src/index.js"), // 入口文件
    output: {
        path: path.join( __dirname, "/dist"), //打包后的文件存放的地方
        filename: "bundle.js" //打包后输出文件的文件名
    },
    devServer: {
        contentBase: "./dist", // 本地服务器所加载文件的目录
        port: "8088",  // 设置端口号为8088
        inline: true, // 文件修改后实时刷新
        historyApiFallback: true, //不跳转
    },
    devtool: 'source-map',  // 会生成对于调试的完整的.map文件，但同时也会减慢打包速度
    module: {
        rules: [
            {
                test: /\.css$/,   // 正则匹配以.css结尾的文件
                use: ['style-loader', 'css-loader']  // 需要用的loader，一定是这个顺序，因为调用loader是从右往左编译的
            },
            {
                test: /\.(scss|sass)$/,   // 正则匹配以.scss和.sass结尾的文件
                use: ['style-loader', 'css-loader', 'sass-loader']  // 需要用的loader，一定是这个顺序，因为调用loader是从右往左编译的
            },
            {                             // jsx配置
                test: /(\.jsx|\.js)$/,   
                use: {                    // 注意use选择如果有多项配置，可写成这种对象形式
                    loader: "babel-loader"
                },
                exclude: /node_modules/   // 排除匹配node_modules模块
            }
        ]
    }
}
```




```
// .babelrc 使用时把注释删掉，该文件不能添加注释
{
    "presets": [
        "@babel/preset-env",
        "@babel/preset-react"
    ]
}
```

此时不出问题的话应该一切运行正常，接下来让我们进入强大的插件模块。  
### 六、插件（Plugins）
插件（Plugins）是用来拓展Webpack功能的，它们会在整个构建过程中生效，执行相关的任务。 Loaders和Plugins常常被弄混，但是他们其实是完全不同的东西，可以这么来说，loaders是在打包构建过程中用来处理源文件的（JSX，Scss，Less..），一次处理一个，插件并不直接操作单个文件，它直接对整个构建过程其作用。  
#### 6.1 插件如何使用
使用某个插件，需要通过npm进行安装，然后在webpack.config.js配置文件的plugins(是一个数组)配置项中添加该插件的实例，下面我们先来使用一个简单的版权声明插件。

```
// webpack.config.js
const webpack = require('webpack');  // 这个插件不需要安装，是基于webpack的，需要引入webpack模块

module.exports = {
    ...
    module: {
        rules: [
            {
                test: /\.css$/,   // 正则匹配以.css结尾的文件
                use: ['style-loader', 'css-loader']  // 需要用的loader，一定是这个顺序，因为调用loader是从右往左编译的
            },
            {
                test: /\.(scss|sass)$/,   // 正则匹配以.scss和.sass结尾的文件
                use: ['style-loader', 'css-loader', 'sass-loader']  // 需要用的loader，一定是这个顺序，因为调用loader是从右往左编译的
            },
            {                             // jsx配置
                test: /(\.jsx|\.js)$/,   
                use: {                    // 注意use选择如果有多项配置，可写成这种对象形式
                    loader: "babel-loader"
                },
                exclude: /node_modules/   // 排除匹配node_modules模块
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究')  // new一个插件的实例 
    ]
}
```



运行npm run build打包后我们看到bundle.js文件显示如下：
 
#### 6.2 自动生成html文件(HtmlWebpackPlugin)
到目前为止我们都是使用一开始建好的index.html文件，而且也是手动引入bundle.js，要是以后我们引入不止一个js文件，而且更改js文件名的话，也得手动更改index.html中的js文件名，所以能不能自动生成index.html且自动引用打包后的js呢？HtmlWebpackPlugin插件就是用来解决这个问题的：
首先安装该插件

```
npm i html-webpack-plugin -D
```


然后我们对项目结构进行一些更改：
把dist整个文件夹删除；
在src文件夹下新建一个index.template.html(名称自定义)文件模板（当然这个是可选的，因为就算不设置模板，HtmlWebpackPlugin插件也会生成默认html文件，这里我们设置模块会让我们的开发更加灵活），如下：

```
<!-- index.template.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Here is Template</title>
  </head>
  <body>
    <div id='root'>
    </div>
  </body>
</html>
```


webpack.config.js中我们引入了HtmlWebpackPlugin插件，并配置了引用了我们设置的模板，如下：

```
// webpack.config.js
const path = require('path');  // 路径处理模块
const webpack = require('webpack');  // 这个插件不需要安装，是基于webpack的，需要引入webpack模块
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 引入HtmlWebpackPlugin插件

module.exports = {
    entry: path.join(__dirname, "/src/index.js"), // 入口文件
    output: {
        path: path.join( __dirname, "/dist"), //打包后的文件存放的地方
        filename: "bundle.js" //打包后输出文件的文件名
    },
    devServer: {
        contentBase: "./dist", // 本地服务器所加载文件的目录
        port: "8088",  // 设置端口号为8088
        inline: true, // 文件修改后实时刷新
        historyApiFallback: true, //不跳转
    },
    devtool: 'source-map',  // 会生成对于调试的完整的.map文件，但同时也会减慢打包速度
    module: {
        rules: [
            {
                test: /\.css$/,   // 正则匹配以.css结尾的文件
                use: ['style-loader', 'css-loader']  // 需要用的loader，一定是这个顺序，因为调用loader是从右往左编译的
            },
            {
                test: /\.(scss|sass)$/,   // 正则匹配以.scss和.sass结尾的文件
                use: ['style-loader', 'css-loader', 'sass-loader']  // 需要用的loader，一定是这个顺序，因为调用loader是从右往左编译的
            },
            {                             // jsx配置
                test: /(\.jsx|\.js)$/,   
                use: {                    // 注意use选择如果有多项配置，可写成这种对象形式
                    loader: "babel-loader"
                },
                exclude: /node_modules/   // 排除匹配node_modules模块
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究'),  // new一个插件的实例 
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "/src/index.template.html")// new一个这个插件的实例，并传入相关的参数
        })
    ]
}
```


然后我们使用npm run build进行打包，你会发现，dist文件夹和html文件都会自动生成，如下：
为什么会自动生成dist文件夹呢？因为我们在output出口配置项中定义了出口文件所在的位置为dist文件夹，且出口文件名为bundle.js，所以HtmlWebpackPlugin会自动帮你在index.html中引用名为bundle.js文件，如果你在webpack.config.js文件中更改了出口文件名，index.html中也会自动更改该文件名，这样以后修改起来是不是方便多了？  
#### 6.3 清理/dist文件夹(CleanWebpackPlugin)
你可能已经注意到，在我们删掉/dist文件夹之前，由于前面的代码示例遗留，导致我们的/dist文件夹比较杂乱。webpack会生成文件，然后将这些文件放置在/dist文件夹中，但是webpack无法追踪到哪些文件是实际在项目中用到的。
通常，在每次构建前清理/dist文件夹，是比较推荐的做法，因此只会生成用到的文件，这时候就用到CleanWebpackPlugin插件了。

```
npm i clean-webpack-plugin -D
```




```
// webpack.config.js
...
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 引入CleanWebpackPlugin插件

module.exports = {
    ...
    plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究'),  // new一个插件的实例 
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "/src/index.template.html")// new一个这个插件的实例，并传入相关的参数
        }),
        new CleanWebpackPlugin(),  
    ]
}
```



插件的使用方法都是一样的，首先引入，然后new一个实例，实例可传入参数。
现在我们运行npm run build后就会发现，webpack会先将/dist文件夹删除，然后再生产新的/dist文件夹。  
#### 6.4 热更新(HotModuleReplacementPlugin)
HotModuleReplacementPlugin（HMR）是一个很实用的插件，可以在我们修改代码后自动刷新预览效果。   方法：
devServer配置项中添加hot: true参数。
因为HotModuleReplacementPlugin是webpack模块自带的，所以引入webpack后，在plugins配置项中直接使用即可。

```
// webpack.config.js
...
const webpack = require('webpack');  // 这个插件不需要安装，是基于webpack的，需要引入webpack模块

module.exports = {
    ...
    devServer: {
        contentBase: "./dist", // 本地服务器所加载文件的目录
        port: "8088",  // 设置端口号为8088
        inline: true, // 文件修改后实时刷新
        historyApiFallback: true, //不跳转
        hot: true // 热更新
    },
    ...
    plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究'),  // new一个插件的实例 
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "/src/index.template.html")// new一个这个插件的实例，并传入相关的参数
        }),
        new CleanWebpackPlugin(), 
        new webpack.HotModuleReplacementPlugin() // 热更新插件 
    ]
}
```

此时我们重新启动项目npm run dev后，修改hello.js的内容，会发现浏览器预览效果会自动刷新（也许反应会比较慢，因为我们使用了source-map和其他配置的影响，后面代码分离的时候我们再处理）。 
### 七、项目优化及拓展
#### 7.1 代码分离
在当前的开发环境都是提倡模块化，webpack自然不例外，我们前面的webpack.config.js配置文件，其实也没配置多少东西就这么多了，要是以后增加了更多配置，岂不是看得眼花缭乱，所以最好的方法就是把它拆分，方便管理：
1. 我们在根目录下新建三个文件，分别为webpack.common.js、webpack.dev.js、webpack.prod.js，分别代表公共配置文件、开发环境配置文件、生产环境（指项目上线时的环境）配置文件。
2. 安装一个合并模块插件：

```
npm i webpack-merge -D
```


3. 将webpack.config.js的代码拆分到上述新建的三个文件中，然后把webpack.config.js文件删除，具体如下：

```
// webpack.common.js
const path = require('path');  // 路径处理模块
const webpack = require('webpack');  // 这个插件不需要安装，是基于webpack的，需要引入webpack模块
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 引入HtmlWebpackPlugin插件

module.exports = {
    entry: path.join(__dirname, "/src/index.js"), // 入口文件
    output: {
        path: path.join( __dirname, "/dist"), //打包后的文件存放的地方
        filename: "bundle.js" //打包后输出文件的文件名
    },
    module: {
        rules: [
            {
                test: /\.css$/,   // 正则匹配以.css结尾的文件
                use: ['style-loader', 'css-loader']  // 需要用的loader，一定是这个顺序，因为调用loader是从右往左编译的
            },
            {
                test: /\.(scss|sass)$/,   // 正则匹配以.scss和.sass结尾的文件
                use: ['style-loader', 'css-loader', 'sass-loader']  // 需要用的loader，一定是这个顺序，因为调用loader是从右往左编译的
            },
            {                             // jsx配置
                test: /(\.jsx|\.js)$/,   
                use: {                    // 注意use选择如果有多项配置，可写成这种对象形式
                    loader: "babel-loader"
                },
                exclude: /node_modules/   // 排除匹配node_modules模块
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究'),  // new一个插件的实例 
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "/src/index.template.html")// new一个这个插件的实例，并传入相关的参数
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
}
```



```
// webpack.dev.js
const merge = require('webpack-merge');  // 引入webpack-merge功能模块
const common = require('./webpack.common.js'); // 引入webpack.common.js

module.exports = merge(common, {   // 将webpack.common.js合并到当前文件
    devServer: {
        contentBase: "./dist",   // 本地服务器所加载文件的目录
        port: "8088",  // 设置端口号为8088
        inline: true,  // 文件修改后实时刷新
        historyApiFallback: true, //不跳转
        hot: true     //热加载
    }
})
```




```
// webpack.prod.js
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 引入CleanWebpackPlugin插件

module.exports = merge(common, { // 将webpack.common.js合并到当前文件
    devtool: 'source-map',  // 会生成对于调试的完整的.map文件，但同时也会减慢打包速度
    plugins: [
        new CleanWebpackPlugin(),  // 所要清理的文件夹名称
    ]
})
```



4. 设置package.json的scripts命令：

```
{
  "name": "webpack4x",
  "version": "1.0.0",
  "description": "base config for webpack",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack --config webpack.prod.js",
    "start": "webpack-dev-server --open --config webpack.dev.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/TimorCookie/webpack4x.git"
  },
  "keywords": [
    "webpack"
  ],
  "author": "timokie",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/TimorCookie/webpack4x/issues"
  },
  "homepage": "https://github.com/TimorCookie/webpack4x#readme",
  "devDependencies": {
    "@babel/core": "^7.6.4",
    "@babel/preset-env": "^7.6.3",
    "@babel/preset-react": "^7.6.3",
    "babel-core": "^6.26.3",
    "babel-loader": "^8.0.6",
    "babel-preset-env": "^1.7.0",
    "babel-preset-react": "^6.24.1",
    "clean-webpack-plugin": "^3.0.0",
    "css-loader": "^3.2.0",
    "html-webpack-plugin": "^3.2.0",
    "node-sass": "^4.12.0",
    "sass-loader": "^8.0.0",
    "style-loader": "^1.0.0",
    "webpack": "^4.41.1",
    "webpack-cli": "^3.3.9",
    "webpack-dev-server": "^3.8.2",
    "webpack-merge": "^4.2.2"
  }
}
```


我们把build命令改为了==webpack --config webpack.prod.js==，意思是把打包配置指向webpack.prod.js配置文件，而之前我们只需要使用一个webpack命令为什么就可以运行了？因为webpack命令是默认指向webpack.config.js这个文件名称了，现在我们把文件名称改了，所以就需要自定义指向新的文件，dev命令中的指令也同理。
然后我们运行npm run build和npm run dev，效果应该和我们分离代码前是一样的。
注：说道package.json文件，顺便就多提几句，因为也许有些朋友可能对我们安装模块时加的-D、-S或-g命令存在一些疑惑，因为不知道什么时候加什么尾缀。 其实这个package.json文件是用于我们安装依赖的，可以把它当成一份依赖安装说明表，就是如果我们把项目上传或者发给其他的开发同事，肯定不会把/node_modules文件夹也发送过去，因为这太大了，不现实也没必要。 开发同事只需要有这份package.json文件，然后npm install就可以把我们所需要的依赖都安装下来，但前提是package.json文件上有记录，这就是安装模块时加上-D,-S命令的原因。 -D的全称是--save-dev指开发环境时需要用到的依赖，会记录在package.json文件中的devDependencies选项中，而-S是--save是指生产环境也就是上线环境中需要用到的依赖，会记录在package.json文件中的dependencies选项中，-g的全称是--global指安装全局命令，就是我们在本电脑的任何项目中都能使用到的命令，比如安装cnpm这个淘宝镜像命令就会用到-g命令。 所以我们在安装模块时一定不要忘了加上对应的尾缀命令，让我们的模块有迹可循，否则其他的开发同事接手你的项目的话，会不会下班后（放学后）在门口等你就不知道了。

#### 7.2 多入口多出口
到目前为止我们都是一个入口文件和一个出口文件，要是我不止一个入口文件呢？下面我们来试试：
在webpack.common.js中的entry入口有三种写法，分别为字符串、数组和对象，平时我们用得比较多的是对象，所以我们把它改为对象的写法，首先我们在src文件夹下新建two.js文件，名称任意。因为有多个入口，所以肯定得多个出口来进行一一对应了，所以entry和output配置如下：

```
// webpack.common.js
...
module.exports = {
    entry: {
        index: path.join(__dirname, "/src/index.js"),
        two: path.join(__dirname, "/src/two.js")
    }, 
    output: {
        path: path.join( __dirname, "/dist"), //打包后的文件存放的地方
        filename: "[name].js" //打包后输出文件的文件名
    },
    ...
}
```



```
// two.js
function two() {
    let element = document.createElement('div');
    element.innerHTML = '我是第二个入口文件';
    return element;
}

document.getElementById('root').appendChild(two());
```


然后我们运行npm run build打包后发现/dist文件夹下会多出two.js文件，同时index.html也会自动将two.js引入，然后我们运行npm run dev显示如下：
 
#### 7.3 增加css前缀、分离css、消除冗余css、分离图片
#####   1.增加css前缀
平时我们写css时，一些属性需要手动加上前缀，比如-webkit-border-radius: 10px;，在webpack中我们能不能让它自动加上呢？那是必须的，首先肯定得安装模块了：

```
npm i postcss-loader autoprefixer -D
```


安装好这两个模块后，在项目根目录下新建postcss.config.js文件:

```
// postcss.config.js
module.exports = {
    plugins: [
        require('autoprefixer')  // 引用autoprefixer模块
    ]
}
```

在style.css中增加以下样式：

```
/* style.css */
body {
    background: #999;
}

#root div{
    width: 200px;
    margin-top: 50px;
    transform: rotate(45deg); /* 这个属性会产生前缀 */
}
```


修改webpack.common.js文件中的css-loader配置：

```
...
module.exports = {
    ...
    module: {
        rules: [
            {
                test: /\.css$/,   // 正则匹配以.css结尾的文件
                use: [            
                    {loader: 'style-loader'}, // 这里采用的是对象配置loader的写法
                    {loader: 'css-loader'},
                    {loader: 'postcss-loader'} // 使用postcss-loader
                ]  
            },
            ...
        ]
    },
    ...
}
```


然后我们运行npm run dev后css样式中会自动添加前缀，显示如下：
#####   2.分离css
虽然webpack的理念是把css、js全都打包到一个文件里，但要是我们想把css分离出来该怎么做呢？

```
npm i extract-text-webpack-plugin@next -D  // 加上@next是为了安装最新的，否则会出错
```


安装完以上插件后在webpack.common.js文件中引入并使用该插件：

```
// webpack.common.js
...
const ExtractTextPlugin = require('extract-text-webpack-plugin') //引入分离插件

module.exports = {
    ...
    module: {
        rules: [
            {
                test: /\.css$/,   // 正则匹配以.css结尾的文件
                use: ExtractTextPlugin.extract({  // 这里我们需要调用分离插件内的extract方法
                    fallback: 'style-loader',  // 相当于回滚，经postcss-loader和css-loader处理过的css最终再经过style-loader处理
                    use: ['css-loader', 'postcss-loader']
                })
            },
            ...
        ]
    },
    plugins: [
        ...
        new ExtractTextPlugin('css/index.css') // 将css分离到/dist文件夹下的css文件夹中的index.css
    ]
}
```


运行npm run build后会发现/dist文件夹内多出了/css文件夹及index.css文件。  
现在webpack4.x版本分离css方法可采用mini-css-extract-plugin插件，具体使用方式可参考这里，套路一样的哈。
##### 3.消除冗余css
有时候我们css写得多了，可能会不自觉的写重复了一些样式，这就造成了多余的代码，上线前又忘了检查，对于这方面，我们应该尽量去优化它，webpack就有这个功能。

```
npm i purifycss-webpack purify-css glob -D
```
 安装完上述三个模块后，因为正常来说是在生产环境中优化代码，所以我们应该是在webpack.prod.js文件中进行配置，引入clean-webpack-plugin及glob插件并使用它们：



```
// webpack.prod.js
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 引入CleanWebpackPlugin插件

const path = require('path');
const PurifyCssWebpack = require('purifycss-webpack'); // 引入PurifyCssWebpack插件
const glob = require('glob');  // 引入glob模块,用于扫描全部html文件中所引用的css

module.exports = merge(common, {   // 将webpack.common.js合并到当前文件
    devtool: 'source-map',  // 会生成对于调试的完整的.map文件，但同时也会减慢打包速度
    plugins: [
        new CleanWebpackPlugin(['dist']),  // 所要清理的文件夹名称
        new PurifyCssWebpack({
            paths: glob.sync(path.join(__dirname, 'src/*.html')) // 同步扫描所有html文件中所引用的css
        })
    ]
})
```


我们在style.css文件中增加一些多余的代码试试：

```
/* style.css */
body {
    background: #999;
}

#root div{
    width: 200px;
    margin-top: 50px;
    transform: rotate(45deg); /* 这个属性会产生前缀 */
}

.a{                 /* 冗余css */
    color: black;     
}

.b{                 /* 冗余css */
    width: 50px;
    height: 50px;
    background: yellow;
}
```


然后我们运行npm run build后发现打包后的index.css中是没有多余的.a和.b代码的：

```
/* index.css */

body {
  background: #999;
}

#root div {
  width: 200px;
  margin-top: 50px;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  /* 这个属性会产生前缀 */
}
/*# sourceMappingURL=index.css.map*/
```



#####   4.处理图片
到目前为止我们还没讲到图片的问题，如果要使用图片，我们得安装两个loader：
// 虽然我们只需使用url-loader，但url-loader是依赖于file-loader的，所以也要安装

```
npm i url-loader file-loader -D
```


然后在webpack.common.js中配置url-loader：

```
// webpack.common.js
...
module.exports = {
    ...
    module: {
        rules: [
            {
                test: /\.css$/,   // 正则匹配以.css结尾的文件
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader']
                })
            },
            {
                test: /\.(png|jpg|svg|gif)$/,  // 正则匹配图片格式名
                use: [
                    {
                        loader: 'url-loader'  // 使用url-loader
                    }
                ]
            },
            ...
        ]
    },
    ...
}
```

我们修改一下style.css，把背景改为图片背景：

```
/* style.css */
body {
    background: url(../images/coffee.png) top right repeat-y;  /* 设为图片背景 */
}

#root div{
    width: 200px;
    margin-top: 50px;
    transform: rotate(45deg); /* 这个属性会产生前缀 */
}

.a{
    color: black;
}

.b{
    width: 50px;
    height: 50px;
    background: yellow;
}
```


运行npm run dev后显示如下：
但是背景图片变成了base64，因为webpack会自动优化图片，减少发送请求，但是如果我想把它变成路径的该怎么做？
我们可以把webpack.common.js的loader配置更改一下，增加options选项：

```
// webpack.common.js
...
module.exports = {
    ...
    module: {
        rules: [
            {
                test: /\.css$/,   // 正则匹配以.css结尾的文件
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader']
                })
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1000  // 限制只有小于1kb的图片才转为base64，例子图片为1.47kb,所以不会被转化
                        }
                    }
                ]
            },
            ...
        ]
    },
    ...
}
```


然后我们运行npm run build后，再运行npm run dev，额，图片是没有转成base64了，但是图片怎么不显示了？
问题就出在路径上，我们之前图片的路径是在../images文件夹下，但是打包出来后没有这个路径了，图片直接和文件同级了，所以我们需要在webpack.common.js中给它设置一个文件夹：

```
// webpack.common.js
...
module.exports = {
    ...
    module: {
        rules: [
            ...
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1000,  // 限制只有小于1kb的图片才转为base64，例子图片为1.47kb,所以不会被转化
                            outputPath: 'images'  // 设置打包后图片存放的文件夹名称
                        }
                    }
                ]
            },
            ...
        ]
    },
    ...
}
```



继续npm run build打包再npm run dev运行，我的天！图片还是不显示！ 调试工具上看图片路径有images文件夹了，但是我的../呢？
这又涉及到配置路径的问题上了，我们还需要在css-loader中给背景图片设置一个公共路径publicPath: '../'，如下：

```
// webpack.common.js
...
module.exports = {
    ...
    module: {
        rules: [
            {
                test: /\.css$/,   // 正则匹配以.css结尾的文件
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader'],
                    publicPath: '../'  // 给背景图片设置一个公共路径
                })
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1000,  // 限制只有小于1kb的图片才转为base64，例子图片为1.47kb,所以不会被转化
                            outputPath: 'images'  // 设置打包后图片存放的文件夹名称
                        }
                    }
                ]
            },
            ...
        ]
    },
    ...
}
```



 
##### 7.4 压缩代码
在webpack4.x版本中当你打包时会自动把js压缩了，而且npm run dev运行服务器时，当你修改代码时，热更新很慢，这是因为你修改后webpack又自动为你打包，这就导致了在开发环境中效率很慢，所以我们需要把开发环境和生产环境区分开来，这时就体现出我们代码分离的便捷性了，webpack.dev.js代表开发环境的配置，webpack.prod.js代表生产环境的配置，这时我们只要在package.json文件中配置对应环境的命令即可：

```
{
  ...
  "scripts": {
    "build": "webpack --config webpack.prod.js --mode production",
    "dev": "webpack-dev-server --open --config webpack.dev.js --mode development"
  },
  ...
  }
}
```


--mode production表示打包时是生产环境，会自行将js进行压缩，而--mode development表示当前是开发环境，不需要进行压缩。这同时也解决了之前一直遗留的警告问题