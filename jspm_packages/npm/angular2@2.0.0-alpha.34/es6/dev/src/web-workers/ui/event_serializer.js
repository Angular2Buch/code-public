/* */ 
"format cjs";
import { Set } from 'angular2/src/facade/collection';
const MOUSE_EVENT_PROPERTIES = [
    "altKey",
    "button",
    "clientX",
    "clientY",
    "metaKey",
    "movementX",
    "movementY",
    "offsetX",
    "offsetY",
    "region",
    "screenX",
    "screenY",
    "shiftKey"
];
const KEYBOARD_EVENT_PROPERTIES = [
    'altkey',
    'charCode',
    'code',
    'ctrlKey',
    'isComposing',
    'key',
    'keyCode',
    'location',
    'metaKey',
    'repeat',
    'shiftKey',
    'which'
];
const EVENT_PROPERTIES = ['type', 'bubbles', 'cancelable'];
const NODES_WITH_VALUE = new Set(["input", "select", "option", "button", "li", "meter", "progress", "param"]);
export function serializeGenericEvent(e) {
    return serializeEvent(e, EVENT_PROPERTIES);
}
// TODO(jteplitz602): Allow users to specify the properties they need rather than always
// adding value #3374
export function serializeEventWithValue(e) {
    var serializedEvent = serializeEvent(e, EVENT_PROPERTIES);
    return addValue(e, serializedEvent);
}
export function serializeMouseEvent(e) {
    return serializeEvent(e, MOUSE_EVENT_PROPERTIES);
}
export function serializeKeyboardEvent(e) {
    var serializedEvent = serializeEvent(e, KEYBOARD_EVENT_PROPERTIES);
    return addValue(e, serializedEvent);
}
// TODO(jteplitz602): #3374. See above.
function addValue(e, serializedEvent) {
    if (NODES_WITH_VALUE.has(e.target.tagName.toLowerCase())) {
        serializedEvent['target'] = { 'value': e.target.value };
    }
    return serializedEvent;
}
function serializeEvent(e, properties) {
    var serialized = {};
    for (var i = 0; i < properties.length; i++) {
        var prop = properties[i];
        serialized[prop] = e[prop];
    }
    return serialized;
}
//# sourceMappingURL=event_serializer.js.map