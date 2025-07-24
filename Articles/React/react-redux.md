### React-redux

#### 1. 了解 react-redux

-   什么是 `react-redux`

    -   `react-redux` 是一个专门为 `react` 开发的应用程序提供状态管理的库。

-   为什么需要 `react-redux`

    -   因为 react 本身并不提供状态管理，所以需要使用 `react-redux` 来实现状态管理。

-   怎么使用 `react-redux`

    -   安装 `react-redux` or `redux`

        ```
        npm i react-redux
        npm i redux
        ```

    -   创建 store

        ```jsx
        import { createStore } from 'redux';
        import reducer from './reducer';
        const store = createStore(reducer);

        export default store;
        ```

    -   创建 reducer

        ```jsx
        const initialState = {
            count: 0,
        };

        function reducer(state = initialState, action) {
            switch (action.type) {
                case 'INCREMENT':
                    return {
                        ...state,
                        count: state.count + 1,
                    };
                case 'DECREMENT':
                    return {
                        ...state,
                        count: state.count - 1,
                    };
                default:
                    return state;
            }
        }
        ```

    -   引入 `react-redux` 的 `Provider` 并注入 store

        ```jsx
        import { Provider } from 'react-redux';
        import store from './store';
        import Counter from './Counter';
        const app = () => {
            return (
                <Provider store={store}>
                    <Counter />
                </Provider>
            );
        };
        ```

    -   使用 `connect` 方法将组件与 `Redux store` 连接起来

    ```javascript
    import { connect } from 'react-redux';
    import { increment, decrement } from './actions';
    const mapStateToProps = (state) => {
        return {
            ...state,
        };
    };
    const mapDispatchToProps = (dispatch) => {
        return {
            increment: () => increment(dispatch),
            decrement: () => decrement(dispatch),
        };
    };
    const Counter = (props) => {
        return (
            <div>
                <h1>{props.count}</h1>
                <button onClick={() => props.increment()}>+</button>
                <button onClick={() => props.decrement()}>-</button>
            </div>
        );
    };

    export default connect(mapStateToProps, mapDispatchToProps)(Counter);
    ```
-  `connect` 方法的参数接收四个参数，分别是：
   -   `mapStateToProps`：将 `state` 映射到 `props` 中。
   -   `mapDispatchToProps`：将 `dispatch` 映射到 `props` 中。
   -   `mergeProps`：将 `state` 和 `dispatch` 合并到 `props` 中。
   -   `options`：配置选项。
-   `connect` 方法可以理解成为一个高阶函数，它接收一个组件作为参数，并返回一个新的组件。
-   `connect` 一般情况我们只采用 `mapStateToProps` 和 `mapDispatchToProps` 这两个参数，`mergeProps` 和 `options` 这两个参数很少用到。
-   在我们 `mapStateToProps` 函数中，我们返回了 `state` 对象。
-   在 `mapDispatchToProps` 函数中，我们返回了两个函数，这两个函数都是我们需要触发的 `action`。
-   在 `Counter` 组件中，我们使用 `props` 对象来访问 `state` 和 `dispatch` 函数。
-   在 `Counter` 组件中，我们使用 `props` 对象来访问 `increment` 和 `decrement` 函数。

-   `actions` 的写法案例

    ```javascript
    // actions.js
    export const increment = (dispatch) => {
        return dispatch({
            type: 'INCREMENT',
        });
    };

    export const decrement = (dispatch) => {
        return dispatch({
            type: 'DECREMENT',
        });
    };
    ```

-   `combineReducers`

    ```javascript
    // store.js
    import { combineReducers, createStore } from 'redux';
    import reducer1 from './reducer1';
    import reducer2 from './reducer2';

    const reducers = combineReducers({
        reducer1,
        reducer2,
    });

    const store = createStore(reducers);

    export default store;
    ```

-   `combineReducers` 是用来合并多个 `reducer` 的，但是它合并的 `reducer` 必须是纯函数，不能有副作用。
-   `createStore` 方法是用来创建 `store` 的，它接收一个 `reducer` 作为参数，返回一个 `store` 对象。
-   多个 `reducer` 使用，在只有在组件使用的时候会有一些变化，比如：

```jsx
const mapStateToProps = ({ reducer1, reducer2 }) => {
    return {
        redcuer1,
        reducer2,
    };
};
```

-   这个地方是以我们在 `combineReducers` 合并的 `reducer` 名字作为 `key`，然后返回一个对象，这个对象包含多个 `reducer` 的值。
-   然后我们在 `mapStateToProps` 的时候，就可以拿到多个 `reducer` 的值了。



### 总结

-   `redux` 是一个状态管理工具，它用来管理状态，并且提供了一些方法来操作状态。
-   `redux` 中的状态是全局的，它是唯一的。
-   `redux` 中的状态是只读的，不能直接修改状态，只能通过 `reducer` 来修改状态。
-   `react-redux` 是连接 `react` 和 `redux` 的一个库，它提供了 `connect` 方法来连接 `react` 和 `redux`。
-   `Provider` 组件是用来提供 `store` 的，并将它的 `context` 传递下去。