/**
 * Fiber 节点结构
 * child/sibling/return 形成树状结构
 */
function createFiber({ type, props, key, parent = null }) {
  return {
    type, // 元素类型（如 div、span、函数组件等）
    props, // 属性对象
    key, // 可选，唯一标识
    dom: null, // 真实 DOM 节点
    child: null, // 第一个子 Fiber
    sibling: null, // 下一个兄弟 Fiber
    parent, // 父 Fiber
    alternate: null, // 上一轮的 Fiber
    effectTag: null, // 标记如何处理该节点（新增/更新/删除）
  };
}

/**
 * 将虚拟元素树转换为 Fiber 树
 * @param {object} element - 虚拟 DOM 元素
 * @param {Fiber} parentFiber - 父 Fiber
 */
function reconcileChildren(parentFiber, elements) {
  let prevSibling = null;
  elements.forEach((element, index) => {
    const newFiber = createFiber({
      type: element.type,
      props: element.props,
      key: element.key || index,
      parent: parentFiber,
    });
    if (index === 0) {
      parentFiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
  });
}

/**
 * Diff 两棵 Fiber 树，标记 effectTag
 * @param {Fiber} wipFiber - 工作中的新 Fiber
 */
function diffFiber(wipFiber) {
  const oldFiber = wipFiber.alternate;
  let oldChild = oldFiber && oldFiber.child;
  let prevSibling = null;
  let elements = wipFiber.props.children || [];

  elements.forEach((element, index) => {
    // 是否可以复用
    let sameType = oldChild && element && oldChild.type === element.type;

    let newFiber;
    if (sameType) {
      // 类型相同，复用
      newFiber = createFiber({
        type: oldChild.type,
        props: element.props,
        key: element.key || index,
        parent: wipFiber,
      });
      newFiber.dom = oldChild.dom;
      newFiber.alternate = oldChild;
      newFiber.effectTag = "UPDATE";
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

let nextUnitOfWork = null;
let wipRoot = null;
let currentRoot = null;
let deletions = [];

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

function performUnitOfWork(fiber) {
  // 函数组件/原生组件分开
  if (fiber.type instanceof Function) {
    fiber.props.children = [fiber.type(fiber.props)];
  }
  diffFiber(fiber); // 关键：做 diff

  // 遍历 fiber 树
  if (fiber.child) return fiber.child;
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
  return null;
}

/**
 * 遍历所有 Fiber，根据 effectTag 操作真实 DOM
 */
function commitRoot() {
  deletions.forEach(commitWork); // 删除多余节点
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) return;
  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;

  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    domParent.removeChild(fiber.dom);
    return;
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

/**
 * 更新 DOM 节点属性
 */
function updateDom(dom, prevProps, nextProps) {
  // 这里只写演示，实际应遍历属性做移除/添加
  Object.keys(prevProps)
    .filter((name) => name !== "children")
    .forEach((name) => {
      if (!(name in nextProps)) {
        dom[name] = "";
      }
    });
  Object.keys(nextProps)
    .filter((name) => name !== "children")
    .forEach((name) => {
      dom[name] = nextProps[name];
    });
}
function createDom(fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);
  Object.keys(fiber.props)
    .filter((key) => key !== "children")
    .forEach((name) => {
      dom[name] = fiber.props[name];
    });
  return dom;
}
function render(element, container) {
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
const MyApp = (props) => {
  const [count, setCount] = useState(0);
  return {
    type: "div",
    props: {
      children: [
        { type: "span", props: { children: [`count: ${count}`] } },
        {
          type: "button",
          props: {
            onclick: () => setCount(count + 1),
            children: ["+1"],
          },
        },
      ],
    },
  };
};

render({ type: MyApp, props: {} }, document.getElementById("root"));
