class todo {
    static toDoList = [];
    static activeList = [];
    static completedList = [];

    static createTask(task) { //Sukuriame naujau uzduoti
        this.toDoList.push(new todo(task));
        this.taskCount();
        this.saveCreatedTask();
    };
    static loadTaskToActive(task) { //Iš atminties surašo visas buvusias užduotis į Vykdoma lentą
        console.log("pp", this.activeList);
        this.activeList.push(new todo(task));
        this.taskCount();
        this.saveOpenTasks();


    };
    static loadTaskToComplete(task) { //Iš atminties surašo visas buvusias užduotis į Atliktą lentą
        this.completedList.push(new todo(task));
        this.taskCount();
        this.saveCompletedTasks();
    };


    static clearTasks() {  //Lentos valymas
        this.toDoList.forEach(task => {

            document.querySelector('#newTaskTable').removeChild(task.tr);
            console.log('tt',document.querySelector('#newTaskTable'));
        });
    };
    static clearOpenTasks() {  //Lentos valymas
        this.activeList.forEach(task => {
            document.querySelector('#openTaskTable').removeChild(task.tr);
        });

    };
    static clearCompletedTasks() { //Lentos valymas
        this.completedList.forEach(task => {
            document.querySelector('#doneTaskTable').removeChild(task.tr);
        });

    };

    static buttonCreate() {
        document.querySelector('#create').addEventListener('click', () => {
            const task = document.querySelector('#newTaskTxt');
            todo.clearTasks();
            todo.createTask(task.value);
            todo.renderTasks();
            task.value ='';
        })
        document.querySelector('#newTaskTxt').addEventListener('keypress', (e) => {
            if(e.key ==='Enter'){
                const task = document.querySelector('#newTaskTxt');
            todo.clearTasks();
            todo.createTask(task.value);
            todo.renderTasks();
            task.value ='';
            } ;
        })

    }


    static renderTasks() { //atvaizduoja elementus Sukurta lentoje
        this.toDoList.forEach(task => {
            task.render();//mesuprantu kas vyksta;
        });
    };

    static renderOpenTask() { //atvaizduoja elementus Vykdoma lentoje
        this.activeList.forEach(task => {
            task.renderOpenTask();
        });
    }
    static renderCompletedTask() { //atvaizduoja elementus Atlikta lentoje
        this.completedList.forEach(task => {
            task.renderCompletedTask();
        });
    }
    static taskCount() {
        const created = this.toDoList.length;
        const open = this.activeList.length;
        const done = this.completedList.length;
        const total = created + open + done;

        document.querySelector('#createdTasks').innerText = created;
        document.querySelector('#openTasks').innerText = open;
        document.querySelector('#doneTasks').innerText = done;
        document.querySelector('#totalTasks').innerText = total;
    }

    static deleteTask(id) {
        this.toDoList.forEach((task, index) => {
            if (task.id == id) {
                this.clearTasks();
                this.toDoList.splice(index, 1);
                this.renderTasks();
            }
        });
        this.saveCreatedTask();

    };

    static deleteActiveTask(id) {
        this.activeList.forEach((task, index) => {
            if (task.id == id) {
                this.clearOpenTasks();
                this.activeList.splice(index, 1);
                this.renderOpenTask();
            }
        });

        this.saveOpenTasks();
    };

    static deleteCompleteTask(id) {
        this.completedList.forEach((task, index) => {
            if (task.id == id) {
                this.clearCompletedTasks();
                this.completedList.splice(index, 1);
                this.renderCompletedTask();
            }
        });
        this.saveCompletedTasks();
    };

    static showDdeleteConfirmModal(id) {
        document.body.querySelector('#popUpBox').style.display = "block";
        document.querySelector('.btn-delete').dataset.id = id;

    };

    static buttonHideDeleteModal() {
        document.body.querySelector('.btn-nodelete').addEventListener('click', () => {
            document.body.querySelector('#popUpBox').style.display = "none";
            delete document.querySelector('.btn-nodelete').dataset.id;
        });

    }

