"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const checkFetchResponse = (response) => {
    if (!response.ok) {
        return Promise.reject(`Произошла ошибка со статусом ${response.status}`);
    }
    return response.json();
};
const checkXHRResponse = (status, response) => {
    if (!(status >= 200 && status < 300)) {
        throw new Error(`Произошла ошибка со статусом ${status}`);
    }
    return JSON.parse(response);
};
class BasicAgent {
    constructor(_baseUrl) {
        this._baseUrl = _baseUrl;
    }
    sendRequestByFetch(url, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this._baseUrl}${url}`, config);
            const data = yield checkFetchResponse(response);
            return data;
        });
    }
    sendRequestByXHR(url, config) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                const method = config && config.method;
                const body = config && config.body;
                xhr.open(method || 'GET', `${this._baseUrl}${url}`);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.onload = () => {
                    try {
                        const result = checkXHRResponse(xhr.status, xhr.response);
                        resolve(result);
                    }
                    catch (error) {
                        reject(error);
                    }
                };
                xhr.onerror = () => reject(new Error('Произошла ошибка'));
                if (body) {
                    xhr.send(body);
                }
                else {
                    xhr.send();
                }
            });
        });
    }
}
class FetchAgent extends BasicAgent {
    constructor(_baseUrl) {
        super(_baseUrl);
    }
    getTask(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const task = yield this.sendRequestByFetch(`/tasks/${taskId}`);
                return task;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    getTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tasks = yield this.sendRequestByFetch(`/tasks`);
                return tasks;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    createTask(task) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdTask = yield this.sendRequestByFetch(`/tasks`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(task),
                });
                return createdTask;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    updateTask(taskId, task) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedTask = yield this.sendRequestByFetch(`/tasks/${taskId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(task),
                });
                return updatedTask;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    deleteTask(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.sendRequestByFetch(`/tasks/${taskId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                return true;
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
}
const fetchAgent = new FetchAgent('http://37.220.80.108');
fetchAgent.getTask(164).then((task) => {
    console.log(task);
});
fetchAgent.getTasks().then((tasks) => {
    console.log(tasks);
});
fetchAgent
    .createTask({
    name: 'hello',
    info: 'helloworld',
    isImportant: false,
    isCompleted: false,
})
    .then((task) => console.log(task));
fetchAgent.updateTask(164, { name: 'value123' }).then((updatedTask) => console.log(updatedTask));
fetchAgent.deleteTask(164).then((deletedTask) => {
    console.log(deletedTask);
});
class XHRAgent extends BasicAgent {
    constructor(_baseUrl) {
        super(_baseUrl);
    }
    getTask(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.sendRequestByXHR(`/tasks/${taskId}`, {
                method: 'GET',
            });
            return task;
        });
    }
    getTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tasks = yield this.sendRequestByXHR(`/tasks`);
                return tasks;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    createTask(task) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdTask = yield this.sendRequestByXHR(`/tasks`, {
                    method: 'POST',
                    body: JSON.stringify(task),
                });
                return createdTask;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    updateTask(taskId, task) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedTask = yield this.sendRequestByXHR(`/tasks/${taskId}`, {
                    method: 'PATCH',
                    body: JSON.stringify(task),
                });
                return updatedTask;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    deleteTask(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.sendRequestByXHR(`/tasks/${taskId}`, {
                    method: 'DELETE',
                });
                return true;
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
}
const xhrAgent = new XHRAgent('http://37.220.80.108');
xhrAgent.getTask(1).then((task) => console.log(task));
xhrAgent.getTasks().then((tasks) => console.log(tasks));
xhrAgent
    .createTask({ name: 'hi1', info: 'nothing', isImportant: true, isCompleted: false })
    .then((task) => console.log(task));
xhrAgent
    .updateTask(178, {
    name: 'приветик',
})
    .then((task) => console.log(task));
xhrAgent.deleteTask(178).then((task) => console.log(task));
class Task {
    constructor(_baseUrl) {
        this._baseUrl = _baseUrl;
        this._service = 'fetch' in window ? new FetchAgent(this._baseUrl) : new XHRAgent(this._baseUrl);
    }
    getTask(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._service.getTask(taskId);
            return response;
        });
    }
    getAllTask() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._service.getTasks();
            return response;
        });
    }
    createTask(task) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._service.createTask(task);
            return response;
        });
    }
    updateTask(taskId, updatedTask) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._service.updateTask(taskId, updatedTask);
            return response;
        });
    }
    deleteTask(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._service.deleteTask(taskId);
            return response;
        });
    }
}
const task = new Task('http://37.220.80.108');
task.getAllTask().then((data) => {
    console.log(data);
});
task.getTask(167).then((data) => {
    console.log(data);
});
task
    .createTask({
    name: 'Артем',
    info: 'Хочу устроиться на работу в лигу',
    isImportant: true,
    isCompleted: false,
})
    .then((task) => {
    console.log(task);
});
task
    .updateTask(167, {
    name: 'Hello',
    info: 'hello123',
})
    .then((updatedTask) => {
    console.log(updatedTask);
});
task.deleteTask(167).then((deletedTask) => {
    console.log(deletedTask);
});
//# sourceMappingURL=index.js.map