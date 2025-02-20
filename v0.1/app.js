/*
마지막 수정일 : 2025-02-20 12:30
*/

function loadApp() {
    console.log("========== Start Load App ==========")
    deviceCheck();
    injectCSS();
    overideClick();
    beforePathCheck()
    initIframes()

    // 0.5초 후 실행
    setTimeout(function () {
        beforePathCheck()
    }, 500);

    // 5초 후 실행
    setTimeout(function () {
        beforePathCheck()
    }, 5000);
}

function to(path) {
    window.location.href = path
}

function deviceCheck() {
    const PC_PATH = "/"
    const MOBILE_PATH = "/m/home.html"
    var width = window.outerWidth;
    const pathname = window.location.pathname
    const href = window.location.href
    const isMobilePath = pathname.includes("/m/")
    const hasPcTag = href.includes("?pc=1")
    if (width >= 640) {
        // PC 페이지로 리다이렉션
        if (isMobilePath) {
            to(PC_PATH)
        }
    } else {
        // 모바일 페이지로 리다이렉션
        if (!isMobilePath && !hasPcTag) {
            to(MOBILE_PATH)
        }
    }
}

function injectCSS() {
    // only for pc
    const isPC = !window.location.pathname.includes('/m/')
    if (isPC) {
        var C = window.innerHeight;
        document.querySelectorAll('.swiper-wrapper').forEach(swiperWrapper => {
            swiperWrapper.style.height = C + 'px';
        });
        document.querySelectorAll('._mainSwiperArea').forEach(mainSwiperArea => {
            mainSwiperArea.style.height = C + 'px';
        });
        document.querySelectorAll('._imgCover').forEach(imgCover => {
            imgCover.style.height = C + 'px';
        });
        document.querySelectorAll('._spotHomesite').forEach(spotHomesite => {
            // "is_center" class 도 가진 경우에만
            if (spotHomesite.classList.contains('is_center')) {
                spotHomesite.style.height = (C + spotHomesite.offsetHeight + 100) / 2 + 'px';
            }
        });
    }
}

function beforePathCheck() {
    // 모든 <a> 태그를 가져오기
    var links = document.querySelectorAll('a');
    // 각 링크를 순회하며 href 속성 수정
    links.forEach(function (link) {
        var from = link.getAttribute('href'); // 현재 href 값
        if (from) {

            var to = from

            if (from.includes('flickcard://')) {
                let key = from.split('flickcard://')[1]
                if (APP_PATH_SETTINGS[key]) {
                    to = APP_PATH_SETTINGS[key]
                }
                // console.log('to : ', to, 'from : ', from);

            }
            link.setAttribute('href', to);
        }
    });

    // data-type="address" 인 경우 클릭 이벤트 추가
    document.querySelectorAll('a[data-type="address"]').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            // console.log('address click', link.href)
            window.location.href = link.href;
        });
    });

    // class="list_sitemenu _listSitemenu" 인 요소에서 _listSitemenu class 제거
    document.querySelectorAll('.list_sitemenu').forEach(listSitemenu => {
        listSitemenu.classList.remove('_listSitemenu')
    })
}

function overideClick() {
    // 1. _summary_more_btn(더보기 버튼) 클릭 시,  gallery_box 내부 display:none 인 요소들을 display:block 으로 변경
    // _summary_more_btn 버튼의 클릭 오버라이드

    if (document.querySelector('._summary_more_btn')) {
        document.querySelector('._summary_more_btn').addEventListener('click', function (event) {
            event.preventDefault();
            // 자기 자신 숨기기 
            this.style.display = 'none';

            try {
                // .gallery_box 밑  .uio_content 요소 하위 요소들 모두 보이도록
                document.querySelector('.gallery_box').querySelector('.uio_content').querySelectorAll('li').forEach(li => {
                    li.style.display = 'block';
                });
            } catch (e) {
                console.log('error', e)
            }
        })
    }

    // 2. 모바일 왼쪽메뉴 하위메뉴 펼치기
    const isMobile = window.location.pathname.includes('/m/')
    if (isMobile) {
        // data-role="toggleSubMenu" 인 요소 클릭시 다음 요소의 list style 변경
        const toggleSubMenu = document.querySelectorAll('[data-role="toggleSubMenu"]')
        toggleSubMenu.forEach(menu => {
            menu.addEventListener('click', function (event) {
                event.preventDefault();
                // 우선 전체 메뉴 닫기
                document.querySelectorAll('[data-role="toggleSubMenu"]').forEach(menu => {
                    menu.nextElementSibling.style.display = 'none'
                })

                const list = menu.nextElementSibling
                if (list.style.display === 'block') {
                    list.style.display = 'none'
                } else {
                    list.style.display = 'block'
                }
            })
        })
    }
}

