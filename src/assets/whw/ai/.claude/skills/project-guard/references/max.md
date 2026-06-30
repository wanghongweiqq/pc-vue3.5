# Max 代码规范

> Max 是美团跨端框架，使用 @max/max、@hfe/max-* 等包体系。
> 本规范持续补充，欢迎按实际项目经验更新。

## 组件写法

- 使用函数式组件 + hooks，不使用 class 组件
- 组件文件使用 `.tsx` 后缀
- 用 `memo()` 包裹纯展示组件，避免不必要的重渲染
- 组件 props 类型用 `interface Props` 定义，不用 `type`

```tsx
// ✅ 推荐
interface Props {
  value: string;
}
function MyComponent(props: Props) { ... }
export default memo(MyComponent);
```

## 样式系统

- 使用 `remStyleSheet` 创建样式表（来自 `@max/leez-style-util`），自动处理 rem 适配
- 不要直接写内联样式对象（除非是动态值）
- 样式文件独立为 `styles.ts`，与组件文件分离

```ts
// ✅ 推荐
import { remStyleSheet } from '@max/leez-style-util';
export default remStyleSheet({
  wrapper: { padding: 12 },
});

// ❌ 避免
<View style={{ padding: 12 }} />
```

## 文本渲染

- 使用 `LText`（来自 `@max/leez-text`）而非原生 `Text`
- `LText` 的 `children` 类型是 `React.ReactText`（string | number），不支持嵌套 React 节点
- 需要混合样式的文本（如部分高亮），拆分为多个同级 `LText` 放在 `flexDirection: 'row'` 的 `View` 中

```ts
// styles.ts
const styles = remStyleSheet({
  row: { flexDirection: 'row', alignItems: 'center' },
});
```

```tsx
// ✅ 混合样式文本的正确写法
<View style={styles.row}>
  <LText>前缀文字</LText>
  <LText color="#ff4b10">{highlightValue}</LText>
  <LText>后缀文字</LText>
</View>

// ❌ LText 不支持嵌套
<LText>前缀<LText color="red">{value}</LText>后缀</LText>
```

## 布局组件

- 使用 `View`（来自 `@hfe/max-view`）而非原生 `View`
- 使用 `LinearGradient`（来自 `@hfe/max-linear-gradient`）实现渐变背景

**基础组件默认样式：**
- `View`、`Sensor` 等容器组件：默认 `flex` 布局，`flexDirection: column`，`box-sizing: border-box`，`position: relative`
- `LText` 等内容组件：默认 `display: block`，**不是** flex 布局
- `LinearGradient`：在 MRN 端为 `flex + column`，但在 **H5 端默认为 `display: block`**（浏览器默认 div 行为），如需多端兼容须显式声明：

```ts
// styles.ts
const styles = remStyleSheet({
  gradient: { display: 'flex', flexDirection: 'column' },
});
```

```tsx
// ✅ 多端兼容写法
<LinearGradient style={styles.gradient}>
```

## Redux 状态

- 使用 `useSelector` 读取状态，`useDispatch` 或封装好的 action hooks 修改状态
- 不要在渲染函数中直接修改 store

## 跨平台注意

- 避免使用纯 Web API（如 `window`、`document`、`localStorage`）
- 样式属性使用 React Native 支持的子集（不是所有 CSS 属性都支持）
- 图片使用 `LImage`（来自 `@max/leez-image`）
- **`paddingHorizontal` / `paddingVertical` 在 H5 端不支持**（View、LText、LinearGradient 均已验证），多端项目须拆分为单独属性：

```ts
// ❌ H5 不支持
paddingHorizontal: 16

// ✅ 多端兼容
paddingLeft: 16, paddingRight: 16
```

## 鸿蒙端注意

- **不支持 8 位 16 进制颜色（带透明度）**，须改用 `rgba`：

```ts
// ❌ 鸿蒙不支持
backgroundColor: '#ffffff7f'

// ✅ 改用 rgba
backgroundColor: 'rgba(255, 255, 255, 0.5)'
```

- **传入 `rootTag` 会导致鸿蒙端闪退**，跳转时不要透传该参数

## 字体规范

- 数字类展示使用 MTNew 系列字体（通过 `LText` 的 `type` prop）

**命名规则：** `MTNew{组}{字号}{字重}`

| 分组 | 可用字号 | 字重 |
|---|---|---|
| `DXL`（超大）| 30、24、22 | Bold / Medium / Regular |
| `DL`（大）  | 20、18、16、15 | Bold / Medium / Regular |
| `DS`（小）  | 14、13、12、11、10 | Bold / Medium / Regular |

示例：`MTNewDXL24Bold`、`MTNewDL16Regular`、`MTNewDS13Medium`

- **鸿蒙点评端 MTNew 数字字体加粗不生效**：使用 MTNew Bold 系列（如 `MTNewDL16Bold`、`MTNewDXL24Bold`）时，鸿蒙点评端字重显示为常规，须额外声明 `fontWeight: '700'`：

```ts
// styles.ts
const styles = remStyleSheet({
  boldNumber: { fontWeight: '700' },
});
```

```tsx
<LText type="MTNewDXL24Bold" style={styles.boldNumber}>
  {value}
</LText>
```

---

*请根据实际项目经验持续补充。*
