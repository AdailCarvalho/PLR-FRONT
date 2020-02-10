class PLRBusiness {
    
    constructor() {
        this._API_BASE_URI = getPropertyVal('api_base_uri');
        this._APP_BASE_URI = getPropertyVal('app_base_uri');
    }

    getLista(urlDestino) {
        return $.ajax({
            url : this._API_BASE_URI + urlDestino,
            type : "GET"
        });
    }
}
