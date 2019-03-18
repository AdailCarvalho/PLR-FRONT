class MetasBusiness extends PLRBusiness {
    
    constructor() {
        super();
    }

    /**
     * Query
     */
    findMetasCadastradasByLoggedUser() {
        return $.ajax({url : this._API_BASE_URI + '/metaEspecifica/colaborador/' + getLoggedUser(), type : "GET"});
    }

    /**
     * CRUD Grids
     */
    insertMeta(matricula, item) {
        $.ajax({
            url : this._API_BASE_URI + '/metaEspecifica/colaborador/' + matricula,
            type : "POST",
            contentType: "application/json; charset=utf-8",
            data : JSON.stringify(item),
            async : false
        });
    }

    deleteMeta(matricula, item) {
        $.ajax({
			url : this._API_BASE_URI + "/metaEspecifica/colaborador/" + matricula,
            contentType: "application/json; charset=utf-8",
            data : JSON.stringify(item),
			type : "DELETE",
			async: false
		});
    }

    updateMeta(matricula, item) {
        $.ajax({
            url : this._API_BASE_URI + "/metaEspecifica/colaborador/" + matricula,
            contentType: "application/json; charset=utf-8",
            data : JSON.stringify(item),
            type : "PUT",
            async: false
        });
    }

    /**
     * CRUD Grid Metas Mensais  
     */
    findMetasMensais(idMeta, sequencia, matricula, filterVersion) {
        let finalURL = this._API_BASE_URI + "/metaEspecifica/colaborador/" + matricula 
                                          + "/mensal?idMeta=" + idMeta + "&sequencia=" + sequencia;
        if (filterVersion) {
            finalURL = finalURL + '&filterVersion=' + filterVersion;
        }
        return $.ajax({url : finalURL, type : 'GET'});

    }
    
    saveMetasMensais(matricula, metasMensaisData) {
        $.ajax({
            url : this._API_BASE_URI + '/metaEspecifica/colaborador/' + matricula + '/mensal',
            type : "POST",
            contentType: "application/json; charset=utf-8",
            data : JSON.stringify(metasMensaisData),
            async : false
        });
    }

    uploadImage(matricula, foto) {
        $.ajax({
            url : this._API_BASE_URI + '/metaEspecifica/colaborador/' + matricula + '/anexaFoto?foto=' + foto,
            type : "POST",
            async : false
        });
    }
}