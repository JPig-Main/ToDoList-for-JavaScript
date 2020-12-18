'use strict';
{
    // todoリストを追加する部品の抽象クラス
    class Add_Part {
        constructor(selector) {
            this.elem = document.getElementById(selector);
        }
    }

    // todoリストを追加する標準部品のクラス(Add_Part抽象クラスを継承)
    class Add_Normal_Part extends Add_Part{
        constructor(selector) {
            super(selector);
        }
    }

    // todoリストを追加する入力部品のクラス(Add_Part抽象クラスを継承)
    class Add_Input_Part extends Add_Part{
        constructor(selector, init_value) {
            super(selector);
            this.init_value = init_value;
            this.elem.value = this.init_value
            console.log(init_value);
            if (this.elem.type === 'date') {
                this.elem.min = this.init_value;
            }
        }

        // 入力部品の値をリセットする
        _inputValueReset = () => {
            this.elem.value = this.init_value;
        }

        // Escapeがクリックされたら, 入力部品の値をリセットする
        _inputReset = () => {
            this.elem.addEventListener('keydown', e => {
                if (e.key === 'Escape') {
                    this._inputValueReset();
                }
            });
        }
    }

    // listのid(Listの静的変数のつもり)
    let list_now_id = 0;

    // listの操作
    class List {
        constructor(text_value, date_value, time_value) {
            this.lists = document.getElementById('todo-lists');
            this.text_value = text_value;
            this.date_value = date_value;
            this.time_value = time_value;
            this.list_id = list_now_id++;
        }

        // listの追加
        _add = () => {
            const list = document.createElement('div');
            list.id = `todo-list-${this.list_id}`;

            const check = document.createElement('input');
            check.type = 'checkbox';
            list.appendChild(check);
            const time = document.createElement('div');
            time.classList.add('todo-time');
            const date_value = this.date_value.split('-');
            time.textContent = `${date_value.splice(0, 1)} ${date_value.join('/')} ${this.time_value}`;
            list.appendChild(time);
            const text = document.createElement('div');
            text.classList.add('todo-text');
            text.textContent = this.text_value;
            list.appendChild(text);
            this.lists.insertBefore(list, this.lists.firstChild);
        }

        // チェックの付け外し
        _check = () => {
            const list = document.getElementById(`todo-list-${this.list_id}`);
            const check = list.querySelector('input[type="checkbox"]');
            const text = list.querySelector('.todo-text');

            check.addEventListener('click', () => {
                text.classList.toggle('finished');
            })
        }

        _play = () => {
            this._add();
            this._check();
        };
    }

    // todoリストを追加するクラス
    class Add {
        constructor() {
            // セレクタ
            this.selector = {
                text: 'todo-add-text',
                date: 'todo-add-date',
                time: 'todo-add-time',
                submit: 'todo-add-submit',
            }

            // 現在の日にちと時刻を取得
            const now_time = new Date();
            const now_time_details = {
                year: String(now_time.getFullYear()).padStart(4, '0'),
                month: String(now_time.getMonth() + 1).padStart(2, '0'),
                date: String(now_time.getDate()).padStart(2, '0'),
                hour: String(now_time.getHours()).padStart(2, '0'),
                minute: String(now_time.getMinutes()).padStart(2, '0'),
                second: String(now_time.getSeconds()).padStart(2, '0'),
            }

            this.text = new Add_Input_Part(this.selector.text, '');
            this.date = new Add_Input_Part(this.selector.date, [now_time_details.year, now_time_details.month, now_time_details.date].join('-'));
            this.time = new Add_Input_Part(this.selector.time, [now_time_details.hour, now_time_details.minute, now_time_details.second].join(':'));
            this.submit = new Add_Normal_Part(this.selector.submit);
            this.text.elem.focus();
        }

        // 入力をリセットする
        _reset = () => {
            this.text._inputReset();
            this.date._inputReset();
            this.time._inputReset();
        }

        // 入力をサブミットする
        _submit = () => {
            add.submit.elem.addEventListener('click', () => {
                this.text.elem.focus();
                if (this.text.elem.value.length <= 0) {
                    return;
                }

                // listを追加
                new List(this.text.elem.value, this.date.elem.value, this.time.elem.value)._play();

                this.text._inputValueReset();
                this.date._inputValueReset();
                this.time._inputValueReset();
            });
        }
    }

    class Remove {
        constructor() {
            this.lists = document.getElementById('todo-lists');
            this.remove = document.getElementById('todo-remove');
        }
        _remove = () => {
            if (!confirm('チェックの付いたリストを削除しますか?')) {
                return;
            }
            this.lists.childNodes.forEach(list => {
                console.log(list);
                if (list.querySelector('.todo-text').classList.contains('finished')) {
                    this.lists.removeChild(list);
                }
            });
        }
        _play = () => {
            this.remove.addEventListener('click', () => {
                this._remove();
            });
        }
    }

    // ショートカットキー
    class Short_Cut {
        constructor(add) {
            this.add = add;
        }

        _play = () => {
            this.add.text.elem.addEventListener('keydown', e => {
                switch(e.key) {
                    case 'Enter':
                    case 'ArrowRight':
                        this.add.date.elem.focus();
                        break;
                    case 'ArrowLeft':
                        this.add.submit.elem.focus();
                        break;
                }
            });
            this.add.date.elem.addEventListener('keydown', e => {
                switch(e.key) {
                    case 'Enter':
                    case 'ArrowRight':
                        this.add.time.elem.focus();
                        break;
                    case 'ArrowLeft':
                        this.add.text.elem.focus();
                        break;
                }
            });
            this.add.time.elem.addEventListener('keydown', e => {
                switch(e.key) {
                    case 'Enter':
                    case 'ArrowRight':
                        this.add.submit.elem.focus();
                        break;
                    case 'ArrowLeft':
                        this.add.date.elem.focus();
                        break;
                }
            });
            this.add.submit.elem.addEventListener('keydown', e => {
                switch(e.key) {
                    case 'Enter':
                        this.add._submit();
                        break;
                    case 'ArrowRight':
                        this.add.text.elem.focus();
                        break;
                    case 'ArrowLeft':
                        this.add.time.elem.focus();
                        break;
                }
            });
        }
    }

    const add = new Add();
    add._reset();
    add._submit();
    new Remove()._play();
    new Short_Cut(add)._play();
}