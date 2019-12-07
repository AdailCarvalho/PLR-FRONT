class CardapioMetasBusiness extends PLRBusiness {

    constructor() {
        super();
    }

    findByFilter(idMeta, meta, situacao, tipoMedicao, tipoMeta, formula, frequenciaMedicao) {
        return $.ajax({
            url : this._API_BASE_URI + '/metas/filter?meta=' + meta + '&idMeta=' + idMeta + '&tipoMedicao=' + tipoMedicao + '&tipoMeta=' + tipoMeta + 
                 '&formula=' + formula + '&frequenciaMedicao=' + frequenciaMedicao + '&situacao=' + situacao,
            type : "GET",
            async : false
        });
    }

    salvarMeta(meta)  {
        return $.ajax({
            url : this._API_BASE_URI + '/metas/',
            data : JSON.stringify(meta),
            dataType : "json",
            type : "POST",
            contentType : "application/json; charset=utf-8",
            async : false
        });
    }
}
