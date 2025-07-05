import { pages } from './pages.js';
import { typeText, typeTextToButton } from './typewriter.js';
import { createChoiceButton } from './choices.js';

let currentPageIndex = 0;

function processPageFromObject(page) {
    const container = document.getElementById('typewriter-container');
    const nextPageElement = document.getElementById('next-page');
    container.innerHTML = '';
    nextPageElement.style.display = 'none';

    // 이미지 렌더링 (image가 있을 때만)
    if (page.image) {
        const img = document.createElement('img');
        img.src = page.image;
        img.alt = "Page Image";
        img.className = 'page-image';
        container.appendChild(img);
    }

    // 본문
    const textElement = document.createElement('div');
    textElement.className = 'typewriter-text';
    container.appendChild(textElement);

    // 선택지 처리
    if (page.type === 'choice') {
        // 1. 항상 본문 아래에 choicesContainer(최상위 선택지 버튼들) 추가
        let choicesContainer = document.createElement('div');
        choicesContainer.className = 'choices-container';
        container.appendChild(choicesContainer);

        // 2. 본문+선택지 아래에 resultArea(결과/하위선택지 영역) 추가
        let resultArea = document.createElement('div');
        resultArea.className = 'choice-result-area';
        container.appendChild(resultArea);

        // 3. 본문 타이핑 완료 후 선택지들 순차 생성
        typeText(textElement, page.content, () => {
            // 본문 타이핑 완료 후 선택지들 생성
            createChoicesSequentially(page.choices, choicesContainer, resultArea, nextPageElement);
        });
    } else {
        // text 타입인 경우
        typeText(textElement, page.content, () => {
            if (currentPageIndex < (pages.length - 1)) {
                nextPageElement.style.display = 'block';
            }
        });
    }
}

// 선택지들을 순차적으로 생성하는 함수
function createChoicesSequentially(choices, container, resultArea, nextPageElement, index = 0) {
    if (index >= choices.length) {
        return; // 모든 선택지 생성 완료
    }

    const choice = choices[index];
    const button = createChoiceButton(choice, () => {
        // resultArea만 초기화(최상위 선택지는 항상 남아 있음)
        resultArea.innerHTML = '';

        if (typeof choice.result === 'string') {
            const resultText = document.createElement('div');
            resultText.className = 'typewriter-result';
            typeText(resultText, choice.result, () => {
                nextPageElement.style.display = 'block';
            });
            resultArea.appendChild(resultText);
        } else if (typeof choice.result === 'object') {
            // 하위 choice는 resultArea에만 출력(최상위 선택지 아래)
            processSubChoice(choice.result, resultArea, nextPageElement);
        }
    });

    // 버튼을 컨테이너에 추가하고 타이핑 시작
    container.appendChild(button);
    typeTextToButton(button, choice.text, () => {
        // 현재 버튼 타이핑이 완료되면 다음 버튼 생성
        setTimeout(() => {
            createChoicesSequentially(choices, container, resultArea, nextPageElement, index + 1);
        }, 300); // 0.3초 간격
    });
}

// 하위 choice(책장 등)는 resultArea에만 출력
function processSubChoice(subPage, resultArea, nextPageElement) {
    resultArea.innerHTML = '';

    // 하위 choice 본문
    if (subPage.content) {
        const subTextElement = document.createElement('div');
        subTextElement.className = 'typewriter-text';
        typeText(subTextElement, subPage.content, () => {
            // 본문 타이핑 완료 후 하위 선택지들 생성
            if (subPage.choices && subPage.choices.length > 0) {
                let subChoicesContainer = document.createElement('div');
                subChoicesContainer.className = 'choices-container';
                resultArea.appendChild(subChoicesContainer);

                // 하위 선택지들도 순차적으로 생성
                createSubChoicesSequentially(subPage.choices, subChoicesContainer, resultArea, nextPageElement);
            }
        });
        resultArea.appendChild(subTextElement);
    } else if (subPage.choices && subPage.choices.length > 0) {
        // 본문이 없는 경우 바로 하위 선택지들 생성
        let subChoicesContainer = document.createElement('div');
        subChoicesContainer.className = 'choices-container';
        resultArea.appendChild(subChoicesContainer);

        createSubChoicesSequentially(subPage.choices, subChoicesContainer, resultArea, nextPageElement);
    }
}

// 하위 선택지들을 순차적으로 생성하는 함수
function createSubChoicesSequentially(choices, container, resultArea, nextPageElement, index = 0) {
    if (index >= choices.length) {
        return; // 모든 하위 선택지 생성 완료
    }

    const choice = choices[index];
    const button = createChoiceButton(choice, () => {
        resultArea.innerHTML = '';
        if (typeof choice.result === 'string') {
            const resultText = document.createElement('div');
            resultText.className = 'typewriter-result';
            typeText(resultText, choice.result, () => {
                nextPageElement.style.display = 'block';
            });
            resultArea.appendChild(resultText);
        } else if (typeof choice.result === 'object') {
            processSubChoice(choice.result, resultArea, nextPageElement);
        }
    });

    // 버튼을 컨테이너에 추가하고 타이핑 시작
    container.appendChild(button);
    typeTextToButton(button, choice.text, () => {
        // 현재 버튼 타이핑이 완료되면 다음 버튼 생성
        setTimeout(() => {
            createSubChoicesSequentially(choices, container, resultArea, nextPageElement, index + 1);
        }, 300); // 0.3초 간격
    });
}

// 현재 보이는 모든 타이핑을 스킵
function skipAllTyping() {
    document.querySelectorAll('.typewriter-text, .typewriter-result, .choices-container button').forEach(el => {
        if (typeof el._skipTyping === 'function') el._skipTyping();
    });
}

// 현재 보이는 타이핑이 하나라도 있으면 true
function isAnyTyping() {
    let typing = false;
    document.querySelectorAll('.typewriter-text, .typewriter-result, .choices-container button').forEach(el => {
        if (typeof el._skipTyping === 'function') typing = true;
    });
    return typing;
}

document.addEventListener('DOMContentLoaded', () => {
    const nextPageElement = document.getElementById('next-page');
    processPageFromObject(pages[0]);
    currentPageIndex = 0;

    nextPageElement.addEventListener('click', () => {
        if (isAnyTyping()) {
            skipAllTyping();
        } else {
            currentPageIndex++;
            if (currentPageIndex < pages.length) {
                processPageFromObject(pages[currentPageIndex]);
            }
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
            e.preventDefault();
            if (isAnyTyping()) {
                skipAllTyping();
            } else {
                // choice 페이지에서는 스페이스바로 넘기지 않음
                if (pages[currentPageIndex] && pages[currentPageIndex].type === 'choice') return;
                currentPageIndex++;
                if (currentPageIndex < pages.length) {
                    processPageFromObject(pages[currentPageIndex]);
                }
            }
        }
    });
});