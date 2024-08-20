/**
 * To-do List 관리를 위한 클래스 (MyLittleThings)
 */

// ---------- 공백 제거 정규표현식 ----------

const spaceCheck = /^\s+|\s+$/g;

// ---------- 할 일 갯수 세기 엘리먼트 ----------

const labelTotalTodos = document.querySelector('.label-total-todos');
const labelCompleteTodos = document.querySelector('.label-complete-todos');

// ---------- MyLittleThings 클래스 시작 ----------

class MyLittleThings { // 근본적인 아이템 배열 구조에 대한 재설계 필요. 배열을 가지고 와서 매 행동마다 다시 로컬 스토리지로 돌려보내는 방법이 필요하다.
    constructor(targetEl) {
        this.target = targetEl // draw()를 실행할 대상 DOM 엘리먼트
    }

    getLocalData() { // 데이터 불러오기
        return JSON.parse(localStorage.getItem('mltTodoList'));
    }

    setLocalData(dataArray) { // 데이터 저장하기
        localStorage.setItem('mltTodoList', JSON.stringify(dataArray));
    }

    countTodos(dataArray) { // footer 부분에 할 일 갯수를 삽입하는 기능
        labelTotalTodos.textContent = dataArray.filter(n => n.deleted === false).length;
        labelCompleteTodos.textContent = dataArray.filter(n => n.status === 'done' && n.deleted === false).length;
    }

