// import DispatcherContext from "./shared.js"; // 指向当前正在渲染的 fiber 或组件上下文
const DispatcherContext = require("./shared.js"); // 指向当前正在渲染的 fiber 或组件上下文
// import { createMountDispatcher, createUpdateDispatcher } from './dispatcher.js'; // hooks 调度器

// ----------------- Fiber/组件上下文定义 -----------------
/**
 * 用于模拟 Fiber，每个组件实例拥有自己的 hooks 存储、effect 队列等。
 */
function createFiberContext(Component) {
  return {
    Component, // 组件函数本身
    hooks: [], // 当前组件的 hooks 状态
    hookIndex: 0, // 当前 hooks 的索引
    effects: [], // 普通 effect 队列
    layoutEffects: [], // layoutEffect 队列
    isMount: true, // 是否首次渲染
    pendingUpdate: false, // 是否有待处理的更新
  };
}
// ----------------- 批量渲染/调度 -----------------
/**
 * batchedRender 对当前 fiber/组件上下文进行批量更新（模拟 React 的批量）
 */
function batchedRender(ctx) {
  if (!ctx.pendingUpdate) {
    ctx.pendingUpdate = true;
    setTimeout(() => {
      ctx.pendingUpdate = false;
      render(ctx);
    }, 0);
  }
}
// ----------------- Dispatcher 实现 -----------------
/**
 * 首次渲染时的 hooks 行为
 */

function createMountDispatcher(ctx) {
  return {
    useState(initialState) {
      const hookState =
        typeof initialState === "function" ? initialState() : initialState;
      const index = ctx.hookIndex++;
      ctx.hooks[index] = hookState;
      // setState 更新该 fiber 的 hooks 并触发 batchedRender
      const setState = (newState) => {
        ctx.hooks[index] =
          typeof newState === "function"
            ? newState(ctx.hooks[index])
            : newState;
        batchedRender(ctx);
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
        batchedRender(ctx);
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
 * 更新时的 hooks 行为
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
        batchedRender(ctx);
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
        batchedRender(ctx);
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

// ----------------- 渲染入口 -----------------
/**
 * 渲染组件：1. 设置 DispatcherContext 2. 重置索引 3. 执行组件函数 4. 依次执行 effects
 */
function render(ctx) {
  ctx.hookIndex = 0;
  ctx.effects = []; // 清空 effect 队列
  ctx.layoutEffects = []; // 清空 layoutEffect 队列
  // 设置 Dispatcher（首次渲染/更新各不同）
  DispatcherContext.current = ctx.isMount
    ? createMountDispatcher(ctx)
    : createUpdateDispatcher(ctx);

  ctx.isMount = false;
  // 执行组件函数
  ctx.Component();

  // 先执行 layoutEffects
  ctx.layoutEffects.forEach(({ effect, hasRun }) => {
    if (!hasRun) effect();
  });

  // 再执行 effects
  ctx.effects.forEach(({ effect, hasRun }) => {
    if (!hasRun) effect();
  });
}

// =================== 启动渲染 ===================
/**
 * 创建独立 Fiber 上下文并渲染
 */
// const myComponentContext = createFiberContext(MyComponent);
// render(myComponentContext);
// 若需要并行渲染其它组件，再创建其它 FiberContext 并调用 render

// export default fn;
module.exports = (fn) => render(createFiberContext(fn));
