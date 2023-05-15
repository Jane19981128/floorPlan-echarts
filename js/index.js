
import { addLightFurniture, addLighting, removeLine, getClickLine, addCamera, getLine, addGraphicPoint } from './scatter/scatter.js';
import { setShape, setScale } from './utils.js'
import { SCATTER_TYPE, COLOR } from './constant/constant.js'
import { getGraphic } from './scatter/drag.js'

export function checkboxChange(seriesList, myChart, observerList) {
    // const furnitureBox = document.getElementById('furnitureBox');
    // const cameraBox = document.getElementById('cameraBox');

    const { observerFurniture } = observerList;
    var checkbox = document.getElementsByName('doit');
    checkbox.forEach(item => {
        item.onclick = () => {
            if (item.checked) {
                // if(item.value === 'cameraScatter'){
                //     cameraBox.style.display = 'block';
                //     furnitureBox.style.display = 'none'
                // }else{
                //     cameraBox.style.display = 'none';
                //     furnitureBox.style.display = 'block'
                // }

                if (item.value === 'lightingLine') {
                    addLighting(seriesList, pointData, myChart, observerFurniture);
                };

                if (item.value === 'lightFurnitureScatter') {
                    addLightFurniture(seriesList, pointData, myChart, observerFurniture);
                };

                if (item.value === 'cameraScatter') {
                    addCamera(seriesList, pointData, myChart, observerFurniture);
                }
            } else {
                removeLine(seriesList, item.value, myChart);
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

                    if (event.target.id === 'pointZ') {
                        dotData.posZ = parseFloat(event.target.value);
                    };

                    if (dotData.originDot[event.target.id]) {
                        dotData.originDot[event.target.id] = parseFloat(event.target.value);
                    };

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
                console.log(item);
                saveSerietoFloorPlan(pointData, item);
            }
        });
        alert('保存成功！')

    } catch (error) {
        alert('保存失败！')
        throw (error)

    }
    console.log(pointData)
}

function saveSerietoFloorPlan(pointData, serie) {
    let pointList = [];
    serie.data.forEach(item => {
        if (serie.id != 'cameraScatter') {
            item.originDot.position.x = item.value[0];
            item.originDot.position.y = item.value[1];
        } else {
            item.originDot.camPos.x = item.value[0] * 1000;
            item.originDot.camPos.y = item.value[1] * 1000;
            item.originDot.camPos.z = item.posZ * 1000;
        }

        pointList.push(item.originDot);
    });

    if (serie.id === SCATTER_TYPE[0]) {
        pointData.plan_data.lighting = pointList;
    };

    if (serie.id === SCATTER_TYPE[1]) {
        const furnitureList = pointData.plan_data.furniture.filter(item => {
            return item.name.includes('灯')
        });

        furnitureList.forEach((item, index) => {
            item = Object.assign(pointList[index])
        });
    };
    if (serie.id === SCATTER_TYPE[2]) {
        pointData.point_data.cameraDataList = pointList;
    };
}

export function addLightingPoint(seriesList, myChart, observerList) {
    const { observerFurniture } = observerList
    let btn = document.getElementById('addLightingPoint');
    btn.onclick = () => {
        let checkbox = document.getElementById('lightingLine');
        const type = checkbox.value;
        if (!checkbox.checked) {
            alert('图中未有灯光点！');
            return
        }
        const { lineData, lineIndex } = getLine(seriesList, type);
        const addPointData = Object.assign({}, lineData.data[0]);
        const pointIndex = lineData.data.length
        addPointData.name = checkbox.value + pointIndex;
        addPointData.value = [0, 0];
        addPointData.originDot.position = {
            x: 0,
            y: 0
        };

        lineData.data.push(addPointData);

        const option = [
            lineData.data,
            addPointData,
            parseInt(pointIndex),
            lineIndex,
            'lightingLine',
            myChart
        ];

        const graphic =  getGraphic(...option);
        addGraphicPoint(graphic, lineData, 'lightingLine', myChart, observerFurniture);
    }
}