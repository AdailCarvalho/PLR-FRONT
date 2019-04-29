class PerfilBusiness extends PLRBusiness {

    constructor() {
        super();
    }

    getLoggedUsedProfile() {
        return $.ajax({
            url : this._API_BASE_URI + '/perfis/permissao/' + getLoggedUser(),
            type : "GET",
            async : false
        });
    }
}