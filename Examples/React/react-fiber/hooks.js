/**
 * 所有 hooks 对外暴露，自动选择当前 DispatcherContext.current 进行操作
 * 这样 hooks 可以并行工作于不同 Fiber/组件实例
 */

// const DispatcherContext = require("./shared.js");
import DispatcherContext from "./shared.js";

/**
 * useState Hook
 */
function useState(initialState) {
  const dispatcher = DispatcherContext.current;
  if (!dispatcher) throw new Error("Hooks只能在组件内使用");
  return dispatcher.useState(initialState);
}

/**
 * useEffect Hook
 */
function useEffect(effect, deps) {
  const dispatcher = DispatcherContext.current;
  if (!dispatcher) throw new Error("Hooks只能在组件内使用");
  return dispatcher.useEffect(effect, deps);
}

/**
 * useLayoutEffect Hook
 */
function useLayoutEffect(effect, deps) {
  const dispatcher = DispatcherContext.current;
  if (!dispatcher) throw new Error("Hooks只能在组件内使用");
  return dispatcher.useLayoutEffect(effect, deps);
}

/**
 * useRef Hook
 */
function useRef(initialValue) {
  const dispatcher = DispatcherContext.current;
  if (!dispatcher) throw new Error("Hooks只能在组件内使用");
  return dispatcher.useRef(initialValue);
}

/**
 * useReducer Hook
 */
function useReducer(reducer, initialArg, init) {
  const dispatcher = DispatcherContext.current;
  if (!dispatcher) throw new Error("Hooks只能在组件内使用");
  return dispatcher.useReducer(reducer, initialArg, init);
}

/**
 * useMemo Hook
 */
function useMemo(factory, deps) {
  const dispatcher = DispatcherContext.current;
  if (!dispatcher) throw new Error("Hooks只能在组件内使用");
  return dispatcher.useMemo(factory, deps);
}

/**
 * useCallback Hook
 */
function useCallback(callback, deps) {
  const dispatcher = DispatcherContext.current;
  if (!dispatcher) throw new Error("Hooks只能在组件内使用");
  return dispatcher.useCallback(callback, deps);
}

/**
 * useImperativeHandle Hook
 */
function useImperativeHandle(ref, factory, deps) {
  const dispatcher = DispatcherContext.current;
  if (!dispatcher) throw new Error("Hooks只能在组件内使用");
  return dispatcher.useImperativeHandle(ref, factory, deps);
}

/**
 * useDebugValue Hook
 */
function useDebugValue(value, formatter) {
  const dispatcher = DispatcherContext.current;
  if (!dispatcher) throw new Error("Hooks只能在组件内使用");
  return dispatcher.useDebugValue(value, formatter);
}

// 统一导出所有 hooks API
// module.exports = {
//   useState,
//   useEffect,
//   useLayoutEffect,
//   useRef,
//   useReducer,
//   useMemo,
//   useCallback,
//   useImperativeHandle,
//   useDebugValue,
// };

export default {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useReducer,
  useMemo,
  useCallback,
  useImperativeHandle,
  useDebugValue,
};
