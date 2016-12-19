window.onload = function () {
    let domElems = document.querySelectorAll('*');
    let i = 0;
    while (i < domElems.length) {
        PIE.attach(domElems[i]);
        i++;
    }
}
