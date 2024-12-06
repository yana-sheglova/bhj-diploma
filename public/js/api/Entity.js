/**
 * Класс Entity - базовый для взаимодействия с сервером.
 * Имеет свойство URL, равно пустой строке.
 * */
class Entity {
	static URL = '';
	/**
	 * Запрашивает с сервера список данных.
	 * Это могут быть счета или доходы/расходы
	 * (в зависимости от того, что наследуется от Entity)
	 * */
	static list(accountId, callback) {
		createRequest({
			url: this.URL,
			data: { account_id: accountId },
			method: 'GET',
			callback: (err, response) => {
				callback ? callback(err, response) : null;
			}
		});
	};

	/**
	 * Создаёт счёт или доход/расход с помощью запроса
	 * на сервер. (в зависимости от того,
	 * что наследуется от Entity)
	 * */
	static create(data, callback) {
		createRequest({
			url: this.URL,
			data: data,
			method: 'PUT',
			callback: (err, response) => {
				callback ? callback(err, response) : null;
			}
		});
	};

	/**
	 * Удаляет информацию о счёте или доходе/расходе
	 * (в зависимости от того, что наследуется от Entity)
	 * */
	static remove(data, callback) {
		createRequest({
			url: this.URL,
			method: 'DELETE',
			data: data,
			callback: (err, response) => {
				if (err) {
				    console.error('Ошибка при удалении:', err);
                    callback(err, null); 
                    return;
				}
				if (response && response.success) {
					callback(null, response);
				} else {
					const errorMessage = response && response.error ? response.error : 'Неизвестная ошибка';
                    console.error('Ошибка при удалении:', errorMessage);
                    callback(new Error(errorMessage), null);
				}
			}
		});
	};
};