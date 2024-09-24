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
    this.initAuthLinks();
    this.initToggleButton();
  };

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
		document.addEventListener('DOMContentLoaded', function() {
				let toggleBtn = document.querySelector('.sidebar-toggle');
				let body = document.body;

				toggleBtn.addEventListener('click', function(e) {
					e.preventDefault();
					body.classList.toggle('sidebar-open');
					body.classList.toggle('sidebar-collapse');
				});
			});
    };
	};

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    document.addEventListener('DOMContentLoaded', function() {
      let registerBtn = document.querySelector('.menu-item_register');
      let loginBtn = document.querySelector('.menu-item_login');
      let logoutBtn = document.querySelector('.menu-item_logout');

      if(registerBtn) {
        registerBtn.addEventListener('click', function() {
          const modal = App.getModal('modal-register');
          if (modal) {
            modal.open();
          }
        })
      }

      if (loginBtn) {
        loginBtn.addEventListener('click', function() {
          const modal = App.getModal('modal-login');
          if (modal) {
            modal.open();
          }
        })
      }

      if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
          User.logout().then(response => {
            if (response.succes) {
              App.setState('init');
            }
          });
        });
      }
    });
  }
};