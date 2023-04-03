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
            switch (item.id) {
                case 'pointX':
                    this.setInputVal(item, val.value[0]);
                    break;
                case 'pointY':
                    this.setInputVal(item, val.value[1]);
                    break;
                case 'groundClearance':
                    this.setInputVal(item, val.originDot.groundClearance);
                    break;
                case 'width':
                    this.setInputVal(item, val.originDot.width);
                    break;
                case 'length':
                    this.setInputVal(item, val.originDot.length);
                    break;
                case 'brightness':
                    this.setInputVal(item, val.originDot.brightness);
                    break;
                case 'pointZ':
                    this.setInputVal(item, val.posZ);
                    break;
                case 'dotId':
                    this.setInputVal(item, val.name);
                    break;
                default: item.value = '';
            }
        })
    }

    setInputVal(dom, val) {
        if (val == undefined) {
            dom.value = '';
            dom.disabled = true;
        } else {
            dom.value = val;
            dom.disabled = false;
        }
    }
}