// 3. 아이프레임 높이 자동 조절
function resizeIframe(iframe, retryCount = 0) {
    try {
        if (!iframe.contentWindow || !iframe.contentWindow.document) return;

        let doc = iframe.contentWindow.document;
        let height = doc.body.scrollHeight || doc.documentElement.scrollHeight;

        console.log("Iframe height:", height);

        if (height > 0) {
            iframe.style.height = height + "px";
        } else if (retryCount < 10) {
            console.warn(`Retrying iframe height adjustment... (${retryCount + 1})`);
            setTimeout(() => resizeIframe(iframe, retryCount + 1), 50);
        }
    } catch (e) {
        console.error("iframe height adjustment failed:", e);
    }
}

function initIframes() {
    const iframes = document.querySelectorAll("iframe");

    iframes.forEach((iframe) => {
        // iframe이 처음부터 로드되도록 강제 트리거
        resizeIframe(iframe);

        // onload 이벤트 활용
        iframe.onload = function () {
            resizeIframe(iframe);
        };

        // 내부 iframe이 `DOMContentLoaded` 되었는지 감지
        let interval = setInterval(() => {
            if (iframe.contentWindow.document.readyState === "complete") {
                resizeIframe(iframe);
                clearInterval(interval);
            }
        }, 100);
    });
}


