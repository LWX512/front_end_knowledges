// const render = require("./fiber.js"); // 渲染器
// const {
//   useState,
//   useEffect,
//   useMemo,
//   useRef,
//   useCallback,
//   useLayoutEffect,
//   useDebugValue,
//   useImperativeHandle,
//   useReducer,
// } = require("./hooks.js"); // hooks 调度器
// // =================== 组件定义及测试 ===================
// /**
//  * 组件示例，支持所有 hooks
//  */
// function MyComponent() {
//   const [count, setCount] = useState(0); // 计数器
//   const [name, setName] = useState("React"); // 名字
//   const ref = useRef(); // ref 对象
//   const [state, dispatch] = useReducer((s, a) => s + a, 0); // reducer 示例
//   const memoValue = useMemo(() => count * 2, [count]); // memo 示例
//   const cb = useCallback(() => setCount(count + 1), [count]); // callback 示例
//   useImperativeHandle(ref, () => ({ focus: () => console.log("focus") }), []); // imperativeHandle 示例
//   useDebugValue(count, (v) => `Count is ${v}`); // 调试输出

//   useEffect(() => {
//     console.log(`✨ Effect: count = ${count}, name = ${name}`);
//     if (count < 2) {
//       setCount(count + 1);
//       setName((n) => n + "!");
//       dispatch(1);
//     }
//   }, [count, name]);

//   useEffect(() => {
//     console.log(`🧩 no useEffect deps [] ---`);
//   }, []);

//   useEffect(() => {
//     console.log(`🧩 Effect: count = ${count}, name = ${name}, no deps `);
//   });

//   useLayoutEffect(() => {
//     console.log(`🧩 LayoutEffect: count = ${count}, name = ${name}`);
//   }, [count, name]);
//   console.log("render:", { count, name, memoValue, state });
// }

// render(MyComponent); // 渲染组件
/**
 * index.js
 * 框架入口文件，定义组件并启动渲染
 */

// const { render } = require('./fiber.js');
import fiber from "./fiber.js"; // 渲染器
import hooks from "./hooks.js"; // hooks 调度器

const {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useLayoutEffect,
  useDebugValue,
  useImperativeHandle,
  useReducer,
} = hooks; // 解构获取所有 hooks
// const {
//   useState,
//   useEffect,
//   useRef,
//   // ...其他hooks
// } = require('./hooks.js');

/**
 * 定义函数组件
 */

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object"
          ? child
          : {
              type: "TEXT_ELEMENT",
              props: { nodeValue: child, children: [] },
            }
      ),
    },
  };
}

function MyApp(props) {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("world");
  const ref = useRef();
  useEffect(() => {
    ref.current = `count: ${count}`;
    console.log("useEffect called with count:", count);
  }, [count]);

  const upCount = () => {
    console.log("upCount called");
    setCount(count + 1);
  };
    const upName = () => {
    console.log("upName called");
    setName(name + '!');
  };
  //   return {
  //     type: "div",
  //     props: {
  //       children: [
  //         { type: "span", props: { ref, children: [] } },
  //         {
  //           type: "button",
  //           props: {
  //             onclick: () => setCount(count + 1),
  //             children: ["+1"],
  //           },
  //         },
  //       ],
  //     },
  //   };
  return createElement(
    "div",
    { key: "a", className: "app" },
    createElement("div", {}, count),
    createElement("div", {}, name),
    createElement("button", { onclick: upCount }, "+1"),
    createElement("button", { onclick: upName }, "+!"),
    createElement("span", { ref }, ref.current)
  );
}

// 启动渲染
fiber.render({ type: MyApp, props: {} }, document.getElementById("root"));
