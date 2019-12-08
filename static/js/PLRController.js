class PLRController {
    constructor() {
    }
 
    applyConstraintsOnFields(fieldsToHide, fieldsToBlock, hasPermission) {
        if (!hasPermission) {
            this.enableDisableElements(fieldsToBlock, true);
            this.hideElements(fieldsToHide);
        }
    }

    buildSelectOptions(selectField, optionsData) {
        optionsData.forEach(opt => {
            $(selectField).append(new Option(opt.text, opt.value));
        });
    }

	  enableDisableElements(elems, stat) {
	  	elems.forEach(elm => $(elm.id).prop('disabled', stat));
    }
    
	  getFieldValidation(fieldValue, fieldName, types, customMessage) {
	  	return {value:fieldValue, fieldName:fieldName, types:types, customMessage:customMessage};
	  }
      
    hideElements(fields) {
        fields.forEach(field => $(field).hide());
    }
    
    setFieldValue(field, value) {
	    $('#' + field).val(value);
    }
  
    showHiddenElement(field) {
        if (field.is(':hidden')) {
            field.removeAttr('hidden');
            field.show();       
        } 
    }
    setInputFilter(textbox, inputFilter) {
        ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
          textbox.addEventListener(event, function() {
            if (inputFilter(this.value)) {
              this.oldValue = this.value;
              this.oldSelectionStart = this.selectionStart;
              this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
              this.value = this.oldValue;
              this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
              this.value = "";
            }
          });
        });
    }
  
    writeSessionMessage() {
        let nomeUsuarioLogado = getLoggedName();
        let periodoPLRAtivo = getPeriodoPLR();
        let minutosRestantes = Math.round(sessionRemainingMin()) + ' min';
    
        document.getElementById('idNomeUsuarioLogado').textContent = nomeUsuarioLogado;
        document.getElementById('idTempoRestante').textContent = minutosRestantes;
        document.getElementById('idPeriodoPLRAtivo').textContent = 'PERÍODO: ' + periodoPLRAtivo;
    }
}
