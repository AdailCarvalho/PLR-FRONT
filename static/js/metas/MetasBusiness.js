class MetasBusiness extends PLRBusiness {
    
    constructor() {
        super();
    }

    /**
     * Query
     */
    findMetasCadastradasUsuarioLogado(periodoPLR) {
        return $.ajax({url : this._API_BASE_URI + '/folhametas/responsavel/' + getLoggedUser() + '/periodo/' + periodoPLR, type : "GET"});
    }

    findMetasPertencentesUsuarioLogado(periodoPLR) {
        return $.ajax({url : this._API_BASE_URI + '/folhametas/colaborador/' + getLoggedUser() + '/periodo/' + periodoPLR, type : "GET"});
    }

    findMetasPendentesUsuarioLogado(periodoPLR) {
        return $.ajax({url : this._API_BASE_URI + '/folhametas/pendentes/colaborador/' + getLoggedUser() + '/periodo/' + periodoPLR, type : "GET"});
    }

    findValoresMetasForFolhaMeta(idFolhaMeta) {
        return $.ajax({url : this._API_BASE_URI + '/metasitem/' + idFolhaMeta + '?login=' + getLoggedUser(), type : "GET"});
    }
}
