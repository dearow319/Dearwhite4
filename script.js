document.addEventListener('DOMContentLoaded', () => {
    const typewriterElement = document.getElementById('typewriter');
    const nextPageElement = document.getElementById('next-page');

    // 여러 페이지로 분할된 텍스트
    const pages = [
        "[현재 위치: 그리핀도르 기숙사]\n[시간: AM  9 : 15]\n\n이불 아래 숨은 작고 가벼운 몸. 아니, 원래도 가벼웠지만…\n축 늘어지는 꼬리와 차게 식은 피부가 증명하는 바는 다르다.\n…밀리가 떠났다.\n\n어떠한 병도, 사고도 아니었다. \n그냥… 수명이 다한 것이었다. \n나는 납득한다. 쥐는 원래 삼 년이 넘도록 사는 일도 극히 드물었으니까. \n마치 잠든 것처럼 죽어 있는 밀리는, 아주 평온하게 눈을 감고 있었다.\n나는 고개를 돌린다. 그곳엔 밀리의 흔적이 있다.\n\n식기 옆에 남은 사료 한 알,\n지퍼에 끼어 있는 털 한 가닥,\n낡은 방석의 움푹 팬 자국…\n\n밀리의 죽음을 알리는 건 무른 살로 이루어진 몸 뿐이다. \n고로 나는 납득하고 싶지 않았다.\n이게 밀리의 끝이라는 것을.\n어떠한 말도, 어떠한 위로도… \n닿지 않았다.\n그저 멍하니 생각할 뿐이었다.\n\n밀리를 되살릴 수 있는 방법이 있다면, 바로 무엇이든 하겠다고.\n밀리를 다시 한 번 안을 수 있는 방법이 있다면, 무엇이든 바칠 수 있겠노라고….",
        "…나는 마침내 밀리를 살릴 방법을 떠올려 냈다.\n호그와트는 마법사인 동시에, 내로라하는 괴짜 학교다.\n고대 룬 문자, 신비한 동물 돌보기, 연금술… 기실 학년이 올라갈 수록 자신의 길을 찾아 흥미를 찾아 하고픈 걸 하는 녀석들이 많다.\n\n나는 이미 그런 *싹수를 틔운*, 내 구세주가 될 사람을 알고 있다— \n\n오스월드 화이트. \n\n소문에 의하면 그는 무언가를 소생시키는 시술도 연구하고 있다고 한다.\n아니, 어쩌면 「프랑켄슈타인」에 나올 법한 생명 창조 마법일지도 모른다.\n다만 핵심은, 그가 생명에… 이미 다한 수명에 관여할 수도 있는 사람이라는 것이다.",
        "[현재 위치: 래번클로 기숙사 앞]\n[시간: PM 4 : 24]\n\n마침 책을 들고 나오는 친구 Z가 나에게 용건을 묻는다.\nZ: 여기까지 무슨 일이야?\nA: 다른 건 아니고, 혹시 오스월드가 안에 있는지 봐줄 수 있어?\nZ: 오스월드? 지금은 폐교실에 있을 걸.\nA: 폐교실?\nZ: 요즘 실험같은 거 한다고 거기 틀어박혀 있거든.\nA: 그래서, 어느 쪽인데?\n\nZ는 나를 이해할 수 없다는 듯한 얼굴로 바라보았다.\n\nA: 어쩔 수 없어. 그애를 꼭… 찾아야 하거든.\nZ: 마법약 교실 옆이야.\nZ: 미리 경고하자면, 그애가 하는 제안같은 거… 막 받아들이지 마.\n\nZ는 의미심장한 말을 중얼거리고서 다시 기숙사 안으로 들어갔다.\n다시 말하지만…\n모든 건 어쩔 수 없는 일이다."

    ];

    const nextPageMessage = "다음 페이지";
    const typingSpeed = 100; // milliseconds per character

    let currentPageIndex = 0;
    let currentCharIndex = 0;
    let timeoutId = null;

    function typeCharacter() {
        const currentPage = pages[currentPageIndex];

        if (currentCharIndex < currentPage.length) {
            typewriterElement.textContent += currentPage.charAt(currentCharIndex);
            currentCharIndex++;
            timeoutId = setTimeout(typeCharacter, typingSpeed);
        } else {
            nextPageElement.textContent = nextPageMessage;
            nextPageElement.style.display = 'block';
        }
    }

    // 'Next Page' 버튼 클릭 이벤트
    nextPageElement.addEventListener('click', () => {
        // 현재 타이핑 중지
        clearTimeout(timeoutId);

        // 다음 페이지로 이동
        currentPageIndex++;
        currentCharIndex = 0;

        // 텍스트 초기화
        typewriterElement.textContent = '';
        nextPageElement.style.display = 'none';

        // 다음 페이지 타이핑 시작
        typeCharacter();
    });

    // Spacebar 이벤트 핸들러
    document.addEventListener('keydown', (e) => {
        if (e.key === ' ' && currentCharIndex < pages[currentPageIndex].length) {
            e.preventDefault(); // 스페이스바 스크롤 방지
            clearTimeout(timeoutId);

            // 현재 페이지 텍스트 전체 표시
            typewriterElement.textContent = pages[currentPageIndex];
            currentCharIndex = pages[currentPageIndex].length;

            // 다음 페이지 버튼 표시
            nextPageElement.textContent = nextPageMessage;
            nextPageElement.style.display = 'block';
        }
    });

    // 첫 페이지 타이핑 시작
    typeCharacter();
});