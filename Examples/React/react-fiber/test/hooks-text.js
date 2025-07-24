// 全局 dispatcher 当前值，模拟 ReactCurrentDispatcher
const DispatcherContext = {
  current: null,
};

// 全局当前组件的 hooks 存储
let currentHookIndex = 0;      // 当前 hook 的索引
let currentHooks = [];         // 存储所有 hook 的状态
let effects = [];              // useEffect 队列
let layoutEffects = [];        // useLayoutEffect 队列

let pendingUpdate = false;     // 是否有待处理的更新

// 模拟 React 的 batchedUpdates，批量触发渲染
function batchedRender() {
  if (!pendingUpdate) {
    pendingUpdate = true;
    setTimeout(() => {
      pendingUpdate = false;
      render(Component);
    }, 0);
  }
}

// useState 外部 API，实际调用 dispatcher 的实现
function useState(initialState) {
  const dispatcher = DispatcherContext.current;
  if (!dispatcher) {
    throw new Error('Hooks can only be used inside a component');
  }
  return dispatcher.useState(initialState);
}

// useEffect 外部 API
function useEffect(effect, deps) {
  const dispatcher = DispatcherContext.current;
  if (!dispatcher) throw new Error('Hooks can only be used inside a component');
  return dispatcher.useEffect(effect, deps);
}

// useLayoutEffect 外部 API
function useLayoutEffect(effect, deps) {
  const dispatcher = DispatcherContext.current;
  if (!dispatcher) throw new Error('Hooks can only be used inside a component');
  return dispatcher.useLayoutEffect(effect, deps);
}

// useRef 外部 API
function useRef(initialValue) {
  const dispatcher = DispatcherContext.current;
  if (!dispatcher) throw new Error('Hooks can only be used inside a component');
  return dispatcher.useRef(initialValue);
}

// useReducer 外部 API
function useReducer(reducer, initialArg, init) {
  const dispatcher = DispatcherContext.current;
  if (!dispatcher) throw new Error('Hooks can only be used inside a component');
  return dispatcher.useReducer(reducer, initialArg, init);
}

// useMemo 外部 API
function useMemo(factory, deps) {
  const dispatcher = DispatcherContext.current;
  if (!dispatcher) throw new Error('Hooks can only be used inside a component');
  return dispatcher.useMemo(factory, deps);
}

// useCallback 外部 API
function useCallback(callback, deps) {
  const dispatcher = DispatcherContext.current;
  if (!dispatcher) throw new Error('Hooks can only be used inside a component');
  return dispatcher.useCallback(callback, deps);
}

// useImperativeHandle 外部 API
function useImperativeHandle(ref, factory, deps) {
  const dispatcher = DispatcherContext.current;
  if (!dispatcher) throw new Error('Hooks can only be used inside a component');
  return dispatcher.useImperativeHandle(ref, factory, deps);
}

// useDebugValue 外部 API（仅调试用，实际 React DevTools 里显示）
function useDebugValue(value, formatter) {
  const dispatcher = DispatcherContext.current;
  if (!dispatcher) throw new Error('Hooks can only be used inside a component');
  return dispatcher.useDebugValue(value, formatter);
}

// MountDispatcher：首次渲染时的 hooks 实现
const MountDispatcher = {
  // useState 实现
  useState(initialState) {
    const hookState =
      typeof initialState === 'function' ? initialState() : initialState;
    const index = currentHookIndex++;
    currentHooks[index] = hookState;

    // setState 触发 batchedRender
    const setState = newState => {
      currentHooks[index] =
        typeof newState === 'function'
          ? newState(currentHooks[index])
          : newState;
      batchedRender();
    };

    return [hookState, setState];
  },
  // useEffect 实现
  useEffect(effect, deps) {
    const index = currentHookIndex++;
    effects.push({index, effect, deps, hasRun: false});
    currentHooks[index] = deps;
  },
  // useLayoutEffect 实现
  useLayoutEffect(effect, deps) {
    const index = currentHookIndex++;
    layoutEffects.push({index, effect, deps, hasRun: false});
    currentHooks[index] = deps;
  },
  // useRef 实现
  useRef(initialValue) {
    const index = currentHookIndex++;
    const ref = { current: initialValue };
    currentHooks[index] = ref;
    return ref;
  },
  // useReducer 实现
  useReducer(reducer, initialArg, init) {
    const index = currentHookIndex++;
    const initialState = init ? init(initialArg) : initialArg;
    currentHooks[index] = initialState;
    const dispatch = action => {
      currentHooks[index] = reducer(currentHooks[index], action);
      batchedRender();
    };
    return [currentHooks[index], dispatch];
  },
  // useMemo 实现
  useMemo(factory, deps) {
    const index = currentHookIndex++;
    const value = factory();
    currentHooks[index] = { value, deps };
    return value;
  },
  // useCallback 实现
  useCallback(callback, deps) {
    const index = currentHookIndex++;
    currentHooks[index] = { callback, deps };
    return callback;
  },
  // useImperativeHandle 实现
  useImperativeHandle(ref, factory, deps) {
    const index = currentHookIndex++;
    ref.current = factory();
    currentHooks[index] = deps;
  },
  // useDebugValue 实现（仅调试用）
  useDebugValue(value, formatter) {
    if (formatter) {
      console.log('DebugValue:', formatter(value));
    } else {
      console.log('DebugValue:', value);
    }
  },
};

