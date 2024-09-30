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
    Account.list(null, (response) => {
      if (response && response.success) {
        let accountSelect = this.element.querySelector('.accounts-select');
        accountSelect.innerHTML = '';

        response.data.forEach(account => {
          let option = document.createElement('option');
          option.value = account.id;
          option.textContent = account.name;
          accountSelect.appendChild(option);
        });
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
    Transaction.create(data, (response) => {
      if (esponse && response.success) {
        this.element.reset();
        let modal = App.getModal(this.element.dataset.modalId);
        modal.close();
        App.update();
      }
    });
  }
}