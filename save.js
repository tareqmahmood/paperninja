const sampleExportJson = {
    "filename": "file.pdf",
    "render_width": 1000,
    "texthighlights": [
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
        let txtJson = {};
        txtJson["comment"] = "none";
        for(let rect of textHighlightDiv.children) {
            for(let attrib of ["top", "left", "width", "height"]) {
                txtJson[attrib] = parseFloat(rect.style[attrib]);
            }
        }
        textHighlights.push(txtJson);
    }
    json["texthighlights"] = textHighlights;
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
