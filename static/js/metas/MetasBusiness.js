class MetasBusiness extends PLRBusiness {
    
    constructor() {
        super();
    }

    /**
     * Query
     */
    findMetasCadastradasUsuarioLogado() {
        return $.ajax({url : this._API_BASE_URI + '/folhametas/colaborador/' + getLoggedUser(), type : "GET"});
    }

    findMetasPertencentesUsuarioLogado() {
        return $.ajax({url : this._API_BASE_URI + '/folhametas/responsavel/' + getLoggedUser(), type : "GET"});
    }

    findValoresMetasForFolhaMeta(idFolhaMeta) {
        return $.ajax({url : this._API_BASE_URI + '/metasitem/' + idFolhaMeta + '?login=' + getLoggedUser(), type : "GET"});
    }
}
