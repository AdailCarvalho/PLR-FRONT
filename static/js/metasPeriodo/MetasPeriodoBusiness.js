class MetasPeriodoBusiness extends PLRBusiness {

    constructor() {
        super();
    }

    getDadosMetasPeriodo() {
        return $.ajax({
            url : this._API_BASE_URI + '/metasperiodo',
            type : "GET",
            async : false
        });
    }

    insertItem(item) {
        return $.ajax({
            url : this._API_BASE_URI + '/metasperiodo',
            data : JSON.stringify(item),
            dataType : "json",
            type : "POST",
            contentType : "application/json; charset=utf-8",
            async : false
        });
    }

    deleteItem(item) {
        $.ajax({
            url : this._API_BASE_URI + '/metasperiodo/meta/' + item.meta.id + '/periodoplr/' + item.tempo.id,
            data : item, 
            type : "DELETE", 
            async : false
        });
    }
}
