// typeText: 각 엘리먼트별로 타이핑 상태/스킵 관리
export function typeText(element, text, onComplete) {
    let localTimeoutId = null;
    let localSkipTyping = false;
    let idx = 0;
    let safeText = (typeof text === 'string') ? text : '';
    let textNode = document.createTextNode('');
    element.appendChild(textNode);

    element._skipTyping = () => {
        localSkipTyping = true;
        if (localTimeoutId) clearTimeout(localTimeoutId);
        textNode.textContent = safeText;
        delete element._skipTyping;
        if (onComplete) onComplete();
    };

    function typeChar() {
        if (localSkipTyping) return;
        if (idx < safeText.length) {
            textNode.textContent += safeText.charAt(idx);
            idx++;
            localTimeoutId = setTimeout(typeChar, 80);
        } else {
            delete element._skipTyping;
            if (onComplete) onComplete();
        }
    }
    typeChar();
}

export function typeTextToButton(button, text, onComplete) {
    let localTimeoutId = null;
    let localSkipTyping = false;
    let idx = 0;
    let safeText = (typeof text === 'string') ? text : '';
    button.textContent = '';

    button._skipTyping = () => {
        localSkipTyping = true;
        if (localTimeoutId) clearTimeout(localTimeoutId);
        button.textContent = safeText;
        delete button._skipTyping;
        if (onComplete) onComplete();
    };

    function typeChar() {
        if (localSkipTyping) return;
        if (idx < safeText.length) {
            button.textContent += safeText.charAt(idx);
            idx++;
            localTimeoutId = setTimeout(typeChar, 10);
        } else {
            delete button._skipTyping;
            if (onComplete) onComplete();
        }
    }
    typeChar();
}