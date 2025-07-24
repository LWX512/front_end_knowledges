/**
 * DispatcherContext：类似 ReactCurrentDispatcher，记录当前正在执行的 Fiber/组件
 * 所有 hooks API 都会从这里获取当前 dispatcher
 */
const DispatcherContext = {
  current: null, // 当前 dispatcher 实例，Fiber 渲染时设置
};

// 导出供其他模块使用
// module.exports = DispatcherContext;

export default DispatcherContext;
