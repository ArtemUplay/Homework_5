"use strict";
const websiteUrl = 'https://intership-liga.ru/tasks';
function api(url, config, id = '') {
    return fetch(`${url}/${id}`, config)
        .then((response) => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    })
        .catch((error) => {
        throw error;
    });
}
api(websiteUrl, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    .then((data) => {
    console.log(data);
})
    .catch((error) => {
    console.log(error);
});
api(websiteUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Антон', info: 'something', isImportant: true, isCompleted: false }),
})
    .then((data) => {
    console.log(data);
})
    .catch((error) => {
    console.log(error);
});
api(websiteUrl, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Кирилл', isImportant: true }),
}, 761)
    .then((data) => {
    console.log(data);
})
    .catch((error) => {
    console.log(error);
});
api(websiteUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Олег', info: 'something', isImportant: false, isCompleted: false, id: 123 }),
}, 763)
    .then((data) => {
    console.log(data);
})
    .catch((error) => {
    console.log(error);
});
api(websiteUrl, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
}, 765)
    .then((data) => {
    console.log(data);
})
    .catch((error) => {
    console.log(error);
});
//# sourceMappingURL=index.js.map