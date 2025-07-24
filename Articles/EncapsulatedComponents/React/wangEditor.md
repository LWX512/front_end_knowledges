## `WangEditor`

​
### 介绍富文本
我这里使用WangEditor是因为没有很复杂的富文本功能诉求，然而WangEditor是一个轻量级的一个富文本，所以采用的是wangeditor

本章所使用的版本是 4.7.15

[WangEditor](https://www.wangeditor.com/v4/) 是一款基于 JavaScript 的富文本编辑器。

​
**优势：**
1. 易用性： WangEditor 具有直观的用户界面，易于上手和集成到网站或应用中。用户可以轻松地进行文本编辑、插入图片、表格等操作。
2. 开源和免费：WangEditor 是一款开源的编辑器，免费供开发者使用，无需支付费用。
3. 轻量级：WangEditor 的体积较小，加载速度相对较快，适用于需要快速加载的网页或应用。
4. 插件系统： WangEditor 支持插件系统，开发者可以根据需要扩展编辑器的功能，使其适应更多的使用场景。
5. 多平台兼容性： WangEditor 兼容多个主流浏览器，包括 Chrome、Firefox、Safari 等，确保用户在不同平台上都能正常使用。
6. 中文文档和社区支持： WangEditor 提供了详细的中文文档和用户社区，开发者可以方便地获取技术支持和交流经验。

**劣势：**
1. 功能相对基础： 与一些商业的富文本编辑器相比，WangEditor 的功能相对基础。对于一些高级的富文本编辑需求，可能无法提供足够的支持。
2. 扩展性有限：尽管有插件系统，但相比一些成熟的商业编辑器，WangEditor 的扩展性相对有限。
3. 可能的兼容性问题：尽管它在多数主流浏览器上表现良好，但在某些特殊环境或老旧浏览器中，可能存在兼容性问题。


**代码实现**
实现简单的一个富文本
```js
import React, { useState, useEffect, useRef } from 'react';
import E from 'wangeditor';

const Editor = (props) => {
  const { height = 500,} = props;
  const [editorContent, setEditorContent] = useState('');
  const editorElemMenu = useRef(null);
  const editorElemBody = useRef(null);
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    const elemBody = editorElemBody?.current;
    const elemMenu = editorElemMenu?.current;
    if (elemBody && elemMenu) {
      if (!editor) {

        const editorConfig = new E(elemMenu, elemBody);
        editorConfig.create();
        setEditor(editorConfig);
      }
      editor?.txt?.html(value);
    }
    return () => {
      editor?.destroy();
      setEditor(null);
    };
  }, []);

  return (
    <div className="shop">
      <div
        className="text-area"
        style={{
          height: height,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          ref={editorElemMenu}
          style={{
            backgroundColor: '#f1f1f1',
            border: '1px solid #ccc',
            minHeight: '32px',
          }}
          className="editorElem-menu"
        ></div>
        <div
          style={{
            paddingLeft: '10px',
            overflowY: 'hidden',
            flex: 1,
            border: '1px solid #ccc',
            borderTop: 'none',
          }}
          ref={editorElemBody}
          className="editorElem-body"
        ></div>
      </div>
    </div>
  );
};

export default Editor;
```
这是配置toolbar的数据
```js
const menus = [
  'head', // 标题
  'bold', // 粗体
  'fontSize', // 字号
  'fontName', // 字体
  'italic', // 斜体
  'underline', // 下划线
  'strikeThrough', // 删除线
  'link', // 插入链接
  'list', // 列表
  'justify', // 对齐方式
  'quote', // 引用
  'undo', // 撤销
  'redo', // 重复
  "foreColor", // 文字颜色
  "backColor", // 背景颜色
  "emoticon", // 表情
  "image", // 插入图片
  "table", // 表格
  "video", // 插入视频
  "code", // 插入代码
];

import React, { useState, useEffect, useRef } from 'react';
import E from 'wangeditor';

const Editor = (props) => {
...

  useEffect(() => {
    const elemBody = editorElemBody?.current;
    const elemMenu = editorElemMenu?.current;
    if (elemBody && elemMenu) {
      if (!editor) {
        const editorConfig = new E(elemMenu, elemBody);
        editorConfig.config.height = height;
        editorConfig.config.menus =  menus;

        editorConfig.config.onchange = (html) => {
          setEditorContent(html);
          onChange && onChange(html);
        };
        editorConfig.create();
        setEditor(editorConfig);
}
    }
    return () => {
      editor?.destroy();
      setEditor(null);
    };
  }, []);

  return (
       ...
  );
};

export default Editor;
```
实现自定义上传图片视频
```js
...        
        editorConfig.config.customUploadImg = (resultFiles, insertImgFn) => {
          // resultFiles 是 input 中选中的文件列表
          // insertImgFn 是获取图片 url 后，插入到编辑器的方法
          // 判断上传的是图片还是视频
          const isImage = resultFiles[0].type.startsWith('image/');
          const isVideo = resultFiles[0].type.startsWith('video/');
          const url = isImage ? '/img' : '/video';

          if (isImage) {
            // 如果是图片，使用图片上传的接口
            axios.post(url, data).then((res) => {
              insertImgFn(res.data.url); // res.data.url 是服务端返回的图片地址
            });
          } else if (isVideo) {
            // 如果是视频，使用视频上传的接口
            axios.post(url, data).then((res) => {
              insertImgFn(res.data.url); // res.data.url 是服务端返回的视频地址
            });
          } else {
            // 如果既不是图片也不是视频，抛出错误
            throw new Error('上传的文件既不是图片也不是视频');
          }
        };
...
```
完整代码
```js
import React, { useState, useEffect, useRef } from 'react';
import E from 'wangeditor'; // 如果是SSR项目这个地方是不可以直接引入

const Editor = (props) => {
  const {
    onChange,
    value = '',
    height = 500,
    config = {},
    menuList,
  } = props;
  const [editorContent, setEditorContent] = useState('');
  const editorElemMenu = useRef(null);
  const editorElemBody = useRef(null);
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    const elemBody = editorElemBody?.current;
    const elemMenu = editorElemMenu?.current;
    if (elemBody && elemMenu) {
      if (!editor) {
//如果是SSR项目将从这个地方引入
// const E = require('wangeditor');
        const editorConfig = new E(elemMenu, elemBody);
        editorConfig.config.height = height;
        editorConfig.config.menus = menuList;
        editorConfig.config.zIndex = 0;
        // 隐藏网络图片
        editorConfig.config.showLinkImg = false;
        editorConfig.config.onchange = (html) => {
          setEditorContent(html);
          onChange && onChange(html);
        };
        editorConfig.config.customUploadImg = (resultFiles, insertImgFn) => {
          // resultFiles 是 input 中选中的文件列表
          // insertImgFn 是获取图片 url 后，插入到编辑器的方法
          // 判断上传的是图片还是视频
          const isImage = resultFiles[0].type.startsWith('image/');
          const isVideo = resultFiles[0].type.startsWith('video/');
          const url = isImage ? '/img' : '/video';

          if (isImage) {
            // 如果是图片，使用图片上传的接口
            axios.post(url, data).then((res) => {
              insertImgFn(res.data.url); // res.data.url 是服务端返回的图片地址
            });
          } else if (isVideo) {
            // 如果是视频，使用视频上传的接口
            axios.post(url, data).then((res) => {
              insertImgFn(res.data.url); // res.data.url 是服务端返回的视频地址
            });
          } else {
            // 如果既不是图片也不是视频，抛出错误
            throw new Error('上传的文件既不是图片也不是视频');
          }
        };
        const configList = Object.entries(config);
        if (configList.length > 0) {
          configList.forEach((item, index) => {
            const [key, value] = item;
            editorConfig.config[key] = value;
          });
        }
        editorConfig.create();
        setEditor(editorConfig);
      }
    }
    return () => {
      editor?.destroy();
      setEditor(null);
    };
  }, []);

  useEffect(() => {
    editor?.txt?.html(value);
  }, [value]);

  return (
    <div className="shop">
      <div
        className="text-area"
        style={{
          height: height,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          ref={editorElemMenu}
          style={{
            backgroundColor: '#f1f1f1',
            border: '1px solid #ccc',
            minHeight: '32px',
          }}
          className="editorElem-menu"
        ></div>
        <div
          style={{
            paddingLeft: '10px',
            overflowY: 'hidden',
            flex: 1,
            border: '1px solid #ccc',
            borderTop: 'none',
          }}
          ref={editorElemBody}
          className="editorElem-body"
        ></div>
      </div>
    </div>
  );
};

export default Editor;
```
**TIP：**这个地方注意一下，ssr 项目是不可以直接引入wangeditor，是因为在这个wangeditor会提示window这个报错，因为在ssr是没有window对象的，所以我们在引入的时候要注意一下，在useeffect里面引入这个wangeditor

**结语：**
wangEditor是一个功能非常丰富且功能强大的软件，适配性非常强可塑性也非常强大，就看怎么去使用，在此仅代表自己对于大佬的崇高敬意！！！
wangEditor5 新版已经正式发布了 ，大概看了下官方文档，新手超级友好，也更加适应框架特性，还有相应的react和vue组件
react组件 @wangeditor/editor-for-react、vue组件 @wangeditor/editor-for-vue
新编辑器加了两种mode，default 默认模式 - 集成了 wangEditor 所有功能，simple 简洁模式 - 仅有部分常见功能，简洁易用

​