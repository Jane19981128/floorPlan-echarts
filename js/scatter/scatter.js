import { getGraphic } from './drag.js'
import { COLOR, SHAPE, SIZE, SCATTER_TYPE, LEGEND_NAME } from '../constant/constant.js'
import { Dep } from '../monitor/dep/index.js';
import { deepCloneJson } from '../utils.js'

let graphicList = [];

export const depList = [];
// export const observerList = [observer];

//计算墙的数据
function calcWallList(walls) {
    const wallArry = [];
    const seriesList = walls.map((item, index) => {
        let wall = {
            data: [],
            type: 'line',
            showSymbol: false,
        };

        wall.data = [[item.start.x, item.start.y], [item.end.x, item.end.y]];
        wallArry.push(item.start.x, item.start.y, item.end.x, item.end.y);

        return wall;
    })

    //计算最大值
    const max = Math.max(...wallArry);
    const min = Math.min(...wallArry);
    const maxValue = max > Math.abs(min) ? max : Math.abs(min);

    return { seriesList, maxValue }
}

//计算家具点位
function calcPlanList(planArr, type, size) {
    let graphicData = planArr.map((item, index) => {
        const value = [item.position.x, item.position.y];
        const symbolSize = [item.width * size, item.length * size];
        const name = type + index;

        return {
            value,
            symbolSize,
            name,
            originDot: Object.assign({}, item),
            size: size
        };
    });

    const planLine = {
        id: type,
        name: type,
        type: 'line',
        data: graphicData,
        color: COLOR[type],
        symbol: SHAPE[type],
        lineStyle: {
            color: 'rgba(0,0,0, .0)',
        }
    };

    return planLine
}

//计算相机点位
function calcCameraList(planArr, type, size) {
    let graphicData = planArr.map((item, index) => {
        const value = [item.camPos.x / 1000, item.camPos.y / 1000];
        const symbolSize = 15;
        const name = type + index;
        const Z = item.camPos.z / 1000

        return {
            value,
            symbolSize,
            name,
            originDot: deepCloneJson(item),
            size: size,
            posZ: Z
        };
    });

    const planLine = {
        id: type,
        name: type,
        type: 'line',
        data: graphicData,
        color: COLOR[type],
        symbol: SHAPE[type],
        lineStyle: {
            color: 'rgba(0,0,0, .0)',
        }
    };

    return planLine
}

//增加灯家具点位
function addLightFurniture(seriesList, pointData, myChart, observerFurniture) {
    const lightFurniture = pointData.plan_data.furniture.filter(item => {
        return item.name.includes('灯')
    });

    const lightFurnitureScatter = calcPlanList(lightFurniture, 'lightFurnitureScatter', SIZE['lightFurnitureScatter']);
    const count = seriesList.filter(item => {
        return item.id === 'lightFurnitureScatter'
    });

    if (count.length) {
        showLine(seriesList, 'lightFurnitureScatter', myChart)
        return false
    };

    seriesList.push(lightFurnitureScatter);
    const seriesIndex = seriesList.length - 1;
    const newGraphicList = echarts.util.map(lightFurnitureScatter.data,
        function (dataItem, dataIndex) {
            const option = [
                lightFurnitureScatter.data,
                dataItem,
                dataIndex,
                seriesIndex,
                'lightFurnitureScatter',
                myChart
            ];

            return getGraphic(...option);
        });

    const option = myChart.getOption();
    graphicList = combineGraphicList(option.graphic[0].elements, newGraphicList)
    myChart.setOption({
        legend: {
            formatter: function (name) {
                return LEGEND_NAME[name]
            },
            data: SCATTER_TYPE
        },
        series: seriesList,
        graphic: graphicList,
    });

    //增加发布者
    lightFurnitureScatter.data.forEach((item, index) => {
        const dep = new Dep(item, item.name);
        //订阅所有发布
        observerFurniture.addDep([dep]);
        depList.push(dep);
    });
}

//增加灯光点位
function addLighting(seriesList, pointData, myChart, observerFurniture) {
    const lighting = pointData.plan_data.lighting;
    const lightingLine = calcPlanList(lighting, 'lightingLine', SIZE['lightingLine']);

    const count = seriesList.filter(item => {
        return item.id === 'lightingLine'
    });

    if (count.length) {
        showLine(seriesList, 'lightingLine', myChart)
        return false
    };

    seriesList.push(lightingLine);
    const seriesIndex = seriesList.length - 1;
    const newGraphicList = echarts.util.map(lightingLine.data,
        function (dataItem, dataIndex) {
            const option = [
                lightingLine.data,
                dataItem,
                dataIndex,
                seriesIndex,
                'lightingLine',
                myChart
            ];

            return getGraphic(...option);
        });
    const option = myChart.getOption();
    graphicList = combineGraphicList(option.graphic[0].elements, newGraphicList)
    myChart.setOption({
        legend: {
            formatter: function (name) {
                return LEGEND_NAME[name]
            },
            data: SCATTER_TYPE
        },
        series: seriesList,
        graphic: graphicList
    });

    //增加发布者
    lightingLine.data.forEach((item) => {
        const dep = new Dep(item, item.name);
        //订阅所有发布
        observerFurniture.addDep([dep]);
        depList.push(dep);
    });
}

