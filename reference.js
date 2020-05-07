let references_raw = [];
let references_map = new Map();
let references_trie = new Trie();

// /**
//  *
//  * @param {string} text
//  * @return {Boolean}
//  */
// const isBibTagText = function (text) {
//     let n = text.length;
//     return n > 2 &&
//         (
//             (text[0] === '(' && text[n - 1] === ')') ||
//             (text[0] === '[' && text[n - 1] === ']')
//         ) &&
//         (!isNaN(text.substring(1, n - 1)));
// };


/**
 * lets talk about logic here
 * First we look for REFERENCES sections
 * Basically 4 state: previous, inside_gap, inside_entry, after
 *
 * state := previous
 * prev_state := previous
 * prev_element := null
 * inside_gap_pages = 0
 * entry = ''
 * references = []
 *
 * For each page:
 *      if state = inside_entry:
 *          prev_state := state
 *          state := inside_gap
 *      else if state = after:
 *          break
 *
 *      For each element:
 *          prev_state := state
 *          if state = previous & element.text ~ 'references':
 *              state := inside_gap
 *
 *          else if state = inside_entry & (element.position is far prev_element.position):
 *              references.push(entry)
 *              entry = ''
 *              state := inside_gap
 *          else if state = inside_entry & element.text.startswith('['):
 *              references.push(entry)
 *              entry = element.text
 *              state := inside_entry
 *          else if state = inside_entry:
 *              entry += element.text
 *
 *          else if state = inside_gap & element.text.startswith('['):
 *              entry = element.text
 *              state := inside_entry
 *          else if state = inside_gap
 *              if prev_state = inside_gap:
 *                  inside_gap_continuity++
 *              else:
 *                  inside_gap_continuity = 0
 *              if inside_gap_continuity > 100:
 *                  state := after
 *                  break
 *
 *          prev_element = element
 *
 *  // tie lose ends
 *  if entry.length > 0:
 *      references.push(entry)
 *
 *  return references
 */

/**
 * @param {string} text
 * @return {boolean}
 */
const isReferenceSectionText = function (text) {
    let latent = text.trim();
    if(latent.length > 10) return false;
    if(latent.length < 9) return false;
    latent = latent.toLowerCase();
    return latent === 'references' ||
        latent.endsWith('eferences') ||
        latent.startsWith('reference');
};


/**
 * @param {HTMLSpanElement} last_ref_element
 * @param {HTMLSpanElement} element
 * @return {boolean}
 */
const isTooFar = function (last_ref_element, element) {
    return Math.abs(last_ref_element.offsetTop - element.offsetTop) > 2*element.offsetHeight;
};


/**
 * @param {string} entry
 */
const entryTextValid = function (entry) {
    if(entry.length === 0) return false;

    // if there is tag
    let i = entry.indexOf('[');
    let j = entry.indexOf(']');
    if (i < 0 || j < 0 || j < i || ((j - i) < 1)) return false;   // [] not present or present at wrong position

    // if there is text after tag
    let text = entry.substring(j + 1);
    if(text.trim().length === 0) return false;
    return true;
};


/**
 * @param {string} entry
 */
const extractBibTag = function (entry) {
    let i = entry.indexOf('[');
    let j = entry.indexOf(']');
    if (i > j || i < 0 || j < 0) return null;
    return entry.substring(i + 1, j);
};


/**
 * @param {string} entry
 */
const extractBibTagWithBraces = function (entry) {
    let i = entry.indexOf('[');
    let j = entry.indexOf(']');
    if (i > j || i < 0 || j < 0) return null;
    return entry.substring(i, j + 1);
};



