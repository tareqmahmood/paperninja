/**
 * Measures IoU of two rect
 * @param {Rect} rect1
 * @param {Rect} rect2
 * @return {number}
 */
let rectIoU = function (rect1, rect2) {
    let x_min = Math.max(rect1.left, rect2.left);
    let x_max = Math.min(rect1.left + rect1.width, rect2.left + rect2.width);
    let y_min = Math.max(rect1.top, rect2.top);
    let y_max = Math.min(rect1.top + rect1.height, rect2.top + rect2.height);

    if(x_max < x_min) return 0;
    if(y_max < y_min) return 0;

    let area1 = rect1.width * rect1.height;
    let area2 = rect2.width * rect2.height;

    let commonArea = (x_max - x_min) * (y_max - y_min);
    let unionArea = area1 + area2 - commonArea;
    return commonArea / unionArea;
};

class Rect {
    /**
     * @param {DOMRect} domRect
     * @param {number} scrollOffset
     */
    constructor(domRect, scrollOffset) {
        this.left = domRect.left / renderScale;
        this.top = domRect.top / renderScale + scrollOffset;
        this.width = domRect.width / renderScale;
        this.height = domRect.height / renderScale;
    }
}

class RectIntervalTree {
    constructor() {
        this.xIntervalTree = new DataIntervalTree();
        this.yIntervalTree = new DataIntervalTree();
        this.count = 0;
        this.domRects = new Map();
    }


    /**
     * @param {Rect} rect
     * @param {String} id
     * @return {Boolean}
     */
    uncheckedInsert(rect, id) {
        let in1 = this.xIntervalTree.insert(rect.left, rect.left + rect.width, id);
        let in2 = this.yIntervalTree.insert(rect.top, rect.top + rect.height, id);
        if (in1 === false || in2 === false) {
            throw new Error('Unsuccessful insert of DomRect id:' + id);
        } else {
            this.domRects.set(id, rect);
            this.count++;
        }
        return in1 && in2;
    }


    /**
     * @param {Rect} rect
     * @param {String} id
     * @return {Boolean}
     */
    insertSkipOverlap(rect, id) {
        let xInter = this.xIntervalTree.search(rect.left, rect.left + rect.width);
        let yInter = this.yIntervalTree.search(rect.top, rect.top + rect.height);
        let inter = xInter.filter(x => yInter.includes(x));
        if (inter.length > 0) {
            for(let i = 0; i < inter.length; i++) {
                let interRect = this.domRects.get(inter[i]);
                let iou = rectIoU(rect, interRect);
                if(iou > 0.5) {
                    return false;
                }
            }
        }
        return this.uncheckedInsert(rect, id);
    }

    /**
     * @param {String} id
     * @return {Boolean}
     */
    removeById(id) {
        let rect = this.domRects.get(id);
        if(rect === undefined) return false;
        this.xIntervalTree.remove(rect.left, rect.left + rect.width, id);
        this.yIntervalTree.remove(rect.top, rect.top + rect.height, id);
        this.domRects.delete(id);
        this.count--;
        return true;
    }


    // exportAsJson() {
    //     let mainJson = {};
    //     mainJson["filename"] = 'file.pdf';
    //     mainJson["renderScale"] = renderScale;
    //     let rects = {};
    //     this.domRects.forEach(function(rect, id){
    //         rects[id] = rect;
    //     });
    //     mainJson["rects"] = JSON.stringify(rects);
    //     return mainJson;
    // }
}

