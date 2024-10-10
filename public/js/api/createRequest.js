/**
 * Основная функция для совершения запросов
 * на сервер.
 * */

function createRequest({
	url,
	data = {},
	method = 'GET',
	callback
}) {
	if (!url) {
		return callback(new Error('URL не указан'));
	}
	const xhr = new XMLHttpRequest();

	if (method === 'GET' && data) {
		const params = new URLSearchParams(data).toString();
		url += '?' + params;
	}

	xhr.open(method, url);
	xhr.responseType = 'json';

	xhr.onload = () => {
		if (xhr.status >= 200 && xhr.status < 300) {
			callback(null, xhr.response)
		} else {
			callback(new Error(`Ошибка: ${xhr.statusText}`));
			console.log(xhr.statusText);
		}
	};

	xhr.onerror = () => {
		callback(new Error('Сетевое/другое соединение не сработало'));
		console.log(xhr.statusText);
	};

	if (method !== 'GET' && data) {
		const formData = new FormData();
		for (let key in data) {
			if (data.hasOwnProperty(key)) {
				formData.append(key, data[key]);
			}
		};
		xhr.send(formData);
	} else {
		xhr.send();
	}
};