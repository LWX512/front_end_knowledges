/**
 * fiber.js
 * 实现 Fiber 节点结构、Diff 算法、调度与渲染流程、虚拟 DOM 到真实 DOM 的转换
 */

// const {
//   createMountDispatcher,
//   createUpdateDispatcher,
//   batchedRender,
// } = require("./dispatcher.js");
// const DispatcherContext = require("./shared.js");

// 引入 DispatcherContext（全局 hooks dispatcher 环境）
import DispatcherContext from "./shared.js";

/**
 * 创建 Fiber 节点
 * @param {Object} param0 - Fiber 属性集合
 * @returns {Object} - 新的 Fiber 节点对象
 */
function createFiber({
  type,
  props,
  key,
  parent = null,
  isMount = true,
  hooks = [],
}) {
  return {
    type, // 元素类型: 标签名或函数组件
    props: props || {}, // dom/组件的属性，始终保证为对象
    key, // key 属性（用于 diff）
    dom: null, // 真实 DOM 节点（首次为 null）
    child: null, // 第一个子 Fiber
    sibling: null, // 兄弟 Fiber
    parent, // 父 Fiber
    alternate: null, // 上一轮的 Fiber（用于 diff）
    effectTag: null, // 操作类型：PLACEMENT/UPDATE/DELETION
    isMount, // 是否首次渲染
    hooks, // hooks 状态数组
    hookIndex: 0, // 当前 hooks 索引
    effects: [], // 普通 effect 队列
    layoutEffects: [], // layoutEffect 队列
    pendingUpdate: false, // 是否有待处理的更新
  };
}

/**
 * 批量渲染/调度
 * 用于 setState 等触发时，防止多次重复渲染
 * @param {Object} ctx - 当前 Fiber/组件上下文
 */
function batchedRender(ctx) {
  if (!ctx.pendingUpdate) {
    ctx.pendingUpdate = true;
    setTimeout(() => {
      ctx.pendingUpdate = false;
      console.log("Batched render triggered", ctx);
      // 重新渲染，入口统一用 root dom
      scheduleUpdate(ctx, document.getElementById("root"));
    }, 0);
  }
}

/**
 * 创建首次渲染时的 hooks dispatcher
 */
function createMountDispatcher(ctx) {
  return {
    useState(initialState) {
      // 初始化状态
      const hookState =
        typeof initialState === "function" ? initialState() : initialState;
      const index = ctx.hookIndex++;
      ctx.hooks[index] = hookState;
      // setState 实现
      const setState = (newState) => {
        ctx.hooks[index] =
          typeof newState === "function"
            ? newState(ctx.hooks[index])
            : newState;
        console.log("set state:", ctx.hooks[index], newState);
        scheduleUpdate(ctx);
      };
      return [hookState, setState];
    },
    useEffect(effect, deps) {
      const index = ctx.hookIndex++;
      ctx.effects.push({ index, effect, deps, hasRun: false });
      ctx.hooks[index] = deps;
    },
    useLayoutEffect(effect, deps) {
      const index = ctx.hookIndex++;
      ctx.layoutEffects.push({ index, effect, deps, hasRun: false });
      ctx.hooks[index] = deps;
    },
    useRef(initialValue) {
      const index = ctx.hookIndex++;
      const ref = { current: initialValue };
      ctx.hooks[index] = ref;
      return ref;
    },
    useReducer(reducer, initialArg, init) {
      const index = ctx.hookIndex++;
      const initialState = init ? init(initialArg) : initialArg;
      ctx.hooks[index] = initialState;
      const dispatch = (action) => {
        ctx.hooks[index] = reducer(ctx.hooks[index], action);
        scheduleUpdate(ctx);
      };
      return [ctx.hooks[index], dispatch];
    },
    useMemo(factory, deps) {
      const index = ctx.hookIndex++;
      const value = factory();
      ctx.hooks[index] = { value, deps };
      return value;
    },
    useCallback(callback, deps) {
      const index = ctx.hookIndex++;
      ctx.hooks[index] = { callback, deps };
      return callback;
    },
    useImperativeHandle(ref, factory, deps) {
      const index = ctx.hookIndex++;
      ref.current = factory();
      ctx.hooks[index] = deps;
    },
    useDebugValue(value, formatter) {
      if (formatter) {
        console.log("DebugValue:", formatter(value));
      } else {
        console.log("DebugValue:", value);
      }
    },
  };
}

/**
 * 创建更新时的 hooks dispatcher
 */
