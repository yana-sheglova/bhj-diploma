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
		return JSON.parse(localStorage.getItem('user' || 'undefined'))
	}

	/**
	 * Получает информацию о текущем
	 * авторизованном пользователе.
	 * */
	static fetch(callback) {
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
						this.setCurrent(response.user);
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
					this.setCurrent(response.user);
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
		createRequest({
			url: `${this.URL}/logout`,
			method: 'POST',
			callback: (err, response) => {
				if (err) {
					callback(err);
					return;
				}
				if (response && response.success) {
					this.unsetCurrent();
				}
				callback(null, response);
			}
		});
	}
};
