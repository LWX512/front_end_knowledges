### 学习使用 `React hooks`

#### 1. 什么是 `hooks`

`hooks` 是一种在 `React` 函数组件中使用 `state` 以及其他的 `React` 特性（例如 `生命周期`）的替代方案，也是 `React 16.8` 的新增特性。

#### 2. 为什么使用 `hooks`

-   函数组件没有生命周期
-   函数组件没有 `this`
-   函数组件没有 `refs`

#### 3. 怎么使用 `hooks`

**useState**

```jsx
const App = () => {
    const add = () => {
        setCount(count + 1);
    };

    return <div onClick={add}> {count} </div>;
};
```

-   我们看到了上面是 `const [count, setCount] = React.useState(0)` 这样写的这个 `count` 就是 `state` 中的 `count` 值，`setCount` 就是 `setState` 方法

```jsx
const App = () => {
    const [arr, setArr] = React.useState([]);

    const add = () => {
        const len = arr.length;
        setArr([...arr, len]);
    };

    return (
        <div onClick={add}>
            {arr.map((v) => {
                return <span>{v}</span>;
            })}
        </div>
    );
};
```

**useEffect**

```jsx
const App = () => {
    const [count, setCount] = React.useState(0);
    const add = () => {
        setCount(count + 1);
    };
    React.useEffect(() => {
        console.log('count ---- 更新', count);
        return () => {
            console.log('count ---- 销毁', count);
        };
    }, [count]);

    return <div onClick={add}>{count}</div>;
};
```

-   在我们 `React` 当中是没有销毁的，只有组件卸载的时候才会销毁，所以我们可以通过 `useEffect` 中的返回值来销毁一些东西
-   第二个参数可以传一个数组，当数组中的值改变的时候，才会执行 `useEffect` 中的方法
-   当我们第二个值为空数组的时候，模拟了 `class` 组件中的 `componentDidMount` 和 `componentWillUnmount` 方法
-   还有一种情况就是在我们 `useEffect` 第二个参数不传的效果，这种情况的话，当组件第一次渲染的时候，会执行一次 `useEffect` 中的方法，当组件更新的时候，也会执行一次 `useEffect` 中的方法

```jsx
const App = () => {
    const [count, setCount] = React.useState(0);
    const add = () => {
        setCount(count + 1);
    };
    React.useEffect(() => {
        console.log('count ---- 更新', count);
    });

    return <div onClick={add}>{count}</div>;
};
```

**useMemo**

```jsx
const App = () => {
    const [count, setCount] = React.useState(0);
    const add = () => {
        setCount(count + 1);
    };
    const sum = React.useMemo(() => {
        return count + 1;
    }, [count]);

    return <div onClick={add}>{sum}</div>;
};
```

-   `useMemo` 中的方法返回的值，只有当依赖的值改变的时候，才会重新计算

**useCallback**

```jsx
const App = () => {
    const [count, setCount] = React.useState(0);
    const add = React.useCallback(() => {
        setCount(count + 1);
    }, [count]);

    return <div onClick={add}>{count}</div>;
};
```

-   `useCallback` 中的方法返回的值，只有当依赖的值改变的时候，才会重新计算

在这里聊到了 `useCallback` 和 `useMemo` 面试当中也会偶然问到这个问题，他们的区别：

1. 相同点：
    - `useCallback` 和 `useMemo` 都有依赖这个参数
    - `useCallback` 和 `useMemo` 都有返回项
2. 不同点：
    - `useCallback` 返回的是一个函数，当依赖的值改变的时候，才会重新计算，`useMemo` 返回的是一个值，当依赖的值改变的时候，才会重新计算

**useRef**

```jsx
const App = () => {
    const inputRef = React.useRef();
    const add = () => {
        inputRef.current.focus();
    };

    return (
        <div>
            <input ref={inputRef} />
            <button onClick={add}>点击</button>
        </div>
    );
};
```

-   `useRef` 返回的是一个对象，对象中有一个 `current` 属性，可以用来存储数据

**useContext**

```jsx
const ThemeContext = React.createContext('light');

const App = () => {
    const [theme, setTheme] = React.useState('light');

    const changeTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={theme}>
            <div>
                <button onClick={changeTheme}>切换主题</button>
                <Child />
            </div>
        </ThemeContext.Provider>
    );
};

```
-   `useContext` 接收一个对象，对象中有一个 `Provider` 属性，属性值是一个对象，对象中有一个 `value` 属性，可以用来存储数据
-   `useContext` 接收一个对象，对象中有一个 `Consumer` 属性，属性值是一个函数，函数接收一个参数，参数就是 `useContext` 接收的对象

**useReducer**

```jsx
const initialState = {
    count: 0,
    name: '张三',
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'add':
            return {
                count: state.count + 1,
                name: state.name,
            };
        case 'changeName':
            return {
                count: state.count,
                name: action.name,
            };
        default:
            return state;
    }
};

const App = () => {
    const [state, dispatch] = React.useReducer(reducer, initialState);

    const changeName = () => {
        dispatch({
            type: 'changeName',
            name: '李四',
        });
    };

    return (
        <div>
            <p>{state.count}</p>
            <p>{state.name}</p>
            <button onClick={changeName}>修改姓名</button>
        </div>
    );
};

```

**useLayoutEffect**

```jsx
const App = () => {
    const [count, setCount] = React.useState(0);
    React.useLayoutEffect(() => {
        console.log('useLayoutEffect');
    }, [count])

    const add = () => {
        setCount(count + 1);
    }

    return <div onClick={add}>{count}</div>;
}
```

`useLayoutEffect` 顾名思义，在 DOM 布局前执行，他要比 `useEffect` 早执行，使用方式和 `useEffect` 一样，不同的是，`useEffect` 是在 DOM 更新后执行，而 `useLayoutEffect` 是在 DOM 更新前执行。