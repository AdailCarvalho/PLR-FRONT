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

    uploadAnexo(mat, image) {
        console.log('Upload');
        let colaboradorImg = {matricula : mat, base64Img : image};
        $.ajax({
            url : this._API_BASE_URI + '/colaboradores/' + mat + '/anexaFoto',
            data : JSON.stringify(colaboradorImg),
            type : "POST",
            contentType : "application/json; charset=utf-8",
            async : false,
        });
    }
}