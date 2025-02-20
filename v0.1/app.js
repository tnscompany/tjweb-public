/*
* 전체
0. 페이지별 다운로드 및 index.html 소스를 index.html 안에있는 파일명의 파일로 덮어쓰기


1. 모든 파일 <head> 안에 아래 소스코드 삽입.
<script>var d=document;var s=d.createElement('script');s.src='/tjweb/app.js?v=' + new Date().getTime();s.onload=function(){loadApp();};d.head.appendChild(s);</script>

2. TODO 
<!-- TODO:1 -->
<!-- TODO:2 filename -->
<!-- TODO:3 path -->
<!-- TODO:4 flickcard 제거-->
<!-- TODO:4 flickcard 제거-->
<!-- TODO:5 _listSitemenu 제거-->
<!-- TODO:6 _banner 제거-->
<!-- TODO:3 path -->
<!-- TODO:3 path -->
<!-- TODO:3 path -->
<!-- TODO:7 PC버전으로 보기(진행중) -->


3. 네이버 지도
<script type="text/javascript" src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=j4nam197t4"></script>

* 001-j4nam197t4
0002 유존디자인
0003 탄금호펜션 
0004 스튜디오 몽글
0006 수목요양병원
0007 서울바른교정치과의원 부산점


https://console.ncloud.com/naver-service/application

* PC

* 모바일
1. index.html 소스를 index.html 안에있는 파일명의 파일로 덮어쓰기

 */

function loadApp() {
    deviceCheck();
    injectCSS();
    overideClick();

    beforePathCheck()
    document.addEventListener("DOMContentLoaded", initIframes);

    // 0.5초 후 실행
    setTimeout(function () {
        beforePathCheck()
        document.addEventListener("DOMContentLoaded", initIframes);
    }, 500);

    // 5초 후 실행
    setTimeout(function () {
        beforePathCheck()
        document.addEventListener("DOMContentLoaded", initIframes);
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
    const css = `
    .block-swiper {
        // overscroll-behavior: none !important;
        // pointer-events: none !important;
        // user-select: none !important;
    }
    `
    const style = document.createElement('style')
    style.textContent = css
    document.head.appendChild(style)

    // swipe-wrapper class 가진 element에 block-swiper class 추가
    const swipeWrapper = document.querySelector('.swipe-wrapper')
    if (swipeWrapper) {
        swipeWrapper.classList.add('block-swiper')
    }

    // 
    // only for pc
    // const isPC = !window.location.pathname.includes('/m/')
    // if (isPC) {
    //     var C = window.innerHeight;
    //     document.querySelectorAll('.swiper-wrapper').forEach(swiperWrapper => {
    //         swiperWrapper.style.height = C + 'px';
    //     });
    //     document.querySelectorAll('._mainSwiperArea').forEach(mainSwiperArea => {
    //         mainSwiperArea.style.height = C + 'px';
    //     });
    //     document.querySelectorAll('._imgCover').forEach(imgCover => {
    //         imgCover.style.height = C + 'px';
    //     });
    //     document.querySelectorAll('._spotHomesite').forEach(spotHomesite => {
    //         // "is_center" class 도 가진 경우에만
    //         if (spotHomesite.classList.contains('is_center')) {
    //             spotHomesite.style.height = (C + spotHomesite.offsetHeight + 100) / 2 + 'px';
    //         }
    //     });
    // }
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
    "9o0gro1p": "/m/02.html", // 임대절차
    "4dg1eiih": "/m/03.html", // 가정용산소발생기 
    "b058oq1h": "/m/04.html", // 휴대용산소발생기
    "4nahfnnm": "/m/05.html", // 가정용인공호흡기
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
}