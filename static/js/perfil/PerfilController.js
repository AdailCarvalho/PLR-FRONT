class PerfilController {

    constructor() {
        this._business = new PerfilBusiness();

        this._perfil = {};
        this._initFields();
    }

    _initFields() {
        let self = this;
        $.when(self._business.getLoggedUsedProfile())
        .done(function (serverData) {
            self._perfil = serverData;
        }).fail( function (xhr, textStatus, errorThrown) {
            MessageView.showWarningMessage('Não foi possível recuperar as informações de acesso. ');
        });
    }

    associaPerfilUsuario(perfilUsuario) {
        let self = this;
        $.when(self._business.associaPerfilUsuario(perfilUsuario))
        .done(function (serverData) {
            //MessageView.showSuccessMessage('Usuário associado ao perfil com sucesso. ');
        })
        .fail( function (xhr, textStatus, errorThrown) {
            MessageView.showWarningMessage('Não foi possível associar o usuário ao perfil informado. ');
        });
    }

    getProfile() {
        return this._perfil;
    }

    isReadOnly() {
        return !this._perfil.editable;
    }

    isEditable() {
        return this._perfil.editable;
    }

    hasPermissionToArea(idArea) {
        return this._perfil.idsAreaPermissaoAcesso.includes(idArea);
    }
}