function createUpdateDispatcher(ctx) {
  return {
    useState(initialState) {
      const index = ctx.hookIndex++;
      const hookState = ctx.hooks[index];
      const setState = (newState) => {
        ctx.hooks[index] =
          typeof newState === "function"
            ? newState(ctx.hooks[index])
            : newState;
        console.log("update state:", ctx.hooks[index], newState);
        scheduleUpdate(ctx);
      };
      return [hookState, setState];
    },
    useEffect(effect, deps) {
      const index = ctx.hookIndex++;
      const prevDeps = ctx.hooks[index];
      const hasChanged =
        !deps || prevDeps == null || deps.some((dep, i) => dep !== prevDeps[i]);
      if (hasChanged) {
        ctx.effects.push({ index, effect, deps, hasRun: false });
      }
      ctx.hooks[index] = deps;
    },
    useLayoutEffect(effect, deps) {
      const index = ctx.hookIndex++;
      const prevDeps = ctx.hooks[index];
      const hasChanged =
        !deps || prevDeps == null || deps.some((dep, i) => dep !== prevDeps[i]);
      if (hasChanged) {
        ctx.layoutEffects.push({ index, effect, deps, hasRun: false });
      }
      ctx.hooks[index] = deps;
    },
    useRef(initialValue) {
      const index = ctx.hookIndex++;
      return ctx.hooks[index];
    },
    useReducer(reducer, initialArg, init) {
      const index = ctx.hookIndex++;
      const state = ctx.hooks[index];
      const dispatch = (action) => {
        ctx.hooks[index] = reducer(ctx.hooks[index], action);
        scheduleUpdate(ctx);
      };
      return [state, dispatch];
    },
    useMemo(factory, deps) {
      const index = ctx.hookIndex++;
      const prev = ctx.hooks[index];
      const hasChanged =
        !deps || !prev || prev.deps.some((dep, i) => dep !== deps[i]);
      if (hasChanged) {
        const value = factory();
        ctx.hooks[index] = { value, deps };
        return value;
      }
      return prev.value;
    },
    useCallback(callback, deps) {
      const index = ctx.hookIndex++;
      const prev = ctx.hooks[index];
      const hasChanged =
        !deps || !prev || prev.deps.some((dep, i) => dep !== deps[i]);
      if (hasChanged) {
        ctx.hooks[index] = { callback, deps };
        return callback;
      }
      return prev.callback;
    },
    useImperativeHandle(ref, factory, deps) {
      const index = ctx.hookIndex++;
      ref.current = factory();
      ctx.hooks[index] = deps;
    },
    useDebugValue(value, formatter) {
      if (formatter) {
        console.log("DebugValue:", formatter(value));
      } else {
        console.log("DebugValue:", value);
      }
    },
  };
}

/**
 * Diff 算法：比较新旧 Fiber 树，标记操作类型
 */
let deletions = [];
function diffFiber(wipFiber) {
  const oldFiber = wipFiber.alternate;
  console.log("Diffing fiber:", wipFiber, "with oldFiber:", oldFiber);
  let oldChild = oldFiber && oldFiber.child;
  let prevSibling = null;
  // 取出所有 children，保证为数组
  let elements = (wipFiber.props && wipFiber.props.children) || [];

  elements.forEach((element, index) => {
    let sameType =
      oldChild &&
      element &&
      oldChild.type === element.type
      //  &&
      // oldChild.key === element.key;
    console.log(
      "Diffing element:",
      element,
      "with oldChild:",
      oldChild,
      "sameType:",
      sameType
    );
    let newFiber;
    if (sameType) {
      // 类型相同则复用
      newFiber = createFiber({
        type: oldChild.type,
        props: element.props,
        key: element.key || index,
        parent: wipFiber,
      });
      newFiber.dom = oldChild.dom;
      newFiber.alternate = oldChild;
      newFiber.effectTag = "UPDATE";
      newFiber.isMount = oldChild.isMount; // 保留是否首次渲染状态
      newFiber.hooks = oldChild.hooks; // 保留 hooks 状态
    } else {
      // 类型不同，新增
      newFiber = createFiber({
        type: element.type,
        props: element.props,
        key: element.key || index,
        parent: wipFiber,
      });
      newFiber.effectTag = "PLACEMENT";
    }
    if (oldChild) {
      oldChild = oldChild.sibling;
    }
    if (index === 0) {
      wipFiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
  });

  // 删除多余的旧节点
  while (oldChild) {
    oldChild.effectTag = "DELETION";
    deletions.push(oldChild);
    oldChild = oldChild.sibling;
  }
}

/**
 * Fiber 调度循环
 * 利用 requestIdleCallback 实现任务分片
 */
let nextUnitOfWork = null;
let wipRoot = null;
let currentRoot = null;
let rootElement = null; // 当前应用的根虚拟DOM
let rootContainer = null; // 当前应用的根真实DOM容器
let isBatchScheduled = false; // 标记是否已有批量任务在等待
function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
}

