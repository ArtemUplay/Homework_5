const websiteUrl = 'https://intership-liga.ru/tasks';
interface Data {
  name?: string;
  info?: string;
  isImportant?: boolean;
  isCompleted?: boolean;
  id?: number;
}

interface Config {
  method: string;
  headers: {
    'Content-Type': 'application/json';
  };
  body?: string;
}

function api<T>(url: string, config: Config, id: number | string = ''): Promise<T> {
  return fetch(`${url}/${id}`, config)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    })
    .catch((error: Error) => {
      throw error;
    });
}

// GET - запрос
api<Data[]>(websiteUrl, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
  .then((data): void => {
    console.log(data);
  })
  .catch((error): void => {
    console.log(error);
  });

//POST - запрос
api<Data>(websiteUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Антон', info: 'something', isImportant: true, isCompleted: false }),
})
  .then((data): void => {
    console.log(data);
  })
  .catch((error): void => {
    console.log(error);
  });

//PATCH - запрос
api<Data>(
  websiteUrl,
  {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Кирилл', isImportant: true }),
  },
  761
)
  .then((data): void => {
    console.log(data);
  })
  .catch((error): void => {
    console.log(error);
  });

//PUT - запрос
api<Data>(
  websiteUrl,
  {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Олег', info: 'something', isImportant: false, isCompleted: false, id: 123 }),
  },
  763
)
  .then((data): void => {
    console.log(data);
  })
  .catch((error): void => {
    console.log(error);
  });

//PUT - запрос
api<Data>(
  websiteUrl,
  {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  },
  765
)
  .then((data): void => {
    console.log(data);
  })
  .catch((error): void => {
    console.log(error);
  });
