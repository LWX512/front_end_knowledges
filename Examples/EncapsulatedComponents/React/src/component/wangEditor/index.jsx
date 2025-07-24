import React, { useState, useEffect, useRef } from 'react';
import E from 'wangeditor'; // 如果是SSR项目这个地方是不可以直接引入

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

const Editor = (props) => {
    const { onChange, value = '', height = 500, config = {}, menuList = menus } = props;
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
                editorConfig.config.customUploadImg = (
                    resultFiles,
                    insertImgFn
                ) => {
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
        const currentValue = editor?.text?.html()
        // 这个地方判断是因为会存在回车的时候根据默认的方式回退成之前的情况
        if (editor && value !== currentValue) {
            editor?.txt?.html(value);
        }
    }, [value, editor]);

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
