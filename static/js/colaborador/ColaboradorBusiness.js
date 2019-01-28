class ColaboradorBusiness  {
    constructor() {   
    	this._API_BASE_URI = 'http://localhost:8080/plr';
    }

    findByMatricula(matricula) {
    	return $.ajax({url : this._API_BASE_URI + '/colaboradores/' + matricula, type : "GET"});
    }

    exportXls(matricula) {
    	let uriExport = this._API_BASE_URI + '/colaboradores/' + matricula + '/export';
		window.open(uriExport, '_blank');
    }
}
