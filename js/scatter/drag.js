import { COLOR, DRAG_SHAPE } from '../constant/constant.js';
import { depList } from './scatter.js';
import { setShape, setScale } from '../utils.js'


//拖拽组件
export function getGraphic(data, dataItem, dataIndex, seriesIndex, type, myChart) {
  return {
    id: type + dataIndex,
    name: type,
    // 'circle' 表示这个 graphic element 的类型是圆点。
    type: DRAG_SHAPE[type],
    shape: setShape(type, dataItem.symbolSize),
    scale: setScale(type, dataItem.symbolSize),
    // 用 transform 的方式对圆点进行定位。position: [x, y] 表示将圆点平移到 [x, y] 位置。
    // 这里使用了 convertToPixel 这个 API 来得到每个圆点的位置，下面介绍。
    position: myChart.convertToPixel('grid', dataItem.value),
    invisible: true,
    draggable: true,
    z: 100,
    // 这里使用了 echarts.util.curry 这个帮助方法，意思是生成一个与 onPointDragging
    // 功能一样的新的函数，只不过第一个参数永远为此时传入的 dataIndex 的值。
    ondrag: echarts.util.curry(onPointDragging, dataIndex, data, type, myChart),
    onmousemove: echarts.util.curry(showTooltip, dataIndex, seriesIndex, myChart),
    onmouseout: echarts.util.curry(hideTooltip, dataIndex, myChart),
    // onclick: echarts.util.curry(onClick, dataIndex, type, myChart),
  }
}

function onPointDragging(dataIndex, data, type, myChart) {
  data[dataIndex].value = myChart.convertFromPixel('grid', this.position);
  // 用更新后的 data，重绘折线图。
  myChart.setOption({
    series: [{
      id: type,
      type: 'line',
      data: data,
      color: COLOR[type]
    }],
    graphic: [{
      id: this.id,
      $action: 'merge',
      position: this.position
    }]
  });

  //拖拽过程中触发事件更新显示
  const depUpdate = depList.find(item => {
    return item.dotName === this.id
  });

  depUpdate.setPosition(data[dataIndex]);
}

function showTooltip(dataIndex, seriesIndex, myChart) {
  myChart.dispatchAction({
    type: 'showTip',
    seriesIndex,//series的index
    dataIndex
  });
}

function hideTooltip(dataIndex, myChart) {
  myChart.dispatchAction({
    type: 'hideTip'
  });
}