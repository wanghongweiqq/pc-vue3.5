# Vue3 代码规范

> 适用于 Vue 3 项目，推荐使用 Composition API + `<script setup>` 语法。
> 本规范持续补充，欢迎按实际项目经验更新。

## 组件写法

- 优先使用 `<script setup>` 语法糖（比 Options API 更简洁）
- 组件文件使用 `.vue` 后缀
- 组件命名使用 PascalCase

```vue
<!-- ✅ 推荐 -->
<script setup lang="ts">
import { ref, computed } from 'vue'
const count = ref(0)
const doubled = computed(() => count.value * 2)
</script>
```

## 响应式

- 原始值用 `ref()`，对象/数组用 `reactive()`
- 访问 `ref` 的值需要 `.value`（在模板中自动解包，不需要）
- 不要解构 `reactive` 对象（会失去响应性），用 `toRefs()` 或 `storeToRefs()`

## 计算属性与监听

- 派生值用 `computed()`，不要在模板中写复杂逻辑
- 副作用用 `watch` 或 `watchEffect`
- 避免在 `computed` 中产生副作用

### watch 使用细节

**getter 函数只追踪返回值的变化**，`deep` 是否需要取决于 `name` 是原始值还是对象：

```js
const obj = reactive({ name: { firstName: 'Tom' } })

// ① 直接 watch reactive 对象 → 默认 deep: true，可感知内部所有属性变化
watch(obj, callback)

// ② getter 返回对象 → 默认 deep: false，只感知引用替换，感知不到内部属性变化
watch(() => obj.name, callback)
obj.name.firstName = 'Jerry' // ❌ 不触发（引用未变）
obj.name = { firstName: 'Jerry' } // ✅ 触发（引用变了）

// ③ getter 返回原始值 → 直接感知，无需 deep
watch(() => obj.name.firstName, callback) // ✅ 推荐，精准监听
```

**推荐：能精准到具体属性就不要开 `deep: true`**，`deep` 会递归遍历对象所有层级，数据复杂时有性能开销。

## 类型

- 使用 TypeScript，为 props 和 emits 定义类型
- `defineProps<{}>()` + `defineEmits<{}>()` 泛型写法

```vue
<script setup lang="ts">
const props = defineProps<{ title: string; count?: number }>()
const emit = defineEmits<{ update: [value: number] }>()
</script>
```

---

*此文件为初始版本，请根据实际项目经验持续补充。*
