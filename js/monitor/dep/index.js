export class Dep {
    constructor(position,dotName) {
        this.position = position;
        this.dotName = dotName
        this.observer = [];
    }
    setPosition(nowPosition) { //位置改变，通知订阅
        this.position = nowPosition;
        this.noticy();
    }
    addObserver(ob) {//添加订阅者
        this.observer.push({
            name: ob.name,
            constructor: ob
        })

    }
    noticy() {
        this.observer.forEach(ob => {
            ob.constructor.update(this.position)
        })
    }
}