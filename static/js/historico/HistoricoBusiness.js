class HistoricoBusiness extends PLRBusiness {
    constructor() {
        super();
    }

    deleteHistorico(id, matricula) {
        $.ajax({
            url : this._API_BASE_URI  + '/historico/'  + id + '/colaborador/' + matricula,
            type : "DELETE",
            async : false
        });
    }

    exportHistorico(matricula, versao) {
    	let uriExport = this._API_BASE_URI + '/historico/' + matricula + '/export?version=' + versao;
		window.open(uriExport, '_blank');
    }

    findHistoricoForColaborador(matricula) {
        return $.ajax({url: this._API_BASE_URI + '/historico/colaborador?matricula=' + matricula, type : 'GET'});
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

    uploadAnexo(mat, version, image) {
        let colaboradorHistorico = {matricula : mat, base64Img : image, versao : version};
        $.ajax({
            url : this._API_BASE_URI + '/historico/' + mat + '/anexaFoto',
            data : JSON.stringify(colaboradorHistorico),
            type : "POST",
            contentType : "application/json; charset=utf-8",
            async : false,
        });
    }
}