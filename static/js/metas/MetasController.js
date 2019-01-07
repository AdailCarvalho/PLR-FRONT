class MetasController {
	
	constructor() {
		this._metasBusiness = new MetasBusiness();
		this._colaboradorBusiness = new ColaboradorBusiness();
		this._initFields();
	}
	
	_initFields() {
		this._matricula = $('#matriculaMeta');
		this._nome = $('#nomeMeta');
		this._cargo = $('#cargoMeta');
		this._diretoria = $('#diretoriaMeta');

		this._gridMetaQuantitativa = $("#jsGridMetaQuantitativa");
		this._gridMetaProjeto = $("#jsGridMetaProjeto");

		this._idsInputsMetas = [{id : '#matriculaMeta', required : true},{id: '#nomeMeta', required : true},{id: '#cargoMeta', required : true},
								{id: '#diretoriaMeta',required : true},{id : '#bonusEbitdaMeta', required : true},{id : '#valMetaGeralMeta', required : true},
								{id : '#obsBonusEbitdaMeta', required : false},{id : '#bonusIndivMeta', required : true},
								{id : '#obsMetaIndivMeta', required : false},{id : '#bonusParticipacaoMeta', required : true},
								{id : '#obsParticipacaoMeta', required : false},{id : "#bonusPerformanceMeta", required : true},
								{id : "#obsPerformanceMeta", required : false}];

		//Buttons
		this._idsButtons = [{id : '#btnSave'}, {id : '#btnCancel'},{id : "#btnExport"}];

		//GRIDS
		this._selectFrequenciaAvaliacao = [{frequencia : ""}, {frequencia : "Mensal"},{frequencia : "Bimestral"},{frequencia : "Trimestral"},
										   {frequencia : "Semestral"},{frequencia : "Anual"}];

		this._sumPesoMetaQuantitativa = 0;
		this._sumPesoMetaProjeto = 0;

		this._loadGridMetasQuantitativas([]);
		this._loadGridMetasProjeto([]);
		this._enableDisableElements(this._idsButtons, true);
	}

	/**
	 * Info Colaborador 
	 */
	getColaborador(matricula) {
		let self = this;
		$.when(self._colaboradorBusiness.findByMatricula(matricula))
		 .done(function(serverResponse) {
			if (serverResponse) {
				self._setColaborador(serverResponse);
			}
		 })
		 .fail(function(xhr, textStatus, errorThrown) {
			alert('Colaborador não encontrado.');
			self._clearInfoColaborador();
		 });
	}

	_clearInfoColaborador() {
		this._idsInputsMetas.forEach(item => $(item.id).val(""));
	}

	_setColaborador(colaborador){
		let self = this;
		if (colaborador.matricula == undefined) {
			self._clearInfoColaborador();
			self._enableDisableElements(self._idsButtons, true);
			return;
		} else {
			self._enableDisableElements(self._idsButtons, false);
		}

		let cargo = colaborador.cargo;
		let metasGerais = colaborador.metasGerais; 

		$('#nomeMeta').val(colaborador.nome);
		$('#cargoMeta').val(cargo.nome);
		$('#diretoriaMeta').val(cargo.diretoria.nome);
		
		self._nome = $('#nomeMeta');
		self._cargo = $('#cargoMeta');
		self._diretoria = $('#diretoriaMeta');	
		
		if (metasGerais.length > 0) {
			metasGerais.forEach(element => self._setMetaGeralDoColaborador(element));
		}

		if (colaborador.metasQuantitativas.length > 0) {
			colaborador.metasQuantitativas.forEach(meta => self._sumMetaQuantitativa(meta.peso));
		}

		if (colaborador.metasProjetos.length > 0) {
			colaborador.metasProjetos.forEach(meta => self._sumMetaProjeto(meta.peso));
		}

		self._loadGridMetasQuantitativas(colaborador.metasQuantitativas);
		self._loadGridMetasProjeto(colaborador.metasProjetos);
	}

	_setMetaGeralDoColaborador(meta) {
		let self = this;
		switch(meta.id) {
			case 1: 
				self._setFieldValue("bonusEbitdaMeta", meta.bonus);
				self._setFieldValue("valMetaGeralMeta", meta.valor);
				self._setFieldValue("obsBonusEbitdaMeta", meta.observacao);
			case 2:
				self._setFieldValue("bonusIndivMeta", meta.bonus);
				self._setFieldValue("obsMetaIndivMeta", meta.observacao);
			case 3:
				self._setFieldValue("bonusParticipacaoMeta", meta.bonus);
				self._setFieldValue("obsParticipacaoMeta", meta.observacao);
			case 4:
				self._setFieldValue("bonusPerformanceMeta", meta.bonus);
				self._setFieldValue("obsPerformanceMeta", meta.observacao);
			default:
				break;
		}
	}

	_setFieldValue(field, value) {
		$('#' + field).val(value);
	}

	_enableDisableElements(elems, stat) {
		elems.forEach(elm => $(elm.id).prop('disabled', stat));
	}

	/** 
	 * GRIDS
	*/

	_loadGridMetasQuantitativas(metasQuantitativas) {
		let self = this;
		self._gridMetaQuantitativa.jsGrid({
			width: "100%",
			height: "auto",
	 
			inserting: true,
			editing: true,
			sorting: true,
			paging: true,
			pageSize: 15,
			data: metasQuantitativas,
	 
			onItemInserting : function (args) {
				if(self._sumMetaQuantitativa(args.item.peso) == false) {
					alert("O resultado das metas está excedendo o valor das Metas Individuais! Reveja os pesos das metas informadas.");
					args.cancel = true;
					return;
				}

				if (self._matricula.val() == "") {
					alert("Informe um colaborador antes de adicionar uma meta.");
					args.cancel = true;
					return;
				}

				if (args.item.id == null) {
					args.item.id = 1;
				}

				args.item.sequencia = self._gridMetaQuantitativa.jsGrid("option", "data").length + 1;
			},
			onItemUpdating : function(args) {
				self._sumPesoMetaQuantitativa = self._sumPesoMetaQuantitativa + args.item.peso;
				self._gridMetaQuantitativa.jsGrid("refresh");
			},

			deleteConfirm: "Deseja realmente excluir a meta selecionada?",
			onItemDeleting : function (args) {
				self._sumPesoMetaQuantitativa = self._sumPesoMetaQuantitativa - args.item.peso;
				
				self._deleteMeta(1, args.item.sequencia);
				args.item.sequencia = self._gridMetaQuantitativa.jsGrid("option", "data").length - 1
		
				self._gridMetaQuantitativa.jsGrid("refresh");
			},
			onItemDeleted : function (args) {
				let i = 1;
				let items = self._gridMetaQuantitativa.jsGrid("option","data");
				for (i = 0; i < items.length; i ++) {
					items[i].sequencia = i + 1;
				}
				self._loadGridMetasQuantitativas(items);
			},
			fields: [
				{name : "id", type : "number", visible : false},
				{ name: "sequencia", title : "Sequência", type: "number", width: 70, align : "center",
						insertTemplate : function(value, item) {
							var $numberSequencia = jsGrid.fields.number.prototype.insertTemplate.apply(this, arguments);
							$numberSequencia.prop('disabled', 'true');

							return $numberSequencia;
						},
						editTemplate: function(value, editItem) {
							var $numberSequencia = jsGrid.fields.number.prototype.editTemplate.apply(this, arguments);
							$numberSequencia.prop('disabled', 'true');

							return $numberSequencia;
						}

				},
				{ name: "descricao", title : "Descrição", type: "text", width: 180 , align : "center"},
				{ name: "peso", title : "Peso (%)", type: "number", width: 70, align : "center",
					validate : {
						message : "Informe um peso válido (>=0)",
						validator : function (value) {
							return value >= 0;
						}
					}
				},
				{name: "meta", title : "Meta", type: "text", width: 160 , align : "center"},
				{name: "observacao", title : "Observações", type: "text", width: 160 , align : "center"},
				{name: "prazo", title : "Prazos", type : "date", align : "center", validate: "required"},
				{name : "frequencia", title : "Freq. Medição", type : "select", items : self._selectFrequenciaAvaliacao, 
				 align : "center", valueField : "frequencia", textField : "frequencia", validate : "required"},
				{type: "control", width : 80, align : "center",
						itemTemplate: function(value, item) {
							var $result = this.__proto__.itemTemplate.call(this, value, item);
							
							var $info = $("<a style='color: inherit'><i class='fas fa-info-circle' " +
						  		" title='Info' style= 'margin-left: 5px;'></i></a>")

							$result = $result.add($info);

							return $result;
					}
				 }
			]
		});
	}

	_loadGridMetasProjeto(metasProjeto) {
		let self = this;
		self._gridMetaProjeto.jsGrid({
			width: "100%",
			height: "auto",
	 
			inserting: true,
			editing: true,
			sorting: true,
			paging: true,
			pageSize: 15,
			data: metasProjeto,

			onItemInserting : function (args) {
				if(self._sumMetaProjeto(args.item.peso) == false) {
					alert("O resultado das metas está excedendo o valor das Metas Individuais! Reveja os pesos das metas informadas.");
					args.cancel = true;
					return;
				}

				if (self._matricula.val() == "") {
					alert("Informe um colaborador antes de adicionar uma meta.");
					args.cancel = true;
					return;
				}

				if (args.item.id == null) {
					args.item.id = 2;
				}

				args.item.sequencia =  self._gridMetaProjeto.jsGrid("option", "data").length + 1;				
			},
			onItemUpdating : function(args) {
				self._sumPesoMetaProjeto = self._sumPesoMetaProjeto + args.item.peso;
				self._gridMetaProjeto.jsGrid("refresh");
			},
			deleteConfirm: "Deseja realmente excluir a meta selecionada?",
			onItemDeleting : function (args) {
				self._sumPesoMetaProjeto = self._sumPesoMetaProjeto - args.item.peso;

				self._deleteMeta(2, args.item.sequencia);
				args.item.sequencia =  self._gridMetaProjeto.jsGrid("option", "data").length - 1;				
				
				self._gridMetaProjeto.jsGrid("refresh");
			},
			onItemDeleted : function (args) {
				var i = 1;
				let items = self._gridMetaProjeto.jsGrid("option","data");
				for (var i = 0; i < items.length; i ++) {
					items[i].sequencia = i + 1;
				}
				self._loadGridMetasProjeto(items);
			},
			fields: [
				{name : "id", type : "number", visible : false},
				{ name: "sequencia", title : "Sequência", type: "number", width: 70, align : "center", 
				  		insertTemplate : function(value, item) {
							var $numberSequencia = jsGrid.fields.number.prototype.insertTemplate.apply(this, arguments);
							$numberSequencia.prop('disabled', 'true');

							return $numberSequencia;
						},
						editTemplate: function(value, editItem) {
							var $numberSequencia = jsGrid.fields.number.prototype.insertTemplate.apply(this, arguments);
							$numberSequencia.prop('disabled', 'true');

							return $numberSequencia;

						}
				},
				{ name: "descricao", title : "Descrição", type: "text", width: 180 , align : "center"},
				{ name: "peso", title : "Peso (%)", type: "number", width: 70, align : "center",
					validate : {
						message : "Informe um peso válido (>=0)",
						validator : function (value) {
							return value >= 0;
						}
					}
				},
				{name: "meta", title : "Meta", type: "text", width: 160 , align : "center"},
				{name: "observacao", title: "Observações", type: "text", width: 160 , align : "center"},
				{name: "prazo", title : "Prazos", type : "date", align : "center", validate: "required"},
				{name : "frequencia", title : "Freq. Medição", type : "select", items : self._selectFrequenciaAvaliacao, 
				 align : "center", valueField : "frequencia", textField : "frequencia", validate : "required"},
				{type: "control" , width : 80, align  : "center",
				  	itemTemplate: function(value, item) {
						var $result = this.__proto__.itemTemplate.call(this, value, item);
						var $info = $("<a style='color: inherit'><i class='fas fa-info-circle' " +
							  " title='Info' style= 'margin-left: 5px;'></i></a>")
							
						$result = $result.add($info);
					
						return $result;
					}
				}
			]
		});
	}

	/**
	 * Validações
	 */

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

	validateAndSave() {
		let metaIndividual = $('#bonusIndivMeta').val();
		if ((this._sumPesoMetaProjeto + this._sumPesoMetaQuantitativa) != metaIndividual) {
			alert("O somatório das metas quantitativas e de projetos está diferente do valor da Meta Individual. Reveja as metas, e tente"
			 + "novamente");
			return;
		}

		this._save();
	}

	_save() {
		let self = this;
		self._insertMetas(self._gridMetaQuantitativa.jsGrid("option", "data"));
		self._insertMetas(self._gridMetaProjeto.jsGrid("option", "data"));
	}

	/**
	 * CRUD METAS
	 */
	
	 _insertMetas(itens) {
		this._metasBusiness.insertMetas(this._matricula.val(), itens);
	 }

	 _deleteMeta(idMeta, sequencia){
		this._metasBusiness.deleteMeta(idMeta, this._matricula.val(), sequencia);
	 }
}
