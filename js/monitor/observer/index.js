export class Observer {
    constructor(name, pageDom, dep) {
        this.name = name;
        this.dep = dep;
        this.pageDom = pageDom;

        this.dep.forEach(element => {
            element.addObserver(this);
        });
    }
    addDep(depList) {
        depList.forEach(element => {
            element.addObserver(this);
        });
        this.dep.push(...depList);
    }
    update(val) {
        this.pageDom.forEach(item => {
            if (item.id === 'pointX') {
                item.value = val.value[0];
            } else if (item.id === 'pointY') {
                item.value = val.value[1];
            } else if (item.id === 'groundClearance') {
                item.value = val.originDot.groundClearance;
            } else if (item.id === 'width') {
                item.value = val.originDot.width;
            } else if (item.id === 'length') {
                item.value = val.originDot.length;
            } else if (item.id === 'brightness') {
                item.value = val.originDot.brightness;
            } else if (item.id === 'dotId') {
                item.value = val.name
            } else {
                item.value = ''
            }
        })
    }
}