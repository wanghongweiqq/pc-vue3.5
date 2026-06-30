# React 代码规范

> 适用于标准 React（Web）项目，使用 react + react-dom。
> 本规范持续补充，欢迎按实际项目经验更新。

## 组件写法

- 函数式组件，不使用 class 组件
- 组件文件使用 `.tsx` 后缀，工具函数用 `.ts`
- 一个文件只导出一个组件（default export）
- 组件 props 类型用 `interface Props` 定义

## Hooks 规范

- 遵循 hooks 规则：只在函数组件顶层调用，不在条件/循环中调用
- 自定义 hook 命名以 `use` 开头
- `useEffect` 依赖数组要完整，不要遗漏依赖
- 避免在 `useEffect` 中直接修改 DOM，使用 ref

## 性能优化

- `useMemo` 用于计算开销大的派生值
- `useCallback` 用于传递给子组件的回调函数
- `React.memo` 包裹纯展示子组件
- 避免在渲染函数中创建内联对象/函数（每次渲染都会新建引用）

## 状态管理

- 局部状态用 `useState`
- 跨组件状态根据项目选型（Redux / Context / Zustand 等）
- 不要直接修改 state，始终返回新对象

---

*此文件为初始版本，请根据实际项目经验持续补充。*
