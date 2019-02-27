class HistoricoBusiness extends PLRBusiness {
    constructor() {
        super();
    }

    exportHistorico(matricula, versao) {
    	let uriExport = this._API_BASE_URI + '/historico/' + matricula + '/export?version=' + versao;
		window.open(uriExport, '_blank');
    }

    findHistoricoForResponsavel(matriculaResponsavel) {
        return $.ajax({url : this._API_BASE_URI + '/historico/responsavel?matriculaResponsavel=' + matriculaResponsavel, type : 'GET'});
    }

    generateHistoricVersion(historico) {
       return $.ajax(
            {
                url : this._API_BASE_URI + '/historico',
                type : 'POST',
                data : JSON.stringify(historico),
                contentType: "application/json; charset=utf-8",
                async : false
            }
        );
    }

    listHistoricoForColaborador(matricula) {
        return $.ajax({url: this._API_BASE_URI + '/historico/colaborador?matricula=' + matricula, type : 'GET'});
    }

    updateHistorico(historico) {
         return $.ajax(
            {
                url : this._API_BASE_URI + '/historico',
                type : 'PUT',
                data : JSON.stringify(historico),
                contentType: "application/json; charset=utf-8",
                async : false
            }
        );
    }
}