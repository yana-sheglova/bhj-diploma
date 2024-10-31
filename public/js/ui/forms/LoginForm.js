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
    User.login(data, (err, response) => {
      console.log('err=', err);
      console.log('response=', response);

      if (response && response.success) {
        App.setState('user-logged');
        App.getModal('login').close();
      } else {
        this.element.reset();
        console.log('err=', err);
      }
    });
  }
}