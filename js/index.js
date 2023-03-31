
import { addLightFurniture, addLighting, removeLine, getClickLine } from './scatter/scatter.js';
import { setShape, setScale } from './utils.js'
import { SCATTER_TYPE } from './constant/constant.js'

export function checkboxChange(seriesList, myChart, observerPage) {
    // var showDomList = [];
    // showDomList.push(document.getElementById('lightingLine'));
    // showDomList.push(document.getElementById('lightFurnitureScatter'));

    var checkbox = document.getElementsByName('doit');
    checkbox.forEach(item => {
        item.onclick = () => {
            if (item.checked) {
                // showDomList.forEach((data) => {
                //   if (data.id === item.value) {
                //     data.style.display = 'block';
                //     return
                //   }
                //   data.style.display = 'none';
                // });

                if (item.value == 'lightingLine') {
                    addLighting(seriesList, pointData, myChart, observerPage);
                }
                else {
                    addLightFurniture(seriesList, pointData, myChart, observerPage);
                }
            } else {
                removeLine(seriesList, item.value, myChart);
                // showDomList.forEach((data) => {
                //   if (data.id === item.value) {
                //     data.style.display = 'none';
                //   }
                // })
            }
        }
    });
}

export function addInputListener(seriesList, myChart, pageNodeList) {
    const dotIdInput = document.getElementById('dotId');
    pageNodeList.forEach(item => {
        if (item.id != 'dotId') {
            item.addEventListener('input', event => {
                if (dotIdInput.value) {
                    const { lineData, dotData } = getClickLine(seriesList, { id: dotIdInput.value });
                    if (event.target.id === 'pointX') {
                        dotData.value[0] = parseFloat(event.target.value);
                    };

                    if (event.target.id === 'pointY') {
                        dotData.value[1] = parseFloat(event.target.value);
                    };

                    dotData.originDot[event.target.id] = parseFloat(event.target.value);
                    if (event.target.id === 'width') {
                        dotData.symbolSize[0] = parseFloat(event.target.value) * dotData.size
                    };

                    if (event.target.id === 'length') {
                        dotData.symbolSize[1] = parseFloat(event.target.value) * dotData.size
                    };

                    myChart.setOption({
                        series: [lineData],
                        graphic: [{
                            id: dotIdInput.value,
                            $action: 'merge',
                            position: myChart.convertToPixel('grid', dotData.value),
                            shape: setShape(lineData.id, dotData.symbolSize),
                            scale: setScale(lineData.id, dotData.symbolSize)
                        }]
                    });

                }
            })
        }

    });

}

export function saveEchartsToFloorPlan(pointData, seriesList) {
    try {
        seriesList.forEach(item => {
            if (item.id) {
                saveSerietoFloorPlan(pointData, item)
            }
        });
        alert('保存成功！')
        
    } catch (error) {
        alert('保存失败！')
    }
}

function saveSerietoFloorPlan(pointData, serie){
    let pointList = [];
    serie.data.forEach(item => {
        item.originDot.position.x = item.value[0];
        item.originDot.position.y = item.value[1];
        pointList.push(item.originDot);
    });

    if(serie.id === SCATTER_TYPE[0]){
        pointData.plan_data.lighting = pointList;
    };

    if(serie.id === SCATTER_TYPE[1]){
        const furnitureList = pointData.plan_data.furniture.filter(item => {
            return item.name.includes('灯')
        });

        furnitureList.forEach((item, index) => {
            item = Object.assign(pointList[index])
        });
    };
}