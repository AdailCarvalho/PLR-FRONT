class PerfilController extends PLRController {

    constructor() {
        super();

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
            alert('Não foi possível recuperar as informações de acesso. ');
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
}