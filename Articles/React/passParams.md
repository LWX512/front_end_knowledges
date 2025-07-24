#### React 传递参数

##### 1. 父组件向子组件传递参数 / 子组件向父组件传递参数

-   父组件向子组件传递参数，需要现在父组件定义一个变量，然后传递给子组件，子组件通过 props 获取父组件传递过来的参数

```jsx
// 父组件
const App = () => {
    const [message, setMessage] = useState('Hello World');
    return (
        <div>
            <h1>父组件</h1>
            <ChildComponent message={message} />
        </div>
    );
};

// 子组件
function ChildComponent({ message }) {
    return <div>{message}</div>;
}
// 或者
function ChildComponent(props) {
    // props 是从父组件传递过来的参数
    return <div>{props.message}</div>;
}
```

-   子组件向父组件传递参数，可以先从父组件定义一个函数，通过父组件传递子组件参数，然后通过子组件事件触发传递参数

```jsx
// 父组件
const App = () => {
    const [message, setMessage] = useState('Hello World');

    const handleClick = (msg) => {
        setMessage(msg);
    };

    return (
        <div>
            <h1>父组件</h1>
            <ChildComponent click={handleClick} message={message} />
        </div>
    );
};

// 子组件
function ChildComponent({ message, click }) {
    const onClick = () => {
        click('Hello React');
    };

    return <div onClick={onClick}>{message}</div>;
}
// 或者
function ChildComponent(props) {
    // props 是从父组件传递过来的参数

    const onClick = () => {
        props.click('Hello React');
    };

    return <div onClick={onClick}>{props.message}</div>;
}
```

#### 兄弟组件通信

-   兄弟组件通信，可以通过父组件传递给子组件，子组件传递给兄弟组件

```jsx
// 父组件
const App = () => {
    const [message, setMessage] = useState('Hello World');

    const handleClick = (msg) => {
        setMessage(msg);
    };

    return (
        <div>
            <h1>父组件</h1>
            <ChildComponent click={handleClick} message={message} />
            <BrotherComponent click={handleClick} message={message} />
        </div>
    ;
    );
};

// 子组件
function ChildComponent({ message, click }) {

    const [count, setCount] = useState(0)

    const onClick = () => {
        const message = `Hello child component ${count}`
        click(message);
        setCount(count + 1);
    }

    return <div onClick={onClick}>{message}</div>;
}

// 兄弟组件
function BrotherComponent({ message, click }) {
    const [count, setCount] = useState(0)

    const onClick = () => {
        const message = `Hello brother component ${count}`
        click(message);
        setCount(count + 1);
    }

    return <div onClick={onClick}>{message}</div>;

}

```

#### 爷孙组件通信

-   爷孙组件通信，可以通过父组件传递给子组件，子组件传递给孙组件
    -   这种其实也不是很建议，因为这样会使得组件之间的耦合度太高，不利于组件的复用
    -   如果非要用，可以考虑使用发布订阅模式，仓库也是可以的，列如 `redux` `dva` 等
-   `Provider` 和 `Consumer`
    -   `Provider` 组件，可以传递数据给子孙组件
    -   `Consumer` 组件，可以接收数据

```jsx
import { createContext } from 'react';

const prantCount = createContext();

// 父组件
const App = () => {
    const [count, setCount] = useState(0);
    const onClick = (type, count) => {
        setCount(count + 1);
        console.log(type, count);
    };
    return (
        <div>
            <createContext.Provider
                value={{
                    count,
                    click: onClick,
                }}
            >
                <div>{count}</div>
                <ChildComponent />
                <BrotherComponent />
            </createContext.Provider>
        </div>
    );
};

// 子组件
const ChildComponent = () => {
    const onClick = (e, count, cb) => {
        console.log(count);
        cb('children component click', count + 1);
    };

    return (
        <div>
            <div>app 子组件 ChildComponent 组件</div>
            <prantCount.Consumer>
                {({ count, click }) => (
                    <div onClick={(e) => onClick(e, count, click)}>{count}</div>
                )}
            </prantCount.Consumer>
        </div>
    );
};

// 兄弟组件
const BrotherComponent = () => {
    return (
        <div>
            <div>app 子组件 BrotherComponent 组件</div>
            <GrandSonComponent />
        </div>
    );
};

// 孙组件
const GrandSonComponent = () => {
    const count = useContext(Context);

    const onClick = (e, count, cb) => {
        console.log(count);
        cb('brother component click', count + 1);
    };

    return (
        <div>
            <div>app 孙组件 GrandSonComponent 组件</div>
            <prantCount.Consumer>
                {({ count, click }) => (
                    <div onClick={(e) => click(e, count, click)}>{count}</div>
                )}
            </prantCount.Consumer>
        </div>
    );
};
```


#### 发布订阅
```js
class PubSub {
    constructor() {
        this.events = {};
    }

    on(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    emit(eventName, ...args) {
        if (this.events[eventName]) {
            this.events[eventName].forEach((callback) => {
                callback(...args);
            });
        }
    }

    off(eventName, callback) {
        if (this.events[eventName]) {
            const index = this.events[eventName].findIndex((item) => item === callback);
            if (index !== -1) {
                this.events[eventName].splice(index, 1);
            }
        }
    }
}

const pubsub = new PubSub();

pubsub.on('eventName', (...args) => {
    console.log(args);
});

pubsub.on('eventName', (...args) => {
    console.log(args);
});

pubsub.emit('eventName', 'arg1', 'arg2');

pubsub.off('eventName', (...args) => {
    console.log(args);
});

pubsub.emit('eventName', 'arg1', 'arg2');
```