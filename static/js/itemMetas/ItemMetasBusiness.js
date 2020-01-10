class ItemMetasBusiness extends PLRBusiness {

    constructor() {
        super();
    }

    aprovarFolhaMeta(id) {
        return $.ajax({
            url : this._API_BASE_URI + '/folhametas/aprovacao/' + id,
            type : "PUT",
            async : false            
        });
    }

    deleteFolhaMeta(id) {
        $.ajax({
            url : this._API_BASE_URI + '/folhametas/' + id,
            type : "DELETE",
            async : false
        });
    }

    exportFolhaMeta(matricula, idFolhaMeta) {
    	let uriExport = this._API_BASE_URI + '/folhametas/export?matricula=' + matricula + '&idFolhaMeta=' + idFolhaMeta;
		window.open(uriExport, '_blank');
    }

    findColaboradorByFilter(matricula, nome) {
        return $.ajax({
            url : this._API_BASE_URI + '/colaboradores/filter?matricula=' + matricula + '&nome=' + nome,
            type : "GET",
            async : false
        });
    }

    findByFilter(matricula, colaborador, inicioVigencia, fimVigencia, responsavel,situacao) {
        return $.ajax({
            url : this._API_BASE_URI + '/folhametas/filter?matricula=' + matricula + '&inicioVigencia=' + inicioVigencia + '&fimVigencia=' + fimVigencia + 
                 '&colaborador=' + colaborador + '&responsavel=' + responsavel + '&situacao=' + situacao,
            type : "GET",
            async : false
        });
    }

    salvarItemMeta(itemMeta) {
        return $.ajax({
            url : this._API_BASE_URI + '/folhametas/',
            data : JSON.stringify(itemMeta),
            dataType : "json",
            type : "POST",
            contentType : "application/json; charset=utf-8",
            async : false
        });
    }
}
