class ColaboradorBusiness extends PLRBusiness  {
    constructor() {   
        super();
    }

    findByMatricula(matricula, version) {
        let finalURI =  this._API_BASE_URI + '/colaboradores/' + matricula;
        if (version) {
            finalURI = finalURI + '?filterVersion=' + version;
        }

    	return $.ajax({url : finalURI , type : "GET"});
    }

    exportXls(matricula) {
    	let uriExport = this._API_BASE_URI + '/colaboradores/' + matricula + '/export';
		window.open(uriExport, '_blank');
    }
}