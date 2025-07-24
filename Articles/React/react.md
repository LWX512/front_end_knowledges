### 认识 React

#### 1. 什么是 React

`React` 是 `Facebook` 推出用于构建用户界面的 `JavaScript` 库，他的口令就是“用来构建用户界面的 `JavaScript` 库”。

#### 2. React 有什么特点

-   `React` 是一个用于构建用户界面的 `JavaScript` 库，它采用组件化的思想，可以将一个复杂的页面分解成多个组件，然后一个一个组件的进行开发，最后再将开发的组件组合起来，形成一个完整的页面。
-   jsx 其实在 `React` 中 `Facebook` 并没有强制性的要求使用，但是 `React` 官方推荐使用 `jsx` 进行 `React` 组件的开发，它是一种类似于 `XML` 的 `JavaScript` 扩展语法，它最终会被编译成 `JavaScript` 代码。
-   virtual Dom
-   react 是一个网页 UI 框架，通过组件化的方式解决视图层开发复用的问题，本质上是一个组件化的框架

#### 3. React 项目搭建
- 安装 `React` 项目 `npx create-react-app my-app`

#### 4. React 核心思想

-   它的核心设计思路有三点，分别是声明式、组件化和通用性
-   声明式的优势在于直观与组合
-   组件化的优势在于试图的拆分与模块复用，可以更容易做到高内聚低耦合。
-   通用性在于一次学习，随处编写。比如 react native ，react 360 等这里主要靠虚拟 dom 来保证实现。
-   这使得 react 的适用氛围变得足够广，无论是 web、native、VR，甚至 shell 应用都可以进行开发。这也是 react 的优势
-   但作为一个视图层的框架，react 的劣势也十分明显。他并没有提供完整的一揽子解决方案，在开发大型前端应用时，需要向社区寻找并整合解决方案。虽然一定程度上促进了社区的繁荣，但也为开发者在技术选型和学习适用上造成了一定的成本

#### 5. React 中的 JSX 是什么

`JSX` 是 `React` 中的一个语法糖，它最终会被编译成 `JavaScript` 代码。

#### 6. React 中的组件

-   组件是 `React` 中的核心概念，它是一个函数，可以接受 `props` 参数，并返回一个 `JSX` 元素。
-   组件的 `props` 参数是一个对象，它包含了组件的属性，通常用来描述组件的特性。
-   组件的 `state` 参数是一个对象，它包含了组件的状态，通常用来描述组件的内部数据。
-   组件的 `render` 方法是组件的核心，它负责返回组件的 `JSX` 元素。

#### 7. React 中的生命周期

-   组件的生命周期可以分为三个状态，分别是挂载、更新、卸载。
-   挂载时，组件会执行 `constructor` 方法和 `getDerivedStateFromProps` 方法，然后调用 `render` 方法，生成组件的 `JSX` 元素。
-   更新时，组件会执行 `getDerivedStateFromProps` 方法，然后调用 `render` 方法，生成新的 `JSX` 元素。
-   卸载时，组件会调用 `componentWillUnmount` 方法。

```jsx
class App extends React.Component {
    constructor(props) {
        super(props);
        console.log('constructor ----- 创建');
    }

    getDerivedStateFromProps(nextProps, prevState) {
        console.log(
            'getDerivedStateFromProps ------- props更新 ------需要返回一个新的状态'
        );
        return null;
    }

    componentWillMount() {
        console.log('componentWillMount ------ 挂载后');
    }

    componentDidMount() {
        console.log('componentDidMount ----- 挂载后');
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log(
            'shouldComponentUpdate ----- 更新前 ------  需要返回一个 true/false 状态'
        );
        return true;
    }

    componentDidUpdate() {
        console.log('componentDidUpdate ---- 更新');
    }

    componentWillUnmount() {
        console.log('componentWillUnmount ----- 卸载前');
    }

    render() {
        console.log('render');
        return <div>Hello World</div>;
    }
}
```

**执行顺序是**

1. 挂载阶段

-   constructor：组件的构造函数，在组件实例化时调用。
-   static getDerivedStateFromProps：在组件实例化、接收新的 props 或者调用 setState 方法之前被调用。
-   render：渲染组件的内容。
-   componentDidMount：在组件挂载到 DOM 后调用，可以进行一些异步操作、网络请求等。

2. 更新阶段

-   static getDerivedStateFromProps：在接收新的 props 时被调用。
-   shouldComponentUpdate：在组件接收到新的 props 或者 state 之后，决定是否需要重新渲染组件。
-   render：重新渲染组件的内容。
-   componentDidUpdate：在组件更新后被调用，可以进行一些 DOM 操作、网络请求等

3. 卸载阶段

-   componentWillUnmount：在组件从 DOM 中移除之前被调用，可以进行一些清理操作、取消订阅等
