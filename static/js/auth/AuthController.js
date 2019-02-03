class AuthController {
	constructor() {
		this._business = new AuthBusiness();
		this._matricula = $('#matricula');
		this._password = $('#password'); 
        this._dialogPrimeiroAcesso = $('#dialogPrimeiroAcesso');
        this._newPassword = $('#idNewPassword')
        this._confirmPassword = $('#idConfirmNewPassword');
        this._passwordRegex =/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/i;
        
        
        let $body = $("body");
        $(document).on({
            ajaxStart: function() { $body.addClass("loading");    },
            ajaxStop: function() { $body.removeClass("loading"); }
        });

        this._init();
	}

    _init() {
        this._dialogPrimeiroAcesso.dialog({
                resizable: false,
                height: "auto",
                width: 400,
                modal: true,
                autoOpen: false,
                closeOnEscape: false
            });
    }

	get _userData() {
        return {
            login : this._matricula.val(),
            matricula : this._matricula.val(),
            password : this._password.val()
        }
    }

    checkActiveSession() {
        return resetBrowserSession();
    }

	login() {
        let self = this;
		if (self._validateForm()) {
			$.when(self._business.login(self._userData))
			 .done(function(userDTO) {
			 	setLoggedUser(userDTO);
			 	self.redirectToHome();
			 })
			 .fail(function(xhr, textStatus, errorThrown) {
                if (xhr.status == 404) {
                    alert("Usuário não encontrado.");
                }
			 });
		}
    }

    logout() {
        removeSession();
        this.redirectToLogin();
    }

    openDialogPrimeiroAcesso() {
        if(isPrimeiroAcesso()) {
            this._dialogPrimeiroAcesso.dialog('open');
        }
    }


    redirectToHome() {
    	window.location.href = 'http://localhost:8080/plr/home.html'
    }

    redirectToLogin() {
    	window.location.href = 'http://localhost:8080/plr'
    }

    redefineSenha() {
        let self = this;
        if (self._validateFormRedefinicaoPassword()) {
            let user = self._userData;
            user.login = getLoggedUser(); 
            user.matricula = user.login;
            user.inPrimeiroAcesso = 'N';
            user.password = this._newPassword.val();
   
            $.when(self._business.updateUserInfo(user))
             .done(function(userDTO) {
                alert('Informações atualizadas com sucesso!');
                removeSessionItem("plrIsFirstAccess");
                
                self._dialogPrimeiroAcesso.close();
                location.reload();
             })
             .fail(function(xhr, textStatus, errorThrown) {
                alert("Erro ao atualizar informações do usuário.");
                self.logout();
             });
        }
    }

    _validateForm() { 
        if (this._matricula.val() == '') {
            alert('Informar matrícula');
            this._matricula.focus();
            return false;
        } else if (this._password.val() == '') {
            alert('Informar senha');
            this._password.focus();
            return false;
        }

        return true;
    }

    _validateFormRedefinicaoPassword() {
        this._newPassword = $('#idNewPassword')
        this._confirmPassword = $('#idConfirmNewPassword');
        if (this._newPassword.val() == "") {
            alert('Informe a nova senha');
            this._newPassword.focus();
            return false;
        } else if (this._confirmPassword.val() == "") {
            alert('Confirme a nova senha');
            this._confirmPassword.focus();
            return false;
        }

        if (this._newPassword.val() == this._confirmPassword.val()) {
            if(this._newPassword.val().match(this._passwordRegex) == null) {
                alert('A senha deve possuir 8 caracteres, pelo menos 1 caractere especial e um número.');
                return false;
            }
        } else {
            alert('As senhas não estão iguais.');
            return false;
        }
        return true;
    }
}
