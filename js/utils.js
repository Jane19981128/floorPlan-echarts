import { DRAG_SHAPE } from './constant/constant.js';

export function setShape(type, symbolSize) {
    if (type === 'lightingLine') {
        return {
            x: -symbolSize[0] / 2,
            y: -symbolSize[1] / 2,
            width: symbolSize[0],
            height: symbolSize[1]
        }
    } else {
        return {
            r: symbolSize[0] / 2
        }
    }
}

export function setScale(type, symbolSize) {
    if (DRAG_SHAPE[type] == 'circle') {
        return [1, symbolSize[1] / symbolSize[0]];
    }
    return [1, 1];

}