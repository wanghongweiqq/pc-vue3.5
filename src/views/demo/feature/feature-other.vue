<template>
  <div class="content">
    <h2>其他更新</h2>
    <h3>钩子函数</h3>
    <p>Vue 3的组合式api中去掉了options api中的beforeCreate和created钩子，其新的setup函数相当于options api的beforeCreate,created，已经完美覆盖了它们的功能，并且提供了更强大、更灵活的逻辑组织方式。</p>
    <p>Vue 3的options api中可以继续使用beforeCreate和created钩子</p>
    <p>兄弟组件关系：同一个组件的beforeCreate、created、beforeMount钩子会依次执行，然后再执行下一个兄弟组件的这三个钩子</p>
    <p>父子组件关系：父组件的beforeCreate、created、beforeMount -> 子组件的beforeCreate、created、beforeMount -> 子组件的mounted -> 父组件的mounted</p>
    <table class="table">
      <tbody>
        <tr>
          <th>钩子函数</th>
          <th>beforeCreate</th>
          <th>created</th>
          <th>beforeMount</th>
          <th>mounted</th>
        </tr>
        <tr>
          <th>触发时机</th>
          <td>实例初始化后，数据观测/事件配置前</td>
          <td>实例创建完成，数据观测/事件配置完成</td>
          <td>模板编译后，挂载（渲染）到 DOM 前</td>
          <td>实例被挂载到 DOM 后</td>
        </tr>
        <tr>
          <th>主要用途</th>
          <td>插件初始化、全局配置</td>
          <td>数据初始化、异步请求、事件监听</td>
          <td>挂载前的最后准备工作</td>
          <td>操作 DOM、初始化第三方库、发送异步请求</td>
        </tr>
        <tr>
          <th>data / methods 访问</th>
          <td>不可访问</td>
          <td>可访问</td>
          <td>可访问</td>
          <td>可访问</td>
        </tr>
        <tr>
          <th>DOM 访问</th>
          <td>不可访问</td>
          <td>不可访问 ($el未定义)</td>
          <td>不可访问（虚拟DOM已生成，真实DOM未生成）</td>
          <td>可访问</td>
        </tr>
      </tbody>
    </table>
    <h3>组件模板根节点</h3>
    <p>在 Vue 3 的组件中，你可以直接在模板内并列放置多个元素，无需根标签包裹。Vue 会在底层自动使用 Fragment来管理这些节点</p>
  </div>
</template>
