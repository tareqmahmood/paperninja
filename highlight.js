const rectIntervalTree = new RectIntervalTree();


/**
 * @param {Rect} rect
 * @param {String} id
 * @return {HTMLElement}
 */
const createHighlightDiv = function (rect, id) {
    let highlightDiv = document.createElement("div");
    highlightDiv.setAttribute("class", "text_highlight");
    highlightDiv.setAttribute("id", id);
    highlightDiv.style.left = rect.left.toString();
    highlightDiv.style.top = rect.top.toString();
    highlightDiv.style.width = rect.width.toString();
    highlightDiv.style.height = rect.height.toString();
    return highlightDiv;
};


/**
 * @param {MouseEvent} mouseEvent
 * @param {DOMRectList} allSelectedRects
 * @param {number} scrollOffset
 * @return {HTMLButtonElement}
 */
const createConfirmHighlightButton = function(mouseEvent, allSelectedRects, scrollOffset) {
    let button = document.createElement("button");
    button.setAttribute("class", "btn btn-success btn-sm");
    // button.style.left = (mouseEvent.pageX).toString();
    // button.style.top = (mouseEvent.pageY - 40).toString();
    // button.style.position = 'absolute';
    button.innerHTML = "<i class='fa fa-pencil'></i> Highlight";
    button.onclick = function (buttonEvent) {
        highlightSelectedText(allSelectedRects, scrollOffset);
        window.getSelection().removeAllRanges();
        eventLayer.innerHTML = '';
    };
    return button;
};


function createCheckForReferenceButton(mouseEvent, matchedTags) {
    let button = document.createElement("button");
    button.setAttribute("class", "btn btn-primary btn-sm");
    if(matchedTags.length > 1) {
        button.innerHTML = "<i class='fa fa-bookmark'></i> Multiple Reference";
        // todo: handle multiple reference with dropdown
        // look: https://getbootstrap.com/docs/4.4/components/button-group/#nesting
    }
    else button.innerHTML = "<i class='fa fa-bookmark'></i> Reference";
    button.onclick = function (buttonEvent) {
        eventLayer.innerHTML = '';
        window.getSelection().removeAllRanges();
        showReferenceInfo('[' + matchedTags[0] + ']', mouseEvent);
    };
    return button;
}

function createButtonGroup(mouseEvent) {
    let buttonGroup = document.createElement("div");
    buttonGroup.setAttribute("class", "btn-group");
    buttonGroup.setAttribute("role", "group");
    buttonGroup.style.left = (mouseEvent.pageX).toString();
    buttonGroup.style.top = (mouseEvent.pageY - 40).toString();
    buttonGroup.style.position = 'absolute';
    return buttonGroup;
}


/**
 *
 * @return {HTMLDivElement}
 */
const createHighlightContainer = function() {
    let highlightDivContainer = document.createElement("div");
    highlightDivContainer.setAttribute("class", "textHighlightDiv");
    highlightDivContainer.setAttribute("id", "textHighlightDiv-" +
        Math.floor(Math.random() * 1e10).toString(16));

    highlightDivContainer.onclick = function(event) {
        eventLayer.innerHTML = '';
        let button = document.createElement("button");
        button.setAttribute("class", "btn btn-danger btn-sm");
        button.style.left = (event.pageX).toString();
        button.style.top = (event.pageY - 40).toString();
        button.style.position = 'absolute';
        button.innerHTML = "<i class='fa fa-times'></i> Remove";
        button.onclick = function (buttonEvent) {
            // clearing interval tree
            for(let i = 0; i < highlightDivContainer.children.length; i++) {
                rectIntervalTree.removeById(highlightDivContainer.children[i].id);
            }
            // removing from html
            highlightDivContainer.remove();
            window.getSelection().removeAllRanges();
            eventLayer.innerHTML = '';
        };
        eventLayer.appendChild(button);
    };
    return highlightDivContainer;
};


/**
 * Highlight selected portion
 * @param {DOMRectList} allSelectedRects
 * @param {number} scrollOffset
 */
const highlightSelectedText = function (allSelectedRects, scrollOffset) {
    // contain all highlight in a div
    let highlightDivContainer = createHighlightContainer();

    // process all rects one by one
    let numRects = allSelectedRects.length;
    for(let i = 0; i < numRects; i++) {
        let domRect = allSelectedRects.item(i);
        let rect = new Rect(domRect, scrollOffset);

        let id = Math.floor(Math.random() * 1e10).toString(16);
        if(rectIntervalTree.insertSkipOverlap(rect, id)) {
            let highlightDiv = createHighlightDiv(rect, id);
            highlightDivContainer.appendChild(highlightDiv);
        }
    }
    annotation.appendChild(highlightDivContainer);
    document.getElementById("save").style.color = '#c2c121';
};


/**
 * @param {MouseEvent} mouseEvent
 */
const textSelected = function (mouseEvent) {
    eventLayer.innerHTML = '';
    let selectedRect = window.getSelection().getRangeAt(0).getBoundingClientRect();
    if(selectedRect.width < 1 || selectedRect.height < 1) return;

    // judging selected text
    let text = window.getSelection().toString();
    let matchedTags = findMatchingBibTags(text);

    let scrollOffset = window.scrollY;
    let allSelectedRects = window.getSelection().getRangeAt(0).getClientRects();

    let buttonGroup = createButtonGroup(mouseEvent);

    // call for confirmation
    let highlightButton = createConfirmHighlightButton(mouseEvent, allSelectedRects, scrollOffset);
    buttonGroup.appendChild(highlightButton);

    // is a bibtag got selected
    if(matchedTags.length > 0) {
        let referenceButton = createCheckForReferenceButton(mouseEvent, matchedTags);
        buttonGroup.appendChild(referenceButton);
    }

    eventLayer.appendChild(buttonGroup);
};

// let mouseDragged = false;
// let mouseX, mouseY;
container.onmouseup = function (e) {
    //mouseDragged = false;
    textSelected(e);
};

// container.onmousedown = function(e) {
//     mouseDragged = true;
//     mouseX = e.pageX;
//     mouseY = e.pageY;
//     window.getSelection().removeAllRanges();
// };

// container.onmousemove = function (e) {
//     let text = window.getSelection().toString();
//     if(mouseDragged) {
//         eventLayer.innerHTML = '';
//         let textElement = document.createElement("div");
//         textElement.setAttribute("class", "alert alert-danger");
//         textElement.style.padding = '0';
//         textElement.style.left = (mouseX).toString();
//         textElement.style.top = (mouseY - 40).toString();
//         textElement.style.position = 'absolute';
//         textElement.style.overflowWrap = 'break-word';
//         if(text.length > 100) {
//             textElement.innerHTML = "<p>" + text.substring(0, 50) + '...' +
//                 text.substring(text.length-50, text.length) + "</p>";
//         }
//         else {
//             textElement.innerHTML = "<p>" + text + "</p>";
//         }
//         eventLayer.appendChild(textElement);
//     }
// };