const scrapReferenceInfo = function () {
    const previous = 1, inside_gap = 2, inside_entry = 3, after = 3;
    let state = previous;
    let prev_state = previous;
    let last_ref_element = null;   // last span element
    let inside_gap_continuity = 0;
    let entry = '';

    for(let i = 1; i <= numPages; i++) {
        if(state === inside_entry) {
            prev_state = state;
            state = inside_gap;
        }
        else if(state === after) {
            break;
        }

        let textDiv = document.getElementById("textDiv-" + i);
        for(let j = 0; j < textDiv.childElementCount; j++) {
            let element = textDiv.children[j];
            let text = element.textContent;
            prev_state = state;

            if (state === previous) {
                if(isReferenceSectionText(text)) {
                    state = inside_gap;
                }
            }
            else if(state === inside_gap) {
                if(text.startsWith('[')) {
                    entry = text;
                    last_ref_element = element;
                    state = inside_entry;
                }
                if(prev_state === inside_gap) {
                    inside_gap_continuity++;
                    if(inside_gap_continuity > 100) {
                        state = after;
                        entry = '';
                        break;
                    }
                }
                else {
                    inside_gap_continuity = 0;
                }
            }
            else if(state === inside_entry) {
                if(element.tagName !== 'SPAN' || isTooFar(last_ref_element, element)) {
                    // push entry
                    if(entryTextValid(entry)) {
                        // console.log(extractBibTag(entry));
                        // console.log(entry);
                        references_raw.push(entry);
                    } //
                    entry = '';
                    state = inside_gap;
                }
                else if(text.startsWith('[')) {
                    // push entry
                    if(entryTextValid(entry)) {
                        // console.log(extractBibTag(entry));
                        // console.log(entry);
                        references_raw.push(entry);
                    } //
                    entry = text;
                    last_ref_element = element;
                    state = inside_entry;
                }
                else {
                    entry += text;
                    last_ref_element = element;
                }
            }
        }
    }
    if(entry.length > 0) {
        // push entry
        if(entryTextValid(entry)) {
            // console.log(extractBibTag(entry));
            // console.log(entry);
            references_raw.push(entry);
        } //
    }

    for(entry of references_raw) {
        references_map.set(extractBibTagWithBraces(entry), entry);
        references_trie.insert(extractBibTag(entry));
    }
};

/**
 * @param {[]} array
 * @return {[]}
 */
function sortByLength (array) {
    return array.sort((x,y) => x.length - y.length);
}


/**
 * @param {string} text
 */
const findMatchingBibTags = function (text) {
    let clean = text.trim();
    if(clean.startsWith('[')) clean = clean.substring(1);
    if(clean.endsWith(']')) clean = clean.substring(clean.length - 1);
    let matchedTags = references_trie.find(clean);
    return sortByLength(matchedTags);
};


// This one need work
// const replaceBibTagsWithLinks = function () {
//     for(let i = 1; i <= numPages; i++) {
//         let textDiv = document.getElementById("textDiv-" + i);
//         let lookAhead = 15;
//         for(let j = 0; j < textDiv.childElementCount - lookAhead; j++) {
//             if(isReferenceSectionText(textDiv.children[j].textContent)) {
//                  return;
//             }
//             if(!textDiv.children[j].textContent.includes('[')) continue;
//
//             let combined = '';
//             let elements = [];
//             for(let k = 0; k < lookAhead; k++) {
//                 combined += textDiv.children[j + k].textContent;
//                 elements.push(textDiv.children[j + k]);
//                 if(textDiv.children[j + k].textContent.includes(']')) break;
//             }
//             for(let tag of references_map.keys()) {
//                 if(combined.includes(tag)) {
//                     for(let element of elements) {
//                         element.innerHTML = element.innerHTML.replace("[", "<a class='bibref' id='" + tag + "' href='#'>[</a>");
//                         let a = document.getElementById(tag);
//                         a.onmouseover = function (mouseEvent) {
//                             showReferenceInfo(tag, mouseEvent);
//                         };
//                         a.onmouseleave = function (mouseEvent) {
//                             eventLayer.innerHTML = '';
//                         }
//                     }
//                 }
//             }
//         }
//     }
// };



/**
 * @param {string} bibtag
 * @param {MouseEvent} mouseEvent
 */
const showReferenceInfo = function (bibtag, mouseEvent) {
    eventLayer.innerHTML = '';
    let info = document.createElement("div");
    info.setAttribute("class", "alert alert-success");
    info.style.left = (mouseEvent.pageX - 125).toString();
    info.style.top = (mouseEvent.pageY + 30).toString();
    info.style.width = '250';
    info.style.position = 'absolute';
    info.style.overflowWrap = 'break-word';
    info.innerHTML = "<p>" + references_map.get(bibtag) + "</p>";
    eventLayer.appendChild(info);
};


// /**
//  *
//  * @param {string} text
//  * @param {MouseEvent} mouseEvent
//  */
// const showReference = function (text, mouseEvent) {
//     let refNo = parseInt(text.match(/\d/g).join(""));
//     if(references === null) references = scrapReferenceInfo();
//     // showReferenceInfo(refNo, mouseEvent);
// };
