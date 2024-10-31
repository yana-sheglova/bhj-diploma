/**
 * Основная функция для совершения запросов
 * на сервер.
 * */

const createRequest = (options = {}) => {
	const xhr = new XMLHttpRequest();
  
	xhr.responseType = 'json';
  
	const { url, data, method, callback } = options;
  
	if (method === 'GET') {
	  xhr.open(method, url + getQueryString(data));
	  xhr.send();
	} else {
	  const formData = new FormData();
	  for (const key in data) {
		formData.append(key, data[key]);
	  }
	  xhr.open(method, url);
	  xhr.send(formData);
	}
  
	xhr.onload = () => {
	  if (xhr.status >= 200 && xhr.status < 300) {
		callback(null, xhr.response);
	  } else {
		callback(new Error(xhr.statusText), null);
	  }
	};
  
	xhr.onerror = () => {
	  callback(new Error('Ошибка сети'), null);
	};
  };
  
  const getQueryString = (data) => {
	if (!data) {
	  return '';
	}
  
	return '?' + Object.keys(data)
	  .map(key => key + '=' + encodeURIComponent(data[key]))
	  .join('&');
  };