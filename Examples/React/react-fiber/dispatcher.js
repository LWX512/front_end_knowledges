/**
 * dispatcher.js
 * 包含 hooks 的调度器：首次渲染/更新时的 hooks 行为、batchedRender
 * 被 fiber 渲染流程调用
 */

const DispatcherContext = require("./shared.js");

// 批量更新：避免多次 setState 立即触发多次渲染
function batchedRender(ctx) {
  if (!ctx.pendingUpdate) {
    ctx.pendingUpdate = true;
    setTimeout(() => {
      ctx.pendingUpdate = false;
      render(ctx);
    }, 0);
  }
}

// 首次渲染时的 hooks 行为
function createMountDispatcher(ctx) {
  return {
    useState(initialState) {
      const hookState =
        typeof initialState === "function" ? initialState() : initialState;
      const index = ctx.hookIndex++;
      ctx.hooks[index] = hookState;
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

// 更新时的 hooks 行为
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

// 导出供 fiber.js 使用
module.exports = {
  batchedRender,
  createMountDispatcher,
  createUpdateDispatcher,
};