const APP_PATH_SETTINGS = {
    // Overall
    "pageTop": "flickcard://pageTop", //TODO

    // 1. 대명아임레디 공식총판 모집인
    "271i1qbm": "/m/home.html",
    "3lwuo7bd": "/m/sign.html",
    "4jin1tyk": "/m/notice.html",
    "2keqhj58": "/m/place.html",

    // 2. 유존디자인
    "ajtmuk8c": "/m/home.html", // YOU ZONE DESIGN
    "9fswbcsp": "/m/01.html", // 인쇄｜출력물
    "dm90yz1l": "/m/06.html", // 실사출력
    "2s2ve2wv": "/m/09.html", // 디자인제작
    "ejp0yyq0": "/m/10.html", // 사진보정 및 촬영
    "susokf27": "/m/12.html", // 행사장추천상품
    "2zfat3vm": "/m/13.html", // DM우편발송
    "t06xjuc0": "/m/14.html", // SNS
    "47v8nbsp": "/m/15.html", // 문의하기
    "7rpxq76n": "/m/01.html", // 카다로그
    "d0purofu": "/m/02.html", // 리플렛｜전단접지
    "7zijwbv6": "/m/03.html", // 홍보포스터 · 전단
    "6pop8gif": "/m/04.html", // 명함｜쿠폰｜봉투
    "daohtsjp": "/m/05.html", // 패키지디자인 및 제작
    "47ny9g8t": "/m/07.html", // 홍보배너
    "ei8idmnn": "/m/08.html", // 기타 사인물 
    "5tkndo8m": "/m/10.html", // 사진보정 및 촬영
    "alud3087": "/m/11.html", // 사진포트폴리오

    // 3. 충주 탄금호 펜션
    "c1e2337e": "/m/home.html", // 홈
    "dnm0f158": "/m/01.html", // 탄금호 펜션
    "1nkunw9f": "/m/02.html", // 객실안내
    "x317twyi": "/m/02.html", // 찾아오시는 길
    "9kty4zqk": "/m/03.html", // 102호-노을
    "t9gg5cbw": "/m/04.html", // 101호-햇살
    "dt5tzq6q": "/m/05.html", // 201호-바람
    "59wyxixb": "/m/06.html", // 바베큐 시설
    "yzk8i8g2": "/m/07.html", // 탄금호 펜션 전경
    "qcu9urx8": "/m/07.html", // 외부 전경1
    "bfsker5v": "/m/08.html", // 외부 전경2
    "4oiua038": "/m/09.html", // 외부 야경
    "1p8c4t2t": "/m/10.html", // 탄금호 불꽃축제
    "9macih0y": "/m/11.html", // 사계절 전경 
    "1c2r16r1": "/m/12.html", // 이용안내
    "b9rw8my8": "/m/13.html", // 예약현황
    "2df4jg98": "/m/14.html", // 이용후기 
    "ddfgkc80": "/m/14.html", // 이용후기
    "hwwpo09e": "/m/15.html", // 예약하기
    "28ref17h": "/m/16.html", // 공지사항
    "5x7rhpan": "/m/17.html", // 주변볼거리 
    "9pti27qn": "/m/17.html", // 주변볼거리
    "cxzyerwg": "/m/18.html", // 주변 볼거리 갤러리

    // 4. 스튜디오 몽글
    "jowtnwsc": "/m/home.html", // 홈
    "7ijxlup9": "/m/01.html", // 갤러리
    "enrxtmky": "/m/01.html", // 대표 세트 촬영 상품 
    "eqbxeo4o": "/m/02.html", // 컬러드로잉 네컷 포스터 
    "ara17kut": "/m/03.html", // 구컷 드로잉 포스터
    "4e4xvgy9": "/m/04.html", // 가족사진
    "9y791roo": "/m/05.html", // 50일/백일화보
    "dsv8cyrn": "/m/06.html", // 이백일화보 
    "kwmgwdzk": "/m/07.html", // 돌 화보
    "6z97ad4g": "/m/08.html", // 돌 이후 화보
    "60f72xua": "/m/09.html", // 천일풍선컨셉
    "bvhhhlkv": "/m/10.html", // 우정사진
    "1vnonpex": "/m/11.html", // 컬러증명패키지 
    "3qj96bch": "/m/12.html", // 화관네컷 패키지
    "1r7xp1ng": "/m/13.html", // 9컷 패키지
    "dduok8s7": "/m/14.html", // 크리스마스 시즌
    "dmagswwq": "/m/15.html", // 촬영가격
    "4kcu2our": "/m/16.html", // 안내사항
    "2m42c27p": "/m/17.html", // 오시는길

    // 5. 널스 메디케어 
    "b8gwpspk": "/m/home.html", // 홈
    "4hmcmioz": "/m/01.html", // 회사소개 
    "9o0gro1p": "/m/02.html", // 임대 절차 
    "4dg1eiih": "/m/03.html", // 가정용 산소 발생기 
    "b058oq1h": "/m/04.html", // 휴대용 산소 발생기 
    "4nahfnnm": "/m/05.html", // 가정용 인공 호흡기 
    "7ataxqf8": "/m/06.html", // 문의하기 

    // 6. 수목요양병원
    "1dbzmroe": "/m/home.html", // 홈
    "dsq5bkr9": "/m/01.html", // 병원소개
    "dqk6cubx": "/m/01.html", // 병원전경
    "celmmb8y": "/m/02.html", // 병원 소개
    "5xy1ajis": "/m/03.html", // 의료진 소개
    "9eec2qi1": "/m/04.html", // 협력병원 기관
    "e4t99hy4": "/m/05.html", // 상담안내
    "7ggagfte": "/m/06.html", // 정밀의학센터
    "b98lr3kw": "/m/06.html", // 정밀의학소개 
    "dhg88lh4": "/m/07.html", // 신속수액요법
    "1hljrycs": "/m/08.html", // 정밀수액요법
    "1gffrpoj": "/m/03.html", // 암_치매 정밀검사
    "dgd1laxf": "/m/10.html", // 기능의학검사
    "2jmrqcc6": "/m/11.html", // 암 치료센터
    "bknnm9pk": "/m/11.html", // 온열암 고압산소 센터
    "eg2tb7dy": "/m/12.html", // 면역요법 치료센터
    "3m85mjjx": "/m/13.html", // 암성통증 치료센터
    "2xpk06nu": "/m/14.html", // 림프부종 치료센터
    "dia2fo4u": "/m/15.html", // 암 심리 치유센터
    "7z7tyayx": "/m/16.html", // 면역증진센터
    "ergh42s3": "/m/16.html", // 면역증진 센터
    "cpacn79c": "/m/17.html", // 면역식단&한방차 프로그램
    "91u6thus": "/m/18.html", // 병원소식
    "7pyy89ju": "/m/18.html", // 병원소식
    "cnatos5m": "/m/19.html", // 의학칼럼
    "1zrd0e98": "/m/20.html", // 식단안내
    "2ygpaz5l": "/m/21.html", // 고객센터
    "aa8exuo9": "/m/21.html", // 온라인 상담문의
    "3wj4gyui": "/m/22.html", // 비급여 치료
    "a51rpqcw": "/m/23.html", // 개인정보 및 영상처리방침

    // 7. 서울바른교정치과의원
    "42p5v7ze": "/m/home.html", // 홈
    "42p5v7ze": "/m/home.html", // 특별함
    "6002jf1r": "/m/01.html", // 의료진
    "722adhuf": "/m/02.html", // 진료 특화
    "empn27li": "/m/03.html", // 진료안내
    "ax1dp1sv": "/m/03.html", // 진료시간
    "8j3tufi3": "/m/04.html", // 오시는길
    "asjhked9": "/m/05.html", // 둘러보기
    "558evpta": "/m/06.html", // 공지사항
    "4zy58jp8": "/m/06.html", // 월별진료일정
    "6jsyepys": "/m/07.html", // 행사

    // 8. 메이저 뮤직&댄스 아카데미
    "1dhzl2k5": "/m/home.html", // 홈
    "1dhzl2k5": "/m/home.html", // MAIN
    "bxt5br7a": "/m/01.html", // 입시|오디션
    "bxt5br7a": "/m/01.html", // 입시
    "8wcl780e": "/m/02.html", // 오디션 
    "1plhjoz0": "/m/03.html", // VOCAL
    "dih5gprz": "/m/04.html", // HIP HOP
    "53ncww1d": "/m/05.html", // 작곡 & MIDI 
    "9w12qowq": "/m/06.html", // 악기 
    "csofx29k": "/m/07.html", // DANCE 
    "e2ieokgp": "/m/08.html", // 연기 
    "et4uci43": "/m/09.html", // TEACHER
    "et4uci43": "/m/09.html", // VOCAL 
    "ax3ff4ly": "/m/10.html", // HIP HOP 
    "evet68ey": "/m/11.html", // 작곡
    "5ok6y7bi": "/m/12.html", // MIDI 
    "9xvvw5hk": "/m/13.html", // PIANO 
    "1hznseq7": "/m/14.html", // GUITAR
    "c2ugvfj2": "/m/15.html", // DANCE
    "7oixerhj": "/m/16.html", // 연기
    "6p09dfz4": "/m/17.html", // CONTACT
    "6p09dfz4": "/m/17.html", // NEWS
    "41sd1ibk": "/m/18.html", // VIDEO
    "hwzdk7u2": "/m/19.html", // CONTACT 
    "879ffwox": "/m/20.html", // MAJOR  
    "879ffwox": "/m/20.html", // Introduction  
    "38fqbtfd": "/m/21.html", // Major Is Best!  


    // 9. 비즈어카운팅
    "aa87dcm8": "/m/home.html", // 홈
    "s4c8652z": "/m/01.html", // 인사말
    "9se7a3x2": "/m/01.html", // 인사말
    "74m0ku8f": "/m/02.html", // 오시는 길
    "e5erpi04": "/m/03.html", // 이용가능지역
    "8nhaerci": "/m/04.html", // 업무분야
    "elp8avfj": "/m/04.html", // 비상주서비스
    "3xd72tnd": "/m/05.html", // 상주1인실
    "f4qz41v0": "/m/06.html", // 세무 및 회계 서비스
    "hp75ifbi": "/m/07.html", // 법무 및 인사 서비스
    "csncp47m": "/m/08.html", // 조세감면 혜택 맞춤형 컨설팅
    "dys3koam": "/m/09.html", // 업무용차량 관련 상담
    "elfwp56i": "/m/10.html", // 이용요금
    "pdro6tzc": "/m/10.html", // 이용요금
    "5mgbvsu3": "/m/11.html", // 이용요금-상주
    "a6wh9gfv": "/m/12.html", // 우리의 강점
    "9se89r8h": "/m/13.html", // 내부모습
    "yz13yigj": "/m/14.html", // 자료게시판
    "2z3hatra": "/m/14.html", // 자료게시판
    "7ibw5i91": "/m/15.html", // 업주업체홍보
    "a5t7l8jn": "/m/16.html", // 업무관련 사이트

    // 10. 행정사사무소 백승
    "2s0rthje": "/m/home.html", // 홈
    "c7v3t9vq": "/m/home.html", // 김경윤행정사
    "b4oi6zqm": "/m/01.html", // 인사
    "fla6h7ux": "/m/02.html", // 소개/협력인사
    "biawmaq0": "/m/03.html", // 비영리법인/단체 설립
    "f1uxsuwa": "/m/03.html", // [목차]
    "9iw8x1gv": "/m/04.html", // 법인의 개요
    "28cdlcjc": "/m/05.html", // 법인설립요건
    "f1qffnxa": "/m/06.html", // 비영리사단법인의 설립
    "epwczbuw": "/m/07.html", // 비영리재단법인의 설립
    "6ig39rcx": "/m/08.html", // 공익법인(장학·연구·자선등)
    "4ptfn0l8": "/m/09.html", // 사회복지법인의 설립
    "emmr8gtf": "/m/10.html", // 종교법인의 설립
    "98aspw2p": "/m/11.html", // 외교국제법인의 설립
    "57aj06j4": "/m/12.html", // 비영리민간단체 등록
    "2w8ucp9z": "/m/13.html", // 협회/종중설립
    "7dwig1ou": "/m/13.html", // [목차]
    "bxwannjp": "/m/14.html", // 사업자등록증/고유번호증
    "mqjxxhbn": "/m/15.html", // 협회설립(고유번호증신청
    "edo4ddmq": "/m/16.html", // 종중설립(고유번호증신청)
    "e5bfmkb9": "/m/17.html", // 전문예술법인･단체 지정
    "61yvh4ql": "/m/18.html", // 기부금단체 지정
    "44y0xdx8": "/m/18.html", // [목차]
    "b654fk03": "/m/19.html", // 기부금 제도
    "qii2awkb": "/m/20.html", // 공익법인(지정기부금단체) 신청
    "1oq0wru5": "/m/21.html", // 법정기부금단체
    "p8od9zq2": "/m/22.html", // 기부금대상민간단체
    "tj41rdqa": "/m/23.html", // 민간자격
    "eewm4okb": "/m/23.html", // [목차]
    "dysc3nl9": "/m/24.html", // 민간자격 등록
    "310onhqc": "/m/25.html", // 민간자격등록대행 실적
    "1nhyrrkz": "/m/26.html", // 민간자격공인 신청
    "7rg1g5b2": "/m/27.html", // 박물관·미술관 설립·등록
    "bvzi78m4": "/m/28.html", // 학원/평생교육시설 설립
    "8lbvab5o": "/m/28.html", // [목차]
    "eicmwuwa": "/m/29.html", // 학원설립신고
    "f1oh5etp": "/m/30.html", // 평생교육시설 설립신고
    "1nmfg3er": "/m/31.html", // 학교부설 평생교육시설
    "bp3iiijg": "/m/32.html", // 학교형태 평생교육시설
    "90badas0": "/m/33.html", // 사내대학형태의 평생교육시설
    "a9mzgmhi": "/m/34.html", // 원격형태 평생 교육시설
    "163a7ctv": "/m/35.html", // 사업장부설 평생교육시설
    "c5621lrz": "/m/36.html", // 시민사회단체부실 평생 교육시설
    "a9pznj6r": "/m/37.html", // 언론기관부설 평생 교육시설
    "bq3o0vh6": "/m/38.html", // 지식ㆍ인력개발 평생 교육시설
    "759uplmn": "/m/39.html", // 장애인평생교육시설
    "2uy1qtpk": "/m/40.html", // 직업훈련기관 설립
    "662dem9m": "/m/40.html", // [목차]
    "36amqv8d": "/m/41.html", // 직업능력개발훈련기관 개요
    "7rpgwwli": "/m/42.html", // 지정 직업능력개발훈련시설
    "pn9uezqj": "/m/43.html", // 직업능력개발훈련법인
    "8770c6dt": "/m/44.html", // 사회적기업지정ㆍ인증
    "374mnsbe": "/m/44.html", // [목차]
    "4yxm06ca": "/m/45.html", // 예비사회적기업 지정
    "ai9ezeoo": "/m/46.html", // 사회적기업 인증
    "26n21yl1": "/m/47.html", // 소셜벤쳐기업 인증
    "3kt132do": "/m/48.html", // 그밖의 사회적경제조직체
    "5jlbrucf": "/m/49.html", // (사회적)협동조합 설립
    "d4zpchc1": "/m/49.html", // [목차]
    "ewckglt5": "/m/50.html", // 협동조합 이해하기
    "cv4vmehy": "/m/51.html", // 일반협동조합 설립
    "eqwvh8ea": "/m/52.html", // 사회적협동조합 설립
    "4ooifbz3": "/m/53.html", // 보건의료사회적협동조합 설립
    "7rsv5frw": "/m/54.html", // 협동조합 조직변경
    "74bzd52u": "/m/55.html", // 조합(동업계약)
    "3epzobw3": "/m/56.html", // 조달인증
    "76l5te1e": "/m/56.html", // [목차]
    "eznczt33": "/m/57.html", // 직접생산확인증명 
    "4dfea9ph": "/m/58.html", // 다수공급자계약(MAS)
    "4l8lsb0n": "/m/59.html", // 성능인증
    "35y2b1lu": "/m/60.html", // 녹색인증
    "13p9jb0d": "/m/61.html", // 신제품(NEP) 인증
    "bq044ykp": "/m/62.html", // 신기술(NET) 인증
    "4d63bvqt": "/m/63.html", // 특정분야신기술(NET)
    "abk6okyw": "/m/64.html", // 우수재활용(GR)제품인증
    "bagjy8na": "/m/65.html", // 환경마크 인증
    "e7gi9ke4": "/m/66.html", // K마크인증
    "c11ez2hp": "/m/67.html", // 조달우수제품 인증
    "cqa7m2ij": "/m/68.html", // 그 밖의 조달관련 인증
    "9tcgfd4s": "/m/69.html", // [기업인증ㆍ확인]
    "2lzk9pya": "/m/69.html", // [목차]
    "nozq3zyw": "/m/70.html", // 벤처기업인증
    "ek9c56wm": "/m/71.html", // 이노비즈인증
    "yn2w2nk4": "/m/72.html", // 메인비즈인증
    "79yc0ggc": "/m/73.html", // 가족친화 인증
    "d5ljm44h": "/m/74.html", // 기업부설연구소/전담부서
    "2978qeur": "/m/75.html", // 여성기업확인
    "api0faga": "/m/76.html", // 행정심판이란?
    "b3nbwo3d": "/m/76.html", // [행정심판이란?]
    "494dkmjt": "/m/77.html", // 행정심판의 개요
    "8hh2pemc": "/m/78.html", // 행정심판기관
    "bt786apw": "/m/79.html", // 행정심판의 대상
    "4jr4vhzc": "/m/80.html", // 행정심판의 종류
    "4ar1yhqe": "/m/81.html", // 행정심판의 당사자
    "cqywlkrp": "/m/82.html", // 행정심판의 청구기간
    "3nyexlos": "/m/83.html", // 행정심판청구서 제출 등
    "adqmi3ub": "/m/84.html", // 행정심판과 집행정지신청
    "9qwjutwx": "/m/85.html", // 행정심판과 임시처분신청
    "a81zw2g4": "/m/86.html", // 주요 행정심판
    "dsabpm3d": "/m/86.html", // [주요행정심판]
    "capbr5cs": "/m/87.html", // 공무원교원소청 행정심판
    "4ob9ltm8": "/m/88.html", // 운전면허 구제
    "e8zn7szn": "/m/89.html", // 영업정지구제 행정심판
    "384nmomc": "/m/90.html", // 세금불복 청구
    "63ja9r0f": "/m/91.html", // 이행강제금 행정심판
    "4zc043vw": "/m/92.html", // 학교폭력 행정심판
    "5545ek2x": "/m/93.html", // 어린이집관련 행정심판
    "169vrtrl": "/m/94.html", // 건설관련 행정심판
    "31zhhoqa": "/m/95.html", // 산업안전보건관련 행정심판
    "e3iufmiu": "/m/96.html", // 연구기술개발관련 행정심판
    "3f2hron9": "/m/97.html", // 이의신청/분쟁조정
    "1vwz36j5": "/m/97.html", // [이의신청/분쟁조정]
    "3tecm5x1": "/m/98.html", // 이의신청 개요
    "zvm5q35o": "/m/99.html", // 분쟁조정신청 개요
    "2kc83gka": "/m/100.html", // 공정거래관련 이의신청
    "7j59s0tw": "/m/101.html", // 금융관련 분쟁조정
    "c5tr2lmc": "/m/102.html", // 건강보험분쟁조정
    "1uv3p3qo": "/m/103.html", // 참고자료
    "v3vn69tf": "/m/104.html", // 문의하기
    "3jz4nd8c": "/m/105.html", // ➜ 오시는 길
}

