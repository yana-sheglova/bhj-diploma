/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    User.register(data, (err, response) => {
      console.log('err=', err);
      console.log('response=', response);

      if(response && response.success) {
        App.setState('user-logged');
        App.getModal('login').close();
        this.element.reset();
      } else {
        this.element.reset();
        console.log('err=', err);
      }
    });
  }
}