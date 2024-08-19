// ---

class MyLittleThings {
    constructor(targetEl) {
        this.target = targetEl // draw()를 실행할 대상 DOM 엘리먼트
    }

    draw(drawType) {
        const dataType = JSON.parse(localStorage.getItem('mltTodoList')); // Todo, Deleted, Pending (대소문자 주의)

        if (drawType === 'Pending') {
            dataType = dataType.filter(n => n.status === 'pending');
        }

        if (drawType === 'Done') {
            dataType = dataType.filter(n => n.status === 'done');
        }

        if (drawType === 'Deleted') {
            dataType = dataType.filter(n => n.deleted === true);
        }

        if (!!dataType === false) {
            this.target.innerHTML = '데이터가 없습니다.';

            return;
        }

        let drawData = dataType.map((data, index) => {
            const dataElement = document.createElement('li');

            dataElement.classList.add('todo-item');
            dataElement.dataset.itemIndex = index;
            dataElement.dataset.itemImp = data.important ? 'important' : 'normal';
            dataElement.dataset.itemStatus = data.status;
            dataElement.innerHTML = `
                <button type="button" class="button-todo-item-done ${ data.status === 'done' ? 'done' : null }" title="완료된 할 일로 표시">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icons icon-checked" fill="currentColor">
                        <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
                    </svg>
                </button>

                <div class="todo-item-aligner">
                    <div class="todo-label-container">
                        <p class="todo-label">
                            ${ data.value }
                        </p>

                        <div class="todo-status">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icons icon-important-blank" fill="currentColor">
                                <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"></path>
                            </svg>
                        </div>
                    </div>

                    <div class="todo-button-container">
                        <div class="todo-buttons general">
                            ${ data.status === 'done' ?
                                ''
                                :
                                `<button type="button" class="button-todo-item-edit" title="내용 수정">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icons icon-edit" fill="currentColor">
                                        <path d="M6.41421 15.89L16.5563 5.74785L15.1421 4.33363L5 14.4758V15.89H6.41421ZM7.24264 17.89H3V13.6473L14.435 2.21231C14.8256 1.82179 15.4587 1.82179 15.8492 2.21231L18.6777 5.04074C19.0682 5.43126 19.0682 6.06443 18.6777 6.45495L7.24264 17.89ZM3 19.89H21V21.89H3V19.89Z"></path>
                                    </svg>
                                </button>`
                            }

                            <button type="button" class="button-todo-item-delete" title="이 할 일 삭제">
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
            const btnDelete = dataElement.querySelector('.button-todo-item-delete');

            chkIsDone.addEventListener('click', (e) => this.updateItem(data, 'change', drawType));

            btnEdit?.addEventListener('click', (e) => this.updateItem(data, 'edit', drawType));

            btnDelete.addEventListener('click', (e) => this.removeItem(data));

            data.element = dataElement;

            return data;
        });

        this.target.innerHTML = '';

        drawData.forEach(dataItem => {
            this.target.appendChild(dataItem.element);
        });
    }

    addItem(isImportant, textOf) {
        if (!!textOf.value === false) {
            alert('아무것도 입력되지 않았습니다.');

            return;
        }

        if (!!localStorage.getItem('mltTodoList') === false) {
            localStorage.setItem('mltTodoList', JSON.stringify([]));
        }

        const todoArray = JSON.parse(localStorage.getItem('mltTodoList'));

        const newItem = {
            value: textOf.value,
            date: new Date(),
            status: 'pending',
            important: isImportant.checked,
            deleted: false
        }

        todoArray.unshift(newItem);
        localStorage.setItem('mltTodoList', JSON.stringify(todoArray));

        isImportant.checked = false;
        textOf.value = '';

        this.draw();
    }

    removeItem(targetObj) {

    }

    restoreItem(targetObj) {

    }
}

const todoListEl = document.getElementById('todoList');
const userData = localStorage.getItem('mltUser');

const myTodo = new MyLittleThings(todoListEl);

if (!userData) {
    const userName = prompt('사용자 이름을 입력해 주세요.');

    localStorage.setItem('mltUser', userName);
} else {
    const userNameLabel = document.getElementById('labelUserName').querySelector('span');

    userNameLabel.textContent = userData;
}

myTodo.draw('Todo');


// --- 입력

const isImportant = document.getElementById('chkImportant');
const txtTodo = document.getElementById('txtTodo');
const btnEnter = document.getElementById('btnEnter');

btnEnter.addEventListener('click', () => myTodo.addItem(isImportant, txtTodo));


// ---

const btnSettings = document.getElementById('btnSettings');
const modalUserSettings = document.getElementById('modalUserSettings');
const btnModalClose = document.getElementById('btnModalClose');

btnSettings.addEventListener('click', () => modalUserSettings.showModal());

btnModalClose.addEventListener('click', () => modalUserSettings.close());