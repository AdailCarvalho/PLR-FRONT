/**
 * Gerencia pesquisa e cadastro de colaboradores
 */
class ColaboradorController {
    constructor() {
        this._initFields();
    }

    _initFields() {
        this._matricula = $('#matricula');
		this._nome = $('#nome');
		this._cargo = $('#cargo');
        this._diretoria = $('#diretoria');
        
        this._sumBonusTotal = 0;
		this._sumBonusIndividual = 0;
		this._sumBonusEbitda = 0;
		this._sumBonusContri = 0;
		this._sumBonusPerformance = 0;
	}
	
	calculaBonus(id) {
		let val = $('#' + id).val();
		let numVal = Number(val);
		switch(id) {
			case "bonusEbitda":
				this._sumBonusEbitda = numVal;	
			  	break;
			case "valMetaIndiv":
				this._sumBonusIndividual =  numVal;
				break;
			case "bonusMargem":
				this._sumBonusContri =  numVal;
				break;
			case "bonusPerformance":
				this._sumBonusPerformance =  numVal;
				break;
			default :
				alert('Bônus não encontrado!');
		  }

		this._sumBonusTotal = this._sumBonusEbitda + this._sumBonusIndividual + this._sumBonusContri + this._sumBonusPerformance;
		if (this._sumBonusTotal > 100) {
			alert("Somatório das Metas Gerais está excedendo 100%. Reveja as metas informadas. ");
			val.focus();
		} else {
			this._updateResultGrid();
		}
	}

    getColaborador(matricula) {
		for (var i = 0; i < this._mockColaboradores.length; i ++) {
			if (matricula == this._mockColaboradores[i].matricula) {
				$('#nome').val(this._mockColaboradores[i].nome);
				$('#cargo').val(this._mockColaboradores[i].cargo);
				$('#diretoria').val(this._mockColaboradores[i].diretoria);
				this._nome = $('#nome');
				this._cargo = $('#cargo');
				this._diretoria = $('#diretoria');
				return;
			}
		}
	}
}