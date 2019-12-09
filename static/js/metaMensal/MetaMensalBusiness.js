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

    saveMetasMensais(itemsMetasMentais) {
        return $.ajax({
            url : this._API_BASE_URI + '/folhasmensais',
            dataType : "json",
            data : JSON.stringify(itemsMetasMentais), 
            type : "POST",
            contentType : "application/json; charset=utf-8",
            async : false
        });
    }
}
