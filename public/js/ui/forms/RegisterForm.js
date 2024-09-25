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
      if(err) {
        console.error(err);
        alert('Ошибка регистрации! Попробуйте снова.');
      } else {
        this.reset();
        App.setState('user-logged');
        Modal.close();
      }
    });
  }
}