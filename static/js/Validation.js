/**
 * Class for the validation logic of the system. 
 */
class Validation {
	
	static get types(){
		return {
			NOT_EMPTY : 1,
			AT_LEAST_ONE : 2,
			MAX_24_HOURS : 3,
			CALCULO_INVALIDO : 4,
			FORBIDDEN_EQUAL_FIELDS : 5,
			MIN_LENGTH : 6,
			MAX_LENGTH : 7,
			REGEX_ALFANUMERICO : 9,
			REGEX_INTEIRO : 10
		}
	}
	
	constructor(message) {
		this._messageArray = [];
		if (message)
			this._messageArray.push(message);
	}

	validateFields(array) {
		array.forEach(object => 
			{
				object.types.forEach(type => {
					
					switch (type) {
						case Validation.types.NOT_EMPTY:
							if (!object.value) {
								this._addEmptyMessage(object.fieldName);
							}
							break;
						case Validation.types.AT_LEAST_ONE:
							let empty = (!object.value || !object.value.length || 
									object.value.every(element => !element));
							if (empty) {
								this._addCustomMessage(object.customMessage, object.fieldName);
							}
							break;
						case Validation.types.MAX_24_HOURS:
							var hora = object.value.split(":")[0];
							if (hora >= 24) {
								this._addCustomMessage(object.customMessage, object.fieldName);
							}
							break;
						case Validation.types.CALCULO_INVALIDO:
							if (object.value.includes("Inválido")) {
								this._addCustomMessage(object.customMessage, object.fieldName);
							}
							break;
						case Validation.types.FORBIDDEN_EQUAL_FIELDS:
							if (object.value == object.comparedFieldValue) {
								this._addForbiddenEqualFieldsMessage(
										object.fieldName, object.comparedFieldName);
							}
							break;
						case Validation.types.MIN_LENGTH:
							if (object.value.length < object.minLength) {
								this._addMinLengthMessage(
										object.fieldName, object.minLength);
							}
							break;
						case Validation.types.REGEX_ALFANUMERICO:
							var regex = /^([a-zA-Z0-9\-]+)$/;
							if (regex.test(object.value) == false) {
								this._addCustomMessage(object.customMessage, object.fieldName);
							}
							break;
						case Validation.types.DATAS:
							var regex = "";
							if (regex.test) {

							}
							break;
						case Validation.types.REGEX_INTEIRO:
							var regex = /^([0-9]+(([.,])([0]+))?)$/;
							if (regex.test(object.value) == false) {
								this._addCustomMessage(object.customMessage, object.fieldName);
							}
							break;
					}
					
				})
			});
		
		if (this._messageArray.length > 0) {
			//throw new WarningException(this._messageArray.join('\n'));
			MessageView.showWarningMessage(this._messageArray.join('\n'));
			return false;
		} 

		return true;
	}
	
	_addEmptyMessage(fieldName) {
		this._messageArray.push('O campo {1} deve ser preenchido.'.replace('{1}', fieldName));
	}
	
	_addForbiddenEqualFieldsMessage(fieldName, comparedFieldName) {
		this._messageArray.push('Os campos {1} e {2} não podem ter os mesmos valores.'
					.replace('{1}', fieldName).replace('{2}', comparedFieldName));
	}
	
	_addMinLengthMessage(fieldName, minLength) {
		this._messageArray.push('O campo {1} não podem ter menos de {2} caracteres.'
					.replace('{1}', fieldName).replace('{2}', minLength));
	}
	
	_addCustomMessage(customMessage, fieldName) {
		if (fieldName)
			this._messageArray.push(customMessage.replace('{1}', fieldName));
		else 
			this._messageArray.push(customMessage);
	}
}
