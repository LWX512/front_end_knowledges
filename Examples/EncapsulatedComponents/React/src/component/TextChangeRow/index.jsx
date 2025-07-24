import React, { useState, useCallback } from 'react';
import { Tooltip } from 'antd';

/**
 * @param {*} Props
 * @return
 * @value text 文本
 * @value row 显示的行数
 * @value showTip 是否使用 Tooltip
 */
const ROW_STYLE = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
};

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