    static buttonConfirmDelete() {///cia reikia sugalvot
        document.body.querySelector('.btn-delete').addEventListener('click', () => {
            const dataSetId = document.querySelector('.btn-delete').dataset.id;
            this.deleteTask(dataSetId);
            this.deleteActiveTask(dataSetId);
            this.deleteCompleteTask(dataSetId);
            document.body.querySelector('#popUpBox').style.display = 'none';
            delete document.querySelector('.btn-nodelete').dataset.id;
            this.taskCount();

        })
    }


    static moveTaskToOpen(id) { // Permeta taskus i Vykdoma lenta
        this.toDoList.forEach((task, index) => {
            if (task.id == id) {
                this.clearOpenTasks();
                this.activeList.push(task);
                //Kaip sukurti uzduotis naujam lange??                 
                this.taskCount();
                this.deleteTask(id);
                this.renderOpenTask();
            }

            this.taskCount();
        });
        // console.log('Open tasks', this.activeList);
        this.saveOpenTasks();
    }

    static moveTaskToCompleted(id) { // Permeta taskus i Atlikta lenta
        this.activeList.forEach((task, index) => {
            if (task.id == id) {
                this.clearCompletedTasks();
                this.completedList.push(task);
                //Kaip sukurti uzduotis naujam lange??                 
                this.taskCount();
                this.deleteActiveTask(id);
                this.renderCompletedTask();
            }

            this.taskCount();
        });
        console.log('Comleted tasks', this.completedList);
        this.saveCompletedTasks();
    }

    static fromCompletedToOpen(id) { // Permeta taskus is Atlikta i Vykdoma lenta
        this.completedList.forEach((task, index) => {
            if (task.id == id) {
                this.clearOpenTasks();
                this.activeList.push(task);
                this.deleteCompleteTask(id);
                this.taskCount();
                this.renderOpenTask();
            }

            this.taskCount();
        });
        console.log('Comleted tasks', this.completedList);
        this.saveCompletedTasks();
        this.saveOpenTasks();
    }

    static saveCreatedTask() {
        const createdTask = [];
        this.toDoList.forEach(task => {
            createdTask.push({
                task: task.task,
                id: task.id,
                tr: task.tr,

            })
        });

        // console.log('Seivas', createdTask);
        localStorage.setItem("Created", JSON.stringify(createdTask));
    };
    static saveOpenTasks() {

        const openTask = [];
        this.activeList.forEach(task => {
            openTask.push({
                task: task.task,
                id: task.id,
                tr: task.tr,

            })
        });
        // console.log('Seivas 2', openTask);
        localStorage.setItem("Open", JSON.stringify(openTask));
    };
    static saveCompletedTasks() {
        const completeTask = [];
        this.completedList.forEach(task => {
            completeTask.push({
                task: task.task,
                id: task.id,
                tr: task.tr,

            })
        });
        // console.log('Seivas 3', completeTask);
        localStorage.setItem("Completed", JSON.stringify(completeTask));

    }
    static load() {
        if (null === localStorage.getItem('Created')) {
            localStorage.setItem('Created', JSON.stringify([]));
        }
        if (null === localStorage.getItem('Open')) {
            localStorage.setItem('Open', JSON.stringify([]));
        }
        if (null === localStorage.getItem('Completed')) {
            localStorage.setItem('Completed', JSON.stringify([]));
        }

        const createdTasks = JSON.parse(localStorage.getItem("Created"));
        createdTasks.forEach(task => {
            this.createTask(task.task, task.id, task.tr);
        });

        const activeTasks = JSON.parse(localStorage.getItem("Open"));
        // console.log('Active',activeTasks);
        activeTasks.forEach(task => {
            this.loadTaskToActive(task.task, task.id, task.tr);
        });

        const completedTasks = JSON.parse(localStorage.getItem("Completed"));
        // console.log('Active',activeTasks);
        completedTasks.forEach(task => {
            this.loadTaskToComplete(task.task, task.id, task.tr);
        });


    };


    static start() {
        this.load();
        this.buttonCreate();
        this.renderTasks();
        this.renderOpenTask();
        this.renderCompletedTask();
        this.taskCount();
        this.buttonHideDeleteModal();
        this.buttonConfirmDelete();
        this.moveTaskToOpen();
        this.moveTaskToCompleted();


    }

