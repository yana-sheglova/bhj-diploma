/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list(null, (err, response) => {
      if (err) {
        console.error('Ошибка при получении списка счетов:', err);
        return;
      }
      if (response && response.success) {
        const accountSelect = this.element.querySelector('.accounts-select');
        if (accountSelect) {
          accountSelect.innerHTML = '';

          response.data.forEach(account => {
            const option = document.createElement('option');
            option.value = account.id;
            option.textContent = account.name;
            accountSelect.appendChild(option);
          });
        } else {
          console.error('Элемент .accounts-select не найден');
        }
      } else {
        console.error('Ошибка получения списка счетов:', response.error || 'Неизвестная ошибка');
      }
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return; 
        }

        if (response) {
            if (response.success) {
                this.element.reset();

                const modalId = this.element.closest('.modal').dataset.modalId;
                console.log('Идентификатор модального окна:', modalId); 
                const modal = App.getModal(modalId);
                
                if (modal) {
                  modal.close();
                } else {
                  console.error('Модальное окно не найдено для ID:', modalId);
                }

                App.update(); 
            } else {
              console.error('Ошибка создания транзакции:', response.error || 'Неизвестная ошибка');
            }
        } else {
          console.error('Ошибка: не был получен ответ от сервера. Ответ равен null или undefined.');
        }
    });
  }
}