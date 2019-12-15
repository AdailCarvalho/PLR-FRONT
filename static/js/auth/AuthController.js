class AuthController extends PLRController {
	constructor() {
        super();

		this._business = new AuthBusiness();
		this._matricula = $('#matricula');
        this._password = $('#password'); 
        this._periodoPLR = $("#periodoPLR");
        this._phrase = '';
        this._hash = '';
        this._dialogPrimeiroAcesso = $('#dialogPrimeiroAcesso');
        this._newPassword = $('#idNewPassword')
        this._confirmPassword = $('#idConfirmNewPassword');
        this._passwordRegex =/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/i;

        let $body = $("body");
		$(document).on({
			ajaxStart: function() { $body.addClass("loading");},
			ajaxStop: function() { $body.removeClass("loading"); }
		});

        this._init();
	}

    _init() {
        this._carregarPeriodosAtivos();
        this._dialogPrimeiroAcesso.dialog({
                resizable: false,
                height: "auto",
                width: 500,
                modal: true,
                autoOpen: false,
                closeOnEscape: false
            });
    }

	get _userData() {
        if (this._hash == "") {
            this._hash = this._matricula.val();
        } 

        return {
            login : this._matricula.val(),
            matricula : this._matricula.val(),
            password : this._password.val(),
            hash : this._hash,
            phrase : this._phrase
        }
    }

    _carregarPeriodosAtivos() {
        let self = this;
        $.when(self._business.getPeriodosAtivos())
        .done(function (serverData) {
            let selectItems = [];
            serverData.forEach(item => selectItems.push({value : item, text : item}));
            self.buildSelectOptions(self._periodoPLR, selectItems);
        });
    }

    checkActiveSession() {
        return resetBrowserSession();
    }

    login() {
        let self = this;
        if (self._validateForm()) {
            $.when(self._business.login(self._userData, self._periodoPLR.val()))
            .done(function(userDTO) {
                self._phrase = userDTO.phrase;
                self._hash = userDTO.hash;
                setLoggedUser(userDTO);
                setPeriodoPLR(self._periodoPLR.val());
                if (userDTO.inPrimeiroAcesso == 'S') {
                    self.redirectToHome();
                } else {
                    if(self._validateAuth()) {
                        self.redirectToHome();
                    }
                }
            })
            .fail(function(xhr, textStatus, errorThrown) {
                    MessageView.showSimpleErrorMessage('Login inválido! Erro: ' + xhr.responseJSON.message);
                    return;
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
    	this._business.redirectToHome();
    }

    redirectToLogin() {
        this._business.redirectToLogin();
    }

    redefineSenha() {
        let self = this;
        let isPasswordOK = true;  
        if (self._validateFormRedefinicaoPassword()) {
            let user = self._userData;
            user.login = getLoggedUser(); 
            user.matricula = user.login;
            user.inPrimeiroAcesso = 'N';
            user.password = this._newPassword.val();
            user.hash = CryptoJS.AES.encrypt(getLoggedPhrase(), this._newPassword.val()).toString();
          
            $.when(self._business.updateUserInfo(user))
             .done(function(userDTO) {
                MessageView.showSuccessMessage('Informações atualizadas com sucesso!');
                removeSessionItens(["plrIsFirstAccess", "plrLoggedPhrase"]);
                
                self._dialogPrimeiroAcesso.close();
                location.reload();
             })
             .fail(function(xhr, textStatus, errorThrown) {
                MessageView.showSimpleErrorMessage("Erro ao atualizar informações do usuário.");
                self.logout();
             });
        } else {
            isPasswordOK = false;
        }

        return isPasswordOK;
    }

    showHidePassword(idPassword, idIcon) {
        let password = document.getElementById(idPassword);
        let iconSeePassword = $('#' + idIcon);
        if (password.type == "password") {
            password.type = "text";
            iconSeePassword.removeClass("far fa-eye fa-lg");
            iconSeePassword.addClass("far fa-eye-slash fa-lg");
        } else {
            password.type = "password";
            iconSeePassword.removeClass("far fa-eye-slash fa-lg");
            iconSeePassword.addClass("far fa-eye fa-lg");
        }
    }

    _validateAuth() {
        let decryptedPhrase = CryptoJS.AES.decrypt(this._hash, this._password.val());
        if (decryptedPhrase.toString(CryptoJS.enc.Utf8) != this._phrase) {
            MessageView.showSimpleErrorMessage('Senha inválida.');
            this._password.focus();
            return false;
        } else {
            return true;
        }
    }

    _validateForm() { 
        if (this._periodoPLR.val() == '') {
            MessageView.showWarningMessage('Informe o período');
            this._periodoPLR.focus();
            return false; 
        } else if (this._matricula.val() == '') {
            MessageView.showWarningMessage('Informe a matrícula');
            this._matricula.focus();
            return false;           
        } else if (this._password.val() == '') {
            MessageView.showWarningMessage('Informe a senha');
            this._password.focus();
            return false;
        }

        return true;
    }

    _validateFormRedefinicaoPassword() {
        this._newPassword = $('#idNewPassword')
        this._confirmPassword = $('#idConfirmNewPassword');
        if (this._newPassword.val() == "") {
            MessageView.showWarningMessage('Informe a nova senha');
            this._newPassword.focus();
            return false;
        } else if (this._confirmPassword.val() == "") {
            MessageView.showWarningMessage('Confirme a nova senha');
            this._confirmPassword.focus();
            return false;
        }

        if (this._newPassword.val() == this._confirmPassword.val()) {
            if(this._newPassword.val().match(this._passwordRegex) == null) {
                MessageView.showWarningMessage('A senha deve possuir 6 caracteres, e possuir ao menos um número.');
                return false;
            }
        } else {
            MessageView.showWarningMessage('As senhas não estão iguais.');
            return false;
        }
        return true;
    }
}