    constructor(task, status) {
        this.task = task;
        this.status = status;
        this.createId();
    }

    render() { //Kuria elementus Sukurta lentoje
        this.createTaskElement();
        this.taskHtml();
        this.deleteButton();
        this.moveAction();
        this.moveActionBtn()

    }

    renderOpenTask() {// Kuria elementus Vykdoma lentoje
        this.createOpenTaskElement();
        this.taskHtml();// Naudoja bendra funkcija elementams sukurti
        this.deleteButton();
        this.moveToCompleted();
        this.moveToCompletedbtn();

    }
    renderCompletedTask() {// Kuria elementus Atlikta lentoje
        this.createCompletedTaskElement();
        this.taskHtml();// Naudoja bendra funkcija elementams sukurti
        this.deleteButton();
        this.moveToAction();
        this.moveToActionBtn();


    }

    createId() {
        this.id = Math.floor(Math.random() * 9000000) + 1000000;
    }

    createTaskElement() {
        this.tr = document.createElement('tr');
        const newTaskLine = document.querySelector('#newTaskTable');
        newTaskLine.appendChild(this.tr);
        
    }

    createOpenTaskElement() {
        this.tr = document.createElement('tr');
        const newTaskLine = document.querySelector('#openTaskTable');
        newTaskLine.appendChild(this.tr);
    }

    createCompletedTaskElement() {
        this.tr = document.createElement('tr');
        const newTaskLine = document.querySelector('#doneTaskTable');
        newTaskLine.appendChild(this.tr);
    }



    taskHtml() {

        const html = `
  
         <td data-id="${this.id}" class="taskName">${this.task}</td>
         <td  id="move" class="move"><button>Perkelti</button></td>
        <td class="delbtn"><button data-id="${this.id}" class="del"> Trinti</button></td>
        
                    
   `;
        this.tr.innerHTML = html;

    };

    deleteButton() { //kaip tai veikia?

        this.tr.querySelector('.del').addEventListener('click', () => {
            this.constructor.showDdeleteConfirmModal(this.id);
            console.log('del button', this.id)
        });

    }


    moveAction() {
        this.tr.querySelector(".taskName").addEventListener('dblclick', () => {
            this.constructor.moveTaskToOpen(this.id);
            console.log('qq');

        });

    };
    moveActionBtn() {
        this.tr.querySelector("#move").addEventListener('click', () => {
            this.constructor.moveTaskToOpen(this.id);
           

        })
    };


    moveToCompleted() {
        this.tr.querySelector('.taskName').addEventListener('dblclick', () => {
            this.constructor.moveTaskToCompleted(this.id);
           

        })

    };
    moveToCompletedbtn() {
        this.tr.querySelector('#move').addEventListener('click', () => {
            this.constructor.moveTaskToCompleted(this.id);
          

        })

    };



    moveToAction() {
        this.tr.querySelector('.taskName').addEventListener('dblclick', () => {
            this.constructor.fromCompletedToOpen(this.id);
            console.log('qq2');

        })

    };
    moveToActionBtn() {
        this.tr.querySelector('#move').addEventListener('click', () => {
            this.constructor.fromCompletedToOpen(this.id);
            console.log('qq2');

        })

    }




}


todo.start();

const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',
    loop: false,

    // If we need pagination
    pagination: {
        el: '.swiper-pagination',
    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    // And if we need scrollbar
    scrollbar: {
        el: '.swiper-scrollbar',
    },
    // Default parameters
    slidesPerView:1,
    spaceBetween: 0,
    // Responsive breakpoints
    breakpoints: {
        // when window width is >= 320px
        310: {
            slidesPerView: 1,
            spaceBetween: 0
        },
        // when window width is >= 480px
        480: {
            slidesPerView: 1,
            spaceBetween:0
        },
        // when window width is >= 640px
        640: {
            slidesPerView: 1,
            spaceBetween: 0
        },
        768:{
            slidesPerView: 3,
            spaceBetween: 10

        }
    }
});


    

