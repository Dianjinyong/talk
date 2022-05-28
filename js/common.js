function $(selector){
   return document.querySelector(selector)
}

function $$(){
    return document.querySelectorAll(selector)
}

function $$$(tagName){
    return document.createElement(tagName)
}