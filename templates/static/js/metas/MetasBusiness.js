class MetasBusiness  {
    
    constructor() {
        this._API_BASE_URI = 'http://localhost:8040';
    }

    /**
     * CRUD Grids
     */
    insertMetas(matricula, itens) {
        return $.ajax({
            url : this._API_BASE_URI + '/metaEspecifica/colaborador/' + matricula,
            type : "POST",
            contentType: "application/json; charset=utf-8",
            data : JSON.stringify(itens),
            async : false
        });
    }

    deleteMeta(matricula, item) {
        return $.ajax({
			url : this._API_BASE_URI + "/metaEspecifica/colaborador/" + matricula,
            contentType: "application/json; charset=utf-8",
            data : JSON.stringify(item),
			type : "DELETE",
			async: false
		});
    }
}