// UpdateDispatcher：更新时的 hooks 实现
const UpdateDispatcher = {
  // useState 实现
  useState(initialState) {
    const index = currentHookIndex++;
    const hookState = currentHooks[index];

    const setState = newState => {
      currentHooks[index] =
        typeof newState === 'function'
          ? newState(currentHooks[index])
          : newState;
      batchedRender();
    };

    return [hookState, setState];
  },
  // useEffect 实现（依赖变化才执行）
  useEffect(effect, deps) {
    const index = currentHookIndex++;
    const prevDeps = currentHooks[index];
    const hasChanged =
      !deps || prevDeps == null || deps.some((dep, i) => dep !== prevDeps[i]);

    if (hasChanged) {
      effects.push({index, effect, deps, hasRun: false});
    }

    currentHooks[index] = deps;
  },
  // useLayoutEffect 实现（依赖变化才执行）
  useLayoutEffect(effect, deps) {
    const index = currentHookIndex++;
    const prevDeps = currentHooks[index];
    const hasChanged =
      !deps || prevDeps == null || deps.some((dep, i) => dep !== prevDeps[i]);

    if (hasChanged) {
      layoutEffects.push({index, effect, deps, hasRun: false});
    }

    currentHooks[index] = deps;
  },
  // useRef 实现
  useRef(initialValue) {
    const index = currentHookIndex++;
    return currentHooks[index];
  },
  // useReducer 实现
  useReducer(reducer, initialArg, init) {
    const index = currentHookIndex++;
    const state = currentHooks[index];
    const dispatch = action => {
      currentHooks[index] = reducer(currentHooks[index], action);
      batchedRender();
    };
    return [state, dispatch];
  },
  // useMemo 实现（依赖变化才重新计算）
  useMemo(factory, deps) {
    const index = currentHookIndex++;
    const prev = currentHooks[index];
    const hasChanged =
      !deps || !prev || prev.deps.some((dep, i) => dep !== deps[i]);
    if (hasChanged) {
      const value = factory();
      currentHooks[index] = { value, deps };
      return value;
    }
    return prev.value;
  },
  // useCallback 实现（依赖变化才重新赋值）
  useCallback(callback, deps) {
    const index = currentHookIndex++;
    const prev = currentHooks[index];
    const hasChanged =
      !deps || !prev || prev.deps.some((dep, i) => dep !== deps[i]);
    if (hasChanged) {
      currentHooks[index] = { callback, deps };
      return callback;
    }
    return prev.callback;
  },
  // useImperativeHandle 实现
  useImperativeHandle(ref, factory, deps) {
    const index = currentHookIndex++;
    ref.current = factory();
    currentHooks[index] = deps;
  },
  // useDebugValue 实现（仅调试用）
  useDebugValue(value, formatter) {
    if (formatter) {
      console.log('DebugValue:', formatter(value));
    } else {
      console.log('DebugValue:', value);
    }
  },
};

// 用于判断当前是否是首次 render
let isMount = true;

// render 函数：设置 dispatcher → 重置索引 → 调用组件函数
function render(fn) {
  currentHookIndex = 0;
  effects = []; // 清空 effect 队列
  layoutEffects = []; // 清空 layoutEffect 队列
  // 设置 dispatcher（根据是否首次 render 切换）
  DispatcherContext.current = isMount ? MountDispatcher : UpdateDispatcher;

  isMount = false;
  // 执行组件函数
  fn();
  // 先执行 layoutEffects
  layoutEffects.forEach(({effect, hasRun}) => {
    if (!hasRun) {
      effect();
    }
  });
  // 再执行 effects
  effects.forEach(({effect, hasRun}) => {
    if (!hasRun) {
      effect();
    }
  });
}

// 组件定义（可像 React 中一样使用 hook）
function Component() {
  const [count, setCount] = useState(0); // 计数器
  const [name, setName] = useState('React'); // 名字
  const ref = useRef(); // ref 对象
  const [state, dispatch] = useReducer((s, a) => s + a, 0); // reducer 示例
  const memoValue = useMemo(() => count * 2, [count]); // memo 示例
  const cb = useCallback(() => setCount(count + 1), [count]); // callback 示例
  useImperativeHandle(ref, () => ({ focus: () => console.log('focus') }), []); // imperativeHandle 示例
  useDebugValue(count, v => `Count is ${v}`); // 调试输出

  useEffect(() => {
    console.log(`✨ Effect: count = ${count}, name = ${name}`);
    if (count < 2) {
      setCount(count + 1);
      setName(n => n + '!');
      dispatch(1);
    }
  }, [count, name]);

  useEffect(() => {
    console.log(`🧩 no useEffect deps [] ---`);
  }, [])

  useEffect(() => {
    console.log(`🧩 Effect: count = ${count}, name = ${name}, no deps `);
  })

  useLayoutEffect(() => {
    console.log(`🧩 LayoutEffect: count = ${count}, name = ${name}`);
  }, [count, name]);
  console.log('render:', { count, name, memoValue, state });
}

// 初次渲染
render(Component);
