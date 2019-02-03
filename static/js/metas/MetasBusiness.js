class MetasBusiness extends PLRBusiness {
    
    constructor() {
        super();
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
}
