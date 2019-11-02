class AuthController extends PLRController {
	constructor() {
        super();

		this._business = new AuthBusiness();
		this._matricula = $('#matricula');
		this._password = $('#password'); 
        this._phrase = '';
        this._hash = '';
        this._dialogPrimeiroAcesso = $('#dialogPrimeiroAcesso');
        this._newPassword = $('#idNewPassword')
        this._confirmPassword = $('#idConfirmNewPassword');
        this._passwordRegex =/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/i;

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


    checkActiveSession() {
        return resetBrowserSession();
    }

    login() {
        let self = this;
        if (self._validateForm()) {
            $.when(self._business.login(this._userData))
            .done(function(userDTO) {
                self._phrase = userDTO.phrase;
                self._hash = userDTO.hash;
                setLoggedUser(userDTO);
                //if (userDTO.inPrimeiroAcesso == 'S') {
                 //   self.redirectToHome();
                //} else {
                    //if(self._validateAuth()) {
                self.redirectToHome();
                    //}
                //}
            })
            .fail(function(xhr, textStatus, errorThrown) {
                alert('Login inválido!');
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
        if (self._validateFormRedefinicaoPassword()) {
            let user = self._userData;
            user.login = getLoggedUser(); 
            user.matricula = user.login;
            user.inPrimeiroAcesso = 'N';
            user.password = this._newPassword.val();
            user.hash = CryptoJS.AES.encrypt(getLoggedPhrase(), this._newPassword.val()).toString();
          
            $.when(self._business.updateUserInfo(user))
             .done(function(userDTO) {
                alert('Informações atualizadas com sucesso!');
                removeSessionItens(["plrIsFirstAccess", "plrLoggedPhrase"]);
                
                self._dialogPrimeiroAcesso.close();
                location.reload();
             })
             .fail(function(xhr, textStatus, errorThrown) {
                alert("Erro ao atualizar informações do usuário.");
                self.logout();
             });
        }
    }

    _validateAuth() {
        let decryptedPhrase = CryptoJS.AES.decrypt(this._hash, this._password.val());
        if (decryptedPhrase.toString(CryptoJS.enc.Utf8) != this._phrase) {
            alert('Senha inválida.');
            this._password.focus();
            return false;
        } else {
            return true;
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
                alert('A senha deve possuir 6 caracteres, e possuir ao menos um número.');
                return false;
            }
        } else {
            alert('As senhas não estão iguais.');
            return false;
        }
        return true;
    }
}
