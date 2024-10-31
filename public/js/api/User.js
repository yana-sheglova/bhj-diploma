/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {
	static URL = '/user';
	/**
	 * Устанавливает текущего пользователя в
	 * локальном хранилище.
	 * */
	static setCurrent(user) {
		localStorage.setItem('user', JSON.stringify(user));
		console.log(localStorage.getItem('user'));
	};

	/**
	 * Удаляет информацию об авторизованном
	 * пользователе из локального хранилища.
	 * */
	static unsetCurrent() {
		localStorage.removeItem('user');
	};

	/**
	 * Возвращает текущего авторизованного пользователя
	 * из локального хранилища
	 * */
	static current() {
		return JSON.parse(localStorage.getItem('user')) || null;
	}

	/**
	 * Получает информацию о текущем
	 * авторизованном пользователе.
	 * */
	static fetch(callback) {
		if (typeof callback !== 'function') {
			console.error('callback is not a function');
			return;
		}
		createRequest({
			url: `${this.URL}/current`,
			method: 'GET',
			callback: (err, response) => {
				if (err) {
					callback(err);
					return;
				}
				if (response && response.success) {
					this.setCurrent(response.user);
				} else {
					this.unsetCurrent();
				}
				callback(null, response);
			}
		});
	}

	/**
	 * Производит попытку авторизации.
	 * После успешной авторизации необходимо
	 * сохранить пользователя через метод
	 * User.setCurrent.
	 * */
	static login(data, callback) {
		if (typeof callback !== 'function') {
			console.error('callback is not a function');
			return;
		}
		createRequest({
			url: `${this.URL}/login`,
			method: 'POST',
			data,
			callback: (err, response) => {
				if (err) {
					callback(err);
					return;
				}
				try {
					if (response && response.user) {
						User.setCurrent(response.user);
					}
					callback(null, response);
				} catch (error) {
					callback(new Error(`Ошибка установки текущего пользователя: ${error.message}`));
				}
			}
		});
	}

	/**
	 * Производит попытку регистрации пользователя.
	 * После успешной авторизации необходимо
	 * сохранить пользователя через метод
	 * User.setCurrent.
	 * */
	static register(data, callback) {
		if (typeof callback !== 'function') {
			console.error('callback is not a function');
			return;
		}
		createRequest({
			url: `${this.URL}/register`,
			data,
			method: 'POST',
			callback: (err, response) => {
				if (err) {
					callback(err);
					return;
				}
				if (response.success) {
					User.setCurrent(response.user);
				}
				callback(null, response);
			}
		});
	};

	/**
	 * Производит выход из приложения. После успешного
	 * выхода необходимо вызвать метод User.unsetCurrent
	 * */
	static logout(callback) {
		return new Promise((resolve, reject) => {
			createRequest({
				url: `${this.URL}/logout`,
				method: 'POST',
				callback: (err, response) => {
					if (err) {
						reject(err);
						return;
					}
					if (response && response.success) {
						User.unsetCurrent();
					}
					resolve(response);
				}
			});
		});
	}
};
