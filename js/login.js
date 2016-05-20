$(document).ready(function() {
  $('.login').click(function(event) {
    event.preventDefault();
    ref.authWithOAuthPopup(this.id, function(error, authData) {
      if (error) {
        console.log("Fallo en el login!", error);
      } else {
        refUser = authData.uid;
        ref.once("value", function(snapshot) {
          if (!snapshot.child(refUser).exists()) {
            if (authData.provider == "google") jsonToFire = '{"registrado": "' + authData[authData.provider].displayName + '"}';
            else jsonToFire = '{"registrado": "' + authData[authData.provider].username + '"}';
            ref.child(refUser).set(JSON.parse(jsonToFire));
          } else {}
        });
        newRef = ref.child(refUser + '/' + refModel);
        menu.getMenuModels();
      }
    });
  });
});
