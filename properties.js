const APP_WIDTH = window.innerWidth;
const APP_FILL_AREA = 0.8;

let container = document.getElementById("container");
let annotation = document.getElementById("annotation");
let eventLayer = document.getElementById("eventLayer");
let pinLayer = document.getElementById("pinLayer");


// lets talk about logic here
/**
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
