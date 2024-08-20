## devcourse-project-01
# 2024 데브코스 1기 / 팀 프로젝트 01 - To-Do List 만들기
FE2 - 김창완

---

## 1. 프로젝트 기획

1차 프로젝트를 진행함에 있어 주제는 To-do list로 지정되었고, 주요 안건은 JavaScript를 활용한 동적 상호작용을 구현할 수 있느냐의 여부와 데이터의 입/출력을 다룰 수 있느냐는 것으로 판단하였다. 이를 바탕으로 화면의 구성에 대해서는 최근 추세인 모바일 환경에서의 사용을 우선시하는 것으로 팀 내 의견이 모였다. 단, 모바일 화면의 사이즈에 국한되지 않도록 화면을 구성하여 PC 환경에서도 불편 없이 사용할 수 있게 개발하였다.

팀 내부에서 공통으로 개발이 가능한 내용을 공통 스펙으로 하여 To-do Item의 생성 / 삭제 / 상태 변경 (완료 / 미완료) 등의 기초적인 기능을 LocalStorage를 이용하여 구현하는 것을 목표로 하였으며, 개인 역량에 따라서 To-do Item의 내용 수정, 삭제된 To-do Item의 되돌리기, Drag & Drop, 다크 / 라이트 색상 테마 변경, 배포 버전의 생성 등을 추가 도전 과제로 설정하였다.

프로젝트 일정은 진행 기간인 8월 19일부터 8월 20일까지의 이틀간이며, 초기 기획과 화면 설계 등을 위하여 일부 시간을 할애하였다.

프로젝트 구현 이전에는 기능 흐름을 아래와 같이 구상하였다. 실제 구현시에는 생각보다 복잡한 방식으로 구현해야 했던 기능이 많아, 구상처럼 심플한 형태로 이루어지지는 않았다.

<img width="1172" alt="image-01" src="https://github.com/user-attachments/assets/bebf0ec1-f39b-4928-8492-3238df7348ea">

## 2. 개발 환경
   - Vite (VanillaJS, 이외 기타 의존성 또는 패키지 없음)
   - VS Code
   - SASS / SCSS

## 3. 배포 / 내용 확인
   - ### 1안 : build 후 확인
      - ```
        > npm install
        > vite build
        ```
      - Vite 설치가 선행되어야 함
      - 이후 `dist` 디렉토리를 VS Code로 열어 Live Server 실행 (source url이 루트(/)로 되어있는 관계로, 이러한 방식으로 실행이 필요함)

   - ### 2안 : 디렉토리를 커맨드 창에서 연 후, `dev` 버전으로 확인
      - ```
        > npm install
        > npm run dev
        ```
      - 위와 마찬가지로 Vite 설치가 선행되어야 함

   - ### 3안 : Vercel을 통한 배포 버전 미리보기
      - 링크 (https://devcourse-project-01.vercel.app/)

## 3. 개발 중 이슈
   - `localStorage`에서 가지고 오는 배열은 임시적으로 생성된 것이고 직접적으로 조작할 수 없기 때문에, 매 조작마다 배열 재생성과 리로드가 필요함 (해결)
   - To-do Item의 내용 수정에 있어 기능 개발의 난항 (해결)
   - 사용자 정보를 입력받는 방법 (해결)
   - 색상 테마 전환 기능 (시간 문제로 보류)