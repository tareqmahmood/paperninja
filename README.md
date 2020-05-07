# Paperninja

A research paper reading tool for researchers.



## Features

- [x] Chrome app
- [x] Paper reading
- [x] Text selection
- [x] Open paper from disk
- [ ] Zoom in, out
- [ ] Fit to screen
- [x] Text highlighting
- [ ] Square highlight
- [ ] Text annotation
- [ ] Annotation save
- [ ] Citation hovering
- [ ] Image crop and pin



## Requirements

### pdf.js

Version: 2.1.266 

Reason: https://github.com/mozilla/pdf.js/issues/11036#issuecomment-552187883

SVG and Text Layer: https://www.sitepoint.com/custom-pdf-rendering/

Font awesome: https://fontawesome.com/v4.7.0/get-started/



## Developer Notes

### Modifications of pdf.js

`renderTextLayer()` was not accessible to `text_layer_builder.js`. So I modified `pdf.js` to expose this function to all as `publicRenderTextLayer()`. Also changed `text_layer_builder.js` to call this new function.


### Allow Text Selection in Chrome Apps

Changed `app.css`. Reason: https://stackoverflow.com/questions/19149993/how-to-select-highlight-text-in-chrome-app
