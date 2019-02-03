class AuthBusiness extends PLRBusiness {
	constructor() {
		super();
	}

	login(user) {
		return $.ajax({
			url : this._API_BASE_URI + '/usuarios/login',
			type : "POST",
			contentType: "application/json; charset=utf-8",
			data : JSON.stringify(user),
			async : false
		});
	}

	updateUserInfo(user) {
		return $.ajax({
			url : this._API_BASE_URI + '/usuarios/',
			type : "PUT",
			contentType : "application/json; charset=utf-8",
			data : JSON.stringify(user),
			async : false
		});
	}
}