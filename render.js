let numPages = 0;
let currentFileName = "";
let currentFilePath = "";
let currentRenderWidth = 0;
let renderTaskCompleted = 0;
let renderScale = 2;


function createElementsForPDF (numPages) {
    let container = document.getElementById("container");

    for (let i = 1; i <= numPages; i++) {
        // new div
        let pageDiv = document.createElement("div");
        // Set id attribute with pageDiv-#{pdf_page_number} format
        pageDiv.setAttribute("id", "pageDiv-" + i);
        // This will keep positions of child elements as per our needs
        pageDiv.setAttribute("style", "position: relative");
        // div class
        pageDiv.setAttribute("class", "page");

        // Append div within div#container
        container.appendChild(pageDiv);

        // Create a new svg div element
        // let svgDiv = document.createElement("div");
        // // Set id attribute with svgDiv-#{pdf_page_number} format
        // svgDiv.setAttribute("id", "svgDiv-" + i);
        // // svgDiv class
        // svgDiv.setAttribute("class", "svgDiv");
        // // Append svgDiv within div#pageDiv-#{pdf_page_number}
        // pageDiv.appendChild(svgDiv);


        // Create a new canvas div element
        let canvasDiv = document.createElement("div");
        // Set id attribute with canvasDiv-#{pdf_page_number} format
        canvasDiv.setAttribute("id", "canvasDiv-" + i);
        // canvasDiv class
        canvasDiv.setAttribute("class", "canvasDiv");
        // style
        canvasDiv.style.position = "relative";
        // Append canvasDiv within div#pageDiv-#{pdf_page_number}
        pageDiv.appendChild(canvasDiv);

        // Create a new text div element
        let textDiv = document.createElement("div");
        // Set id attribute with textDiv-#{pdf_page_number} format
        textDiv.setAttribute("id", "textDiv-" + i);
        // textDiv class
        textDiv.setAttribute("class", "textLayer textDiv");   // this is based on text_layer_builder.css
        // Append textDiv within div#pageDiv-#{pdf_page_number}
        pageDiv.appendChild(textDiv);
    }
}


function clearScene() {
    container.innerHTML = '';
    annotation.innerHTML = '';
    eventLayer.innerHTML = '';
}


function onRenderBegin() {
    references_raw = [];
    references_map = new Map();
    references_trie = new Trie();

    rectIntervalTree = new RectIntervalTree();

    numPages = 0;
    renderTaskCompleted = 0;

    // change file open icon
    document.getElementById("openfile").innerHTML = '<i class="fa fa-spinner fa-spin"></i> Open ';
}

function onRenderComplete() {
    console.log('All Done');

    // show previous annotations
    loadAnnotation();

    scrapReferenceInfo();
    console.log('Reference extracted');

    // replaceBibTagsWithLinks();
    // console.log('Bibtags placed');

    // change file open icon
    document.getElementById("openfile").innerHTML = '<i class="fa fa-check"></i> Open ';
}


async function renderPage(page) {
    let desiredWidth = APP_WIDTH * APP_FILL_AREA;
    currentRenderWidth = desiredWidth;
    let viewport = page.getViewport({scale: 1,});
    let scale = desiredWidth / viewport.width;
    viewport = page.getViewport({scale: renderScale * scale,});

    // // svg layer setup
    //
    // let svgDiv = document.getElementById("svgDiv-" + (page.pageIndex + 1));
    //
    // svgDiv.style.height = viewport.height;
    // svgDiv.style.width = viewport.width;
    //
    // page.getOperatorList()
    //     .then(function (opList) {
    //         let svgGfx = new pdfjsLib.SVGGraphics(page.commonObjs, page.objs);
    //         return svgGfx.getSVG(opList, viewport);
    //     })
    //     .then(function (svg) {
    //         svgDiv.appendChild(svg);
    //     }).then(function () {
    //         renderTaskCompleted++;
    //         if(renderTaskCompleted === (2 * numPages)) {
    //             onRenderComplete();
    //         }
    //     });


    // canvas layer setup

    let canvasDiv = document.getElementById("canvasDiv-" + (page.pageIndex + 1));
    let canvas = document.createElement("canvas");
    canvasDiv.appendChild(canvas);
    let context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    let renderContext = {
        canvasContext: context,
        viewport: viewport
    };
    page.render(renderContext);
    renderTaskCompleted++;
    if(renderTaskCompleted === (2 * numPages)) {
        onRenderComplete();
    }

    // text layer setup

    let textDiv = document.getElementById("textDiv-" + (page.pageIndex + 1));

    textDiv.style.height = viewport.height;
    textDiv.style.width = viewport.width;

    let textLayer = new TextLayerBuilder({
        textLayerDiv: textDiv,
        pageIndex: page.pageIndex,
        viewport: viewport
    });

    page.getTextContent().then(textContent => {
        textLayer.setTextContent(textContent);
        textLayer.render();
    }).then(function () {
        renderTaskCompleted++;
        if(renderTaskCompleted === (2 * numPages)) {
            onRenderComplete();
        }
    });


    // zoom out pages
    let pages = document.getElementsByClassName("page");
    for(let i = 0; i < pages.length; i++) {
        pages.item(i).style.zoom = (1 / renderScale).toString();
        pages.item(i).style.MozTransform = 'scale(' + (1 / renderScale).toString() + ')'
    }
}

const loadPdfInApp = function(url) {
    clearScene();
    onRenderBegin();

    const path = require('path');
    currentFileName = path.parse(url).base;
    currentFilePath = url;

    pdfjsLib.getDocument(url)
        .promise
        .then(file => {
            console.log("Opening file...");
            console.log(file);

            let container = document.getElementById("container");
            container.innerHTML = '';

            // number of pages to render
            let N = file.numPages;
            numPages = N;
            let pageCompleted = 0;

            // first create all pages div
            createElementsForPDF(N);

            // placing all svg on divs
            for (let i = 1; i <= N; i++) {
                file.getPage(i).then(page => {
                    renderPage(page);
                });
                console.log('i: ' + i);
            }
        });
};
