### react-router

`React-Router` 是 `React` 比较最重要的一环，它提供了 `React` 应用的 `URL` 管理，`URL` 管理是 `React` 应用中比较重要的一个部分，它使得应用的 `URL` 和 `UI` 保持同步。本章将介绍使用

### 安装
```
npm install --save react-router-dom
```

### 基本使用

```jsx
import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const App = () => (
    <Router>
        <div>
            <ul>
                <li>
                    <Link to="/">首页</Link>
                </li>
                <li>
                    <Link to="/about">关于</Link>
                </li>
                <li>
                    <Link to="/users">用户</Link>
                </li>
            </ul>

            <hr />

            {/* 路由组件 */}
            <Route path="/" exact component={Home} />;
            <Route path="/about" component={About} />;
            <Route path="/users" component={Users} />;
        </div>
    </Router>
);

const Home = () => <h2>Home</h2>;
const About = () => <h2>About</h2>;
const Users = () => <h2>Users</h2>;

export default App;
```

### 嵌套路由

```jsx
import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const App = () => (
    <Router>
        <div>
            <ul>
                <li>
                    <Link to="/">首页</Link>
                </li>
                <li>
                    <Link to="/about">关于</Link>
                </li>
                <li>
                    <Link to="/users">用户</Link>
                </li>
            </ul>

            <hr />

            {/* 嵌套路由 */}
            <Route path="/" exact component={Home} />;
            <Route path="/about" component={About} />;
            <Route path="/users" component={Users} />;

            <Route path="/users" component={Users}>
                <Route path="/users/:id" component={User} />
            </Route>
        </div>
    </Router>
);

const Home = () => <h2>Home</h2>;
const About = () => <h2>About</h2>;
const Users = () => <h2>Users</h2>;
const User = () => <h2>User</h2>;

export default App;
```

### 参数传递

```jsx
import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
const App = () => (
    <Router>
        <div>
            <ul>
                <li>
                    <Link to="/">首页</Link>
                </li>
                <li>
                    <Link to="/about">关于</Link>
                </li>
                <li>
                    <Link to="/users">用户</Link>
                </li>
            </ul>

            <hr />

            {/* 嵌套路由 */}
            <Route path="/" exact component={Home} />;
            <Route path="/about" component={About} />;
            <Route path="/users" component={Users} />;

            <Route path="/users" component={Users}>
                <Route path="/users/:id" component={User} />
            </Route>
        </div>
    </Router>
);

const Home = () => <h2>Home</h2>;
const About = () => <h2>About</h2>;
const Users = () => <h2>Users</h2>;
const User = ({ match }) => (
    <div>
        <h2>User</h2>
        <p>ID: {match.params.id}</p>
    </div>
);

export default App;
```
