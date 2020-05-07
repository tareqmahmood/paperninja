/**
 * this file containes navbar menu click actions
 */


// open new file
document.getElementById("openfile").onclick = function(mouseEvent) {
    console.log('open file dialog');
    mouseEvent.preventDefault();  // to stop going to stop
    saveAnnotation();
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

// // screenshot
// document.getElementById("screenshot").onclick = function(mouseEvent) {
//     console.log('taking screenshot');
//     mouseEvent.preventDefault();  // to stop going to stop
//     takeScreenShot(mouseEvent);
// };
//
// // zoom in
// document.getElementById("zoomin").onclick = function(mouseEvent) {
//     console.log('zoom in');
//     mouseEvent.preventDefault();  // to stop going to stop
// };
//
// // zoom out
// document.getElementById("zoomout").onclick = function(mouseEvent) {
//     console.log('zoom out');
//     mouseEvent.preventDefault();  // to stop going to stop
// };

// save
document.getElementById("save").onclick = function(mouseEvent) {
    console.log('Saving');
    mouseEvent.preventDefault();  // to stop going to stop
    saveAnnotation();
    document.getElementById("save").style.color = '#16a720';
};

