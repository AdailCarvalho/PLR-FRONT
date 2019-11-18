class ColaboradorBusiness extends PLRBusiness  {
    constructor() {   
        super();
    }

    exportXls(matricula) {
    	let uriExport = this._API_BASE_URI + '/colaboradores/' + matricula + '/export';
		window.open(uriExport, '_blank');
    }

    getLista(urlDestino) {
        return $.ajax({
            url : this._API_BASE_URI + urlDestino,
            type : "GET",
            async: false
        });
    }

    findByFilter(matricula, nome, situacao, cargo, diretoria, time) {
        return $.ajax({
            url : this._API_BASE_URI + '/colaboradores/filter?matricula=' + matricula + '&nome=' + nome + '&situacao=' + situacao + 
                 '&cargo=' + cargo + '&diretoria=' + diretoria + '&time=' + time,
            type : "GET",
            async : false
        });
    }

    findByMatricula(matricula) {
    	return $.ajax({url : this._API_BASE_URI + '/colaboradores/' + matricula, type : "GET"});
    }

    salvarColaborador(colaborador) {
        return $.ajax({
            url : this._API_BASE_URI + '/colaboradores/',
            data : JSON.stringify(colaborador),
            dataType : "json",
            type : "POST",
            contentType : "application/json; charset=utf-8",
            async : false
        });

    }
}