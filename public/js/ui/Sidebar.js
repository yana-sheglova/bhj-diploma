/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.initAuthLinks();
      this.initToggleButton();
    });
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
		let toggleBtn = document.querySelector('.sidebar-toggle');
		let body = document.body;

    if(toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        body.classList.toggle('sidebar-open');
        body.classList.toggle('sidebar-collapse');
      });
    } else {
      console.warn('Toggle button not found.');
    }
  };

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    let registerBtn = document.querySelector('.menu-item_register');
    let loginBtn = document.querySelector('.menu-item_login');
    let logoutBtn = document.querySelector('.menu-item_logout');

    if(registerBtn) {
      registerBtn.addEventListener('click', () => {
        const modal = App.getModal('register');
        if (modal) {
          modal.open();
        }
      });
    } else {
      console.warn('Register button not found.');
    }

    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        const modal = App.getModal('login');
        if (modal) {
          modal.open();
        }
      });
    } else {
      console.warn('Login button not found.');
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        User.logout().then(response => {
          if (response.success) {
            App.setState('init');
          }
        });
      });
    }
  }
}