//增加相机点位
function addCamera(seriesList, pointData, myChart, observerFurniture) {
    const camera = pointData.point_data.cameraDataList;
    const cameraScatter = calcCameraList(camera, 'cameraScatter', SIZE['cameraScatter']);

    const count = seriesList.filter(item => {
        return item.id === 'cameraScatter'
    });

    if (count.length) {
        showLine(seriesList, 'cameraScatter', myChart)
        return false
    };

    seriesList.push(cameraScatter);
    const seriesIndex = seriesList.length - 1;
    const newGraphicList = echarts.util.map(cameraScatter.data,
        function (dataItem, dataIndex) {
            const option = [
                cameraScatter.data,
                dataItem,
                dataIndex,
                seriesIndex,
                'cameraScatter',
                myChart
            ];

            return getGraphic(...option);
        });
    const option = myChart.getOption();
    graphicList = combineGraphicList(option.graphic[0].elements, newGraphicList)
    myChart.setOption({
        legend: {
            formatter: function (name) {
                return LEGEND_NAME[name]
            },
            data: SCATTER_TYPE
        },
        series: seriesList,
        graphic: graphicList
    });

    //增加发布者
    cameraScatter.data.forEach((item) => {
        const dep = new Dep(item, item.name);
        //订阅所有发布
        observerFurniture.addDep([dep]);
        depList.push(dep);
    });
}

//隐藏点位
function removeLine(seriesList, type, myChart) {
    //隐藏拖拽点
    const removeGraphicList = [];
    graphicList.forEach(item => {
        if (item.name === type) {
            item.$action = 'remove';
            removeGraphicList.push(item);
        }
    });

    myChart.setOption({
        series: [{
            id: type,
            showSymbol: false, // 不显示symbol
            lineStyle: {
                width: 0, //设置线宽为0
                color: 'rgba(0, 0, 0, 0)' // s设置线的颜色为透明
            },
        }],
        graphic: removeGraphicList
    });

    //更新拖拽点
    const option = myChart.getOption();
    graphicList = option.graphic[0].elements;

}

//显示点位
function showLine(seriesList, type, myChart) {

    let seriesIndex;
    const lineData = seriesList.find((item, index) => {
        seriesIndex = index;
        return item.id === type;
    });

    const newGraphicList = echarts.util.map(lineData.data,
        function (dataItem, dataIndex) {
            const option = [
                lineData.data,
                dataItem,
                dataIndex,
                seriesIndex,
                type,
                myChart
            ];

            return getGraphic(...option);
        });

    graphicList = combineGraphicList(graphicList, newGraphicList);
    myChart.setOption({
        series: [{
            id: type,
            showSymbol: setGraphic(type),
            lineStyle: {
                width: 0, //设置线宽为0
                color: 'rgba(0, 0, 0, 0)' // s设置线的颜色为透明
            },
        }],
        graphic: graphicList
    })

}

function addGraphicPoint(graphic, lineData, type, myChart, observerFurniture) {
    if (Array.isArray(graphic))
        graphicList = combineGraphicList(graphicList, graphic);
    else
        graphicList = combineGraphicList(graphicList, [graphic]);
    myChart.setOption({
        series: [{
            id: type,
            type: 'line',
            data: lineData.data,
            color: COLOR[type]
        }],
        graphic: graphicList
    });

    const index = lineData.data.length - 1;
    const dep = new Dep(lineData.data[index], lineData.data[index].name);
    observerFurniture.addDep([dep]);
    depList.push(dep);

}
//整合拖拽点
function combineGraphicList(oldList, newList) {
    const graphicList = [...oldList, ...newList];
    return graphicList
}

function setGraphic(type) {
    if (type === 'lightingLine') {
        return 'rect'
    } else {
        return 'circle'
    }
}

function getClickLine(seriesList, graphic) {
    //定位某条折线信息
    const name = graphic.id.replace(/[0-9]+/g, "");
    const lineData = seriesList.find((item, index) => {
        return item.id === name
    });

    //获取折线里的对应点
    const dotIndex = graphic.id.replace(/[^\d]/g, " ");
    const dotData = lineData.data.find((item, index) => {
        return index === parseInt(dotIndex);
    });

    return { lineData, dotData };

}

function getLine(seriesList, id) {
    let lineIndex = 0;
    const lineData = seriesList.find((item, index) => {
        lineIndex = index;
        return item.id === id
    });

    return { lineData, lineIndex };
}

export {
    calcWallList, addLighting, addLightFurniture, removeLine, getClickLine,
    addCamera, getLine, addGraphicPoint
};