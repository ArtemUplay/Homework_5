interface ITask {
  id: string;
  name: string;
  info: string;
  isImportant: boolean;
  isCompleted: boolean;
}

type TaskForCreate = Omit<ITask, 'id'>;
type TaskForUpdate = Partial<ITask>;

const checkFetchResponse = <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    return Promise.reject(`Произошла ошибка со статусом ${response.status}`);
  }

  return response.json();
};

const checkXHRResponse = <T>(status: number, response: string): T => {
  if (!(status >= 200 && status < 300)) {
    throw new Error(`Произошла ошибка со статусом ${status}`);
  }

  return JSON.parse(response);
};

class BasicAgent {
  constructor(private _baseUrl: string) {}

  async sendRequestByFetch<T>(url: string, config?: RequestInit): Promise<T> {
    const response = await fetch(`${this._baseUrl}${url}`, config);
    const data = await checkFetchResponse<T>(response);

    return data;
  }

  async sendRequestByXHR<T>(url: string, config?: RequestInit): Promise<T> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const method = config && config.method;
      const body = config && config.body;

      xhr.open(method || 'GET', `${this._baseUrl}${url}`);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = () => {
        try {
          const result = checkXHRResponse<T>(xhr.status, xhr.response);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      xhr.onerror = () => reject(new Error('Произошла ошибка'));

      if (body) {
        xhr.send(body as XMLHttpRequestBodyInit);
      } else {
        xhr.send();
      }
    });
  }
}

class FetchAgent extends BasicAgent {
  constructor(_baseUrl: string) {
    super(_baseUrl);
  }

  async getTask(taskId: number): Promise<ITask | null> {
    try {
      const task = await this.sendRequestByFetch<ITask>(`/tasks/${taskId}`);

      return task;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getTasks(): Promise<ITask[] | null> {
    try {
      const tasks = await this.sendRequestByFetch<ITask[]>(`/tasks`);

      return tasks;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async createTask(task: TaskForCreate): Promise<ITask | null> {
    try {
      const createdTask = await this.sendRequestByFetch<ITask>(`/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });

      return createdTask;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async updateTask(taskId: number, task: TaskForUpdate): Promise<ITask | null> {
    try {
      const updatedTask = await this.sendRequestByFetch<ITask>(`/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });

      return updatedTask;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deleteTask(taskId: number): Promise<boolean> {
    try {
      await this.sendRequestByFetch<ITask>(`/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

const fetchAgent = new FetchAgent('http://37.220.80.108');

// GET запрос таски по указаному id
fetchAgent.getTask(164).then((task) => {
  console.log(task);
});

// GET запрос всех тасок
fetchAgent.getTasks().then((tasks) => {
  console.log(tasks);
});

// POST запрос для создания таски
fetchAgent
  .createTask({
    name: 'hello',
    info: 'helloworld',
    isImportant: false,
    isCompleted: false,
  })
  .then((task) => console.log(task));

// PATCH запрос для обновления таски
fetchAgent.updateTask(164, { name: 'value123' }).then((updatedTask) => console.log(updatedTask));

// DELETE запрос для обновления таски
fetchAgent.deleteTask(164).then((deletedTask) => {
  console.log(deletedTask);
});

class XHRAgent extends BasicAgent {
  constructor(_baseUrl: string) {
    super(_baseUrl);
  }

  async getTask(taskId: number): Promise<ITask | null> {
    const task = await this.sendRequestByXHR<ITask>(`/tasks/${taskId}`, {
      method: 'GET',
    });

    return task;
  }

  async getTasks(): Promise<ITask[] | null> {
    try {
      const tasks = await this.sendRequestByXHR<ITask[]>(`/tasks`);

      return tasks;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async createTask(task: TaskForCreate): Promise<ITask | null> {
    try {
      const createdTask = await this.sendRequestByXHR<ITask>(`/tasks`, {
        method: 'POST',
        body: JSON.stringify(task),
      });

      return createdTask;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async updateTask(taskId: number, task: TaskForUpdate): Promise<ITask | null> {
    try {
      const updatedTask = await this.sendRequestByXHR<ITask>(`/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify(task),
      });

      return updatedTask;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deleteTask(taskId: number): Promise<boolean> {
    try {
      await this.sendRequestByXHR<ITask>(`/tasks/${taskId}`, {
        method: 'DELETE',
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

const xhrAgent = new XHRAgent('http://37.220.80.108');

// GET - запрос на получение таски
xhrAgent.getTask(1).then((task) => console.log(task));

// GET - запрос на получение тасок
xhrAgent.getTasks().then((tasks) => console.log(tasks));

// POST - запрос на создание таски
xhrAgent
  .createTask({ name: 'hi1', info: 'nothing', isImportant: true, isCompleted: false })
  .then((task) => console.log(task));

// PATCH - запрос на обновление таски
xhrAgent
  .updateTask(178, {
    name: 'приветик',
  })
  .then((task) => console.log(task));

// DELETE - запрос на удаление таски
xhrAgent.deleteTask(178).then((task) => console.log(task));

// Контроллер
class Task {
  private _service: FetchAgent | XHRAgent;

  constructor(private _baseUrl: string) {
    this._service = 'fetch' in window ? new FetchAgent(this._baseUrl) : new XHRAgent(this._baseUrl);
  }

  async getTask(taskId: number): Promise<ITask | null> {
    const response = await this._service.getTask(taskId);
    return response;
  }

  async getAllTask(): Promise<ITask[] | null> {
    const response = await this._service.getTasks();
    return response;
  }

  async createTask(task: TaskForCreate): Promise<ITask | null> {
    const response = await this._service.createTask(task);
    return response;
  }

  async updateTask(taskId: number, updatedTask: TaskForUpdate): Promise<ITask | null> {
    const response = await this._service.updateTask(taskId, updatedTask);
    return response;
  }

  async deleteTask(taskId: number): Promise<boolean> {
    const response = await this._service.deleteTask(taskId);
    return response;
  }
}

const task = new Task('http://37.220.80.108');

// Получение всех тасок
task.getAllTask().then((data) => {
  console.log(data);
});

// Получение таски по id
task.getTask(167).then((data) => {
  console.log(data);
});

// Создание таски
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

// Обновление таски
task
  .updateTask(167, {
    name: 'Hello',
    info: 'hello123',
  })
  .then((updatedTask) => {
    console.log(updatedTask);
  });

// Удаление таски
task.deleteTask(167).then((deletedTask) => {
  console.log(deletedTask);
});
