class MetasController {
	
	constructor() {
		this._initFields();
	}
	
	_initFields() {
		this._cargo = $('#cargo');
		this._diretoria = $('#diretoria');

		this._gridMetaQuantitativa = $("#jsGridMetaQuantitativa");
		this._gridMetaProjeto = $("#jsGridMetaProjeto");
		this._gridMetaResultado = $("#jsGridResultados");

		this._labelResultQuanti = $('#labelResultQuanti');
		this._labelResultProjeto = $('#labelResultProjeto');

		this._sumPesoMetaQuantitativa = 0;
		this._sumPesoMetaProjeto = 0;

		this._sumBonusTotal = 0;
		this._sumBonusIndividual = 0;
		this._sumBonusEbitda = 0;
		this._sumBonusContri = 0;
		this._sumBonusPerformance = 0;

		this._idBonus = "";

		this._loadGridMetasQuantitativas([]);
		this._loadGridMetasProjeto([]);
		this._loadGridMetasResultado([]);
	}

	getDiretoria(cargo) {
		this._diretoria.val(cargo).change();
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
		} else {
			this._updateResultGrid();
		}

	}

	_loadGridMetasQuantitativas(metasQuantitativas) {
		let self = this;
		self._gridMetaQuantitativa.jsGrid({
			width: "80%",
			height: "auto",
	 
			inserting: true,
			editing: false,
			editButton : false,
			sorting: true,
			paging: true,
			pageSize: 15,
			data: metasQuantitativas,
	 
			onItemInserting : function (args) {
				if(self._sumMetaQuantitativa(args.item.Peso) == false) {
					alert("O resultado das metas está excedendo o limite de 50%! Reveja os pesos das metas informadas.");
					args.cancel = true;
					return;
				}

				self._updateResultLabels();
				self._updateResultGrid();
			},

			deleteConfirm: "Deseja realmente excluir a meta selecionada?",
			onItemDeleting : function (args) {
				self._sumPesoMetaQuantitativa = self._sumPesoMetaQuantitativa - args.item.Peso;
				self._updateResultLabels();
				self._updateResultGrid()
				self._gridMetaQuantitativa.jsGrid("refresh");
			},

			fields: [
				{ type: "control" },
				{ name: "Sequencia", type: "number", width: 90, align : "center",
				   validate : {
						message : "Informe uma sequência válida (>=1)",
						validator : function (value) {
							return value > 0;
						}
					}
				},
				{ name: "Descrição", type: "text", width: 200 , align : "center"},
				{ name: "Peso", title : "Peso (%)", type: "number", width: 90, align : "center",
					validate : {
						message : "Informe um peso válido (>=0)",
						validator : function (value) {
							return value >= 0;
						}
					}
				},
				{name: "Meta", type: "text", width: 200 , align : "center"},
				{name: "Observações", type: "text", width: 200 , align : "center"},
				{name: "Prazos", type : "text", align : "center", validate: "required"}
			]
		});
	}

	_loadGridMetasProjeto(metasProjeto) {
		let self = this;
		self._gridMetaProjeto.jsGrid({
			width: "80%",
			height: "auto",
	 
			inserting: true,
			editing: false,
			editButton : false,
			sorting: true,
			paging: true,
			pageSize: 15,
			data: metasProjeto,

			onItemInserting : function (args) {
				if(self._sumMetaProjeto(args.item.Peso) == false) {
					alert("O resultado das metas está excedendo o limite de 50%! Reveja os pesos das metas informadas.");
					args.cancel = true;
					return;
				}
				self._updateResultLabels();
				self._updateResultGrid();
			},

			deleteConfirm: "Deseja realmente excluir a meta selecionada?",
			onItemDeleting : function (args) {
				self._sumPesoMetaProjeto = self._sumPesoMetaProjeto - args.item.Peso;
				self._updateResultLabels();
				self._updateResultGrid();
				self._gridMetaProjeto.jsGrid("refresh");
			},
	 
			fields: [
				{ type: "control" },
				{ name: "Sequencia", type: "number", width: 90, align : "center",
				   validate : {
						message : "Informe uma sequência válida (>=1)",
						validator : function (value) {
							return value > 0;
						}
					}
				},
				{ name: "Descrição", type: "text", width: 200 , align : "center"},
				{ name: "Peso", title : "Peso (%)", type: "number", width: 90, align : "center",
					validate : {
						message : "Informe um peso válido (>=0)",
						validator : function (value) {
							return value >= 0;
						}
					}
				},
				{name: "Meta", type: "text", width: 200 , align : "center"},
				{name: "Observações", type: "text", width: 200 , align : "center"},
				{name: "Prazos", type : "text", align : "center", validate: "required"}
			]
		});
	}

	_loadGridMetasResultado(resultadoMetas) {
		let self = this;
		self._gridMetaResultado.jsGrid({
			width: "50%",
			height: "auto",
	 
			inserting: false,
			editing: false,
			editButton : false,
			deleteButton : false,
			sorting: true,
			paging: true,
			pageSize: 15,
			data: resultadoMetas,

			fields: [
				{name: "meta", title : "Meta", type: "text", width: 100 , align : "center"},
				{name: "resultado", title : "Resultado (%)", type: "text", width: 100 , align : "center"},
			]
		});
	}

	_sumMetaProjeto(val) {
		if ((this._sumPesoMetaProjeto + this._sumPesoMetaQuantitativa + val) > 50) {
			return false;
		}
		
		this._sumPesoMetaProjeto = this._sumPesoMetaProjeto + val;

		return true;

	}

	_sumMetaQuantitativa(val) {
		if ((this._sumPesoMetaProjeto + this._sumPesoMetaQuantitativa + val) > 50) {
			return false;
		}

		this._sumPesoMetaQuantitativa = this._sumPesoMetaQuantitativa + val;

		return true;
	}

	_updateResultLabels() {
		this._labelResultProjeto.text(this._sumPesoMetaProjeto + '%');
		this._labelResultQuanti.text(this._sumPesoMetaQuantitativa + '%');
	}

	_updateResultGrid() {
		let sumMetasProjetoQuanti = this._sumPesoMetaQuantitativa + this._sumPesoMetaProjeto;
		this._loadGridMetasResultado([{meta : "Gerais [GATILHO]", resultado : this._sumBonusTotal}, 
								 {meta : "Projeto + Quantitativa", resultado : sumMetasProjetoQuanti}
								]);
	}
}
