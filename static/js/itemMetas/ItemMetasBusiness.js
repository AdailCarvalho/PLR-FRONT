class ItemMetasBusiness extends PLRBusiness {

    constructor() {
        super();
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
