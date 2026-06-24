<template>
  <div class="content">
    <h2>ref和reactive</h2>
    <p>总的来说，vue3版本中 composition API的ref和reactive只要不改变根数据的引用地址就能触发响应式，而option API 中响应式基本不涉及引用地址是否改变，具体可见<a href="/demo/feature">feature页面</a>。</p>
    <p>Vue3 中 ref 和 reactive 的核心区别体现在数据类型支持、访问方式、响应式原理和使用场景四个维度。</p>

    <h3>1、‌数据类型支持‌</h3>
    <p>ref 支持包装基本类型（字符串、数字、布尔值）和复杂类型数据（对象/数组），内部会对对象类型自动调用 reactive‌‌</p>
    <p>reactive 仅接收对象、数组等引用类型，传入基本类型会触发警告且无法实现响应式。‌‌</p>

    <h3>2、‌数据访问方式‌</h3>
    <p>ref 需要通过 .value 访问或修改值（模板中自动解包）。</p>
    <p>reactive 可直接访问属性，无需额外操作。‌‌</p>

    <h3>3、‌响应式原理</h3>
    <p>ref 通过 RefImpl 类实现，使用 .value 的 getter/setter 拦截变更。‌‌</p>
    <p>reactive 返回 Proxy 代理对象，深度追踪嵌套属性变化。‌‌</p>

    <h3>4、‌‌使用场景对比‌</h3>

    <h4>‌优先使用 ref 的场景‌。</h4>
    <p>处理基本数据类型。</p>
    <p>需要整体替换对象引用（如重新赋值整个数组）。‌‌</p>
    <p>需要保持类型一致性（如函数参数传递）。</p>

    <h4>优先使用 reactive 的场景‌。</h4>
    <p>处理包含多个属性的复杂对象（如表单数据）。</p>
    <p>需要保持对象引用稳定（避免解构丢失响应性）。‌‌</p>

    <h4>混合使用注意事项‌。</h4>
    <p>reactive 嵌套 ref 时，ref 会自动解包。</p>
    <p>ref 嵌套 reactive 时，需通过 .value 访问对象属性。‌‌</p>

    <h3>‌进阶特性差异‌</h3>
    <h4>‌模板渲染行为</h4>
    <p>ref 在模板中自动解包顶层属性，无需 .value‌‌</p>
    <p>reactive 需保持原始对象引用，直接渲染嵌套属性。‌‌</p>

    <h4>‌类型系统表现‌。</h4>
    <p>ref 返回 Ref &lt;T&gt;类型包裹的响应式引用。</p>
    <p>reactive 保留原始对象类型推断。‌‌</p>

    <h4>‌调试信息差异‌。</h4>
    <p>ref 控制台显示为 RefImpl 实例。</p>
    <p>reactive 显示为 Proxy 代理对象。‌‌</p>

    <h3>Vue3 为什么 ref 变量需要 .value</h3>
    <p>1、Proxy 无法直接代理基本类型，必须包装成对象。‌‌</p>
    <p>2、Vue3 需要通过.value 才能做依赖追踪和视图更新。‌‌</p>
    <p>3、.value提供了明确语义，便于类型提示和维护。‌‌</p>
  </div>
</template>
