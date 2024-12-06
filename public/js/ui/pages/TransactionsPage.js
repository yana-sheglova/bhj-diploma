/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
	/**
	 * Если переданный элемент не существует,
	 * необходимо выкинуть ошибку.
	 * Сохраняет переданный элемент и регистрирует события
	 * через registerEvents()
	 * */
	constructor(element) {
		if (!element) {
			throw new Error('Элемент не существует');
		}
		this.element = element;
		this.lastOptions = null;
		this.registerEvents();
	}

	/**
	 * Вызывает метод render для отрисовки страницы
	 * */
	update() {
		if (this.lastOptions) {
			this.render(this.lastOptions);
		} else {
			console.warn('Метод render() не был вызван ранее с опциями.');
		}
	}

	/**
	 * Отслеживает нажатие на кнопку удаления транзакции
	 * и удаления самого счёта. Внутри обработчика пользуйтесь
	 * методами TransactionsPage.removeTransaction и
	 * TransactionsPage.removeAccount соответственно
	 * */
	registerEvents() {
		const removeAccountBtn = this.element.querySelector('.remove-account');
		if (removeAccountBtn) {
			removeAccountBtn.addEventListener('click', () => {
				this.removeAccount();
			});
		}

		this.element.addEventListener('click', (event) => {
			if (event.target.classList.contains('transaction__remove')) {
				const transactionId = event.target.dataset.id;
				this.removeTransaction(transactionId);
			}
		});
	}

	/**
	 * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
	 * Если пользователь согласен удалить счёт, вызовите
	 * Account.remove, а также TransactionsPage.clear с
	 * пустыми данными для того, чтобы очистить страницу.
	 * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
	 * либо обновляйте только виджет со счетами и формы создания дохода и расхода
	 * для обновления приложения
	 * */
	removeAccount() {
		if (!this.lastOptions) return;

		if (confirm("Вы действительно хотите удалить счёт?")) {
			const accountId = this.lastOptions.account_id;
			console.log('Попытка удалить счёт с ID:', accountId);
			
			Account.remove({ account_id: accountId }, (err, response) => {
				if (err) {
					console.error('Ошибка при удалении счёта:', err);
                    alert('Не удалось удалить счёт: ' + (err.message || err.toString()));
                    return;
				}
				if (response.success) {
					App.updateWidgets();
					App.updateForms();
					TransactionsPage.clear();
					this.clear();
				} else {
					const errorMessage = response && response.error ? response.error : 'Неизвестная ошибка';
                    console.error('Ошибка при удалении счёта:', errorMessage);
                    alert('Не удалось удалить счёт: ' + errorMessage);
				}
			});
		}
	}

	/**
	 * Удаляет транзакцию (доход или расход). Требует
	 * подтверждеия действия (с помощью confirm()).
	 * По удалению транзакции вызовите метод App.update(),
	 * либо обновляйте текущую страницу (метод update) и виджет со счетами
	 * */
	removeTransaction(transactionId) {
		if (confirm("Вы действительно хотите удалить эту транзакцию?")) {
			Transaction.remove({ transaction_id: transactionId }, (err, response) => {
				if (err) {
					console.error('Ошибка при удалении транзакции:', err);
                    alert('Не удалось удалить транзакцию: ' + err.message);
                    return;
				}
				if (response && response.success) {
					this.update();
					App.updateWidgets();
				} else {
					console.error('Ошибка при удалении транзакции:', response.error);
					alert('Не удалось удалить транзакцию: ' + response.error);
				}
			});
		}
	}

	/**
	 * С помощью Account.get() получает название счёта и отображает
	 * его через TransactionsPage.renderTitle.
	 * Получает список Transaction.list и полученные данные передаёт
	 * в TransactionsPage.renderTransactions()
	 * */
	render(options) {
		if (!options) return;
		this.lastOptions = options;

		Account.get(options.account_id, (err, account) => {
			if (err) {
				console.error('Ошибка при получении счета:', err);
                alert('Не удалось получить данные счета: ' + err.message);
                return;
			}
			if (account) {
				this.renderTitle(account);

				Transaction.list(options.account_id, (err, transactions) => {
					if (err) {
						console.error('Ошибка при получении транзакций:', err);
                        alert('Не удалось получить данные транзакций: ' + err.message);
                        return;
					}
					console.log('Полученные транзакции:', transactions);
					this.renderTransactions(transactions);
				});
			} else {
				console.error('Счет не найден.');
                alert('Не удается найти счет.');
			}
		});
	}

	/**
	 * Очищает страницу. Вызывает
	 * TransactionsPage.renderTransactions() с пустым массивом.
	 * Устанавливает заголовок: «Название счёта»
	 * */
	clear() {
		this.renderTransactions([]);
		this.renderTitle("Название счёта");
		this.lastOptions = null;
	}

	/**
	 * Устанавливает заголовок в элемент .content-title
	 * */
	renderTitle(account) {
		const titleElement = this.element.querySelector('.content-title');
		const descriptionElement = this.element.querySelector('.content-description');

		if (titleElement) {
			titleElement.textContent = account.data.name;
		} else {
			console.error("Элемент '.content-title' не найден.");
		}

		if(descriptionElement) {
			descriptionElement.textContent = 'Счёт';
		}
		console.log(account.data.name);
	}

	/**
	 * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
	 * в формат «10 марта 2019 г. в 03:20»
	 * */
	formatDate(date) {
		if(!date) return '';
		const options = {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		};

		let formattedDate = new Date(date).toLocaleString('ru-RU', options).replace(',', '');

		return formattedDate;
	}

	/**
	 * Формирует HTML-код транзакции (дохода или расхода).
	 * item - объект с информацией о транзакции
	 * */
	getTransactionHTML(item) {
		const type = item.type;
		const transactionClass = type === 'expense' ? 'transaction_expense' : 'transaction_income';
		const formattedDate = this.formatDate(item.created_at);

		return `
      <div class="transaction ${transactionClass} row">
          <div class="col-md-7 transaction__details">
              <div class="transaction__icon">
                  <span class="fa fa-money fa-2x"></span>
              </div>
              <div class="transaction__info">
                  <h4 class="transaction__title">${item.name}</h4>
                  <div class="transaction__date">${formattedDate}</div>
              </div>
          </div>
          <div class="col-md-3">
              <div class="transaction__summ">
                  ${item.sum} <span class="currency">₽</span>
              </div>
          </div>
          <div class="col-md-2 transaction__controls">
              <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                  <i class="fa fa-trash"></i>  
              </button>
          </div>
      </div>
    `;
	}

	/**
	 * Отрисовывает список транзакций на странице
	 * используя getTransactionHTML
	 * */
	renderTransactions(data) {
		const contentElement = this.element.querySelector('.content');

		if (!data || !Array.isArray(data.data) || data.data.length === 0) {
			contentElement.innerHTML = '<p>Нет транзакций для отображения.</p>';
			return
		}
		const transactionsHTML = data.data.map(item => this.getTransactionHTML(item));
		contentElement.innerHTML = transactionsHTML.join('');
	}
}