    draw(drawType) { // 리스트 출력
        const originArray = this.getLocalData();

        if (!!originArray === false || originArray.length === 0) { // 할 일이 없을 때는 플레이스홀더 출력
            this.target.innerHTML = `
                <li class="empty-list">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icons big-icon icon-no-document" fill="currentColor">
                        <path d="M15 4H5V20H19V8H15V4ZM3 2.9918C3 2.44405 3.44749 2 3.9985 2H16L20.9997 7L21 20.9925C21 21.5489 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"></path>
                    </svg>

                    <p>아직은 할 일이 없어요.</p>
                </li>
            `;

            return;
        }

        this.countTodos(originArray);

        let drawData = originArray.map((data, index) => { // 목록을 출력하기 위해 배열을 정리하고, DOM 요소를 만들어 객체에 추가한다.
            const dataElement = document.createElement('li');

            dataElement.classList.add('todo-item');
            dataElement.dataset.itemIndex = index;
            dataElement.dataset.itemImp = data.important ? 'important' : 'normal';
            dataElement.dataset.itemStatus = data.status;
            dataElement.innerHTML = `
                <button type="button" class="button-todo-item-done ${ data.status === 'done' ? 'done' : null }" ${ data.deleted === true ? 'disabled' : '' } title="완료된 할 일로 표시">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icons icon-checked" fill="currentColor">
                        <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
                    </svg>
                </button>

                <div class="todo-item-aligner">
                    <div class="todo-label-container">
                        <p class="todo-label">
                            ${ data.value }
                        </p>

                        <div class="todo-edit-legends">
                            <span class="legends-keys">Enter</span>
                            <span class="legends-keys">Esc</span>
                        </div>
                    </div>

                    <div class="todo-status">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icons icon-important-blank" fill="currentColor">
                            <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"></path>
                        </svg>
                    </div>

                    <div class="todo-button-container">
                        <div class="todo-buttons general">
                            ${ data.status === 'done' || data.deleted === true ?
                                ''
                                :
                                `<button type="button" class="button-todo-item-edit" title="내용 수정">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icons icon-edit" fill="currentColor">
                                        <path d="M6.41421 15.89L16.5563 5.74785L15.1421 4.33363L5 14.4758V15.89H6.41421ZM7.24264 17.89H3V13.6473L14.435 2.21231C14.8256 1.82179 15.4587 1.82179 15.8492 2.21231L18.6777 5.04074C19.0682 5.43126 19.0682 6.06443 18.6777 6.45495L7.24264 17.89ZM3 19.89H21V21.89H3V19.89Z"></path>
                                    </svg>
                                </button>`
                            }

                            ${ data.deleted === true ?
                                `<button type="button" class="button-todo-item-restore" title="이 할 일 복원">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icons icon-restore" fill="currentColor">
                                        <path d="M22 12C22 17.5228 17.5229 22 12 22C6.4772 22 2 17.5228 2 12C2 6.47715 6.4772 2 12 2V4C7.5817 4 4 7.58172 4 12C4 16.4183 7.5817 20 12 20C16.4183 20 20 16.4183 20 12C20 9.25022 18.6127 6.82447 16.4998 5.38451L16.5 8H14.5V2L20.5 2V4L18.0008 3.99989C20.4293 5.82434 22 8.72873 22 12Z"></path>
                                    </svg>
                                </button>`
                                :
                                ''
                            }

                            <button type="button" class="button-todo-item-delete" title="${ data.deleted === true ? '이 할 일을 완전히 제거' : '이 할 일 삭제' }">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icons icon-delete" fill="currentColor">
                                    <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            const chkIsDone = dataElement.querySelector('.button-todo-item-done');
            const btnEdit = dataElement.querySelector('.button-todo-item-edit');
            const btnRestore = dataElement.querySelector('.button-todo-item-restore');
            const btnDelete = dataElement.querySelector('.button-todo-item-delete');

            chkIsDone.addEventListener('click', (e) => this.updateItem(data, 'change'));

            btnEdit?.addEventListener('click', (e) => this.updateItem(data, 'edit'));

            btnRestore?.addEventListener('click', (e) => this.restoreItem(data));

            btnDelete.addEventListener('click', (e) => this.removeItem(data));

            data.itemIndex = index;
            data.element = dataElement;

            return data;
        });

        this.target.innerHTML = ''; // 새 목록을 그리기 위해 대상 DOM을 비운다.

        drawData.forEach(dataItem => { // drawType에 따라 지정된 목록을 필터링하여 추가한다.
            if (drawType === 'Pending') {
                if (dataItem.status === 'pending' && dataItem.deleted === false) this.target.appendChild(dataItem.element);
            } else if (drawType === 'Deleted') {
                if (dataItem.deleted === true) this.target.appendChild(dataItem.element);
            } else {
                if (dataItem.deleted === false) this.target.appendChild(dataItem.element);
            }
        });

        if ((drawType === 'Pending' || drawType === 'Todo') && this.target.childElementCount === 0) {
            this.target.innerHTML = `
                <li class="empty-list">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icons big-icon icon-no-document" fill="currentColor">
                        <path d="M15 4H5V20H19V8H15V4ZM3 2.9918C3 2.44405 3.44749 2 3.9985 2H16L20.9997 7L21 20.9925C21 21.5489 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"></path>
                    </svg>

                    <p>아직은 할 일이 없어요.</p>
                </li>
            `;
        }

        if (drawType === 'Deleted' && this.target.childElementCount === 0) { // 빈 휴지통을 따로 표현하기 위한 부분
            this.target.innerHTML = `
                <li class="empty-list">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icons big-icon icon-empty-bin" fill="currentColor">
                        <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 4V6H15V4H9Z"></path>
                    </svg>

                    <p>휴지통이 비어 있어요.</p>
                </li>
            `;
        }
    }

    addItem(isImportant, textOf) { // 신규 아이템 추가
        if (textOf.value.replace(spaceCheck, '') === '') {
            createAlert('입력된 내용이 없어요.', 'error');

            textOf.value = '';

            return;
        }

        if (!!localStorage.getItem('mltTodoList') === false) { // 만약 스토리지가 없는 상태에서 입력을 시도하면 오류가 발생하기 때문에, 임의의 빈 배열을 삽입한다.
            localStorage.setItem('mltTodoList', JSON.stringify([]));
        }

        const todoArray = this.getLocalData();

        const newItem = {
            value: textOf.value,
            date: new Date(),
            status: 'pending',
            important: isImportant.checked,
            deleted: false
        }

        todoArray.unshift(newItem);
        this.setLocalData(todoArray);

        isImportant.checked = false; // 추가가 완료되었으면 중요도 체크박스와 입력창을 초기화한다.
        textOf.value = '';

        this.draw(currentMode);
    }

    updateItem(targetObj, mode) { // 아이템 상태 변경 기능 (완료, 수정 등)
        const todoArray = this.getLocalData();
        const thisItem = todoArray[targetObj.itemIndex];

        if (mode === 'change') { // 완료 상태 전환
            thisItem.status === 'pending' ? thisItem.status = 'done' : thisItem.status = 'pending';

            this.setLocalData(todoArray);
            this.draw(currentMode);
        }

        if (mode === 'edit') { // 수정 모드
            const editableField = targetObj.element.querySelector('.todo-label');
            const textBefore = editableField.textContent; // 원래 텍스트를 저장해 놓고, 수정 도중 취소하면 복원한다.

            editableField.setAttribute('contenteditable', true);
            editableField.focus();

            editableField.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    thisItem.value = editableField.textContent;

                    this.setLocalData(todoArray);
                    this.draw(currentMode);
                }

                if (e.key === 'Escape') {
                    editableField.textContent = textBefore;
                    editableField.removeAttribute('contenteditable');
                    editableField.removeEventListener('keyup');
                }
            });
        }
    }

    removeItem(targetObj) { // 아이템 삭제 & 휴지통의 아이템 완전 삭제
        const todoArray = this.getLocalData();
        const thisItem = todoArray[targetObj.itemIndex];

        if (targetObj.deleted === true) {
            const areYouSure = confirm('이 아이템을 완전히 삭제하시겠어요?');

            areYouSure ? todoArray.splice(todoArray.indexOf(thisItem), 1) : null;
        } else {
            thisItem.deleted = true;
        }

        this.setLocalData(todoArray);
        this.draw(currentMode);
    }

    restoreItem(targetObj) { // 휴지통의 아이템 복원
        const todoArray = this.getLocalData();
        const thisItem = todoArray[targetObj.itemIndex];

        thisItem.deleted = false;

        this.setLocalData(todoArray);
        this.draw(currentMode);
    }
}

// ---------- 현재 보기 탭 ----------

const navTabs = document.getElementById('navList').querySelectorAll('.nav-tab-item');

let currentMode = 'all';

navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        navTabs.forEach(elseTab => {
            elseTab.classList.remove('current');
        });

        tab.classList.add('current');
        currentMode = tab.dataset.tabTarget;

        myTodo.draw(currentMode);
    });
});

// ---------- To-do List 시작 ----------

const todoListEl = document.getElementById('todoList');

const myTodo = new MyLittleThings(todoListEl);

myTodo.draw();

// ---------- To-do Item 입력 (생성) ----------

const isImportant = document.getElementById('chkImportant');
const txtTodo = document.getElementById('txtTodo');
const btnEnter = document.getElementById('btnEnter');

txtTodo.addEventListener('keyup', (e) => { if (e.key === 'Enter') myTodo.addItem(isImportant, txtTodo) });

btnEnter.addEventListener('click', () => myTodo.addItem(isImportant, txtTodo));

// ---------- 사용자 설정 모달 ----------

const btnSettings = document.getElementById('btnSettings');
const modalUserSettings = document.getElementById('modalUserSettings');
const txtUserName = document.getElementById('txtUserName');
const btnModalConfirm = document.getElementById('btnModalConfirm');
const btnModalClose = document.getElementById('btnModalClose');

modalUserSettings.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        e.preventDefault();
    }
});

btnSettings.addEventListener('click', () => {
    document.body.classList.add('prevent-scroll');
    modalUserSettings.showModal();
});

btnModalConfirm.addEventListener('click', insertUserName);

btnModalClose.addEventListener('click', () => {
    document.body.classList.remove('prevent-scroll');
    modalUserSettings.close();
});

function insertUserName() {
    if (txtUserName.value.replace(spaceCheck, '') === '') {
        createAlert('이름은 반드시 입력해야 해요!', 'error');

        return;
    }

    localStorage.setItem('mltUser', txtUserName.value);

    const newName = localStorage.getItem('mltUser');

    userNameLabel.textContent = newName;
    modalUserNameLabel.textContent = newName;

    btnModalClose.removeAttribute('style');

    document.body.classList.remove('prevent-scroll');
    modalUserSettings.close();

    createAlert('성공적으로 저장되었어요.', 'good');
}

// ---------- 초기 사용자 정보 입력 ----------

const userNameLabel = document.querySelector('.label-user-name');
const modalUserNameLabel = document.querySelector('.modal-label-user-name');

const userData = localStorage.getItem('mltUser');

if (!userData) {
    userNameLabel.textContent = '(저장된 이름 없음)';
    modalUserNameLabel.textContent = '(저장된 이름 없음)';

    btnModalClose.style.display = 'none';

    document.body.classList.add('prevent-scroll');
    modalUserSettings.showModal();
} else {
    userNameLabel.textContent = userData;
    modalUserNameLabel.textContent = userData;
}

// ---------- 커스텀 경고창 띄우기 ----------

function createAlert(msg, warnType) {
    document.getElementById('customAlert')?.remove();

    const alertEl = document.createElement('aside');

    alertEl.id = 'customAlert';
    alertEl.classList.add('inner-wrapper', warnType);
    alertEl.textContent = msg;

    document.body.appendChild(alertEl);

    setTimeout(() => {
        alertEl.classList.add('hide');
    }, 4000);

    setTimeout(() => {
        alertEl.remove();
    }, 5000);
}

// ---------- 현재 이슈 상황 ----------

/**
 * 1. localStorage에서 가지고 오는 배열을 직접적으로 조작할 수 없기 때문에 매 조작마다 배열 재생성과 리로드 필요 (해결)
 * 2. 내용 수정 어려움 (해결)
 * 3. 사용자 정보 입력받는 모달 미완성 (해결)
 * 4. 색상 테마 전환은 시간적으로 어려울 것 같다.
 */

console.log('%cMyLittleThings', 'font-size: 48px; color: slateblue; font-family: Arial; font-weight: 900;');
console.log('%c나의 작은 할 일 관리 프로그램 - FE2 김창완', 'color: skyblue')