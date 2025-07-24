### 实现超出隐藏并鼠标划过显示 Tip

**实现思路**

1. 设置超出隐藏的样式
2. 传入最多显示行数
3. 计算宽度和行数
4. 鼠标划过时显示 Tip

-   1. 设置超出隐藏的样式实现

```jsx
const ROW_STYLE = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
};
```

-   2. 传入最多显示行数实现

```jsx
/**
 * @param {*} Props
 * @return
 * @value text 文本
 * @value row 显示的行数
 * @value showTip 是否使用 Tooltip
 */
import React, { useState, useCallback } from 'react';
export default function TextChangeRow(props) {
    const { text, row, showTip = true } = props;

    return (
        <div className="text-change-row">
            <div className="text-row">
                {showTip ? (
                    <div>
                        <span
                            // className="text_row"
                            style={{
                                WebkitLineClamp: row,
                                ...ROW_STYLE,
                            }}
                        >
                            {text}
                        </span>
                    </div>
                ) : (
                    <span style={{ WebkitLineClamp: props.row, ...ROW_STYLE }}>
                        {props.text}
                    </span>
                )}
            </div>
        </div>
    );
}
```

-   3. 计算宽度和行数
    -   主要是通过添加标签的形式来设置获取我们的标签

```jsx

...
const [toolTipIsShow, setToolTipIsShow] = useState(false); //保存一个布尔值作为显示的依赖
const strWidth = (fontSize) => {
    const dom = document.createElement('span');
    dom.style.display = 'inline-block';
    dom.style.fontSize = fontSize;
    dom.textContent = text;
    document.body.appendChild(dom);
    const width = dom.clientWidth;
    document.body.removeChild(dom);
    return width;
};

// span宽度、高度
const textDom = useCallback(
    (node) => {
        if (node !== null) {
            // 可以使用 window/globalThis 的 在ssr当中我们要用globalThis，因为window在服务端是不存在的
            const fontSize =
                globalThis.getComputedStyle(node)?.['font-size'] || '14px';
            const width = node.getBoundingClientRect().width;
            //判断一下高度是否大于div的高度
            const initWidth = strWidth(fontSize);
            const rowNum = Math.ceil(initWidth / width);
            if (rowNum > row) {
                setToolTipIsShow(true);
            } else {
                setToolTipIsShow(false);
            }
        }
    },
    [text, row]
);
...

```

-   4. 鼠标滑过线上 Tip

```jsx
export default function TextChangeRow(props) {
    ...
    {
        toolTipIsShow ? (
            <Tooltip title={text}>
                <span
                    style={{
                        WebkitLineClamp: row,
                        ...ROW_STYLE,
                    }}
                >
                    {text}
                </span>
            </Tooltip>
        ) : (
            <span
                // className="text_row"
                style={{
                    WebkitLineClamp: row,
                    ...ROW_STYLE,
                }}
                ref={textDom}
            >
                {text}
            </span>
        );
    }
    ...
}
```

- **实现完整代码**
```jsx
import React, { useState, useCallback } from 'react';
import { Tooltip } from 'antd';

const ROW_STYLE = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
};

/**
 * @param {*} Props
 * @return
 * @value text 文本
 * @value row 显示的行数
 * @value showTip 是否使用 Tooltip
 */

export default function TextChangeRow(props) {
  const { text, row, showTip = true } = props;
  const [toolTipIsShow, setToolTipIsShow] = useState(false); //保存一个布尔值作为显示的依赖

  const strWidth = (fontSize) => {
    const dom = document.createElement('span');
    dom.style.display = 'inline-block';
    dom.style.fontSize = fontSize;
    dom.textContent = text;
    document.body.appendChild(dom);
    const width = dom.clientWidth;
    document.body.removeChild(dom);
    return width;
  };

  // span宽度、高度
  const textDom = useCallback(
    (node) => {
      if (node !== null) {
        // 这里的 14px 需要根据项目当中的字体大小来来设定默认值
        const fontSize =
          globalThis.getComputedStyle(node)?.['font-size'] || '14px';
        const width = node.getBoundingClientRect().width;
        //判断一下高度是否大于div的高度
        const initWidth = strWidth(fontSize);
        const rowNum = Math.ceil(initWidth / width);
        if (rowNum > row) {
          setToolTipIsShow(true);
        } else {
          setToolTipIsShow(false);
        }
      }
    },
    [text, row],
  );

  return (
    <div className="text-change-row">
      <div className="text-row">
        {showTip ? (
          <div>
            {toolTipIsShow ? (
              <Tooltip title={text}>
                <span
                  style={{
                    WebkitLineClamp: row,
                    ...ROW_STYLE,
                  }}
                >
                  {text}
                </span>
              </Tooltip>
            ) : (
              <span
                // className="text_row"
                style={{
                  WebkitLineClamp: row,
                  ...ROW_STYLE,
                }}
                ref={textDom}
              >
                {text}
              </span>
            )}
          </div>
        ) : (
          <span
            style={{ WebkitLineClamp: props.row, ...ROW_STYLE }}
            ref={textDom}
          >
            {props.text}
          </span>
        )}
      </div>
    </div>
  );
}

```

**总结**

- 利用`React.useCallback`来计算DOM元素，并利用`React.useState`来设定是否使用`Tooltip`组件
- 然后通过`React.useCallback`来计算`text`dom元素的大小，在通过`strWidth`获取`text`dom元素的大小，从而判断是否需要使用`Tooltip`组件