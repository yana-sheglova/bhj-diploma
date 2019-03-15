class LoginForm extends AsyncForm {
  onSubmit( options ) {
    User.login( options.data, ( err, response ) => {
      if ( !response.success ) {
        return;
      }

      this.element.reset();

      App.setState( 'user-logged' );

      const modal = new Modal( this.element.closest( '.modal' ));
      modal.close().unregisterEvents();
    });
  }
}