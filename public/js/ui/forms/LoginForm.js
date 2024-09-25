/**
 * Класс LoginForm управляет формой
 * входа в портал
 * */
class LoginForm extends AsyncForm {
  /**
   * Производит авторизацию с помощью User.login
   * После успешной авторизации, сбрасывает форму,
   * устанавливает состояние App.setState( 'user-logged' ) и
   * закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    User.login(data, (response) => {
      if (response && response.success) {
        this.reset();
        App.setState('user-logged');
        Modal.close();
      } else {
        console.error(response.error);
        alert('Ошибка авторизации! Попробуйте снова.');
      }
    });
  }
}