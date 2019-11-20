class CardapioMetasBusiness extends PLRBusiness {

    constructor() {
        super();
    }

    findByFilter(meta, situacao, tipoMedicao, tipoMeta, formula, frequenciaMedicao) {
        return $.ajax({
            url : this._API_BASE_URI + '/metas/filter?meta=' + meta + '&tipoMedicao=' + tipoMedicao + '&tipoMeta=' + tipoMeta + 
                 '&formula=' + formula + '&frequenciaMedicao=' + frequenciaMedicao + '&situacao=' + situacao,
            type : "GET",
            async : false
        });
    }
}
