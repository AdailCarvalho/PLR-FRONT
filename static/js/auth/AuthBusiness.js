class AuthBusiness extends PLRBusiness {
	constructor() {
		super();
	}

	getPeriodosAtivos() {
		return $.ajax({
			url : this._API_BASE_URI + '/tempo/ano',
			type : "GET",
			async : false
		});
	}

	login(user, periodoPLR) {
		return $.ajax({
			url : this._API_BASE_URI + '/usuarios/login/' + periodoPLR,
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

	redefinePrimeiroAcesso(user) {
		return $.ajax({
			url : this._API_BASE_URI + '/usuarios/resetpass/' + getLoggedUser(),
			data : JSON.stringify(user),
			contentType : "application/json; charset=utf-8",
			type : "PUT",
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