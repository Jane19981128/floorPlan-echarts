import { DRAG_SHAPE, SHAPE } from './constant/constant.js';

export function setShape(type, symbolSize) {
    if (SHAPE[type] === 'rectangle') {
        return {
            x: -symbolSize[0] / 2,
            y: -symbolSize[1] / 2,
            width: symbolSize[0],
            height: symbolSize[1]
        }
    };

    if (SHAPE[type] == 'circle') {
        if(Array.isArray(symbolSize)){
            return {
                r: symbolSize[0] / 2
            }
        }

        return {r: symbolSize/2};
    };
}

export function setScale(type, symbolSize) {
    if (DRAG_SHAPE[type] == 'circle') {
        if(Array.isArray(symbolSize)){
            return [1, symbolSize[1] / symbolSize[0]];
        }
    }

    return [1, 1];
}

export function deepCloneJson(obj) {
    let objJson = JSON.stringify(obj);
    let objClone = JSON.parse(objJson);
    return objClone;
}