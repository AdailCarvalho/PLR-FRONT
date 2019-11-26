class ItemMetasBusiness extends PLRBusiness {

    constructor() {
        super();
    }

    findByFilter(matricula, colaborador, inicioVigencia, fimVigencia, responsavel,situacao) {
        return $.ajax({
            url : this._API_BASE_URI + '/folhametas/filter?matricula=' + matricula + '&inicioVigencia=' + inicioVigencia + '&fimVigencia=' + fimVigencia + 
                 '&colaborador=' + colaborador + '&responsavel=' + responsavel + '&situacao=' + situacao,
            type : "GET",
            async : false
        });
    }
}
