<template>
  <div class="bcp-grid content">
    <h2>CSS Grid 网格布局</h2>
    <div class="grid">
      <div class="container">
        <div class="item item-1">
          1
        </div>
        <div class="item item-2">
          2
        </div>
        <div class="item item-3">
          3
        </div>
        <div class="item item-4">
          4
        </div>
        <div class="item item-5">
          5
        </div>
        <div class="item item-6">
          6
        </div>
        <div class="item item-7">
          7
        </div>
        <div class="item item-8">
          8
        </div>
        <div class="item item-9">
          9
        </div>
      </div>
      <div class="container container-01">
        <div class="item item-1">
          1
        </div>
        <div class="item item-2">
          2
        </div>
        <div class="item item-3">
          3
        </div>
        <div class="item item-4">
          4
        </div>
        <div class="item item-5">
          5
        </div>
        <div class="item item-6">
          6
        </div>
        <div class="item item-7">
          7
        </div>
        <div class="item item-8">
          8
        </div>
        <div class="item item-9">
          9
        </div>
      </div>
      <div class="container container-01 container-02">
        <div class="item item-1">
          1
        </div>
        <div class="item item-2">
          2
        </div>
        <div class="item item-3">
          3
        </div>
        <div class="item item-4">
          4
        </div>
        <div class="item item-5">
          5
        </div>
        <div class="item item-6">
          6
        </div>
        <div class="item item-7">
          7
        </div>
        <div class="item item-8">
          8
        </div>
        <div class="item item-9">
          9
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.bcp-grid {
  .grid {
    color: #fff;

    .container {
      display: inline-grid;
      // grid-template-columns:repeat(auto-fill,500px);
      grid-template-rows: repeat(3, 50px);
      grid-template-columns: 50px 50px 50px;
      // justify-items: start;
      grid-auto-rows: 80px;
      grid-column-gap: 0; //grid在最新的语法中可省略
      // grid-template-rows: 50px 50px 50px;
      // grid-gap: <grid-row-gap> <grid-column-gap>;
      column-gap: 0; //grid在最新的gap相关的3个语法中可省略
      margin-right: 50px;
      // place-items: <align-items> <justify-items>;
      .item {
        padding: 0;
        margin: 0;
        font-size: 2em;
        text-align: center;
        border: 1px solid #e5e4e9;
      }

      .item-1 {
        background-color: #ef342a;
      }

      .item-2 {
        background-color: #f68f26;
      }

      .item-3 {
        background-color: #4ba946;
      }

      .item-4 {
        background-color: #0376c2;
      }

      .item-5 {
        background-color: #c077af;
      }

      .item-6 {
        background-color: #f8d29d;
      }

      .item-7 {
        background-color: #149632;
      }

      .item-8 {
        background-color: #852369;
      }

      .item-9 {
        background-color: #ff6100;
      }

      &.container-01 {
        .item-1 {
          grid-column-start: 1;
          grid-column-end: 3;
        }

        .item-2 {
          grid-column-start: 1;
          grid-column-end: 3;
        }
      }

      &.container-02 {
        grid-auto-flow: row dense;
      }
    }
  }
}
</style>
