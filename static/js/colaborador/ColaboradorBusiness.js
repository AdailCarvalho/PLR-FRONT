class ColaboradorBusiness extends PLRBusiness  {
    constructor() {   
        super();
    }

    findByMatricula(matricula) {
    	return $.ajax({url : this._API_BASE_URI + '/colaboradores/' + matricula, type : "GET"});
    }

    exportXls(matricula) {
    	let uriExport = this._API_BASE_URI + '/colaboradores/' + matricula + '/export';
		window.open(uriExport, '_blank');
    }
}
