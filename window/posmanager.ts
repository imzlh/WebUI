const list:Array<HTMLElement> = [];
let timer;

function flush(element:HTMLElement){
    let rem = parseInt(getComputedStyle(document.documentElement).fontSize),action = false;
    if(element.offsetLeft + element.offsetWidth + 0.5*rem < document.documentElement.offsetWidth )
        element.style.right = '0',element.style.left = 'unset',action = true;
    if(element.offsetTop + element.offsetHeight + 0.5*rem < document.documentElement.offsetHeight )
        element.style.bottom = '0',element.style.top = 'unset',action = true;
    if(action) element.style.position = 'fixed',element.style.transform = 'none',
        console.debug(element,'Overflow.reposition...');
    element.dataset.resized = action ? 'true' : 'false';
}

export default function useAutoPosition(element:HTMLElement){
    console.debug('Auto-mark-position-element added.');
    list.push(element);
    flush(element);
}

document.addEventListener('resize',function(){
    console.debug('Position flushed.');
    if(timer) timer = setTimeout(() => timer = list.forEach(item => flush(item)),100);
});
