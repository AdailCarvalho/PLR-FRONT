class PLRController {
    constructor() {

    }
 
    applyConstraintsOnFields(fieldsToHide, fieldsToBlock, isProfileEditable) {
        if (!isProfileEditable) {
            this.enableDisableElements(fieldsToBlock, true);
            this.hideElements(fieldsToHide);
        }
    }

	enableDisableElements(elems, stat) {
		elems.forEach(elm => $(elm.id).prop('disabled', stat));
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

    writeSessionMessage() {
        let nomeUsuarioLogado = getLoggedName();
        let minutosRestantes = Math.round(sessionRemainingMin()) + ' min';

        document.getElementById('idNomeUsuarioLogado').textContent = nomeUsuarioLogado;
        document.getElementById('idTempoRestante').textContent = minutosRestantes;
    }
}