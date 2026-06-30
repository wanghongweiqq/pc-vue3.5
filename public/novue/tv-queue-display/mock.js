// =============================================
// 模板配置（等同于编辑器 serialize() 的输出）
// =============================================
var MOCK_CONFIG = {
  "templateName": "TV 全组件测试",
  "canvas": {
    "width": 750,
    "height": 422,
    "ratio": "16:9",
    "background": "#1a1a2e"
  },
  "components": [
    {
      "id": "comp_text_1",
      "type": "text",
      "x": 20, "y": 10, "width": 260, "height": 50,
      "zIndex": 1,
      "props": {
        "content": "美味餐厅·等位大屏",
        "fontSize": 28, "color": "#ffffff",
        "bold": true, "fontFamily": "", "letterSpacing": 0
      }
    },
    {
      "id": "comp_date_1",
      "type": "date",
      "x": 480, "y": 10, "width": 250, "height": 50,
      "zIndex": 2,
      "props": {
        "format": "YYYY-MM-DD HH:mm:ss",
        "fontSize": 22, "color": "#aaaacc",
        "bold": false, "fontFamily": "", "letterSpacing": 0
      }
    },
    {
      "id": "comp_line_top",
      "type": "line",
      "x": 0, "y": 65, "width": 750, "height": 20,
      "zIndex": 3,
      "props": {
        "direction": "horizontal",
        "color": "#4444aa", "lineWidth": 2, "opacity": 0.8
      }
    },
    {
      "id": "comp_image_1",
      "type": "image",
      "x": 20, "y": 90, "width": 340, "height": 220,
      "zIndex": 4,
      "props": {
        "mediaList": [
          { "type": 2, "url": "https://picsum.photos/seed/food1/340/220" },
          { "type": 2, "url": "https://picsum.photos/seed/food2/340/220" }
        ],
        "autoPlay": true, "interval": 3
      }
    },
    {
      "id": "comp_waitcount_1",
      "type": "waitCount",
      "x": 390, "y": 90, "width": 340, "height": 120,
      "zIndex": 5,
      "props": {
        "maxDisplay": 0, "showCallNum": true,
        "fontSize": 44, "color": "#ffffff",
        "bold": true, "fontFamily": "", "letterSpacing": 0
      }
    },
    {
      "id": "comp_queue_wait",
      "type": "queue",
      "x": 390, "y": 220, "width": 340, "height": 180,
      "zIndex": 6,
      "props": {
        "dataType": "wait",
        "rows": 3, "cols": 4,
        "showTitle": true,
        "fontSize": 22, "color": "#ffffff",
        "bold": false, "fontFamily": "", "letterSpacing": 0
      }
    },
    {
      "id": "comp_rect_bg",
      "type": "rect",
      "x": 20, "y": 320, "width": 340, "height": 90,
      "zIndex": 4,
      "props": {
        "hasFill": true, "fillColor": "#16213e",
        "borderColor": "#4444aa", "borderWidth": 1,
        "borderStyle": "solid", "borderRadius": 8, "opacity": 0.9
      }
    },
    {
      "id": "comp_queue_call",
      "type": "queue",
      "x": 30, "y": 328, "width": 320, "height": 74,
      "zIndex": 7,
      "props": {
        "dataType": "call",
        "rows": 1, "cols": 4,
        "showTitle": false,
        "fontSize": 24, "color": "#ffd700",
        "bold": true, "fontFamily": "", "letterSpacing": 0
      }
    },
    {
      "id": "comp_line_v",
      "type": "line",
      "x": 374, "y": 85, "width": 20, "height": 325,
      "zIndex": 3,
      "props": {
        "direction": "vertical",
        "color": "#4444aa", "lineWidth": 1, "opacity": 0.6
      }
    }
  ],
  "shopIds": []
};

// =============================================
// 实时数据（waitCount / queue 组件的数据来源）
// 实际接入时替换为接口返回的数据
// =============================================
var MOCK_REALTIME = {
  waitCount: {
    total: 12,
    callNum: "A008"
  },
  waitQueue: [
    { num: "A001" }, { num: "A002" }, { num: "A003" }, { num: "A004" },
    { num: "B001" }, { num: "B002" }, { num: "B003" }, { num: "B004" },
    { num: "C001" }, { num: "C002" }, { num: "C003" }, { num: "C004" }
  ],
  callQueue: [
    { num: "A005" }, { num: "A006" }, { num: "B002" }, { num: "C001" }
  ]
};
