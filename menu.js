/**
 * this file containes navbar menu click actions
 */


// open new file
document.getElementById("openfile").onclick = function() {
    console.log('open file dialog');
    document.getElementById("openfileinput").click();
};

document.getElementById("openfileinput").onchange = event => {
    console.log("file selected");

    let file = event.target.files[0];

    if(file.type !== 'application/pdf') return;

    let container = document.getElementById("container");
    container.innerHTML = '';

    loadPdfInApp(file.path);
};

// screenshot
document.getElementById("screenshot").onclick = function(mouseEvent) {
    console.log('taking screenshot');
    takeScreenShot(mouseEvent);
};

// zoom in
document.getElementById("zoomin").onclick = function() {
    console.log('zoom in');
};

// zoom out
document.getElementById("zoomout").onclick = function() {
    console.log('zoom out');
};

// save
document.getElementById("save").onclick = function() {
    console.log('Saving');
    const fs = require('fs');
    try {
        fs.writeFileSync()
    } catch (error) {

    }
};

