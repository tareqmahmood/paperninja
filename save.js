const sampleExportJson = {
    "filename": "file.pdf",
    "render_width": 1000,
    "text_highlights": [
        {
            "comment": "none",
            "rects": [
                {
                    "left": 10,
                    "top": 1200,
                    "width": 30,
                    "height": 10,
                },
                {
                    //...
                },
            ]
        },
        {
            //...
        },
    ]
};

const ANNOTATION_EXT = ".pn";

function exportAnnotationsAsJson() {
    let json = {};
    json["filename"] = currentFileName;
    json["render_width"] = currentRenderWidth;

    // add text highlights
    let textHighlights = [];
    const textHighlightDivs = document.getElementsByClassName("textHighlightDiv");
    for(let textHighlightDiv of textHighlightDivs) {
        let highlightJson = {};
        highlightJson["comment"] = "none";
        let rectJsonS = [];
        for(let rect of textHighlightDiv.children) {
            let rectJson = {};
            for(let attrib of ["top", "left", "width", "height"]) {
                rectJson[attrib] = parseFloat(rect.style[attrib]);
            }
            rectJsonS.push(rectJson);
        }
        highlightJson["rects"] = rectJsonS;
        textHighlights.push(highlightJson);
    }
    json["text_highlights"] = textHighlights;
    return json;
}


function saveAnnotation() {
    const fs = require('fs');
    let json = exportAnnotationsAsJson();
    if(currentFilePath.length === 0) return;
    fs.writeFileSync(currentFilePath + ANNOTATION_EXT,
        JSON.stringify(json),
        'utf-8');
}


function loadAnnotation() {
    const fs = require('fs');
    const annotationFile = currentFilePath + ANNOTATION_EXT;
    if (fs.existsSync(annotationFile)) {
        console.log('loading annotation');

        let json = JSON.parse(fs.readFileSync(annotationFile, 'utf8'));
        let renderWidth = json["render_width"];

        for(let textHighlight of json["text_highlights"]) {
            highlightRects(textHighlight["rects"]);
        }
    }
}
