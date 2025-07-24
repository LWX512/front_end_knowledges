# react-fiber —— 简易版 React Fiber 架构实现

本项目实现了一个极简版的 React Fiber 架构，核心目标是帮助理解 Fiber 的调度机制、虚拟 DOM Diff 算法，以及 hooks 的底层实现原理。项目支持函数组件、主流 hooks（如 useState、useEffect、useRef、useReducer、useMemo、useCallback、useLayoutEffect、useImperativeHandle、useDebugValue），并具备批量渲染和高效更新能力。

---

## 目录结构与主要文件说明

- **index.js**：框架入口，定义组件并启动渲染，演示 hooks 的实际用法。
- **fiber.js**：核心 Fiber 架构，包括 Fiber 节点结构、Diff 算法、调度与渲染流程、虚拟 DOM 到真实 DOM 的转换。
- **hooks.js**：所有 hooks 的统一导出，自动选择当前 DispatcherContext.current，保证 hooks 隔离和并行。
- **shared.js**：DispatcherContext，记录当前正在执行的 Fiber/组件，所有 hooks API 都从这里获取 dispatcher。
- **dispatcher.js**：hooks 的调度器，实现首次渲染和更新时的 hooks 行为，以及批量渲染。
- **index.html**：页面入口，挂载根节点并加载入口脚本。
- **test/**：包含 hooks 和 diff 的简化测试代码，便于理解和扩展。

---

## 设计与实现思路

1. **Fiber 节点结构**  
   每个 Fiber 节点代表一个虚拟 DOM 元素或组件实例，包含 type、props、key、child、sibling、parent、alternate（上一次的 Fiber）、effectTag（标记操作类型）、hooks（存储 hooks 状态）等属性。Fiber 节点通过 child/sibling/parent 串联形成树状结构。

2. **Hooks 实现机制**  
   hooks 的状态存储在 Fiber 节点上，渲染时自动切换 dispatcher（首次渲染/更新），保证每个组件实例的 hooks 独立。所有 hooks API（如 useState、useEffect 等）都通过 DispatcherContext.current 获取当前 dispatcher。

3. **Diff 算法**  
   对比新旧 Fiber 树，标记节点的增删改（effectTag），并批量提交到真实 DOM。支持复用、替换和删除节点，保证高效更新。

4. **批量渲染调度**  
   setState、dispatch 等触发时，自动批量调度渲染，避免多次状态更新导致重复渲染，提升性能。

---

## 使用方法

1. 直接在浏览器打开 `index.html` 即可运行。
2. 入口组件为 `MyApp`，支持所有主流 hooks，点击按钮可触发状态更新和重新渲染。

---

## 关键代码示例

### 1. 定义函数组件并使用 hooks

```javascript
function MyApp(props) {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("world");
  const ref = useRef();

  useEffect(() => {
    ref.current = `count: ${count}`;
    console.log("useEffect called with count:", count);
  }, [count]);

  const upCount = () => setCount(count + 1);
  const upName = () => setName(name + '!');

  return createElement(
    "div",
    { className: "app" },
    createElement("div", {}, count),
    createElement("div", {}, name),
    createElement("button", { onclick: upCount }, "+1"),
    createElement("button", { onclick: upName }, "+!"),
    createElement("span", { ref }, ref.current)
  );
}
```

### 2. Fiber 节点结构与 Diff 算法简述

```javascript
function createFiber({ type, props, key, parent }) {
  return {
    type,
    props,
    key,
    dom: null,
    child: null,
    sibling: null,
    parent,
    alternate: null,
    effectTag: null,
    hooks: [],
    hookIndex: 0,
    effects: [],
    layoutEffects: [],
    pendingUpdate: false,
  };
}

// Diff 新旧 Fiber 树，标记 effectTag
function diffFiber(wipFiber) {
  // ...对比新旧节点，标记增删改...
}
```

### 3. 批量渲染调度

```javascript
function batchedRender(ctx) {
  if (!ctx.pendingUpdate) {
    ctx.pendingUpdate = true;
    setTimeout(() => {
      ctx.pendingUpdate = false;
      scheduleUpdate(ctx, document.getElementById("root"));
    }, 0);
  }
}
```

---

## 扩展与测试

- `test/hooks-text.js`：演示 hooks 的底层实现和调度流程。
- `test/diffing-text.js`：演示 Fiber 节点的 Diff 算法和虚拟 DOM 更新。
- 可扩展更多 hooks 或 Fiber 特性，适合学习 React Fiber 原理和 hooks 实现机制。

---

## 总结

本项目适合前端开发者深入理解 React Fiber 架构、hooks 原理和虚拟 DOM Diff 机制。所有核心逻辑均为简化实现，便于学习和实验。你可以在此基础上扩展更多功能，或对比 React 官方实现，提升对现代前端框架底层原理的认知。