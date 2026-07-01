<template>
  <div class="content">
    <h2>工厂函数</h2>
    <p>工厂函数。顾名思义，就好比一个工厂一样，可以批量制造某种类型的东西。其实说白了就是封装了个方法减少重复工作</p>
    <pre>{{ `function animal (name,sex) {
  let obj = new Object()  //引用原始对象，也可以let obj = {}
  obj.name = name
  obj.sex = sex
  obj.saySex = function () {
      console.log(\`我的性别是$\{this.sex\}\`)  //this引用对象自身
  }
  return obj
}
let monkey = animal('猴子','母')
console.log('工厂函数:')
monkey.saySex() //我的性别是母
console.log(monkey instanceof animal) // false 判断实例是否属于某个原型用instanceof
console.log(monkey instanceof Object) // true

` }}</pre>
    <p>这样写主要是为了解决需要创建大量有属性重叠的对象，如果每个都new一下，然后逐一添加属性。这也是个累人的活。通过上面的代码中，我们声明了一个animal方法，此方法可批量制造动物。这样每次只需要简单的一行代码就可以搞定一个动物的创建。</p>
    <p>方便虽然方便，但是还是有缺点。就是每次新建的时候都需要在内部创建一个对象，然后进行一系列操作，最后返回。也就是说创建十次，那么就会创建十次全新的对象，然后返回并赋值。这样创建的十个对象在代码间的关系是没有的，换句话说就是我们都是动物，但是谁都不知道我们我们产自哪里，只知道出自Object。</p>
  </div>
</template>
