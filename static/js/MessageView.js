/**
 * Class to manage the exhibition of messages of the system. 
 */
class MessageView {
	
	constructor(idDiv) {
		this._idDiv = '#'+idDiv;
	}
	
	static showWarningMessage(message) {
		MessageView._showMessage("warning", message);
	}
	
	static showSaveSuccessMessage() {
		MessageView._showMessage("success", 'Registro salvo com sucesso.');
	}
	
	static showUpdateSuccessMessage() {
		MessageView._showMessage("success", 'Registro atualizado com sucesso.');
	}
	
	static showDeleteSuccessMessage() {
		MessageView._showMessage("success", 'Registro removido com sucesso.');
	}
	
	static showSuccessMessage(message) {
		MessageView._showMessage("success", message);
	}
	
	static showSimpleErrorMessage(message) {
		MessageView._showMessage("error", message);
	}
	
	static showErrorMessage(message, xhrObject, serverStatus) {
		let responseText = xhrObject.responseText;
		if (responseText.indexOf('ConstraintViolationException') != -1) {
			MessageView._showMessage("error", 'Registro Duplicado.');
		} 
		else {
			MessageView._showMessage("error", message);
		}
		console.log("Error: " + xhrObject.responseText); 
		console.log("Server Status: " + xhrObject.status);
		console.log("Status: " + serverStatus);
		console.log("xhr: " + xhrObject);
	}
	
	static showFailMessage(message, detailMessage, xhrObject, serverStatus) {
		
		if (xhrObject.status >= 400 && xhrObject.status < 500) {
			if (xhrObject.status == 401) {
				window.location.href="/error/unauthorized";
			}
			else {
				MessageView.showWarningMessage(xhrObject.responseText);
			}
		}
		else {
			if (xhrObject.responseText.indexOf('ConstraintViolationException') != -1) {
				MessageView._showMessage("error", 'Registro Duplicado.');
			} 
			else {
				MessageView._showMessage("error", 
						message.replace(/#0#/g, detailMessage)
						.replace(/#1#/g, xhrObject.status)
						.replace(/#2#/g, xhrObject.responseText));
			}
		}
		console.log("Error: " + xhrObject.responseText); 
		console.log("Server Status: " + xhrObject.status);
		console.log("Status: " + serverStatus);
		console.log("xhr: " + xhrObject);
	}

	static showFetchFailMessage(message, detailMessage, errorObject) {
		if (errorObject.status >= 400 && errorObject.status < 500) {
			if (errorObject.status == 401) {
				window.location.href="/error/unauthorized";
			}
			else {
				MessageView.showWarningMessage(errorObject.statusText);
			}
		}
		else {
			if (errorObject.statusText &&
					errorObject.statusText.indexOf('ConstraintViolationException') != -1) {
				MessageView._showMessage("error", 'Registro Duplicado.');
			} 
			else {
				MessageView._showMessage("error", 
						message.replace(/#0#/g, detailMessage)
						.replace(/#1#/g, errorObject.status)
						.replace(/#2#/g, errorObject.statusText));
			}
		}
		console.log(errorObject);
		console.log("Status Text: " + errorObject.statusText);
		console.log("Status: " + errorObject.status);
	}
	
	static showNotificationMessage(message) {
		MessageView._showMessage("notification", message);
	}
	
	static _showMessage(type, message) {
		$.iaoAlert({type: type,       //'notification','success', 'error', 'warning'
			mode: "light", 		      // "light" ou "dark"
			autoHide: true,
			fadeTime: "500", 
			alertTime: maxTimeMessage,// timeout in milliseconds
			closeButton: true,
			closeOnClick: false,
			position: 'top-right',    //or top-left, bottom-right, bottom-left
			fadeOnHover: true,
			zIndex: '999',
			alertClass: '',           // additional CSS class(es)
			msg: message});
	}
	
	createConfirmationMessageModal(message) {
		let modalContent = `<p>
 			<span class="ui-icon ui-icon-alert" 
 				style="float:left; margin:12px 12px 20px 0;"></span>
 			${message}
 		</p>`;
		
		$(this._idDiv).html(modalContent);

		$(function() {
			$(this._idDiv).dialog({
				resizable: false,
				height: "auto",
				width: 400,
				modal: true,
				autoOpen: false,
				buttons: {
					"Sim": function() {
						alert('deve abrir em uma nova tela');
						$(this).dialog("close");
					},
					"Não": function() {
						$(this).dialog("close");
					}
				}
			});
		});
	}
	
	showConfirmationMessageModal() {
		$(this._idDiv).dialog('open');
	}
	
}