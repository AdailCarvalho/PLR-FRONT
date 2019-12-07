class MetaMensalBusiness extends PLRBusiness {

    constructor() {
        super();
    }

    findMetasMensais(idMeta) {
        return $.ajax({
            url : this._API_BASE_URI + '/folhasmensais/meta/' + idMeta + '/periodoPLR/' + getPeriodoPLR(),
            type : "GET",
            async : false
        });
    }
}
