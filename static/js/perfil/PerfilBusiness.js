class PerfilBusiness extends PLRBusiness {

    constructor() {
        super();
    }

    associaPerfilUsuario(perfilUsuario) {
        return $.ajax({
            url : this._API_BASE_URI + '/perfis/bindperfilusuario',
            data : JSON.stringify(perfilUsuario),
            dataType : "json",
            contentType : "application/json; charset=utf-8",
            type : "POST",
            async : "false"
        });
    }

    getLoggedUsedProfile() {
        return $.ajax({
            url : this._API_BASE_URI + '/perfis/permissao/' + getLoggedUser(),
            type : "GET",
            async : false
        });
    }
}