/**
 * 执行单个 Fiber 单元任务
 * 包含 hooks 调度、子节点构建、diff
 */
function performUnitOfWork(fiber) {
  // 函数组件/原生组件分开处理
  if (fiber.type instanceof Function) {
    // 设置 dispatcher，支持 hooks
    console.log("use dispatcher:", fiber);
    DispatcherContext.current = fiber.isMount
      ? createMountDispatcher(fiber)
      : createUpdateDispatcher(fiber);

    fiber.hookIndex = 0;
    fiber.effects = [];
    fiber.layoutEffects = [];
    fiber.isMount = false;
    // 执行函数组件，获取其 children
    fiber.props.children = [fiber.type(fiber.props)];
  }
  // 原生组件/文本节点
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // 对当前 Fiber 进行 diff
  diffFiber(fiber);

  // 遍历 Fiber 树
  if (fiber.child) return fiber.child;
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
  return null;
}

/**
 * 提交 Fiber 树到真实 DOM
 * 按 effectTag 进行增/删/改
 */
function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

/**
 * 提交单个 Fiber 节点
 * @param {Object} fiber - Fiber 节点
 */
function commitWork(fiber) {
  if (!fiber) return;
  console.log(
    `Committing ${fiber.effectTag} for`,
    fiber.type,
    fiber.key ? `(key: ${fiber.key})` : ""
  );
  // 找到最近的有 dom 的父节点
  let domParentFiber = fiber.parent;
  while (domParentFiber && !domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;

  // 根据 effectTag 做不同操作
  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    domParent.removeChild(fiber.dom);
    return;
  }
  // 递归处理子节点和兄弟节点
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

/**
 * 虚拟 DOM 节点转真实 DOM 节点
 * 支持标签、文本、忽略函数组件
 */
function createDom(fiber) {
  if (!fiber.type) return null; // 没有类型直接返回
  // 跳过函数组件
  if (typeof fiber.type === "function") return null;
  // 创建文本节点或标签节点
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode(fiber.props.nodeValue || "")
      : document.createElement(fiber.type);
  // 设置属性（不包括 children）
  Object.keys(fiber.props || {})
    .filter((key) => key !== "children")
    .forEach((name) => {
      dom[name] = fiber.props[name];
    });
  return dom;
}

/**
 * 更新 DOM 属性
 * @param {HTMLElement} dom - 真实 DOM
 * @param {Object} prevProps - 旧属性
 * @param {Object} nextProps - 新属性
 */
function updateDom(dom, prevProps, nextProps) {
  // 移除多余属性
  Object.keys(prevProps || {})
    .filter((name) => name !== "children")
    .forEach((name) => {
      if (!(name in nextProps)) {
        dom[name] = "";
      }
    });
  // 更新/新增属性
  Object.keys(nextProps || {})
    .filter((name) => name !== "children")
    .forEach((name) => {
      dom[name] = nextProps[name];
    });
}

function scheduleUpdate() {
  if (isBatchScheduled) return; // 已有任务，不重复调度
  isBatchScheduled = true;
  // 利用 requestIdleCallback 实现任务分片（降级可用 setTimeout）
  requestIdleCallback(() => {
    isBatchScheduled = false;
    if (!currentRoot) return; // 首次渲染不触发
    // 以 currentRoot 作为 base，构建新的 wipRoot 进行 diff
    console.log("Scheduling update for root:", currentRoot);
    wipRoot = {
      ...currentRoot,
      alternate: currentRoot,
    };
    nextUnitOfWork = wipRoot;
    deletions = [];
    // workLoop(performance); // 启动 fiber 主循环（或 requestIdleCallback(workLoop)）
    requestIdleCallback(workLoop); // 启动 fiber 主循环（或 requestIdleCallback(workLoop)）
  });
}

/**
 * 渲染入口
 * @param {Object} element - 虚拟 DOM 根节点
 * @param {HTMLElement} container - 真实 DOM 容器
 */
function render(element, container) {
  rootElement = element;
  rootContainer = container;
  wipRoot = createFiber({
    type: container.nodeName.toLowerCase(),
    props: { children: [element] },
  });
  wipRoot.dom = container;
  wipRoot.alternate = currentRoot;
  deletions = [];
  nextUnitOfWork = wipRoot;
  requestIdleCallback(workLoop);
}

// 默认导出 render 方法（推荐用命名导出）
export default {
  render,
};

// 导出
// module.exports = {
//   render,
// };
