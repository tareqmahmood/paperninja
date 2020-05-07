# Paperninja

A research paper reading tool for researchers.



## Features

- [x] Chrome app
- [x] Paper reading
- [x] Text selection
- [x] Open paper from disk
- [ ] Zoom in, out
- [x] Fit to screen
- [x] Text highlighting
- [ ] Square highlight
- [x] Text annotation
- [x] Annotation save
- [x] Citation hovering
- [ ] Image crop and pin



## Requirements

### pdf.js

Version: 2.1.266 

Reason: https://github.com/mozilla/pdf.js/issues/11036#issuecomment-552187883

SVG and Text Layer: https://www.sitepoint.com/custom-pdf-rendering/

Font awesome: https://fontawesome.com/v4.7.0/get-started/



## Developer Notes

### Switched to Electron.js

I first wanted to use this as an chrome app. But later switched to Electron.js. So, some of the code is very weirdly written. I plan to modify them soon. So, please pardon the bad practices.



### Modifications of pdf.js

`renderTextLayer()` was not accessible to `text_layer_builder.js`. So I modified `pdf.js` to expose this function to all as `publicRenderTextLayer()`. Also changed `text_layer_builder.js` to call this new function.