/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit(data) {
    Account.create(data, (response) => {
      if (response && response.success) {
        this.close();
        App.update();
        this.element.reset();
      } else {
        console.error('Ошибка создания счёта:', response.error);
      }
    });
  }
}