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
		this.registerEvents();
	}

	/**
	 * Вызывает метод render для отрисовки страницы
	 * */
	update() {
		if (this.lastOptions) {
			this.render(this.lastOptions);
		}
	}

	/**
	 * Отслеживает нажатие на кнопку удаления транзакции
	 * и удаления самого счёта. Внутри обработчика пользуйтесь
	 * методами TransactionsPage.removeTransaction и
	 * TransactionsPage.removeAccount соответственно
	 * */
	registerEvents() {
		let removeAccountBtn = this.element.querySelector('.remove-account');
		let transactionRemoveBtn = this.element.querySelector('.transaction__remove');

		removeAccountBtn.addEventListener('click', () => {
			this.removeAccount();
		});

		this.element.addEventListener('click', (event) => {
			if (event.target.classList.contains('transaction__remove')) {
				let transactionId = event.target.dataset.id;
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
			Accoun.remove(this.lastOptions.account_id, (response) => {
				if (response.success) {
					this.clear();
					App.updateWidgets();
					App.updateForms();
				} else {
					console.error('Ошибка при удалении счёта:', response.error);
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
	removeTransaction(id) {
		if (confirm("Вы действительно хотите удалить эту транзакцию?")) {
			Transaction.remove(id, (response) => {
				if (response.success) {
					this.update();
				} else {
					console.error('Ошибка при удалении транзакции:', response.error);
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

		Account.get(this.lastOptions.account_id, (account) => {
			if (account) {
				this.renderTitle(account.name);

				Transaction.list(this.lastOptions.account_id, (transactions) => {
					this.renderTransactions(transactions);
				});
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
	renderTitle(name) {
		let titleElement = this.element.querySelector('.content-title');
		titleElement.textContent = name;
	}

	/**
	 * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
	 * в формат «10 марта 2019 г. в 03:20»
	 * */
	formatDate(date) {
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
		const type = item.type.toLowerCase();
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
		let contentElement = this.element.querySelector('.content');

		if (data.lenght === 0) {
			contentElement.innerHTML = '<p>Нет транзакций для отображения.</p>';
			return
		}
		contentElement.innerHTML = data.map(item => this.getTransactionHTML(item).join(''));
	}
}