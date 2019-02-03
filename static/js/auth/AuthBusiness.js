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

	redirectToHome() {
		window.location.href = this._APP_BASE_URI + '/home.html'
	}

	redirectToLogin() {
		window.location.href = this._APP_BASE_URI
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