### `React-router`实现

-   在上一章有提到怎么使用 `React-router` 实现路由，但是没有详细介绍怎么实现，这一章就详细介绍怎么实现。

在 `React-router` 源码中其实 是分为两个部分，一个是 `react-router` 本身，一个是 `react-router-dom`，`react-router-dom` 是对 `react-router` 的封装，所以这一章主要介绍 `react-router` 的实现。 [`react-router`源码地址](https://github.com/remix-run/react-router)

#### 实现原理

-   原理其实很简单，就是通过 `context` 传递 `location` 对象，然后通过 `context` 传递 `history` 对象，这样就可以实现路由的切换了。

#### 实现

-   首先我们从我们的 `app.js`/`index.js` 回顾一下路由是怎么写的

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<div>Home</div>} />
                <Route path="/about" element={<div>About</div>} />
                <Route path="/list" element={<div>list</div>} />
                <Route path="/hot" element={<div>hot</div>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
```

-   可以看到，我们通过 `BrowserRouter` 包裹了我们的 `Routes`，然后通过 `Routes` 包裹了我们的 `Route`，然后通过 `Route` 实现了路由的切换。
-   然后我们看一下 `BrowserRouter` 组件的源码

```jsx
import { createBrowserHistory } from 'history';
export const BrowserRouter = ({ children }) => {
    const historyRef = useRef();
    //    我们这个地方要检测一下是否创建这个 browserHistory，如果创建了，就直接返回，如果没有创建，就创建一个
    if (!historyRef.current) {
        historyRef.current = createBrowserHistory();
    }
    const history = historyRef.current;

    const [state, setState] = React.useState({
        action: history.action,
        location: history.location,
    });
    // 这个地方需要监听一下我们的
    // 监听路由的变化，然后通过 setState 更新我们的 state
    useLayoutEffect(() => history.listen(setState), [history]);

    return (
        <Router
            location={state.location}
            children={children}
            navigator={history}
            navigationType={history.action}
        />
    );
};
```

-   其实可以看到这个地方用到了 `history`, `history` 是一个第三方库，我们通过 `createBrowserHistory` 创建了一个 `history` 对象，然后通过 `history.listen` 监听路由的变化，然后通过 `setState` 更新我们的 `state`，然后通过 `state` 更新我们的 `Router`。
-   上面说到了 `history` 我们需要安装一下这个 `history` 库，然后通过 `npm install history` 安装一下。
-   上面还提到了 `Router` 组件，我们实现一下 `Router` 组件

#### Router 组件实现

```jsx
const LocationContext = createContext({});
const NavigationContext = createContext({});
export const Router = ({ children, location, navigator, navigationType }) => {
    const locationContext = useMemo(
        () => ({ location, navigationType }),
        [location, navigationType]
    );

    const navigationContext = useMemo(() => ({ navigator }), [navigator]);

    return (
        <NavigationContext.Provider value={navigationContext}>
            <LocationContext.Provider
                value={locationContext}
                children={children}
            ></LocationContext.Provider>
        </NavigationContext.Provider>
    );
};
```

-   可以看到 `Router` 组件里面用到了 `useContext`，`useContext` 是一个 HOC，我们通过 `useContext` 获取到 `NavigationContext` 和 `LocationContext` 这两个 `context`。
-   然后到了这个地方我们的 `Router` 组件就完成了，我们通过 `useContext` 获取到了 `NavigationContext` 和 `LocationContext` 这两个 `context`，然后通过 `Provider` 把 `navigator` 和 `location` 传递给 `NavigationContext` 和 `LocationContext`。

#### 实现我们的 `Routes` 组件

```jsx
const routes = ({ children }) => useRoutes(createRoutesFormChildren(children));
```

-   到了这里基本上已经完成差不多了，我们通过 `createRoutesFormChildren` 把 `children` 将我们的 `children` 递归用 `React` 处理成 dom tree
-   那我们先实现一下 `createRoutesFormChildren` 方法。

**createRoutesFormChildren 方法实现**

```jsx
const createRoutesFormChildren = (children) => {
    let routes = [];

    React.Children.forEach(children, (child) => {
        let routeChildren = {
            path: child.props.path,
            element: child.props.element,
        };
        // 递归处理子元素
        if (routeChildren.props?.children) {
            routeChildren.props.children = createRoutesFormChildren(
                child.props.children
            );
        }

        routes.push(routeChildren);
    });

    return routes;
};
```

-   到这个地方我们的 `createRoutesFormChildren` 方法就完成了，我们通过 `React.Children.forEach` 把我们的 `children` 递归处理成 `routes`，然后通过 `routeChildren.props?.children` 判断是否有子元素，如果有子元素的话，通过 `createRoutesFormChildren` 递归处理子元素。
-   然后我们通过 `useRoutes` 匹配我们的 `path` 然后渲染我们的 `component`。

**useRoutes 方法实现**

```jsx
const useNavigation = () => useContext(NavigationContext).navigation;

const useLocation = () => useContext(LocationContext).location;
const useRoutes = (routes) => {
    const location = useLocation();
    const currentPathname = location?.pathname || '/';
    let currentRoute = null;
    routes.forEach(({ path, ...restChildren }) => {
        const isMatch = currentPathname.match(new RegExp(`^${path}`));
        if (isMatch) {
            currentRoute = { ...restChildren, path };
        }
    });

    return currentRoute?.element || null;
};
```
- 好了到了这里我们的 `useRoutes` 方法就完成了，我们通过 `useContext` 拿到 `navigation` 和 `location`，然后通过 `routes` 循环判断我们的 `path` 是否匹配，如果匹配的话，就把我们的 `restChildren` 赋值给 `currentRoute`，然后通过 `currentRoute?.element` 拿到我们的 `element`，最后返回 `element`。

#### 完整代码
```jsx

import { createBrowserHistory } from "history";
import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";

const LocationContext = createContext({});
const NavigationContext = createContext({});

const useNavigation = () => useContext(NavigationContext).navigation;

const useLocation = () => useContext(LocationContext).location;

export const BrowserRouter = ({ children }) => {
  const historyRef = useRef();

  if (!historyRef.current) {
    historyRef.current = createBrowserHistory();
  }
  const history = historyRef.current;

  const [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      location={state.location}
      children={children}
      navigator={history}
      navigationType={history.action}
    />
  );
};

export const Router = ({ children, location, navigator, navigationType }) => {
  const locationContext = useMemo(
    () => ({ location, navigationType }),
    [location, navigationType]
  );

  const navigationContext = useMemo(() => ({ navigator }), [navigator]);

  return (
    <NavigationContext.Provider value={navigationContext}>
      <LocationContext.Provider
        value={locationContext}
        children={children}
      ></LocationContext.Provider>
    </NavigationContext.Provider>
  );
};

const useRoutes = (routes) => {
  const location = useLocation();
  const currentPathname = location?.pathname || "/";
  let currentRoute = null;
  routes.forEach(({ path, ...restChildren }) => {
    const isMatch = currentPathname.match(new RegExp(`^${path}`));
    if (isMatch) {
      currentRoute = { ...restChildren, path };
    }
  });

  return currentRoute?.element || null;
};

export const Routes = ({ children }) =>
  useRoutes(createRoutesFormChildren(children));
const createRoutesFormChildren = (children) => {
  let routes = [];

  React.Children.forEach(children, (child) => {
    let routeChildren = {
      path: child.props.path,
      element: child.props.element,
    };
    if (routeChildren.props?.children) {
      routeChildren.props.children = createRoutesFormChildren(
        child.props.children
      );
    }

    routes.push(routeChildren);
  });

  return routes;
};

export const Route = () => {};

```