/**
 * Основная функция для совершения запросов
 * на сервер.
 * */

const createRequest = (options = {}) => {
	const xhr = new XMLHttpRequest();
	xhr.responseType = 'json';
  
	const { url, data, method, callback } = options;
	console.log(`Отправляем ${method} запрос на ${url} с данными:`, data);
  
	if (method.toUpperCase() === 'GET') {
		const params = new URLSearchParams(data).toString();
	    xhr.open(method, `${url}?${params}`);
	    xhr.send();
	} else {
	    const formData = new FormData();
	    for (const key in options.data) {
		    formData.append(key, (options.data)[key]);
	    }
	    xhr.open(options.method, options.url);
	    xhr.send(formData); 
	}
  
	xhr.onload = () => {
	  if (xhr.status >= 200 && xhr.status < 300) {
		    callback(null, xhr.response);
	  } else {
		    callback(new Error(`Ошибка: ${xhr.status}`), null);
	  }
	};
  
	xhr.onerror = () => {
	    callback(new Error('Ошибка сети'), null);
	};
};