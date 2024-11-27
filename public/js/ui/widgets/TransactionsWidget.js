/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (!element) {
      throw new Error('Элемент не существует');
    }
    this.element = element;
    this.registerEvents();
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    const createIncomeBtn = this.element.querySelector('.create-income-button');
    const createExpenseBtn = this.element.querySelector('.create-expense-button');

    if (!createIncomeBtn) {
      throw new Error('Кнопка "Новый доход" не найдена');
    }
    if (!createExpenseBtn) {
      throw new Error('Кнопка "Новый расход" не найдена');
    }

    createIncomeBtn.addEventListener('click', () => {
      const incomeModal = App.getModal('newIncome');
      incomeModal.open();
    });

    createExpenseBtn.addEventListener('click', () => {
      const expenseModal = App.getModal('newExpense');
      expenseModal.open();
    });
  }
}
