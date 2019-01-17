class ColaboradorBusiness  {
    constructor() {   
    	this._API_BASE_URI = 'http://localhost:8040';
    }

    findByMatricula(matricula) {
        return $.ajax({url : this._API_BASE_URI + '/colaboradores/' + matricula, type : "GET"});
    }
}
