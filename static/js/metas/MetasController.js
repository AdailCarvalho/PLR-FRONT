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
		this._blocoMetaExtra = $('#blocoMetaExtra');


		this._gridMetaQuantitativa = $("#jsGridMetaQuantitativa");
		this._gridMetaProjeto = $("#jsGridMetaProjeto");

		this._idsInputsMetas = [{id : '#matriculaMeta', required : true},{id: '#nomeMeta', required : true},{id: '#cargoMeta', required : true},
								{id: '#diretoriaMeta',required : true},{id : '#bonusEbitdaMeta', required : true},{id : '#valMetaGeralMeta', required : true},
								{id : '#obsBonusEbitdaMeta', required : false},{id : '#bonusIndivMeta', required : true},
								{id : '#obsMetaIndivMeta', required : false},{id : '#bonusParticipacaoMeta', required : true},
								{id : '#obsParticipacaoMeta', required : false},{id : "#bonusPerformanceMeta", required : true},
								{id : "#obsPerformanceMeta", required : false}, {id : "#bonusMetaExtra", required : false},
								{id : "#obsMetaExtra", required : false}];

		//Buttons
		this._idsButtons = [{id : '#btnSave'}, {id : '#btnCancel'},{id : "#btnExport"}];

		//GRIDS
		this._selectFrequenciaAvaliacao = [{frequencia : ""}, {frequencia : "Mensal"},{frequencia : "Bimestral"},{frequencia : "Trimestral"},
										   {frequencia : "Semestral"},{frequencia : "Anual"}];

		this._sumPesoMetaQuantitativa = 0;
		this._sumPesoMetaProjeto = 0;

		this._loadGridMetasIndividuais(this._gridMetaQuantitativa,[], 1);
		this._loadGridMetasIndividuais(this._gridMetaProjeto,[], 2);
		this._enableDisableElements(this._idsButtons, true);
	}

	/**
	 * Info Colaborador 
	 */
	getColaborador(matricula) {
		let self = this;

		this._sumPesoMetaQuantitativa = 0;
		this._sumPesoMetaProjeto = 0;
		
		$.when(self._colaboradorBusiness.findByMatricula(matricula))
		 .done(function(serverResponse) {
			if (serverResponse.matricula && serverResponse.matricula != null) {
				self._setColaborador(serverResponse);
			} else {
				alert('Colaborador não encontrado.');
				self._clearInfoColaborador();
			}
		 })
		 .fail(function(xhr, textStatus, errorThrown) {
			alert('Colaborador não encontrado.');
			self._clearInfoColaborador();
		 });
	}

	_clearInfoColaborador() {
		this._idsInputsMetas.forEach(item => $(item.id).val(""));
		this._enableGridEdition = false;
		this._blocoMetaExtra.hide();
		this._loadGridMetasIndividuais(this._gridMetaQuantitativa, [], 1);
		this._loadGridMetasIndividuais(this._gridMetaProjeto, [], 2);

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
		self._bonusIndivMeta = $('#bonusIndivMeta');
		
		self._enableGridEdition = true;

		if (cargo.diretoria.possuiMetaExtra == 'S') {
			if (self._blocoMetaExtra.is(':hidden') == true) {
				self._blocoMetaExtra.removeAttr('hidden');
				self._blocoMetaExtra.show();
			}
		} else {
			self._blocoMetaExtra.hide();
		}

		if (metasGerais.length > 0) {
			metasGerais.forEach(element => self._setMetaGeralDoColaborador(element));
		}

		if (colaborador.metasQuantitativas.length > 0) {
			colaborador.metasQuantitativas.forEach(meta => meta.prazo = meta.prazo.toDate(portugueseCalendar.dateFormat));
			colaborador.metasQuantitativas.forEach(meta => self._sumMetaQuantitativa(meta.peso));
		}

		if (colaborador.metasProjetos.length > 0) {
			colaborador.metasProjetos.forEach(meta => meta.prazo = meta.prazo.toDate(portugueseCalendar.dateFormat));
			colaborador.metasProjetos.forEach(meta => self._sumMetaProjeto(meta.peso));
		}

		self._loadGridMetasIndividuais(this._gridMetaQuantitativa, colaborador.metasQuantitativas, 1);
		self._loadGridMetasIndividuais(this._gridMetaProjeto, colaborador.metasProjetos, 2);
	}

	_setMetaGeralDoColaborador(meta) {
		let self = this;
		switch(meta.id) {
			case 1: 
				self._setFieldValue("bonusEbitdaMeta", meta.bonus);
				self._setFieldValue("valMetaGeralMeta", meta.valor);
				self._setFieldValue("obsBonusEbitdaMeta", meta.observacao);
				break;
			case 2:
				self._setFieldValue("bonusIndivMeta", meta.bonus);
				self._setFieldValue("obsMetaIndivMeta", meta.observacao);
				break;
			case 3:
				self._setFieldValue("bonusParticipacaoMeta", meta.bonus);
				self._setFieldValue("obsParticipacaoMeta", meta.observacao);
				break;
			case 4:
				self._setFieldValue("bonusPerformanceMeta", meta.bonus);
				self._setFieldValue("obsPerformanceMeta", meta.observacao);
				break;
			case 5:
				self._setFieldValue("bonusMetaExtra", meta.bonus);
				self._setFieldValue("obsMetaExtra", meta.observacao);
				break;
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

	_loadGridMetasIndividuais(gridObject, metasData, idTipoMeta) {
		let self = this;
		gridObject.jsGrid({
			width: "100%",
			height: "auto",
	 
			inserting: self._enableGridEdition,
			editing: self._enableGridEdition,
			sorting: true,
			paging: true,
			pageSize: 15,
			data: metasData,
	 
			onItemInserting : function (args) {
				if (args.item.id == null) {
					args.item.id = idTipoMeta; 
				}

				if(self._sumMeta(idTipoMeta, args.item.peso) == false) {
					alert("O resultado das metas está excedendo o valor das Metas Individuais! Reveja os pesos das metas informadas.");
					args.cancel = true;
					return;
				}

				if (self._matricula.val() == "") {
					alert("Informe um colaborador antes de adicionar uma meta.");
					args.cancel = true;
					return;
				}

				args.item.sequencia = gridObject.jsGrid("option", "data").length + 1;
				args.item.prazo = args.item.prazo.toLocaleDateString('pt-BR');

				self._insertMeta(args.item);
				self.getColaborador(self._matricula.val());
			},
			onItemUpdating : function(args) {
				args.item.prazo = args.item.prazo.toLocaleDateString('pt-BR');

				if(self._recalcMeta(args.item.id, args.previousItem.peso, args.item.peso) == false) {
					alert("O resultado das metas está excedendo o valor das Metas Individuais! Reveja os pesos das metas informadas.");
					args.cancel = true;
					return;
				}

				self._updateMeta(args.item);
				self.getColaborador(self._matricula.val());
			},

			deleteConfirm: "Deseja realmente excluir a meta selecionada?",
			onItemDeleting : function (args) {
				self._subtractMeta(idTipoMeta, args.item.peso);			
				self._deleteMeta(args.item);
				
				args.item.sequencia = self._gridMetaQuantitativa.jsGrid("option", "data").length - 1
		
				self._gridMetaQuantitativa.jsGrid("refresh");
			},
			onItemDeleted : function (args) {
				let i = 1;
				let items = self._gridMetaQuantitativa.jsGrid("option","data");
				for (i = 0; i < items.length; i ++) {
					items[i].sequencia = i + 1;
				}
			},
			fields: [
				{name : "id", type : "number", visible : false},
				{ name: "sequencia", title : "Sequência", type: "number", width: 80, align : "center",
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
				{ name: "descricao", title : "Descrição", type: "text", width: 150 , align : "center"},
				{ name: "peso", title : "Peso (%)", type: "number", width: 70, align : "center",
					validate : {
						message : "Informe um peso válido (>=0)",
						validator : function (value) {
							return value >= 0;
						}
					}
				},
				{name: "meta", title : "Meta", type: "text", width: 150 , align : "center"},
				{name: "observacao", title : "Observações", type: "text", width: 150 , align : "center"},
				{name: "prazo", title : "Prazos", type : "date", align : "center", width : 80, 
					validate: {
						message : "Informe um prazo",
						validator : function (value) {
							return (value != undefined && value != null);
						}
					}
				},
				{name : "frequenciaMedicao", title : "Freq. Medição", type : "select", items : self._selectFrequenciaAvaliacao, 
				 align : "center", valueField : "frequencia", textField : "frequencia", validate : "required", width : 80},
				{type: "control", width : 70, align : "center",
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

	 _sumMeta(idTipoMeta,val) {
	 	if (idTipoMeta == 1) {
	 		return this._sumMetaQuantitativa(val);
	 	} else {
	 		return this._sumMetaProjeto(val);
	 	}
	 }

	 _recalcMeta(idTipoMeta, previousPeso, currentPeso) {
		let diffPeso = 0;
		let operation = "";
		if (currentPeso < previousPeso) {
			diffPeso = previousPeso - currentPeso;
			operation = "-";
		} else if (currentPeso > previousPeso) {
			diffPeso = currentPeso - previousPeso;
			operation = "+";
		}

	 	if (idTipoMeta == 1) {
			return this._recalcMetaQuantitativa(diffPeso, operation);
	 	} else {
	 		return this._recalcMetaProjeto(diffPeso, operation);
	 	}
	 }

	 _recalcMetaQuantitativa(diffPeso, operation) {
	 	let calc = '' + this._sumPesoMetaQuantitativa + operation + diffPeso;
	 	let tmpPesoQuant = this._sumPesoMetaQuantitativa;
	 	this._sumPesoMetaQuantitativa = eval(calc);

	 	if (this._validateSum(0) == false) {
	 		this._sumPesoMetaQuantitativa = tmpPesoQuant;
	 		return false;
	 	} else {
	 		return true;
	 	}
	 }

	 _recalcMetaProjeto(diffPeso, operation) {
	 	let calc = '' + this._sumPesoMetaProjeto + operation + diffPeso;
	 	let tmpPesoProj = this._sumPesoMetaProjeto;
	 	this._sumPesoMetaProjeto = eval(calc);
	 	
	 	if (this._validateSum(0) == false) {
	 		this._sumPesoMetaProjeto = tmpPesoProj;
	 		return false;
	 	} else {
	 		return true;
	 	}
	 }

	_sumMetaProjeto(val) {
		if (this._validateSum(val) == false) {
			return false;
		}
		
		this._sumPesoMetaProjeto +=  val;

		return true;

	}

	_sumMetaQuantitativa(val) {
		if (this._validateSum(val) == false) {
			return false;
		}

		this._sumPesoMetaQuantitativa += val;

		return true;
	}

	_subtractMeta(idTipoMetaval, val) {
		if (idTipoMetaval == 1) {
			this._sumPesoMetaQuantitativa -= val;
		} else {
			this._sumPesoMetaProjeto -= val;
		}
	}

	_validateSum(val) {
		return ((this._sumPesoMetaProjeto + this._sumPesoMetaQuantitativa + val) <= this._bonusIndivMeta.val());
	}

	validateAndSave() {
		if ((this._sumPesoMetaProjeto + this._sumPesoMetaQuantitativa) != this._bonusIndivMeta.val()) {
			alert("O somatório das metas quantitativas e de projetos está diferente do valor da Meta Individual. Reveja as metas.");
			return;
		}

		this._save();
	}

	_save() {
		alert('Informações salvas com sucesso.');
	}

	/**
	 * CRUD METAS
	 */
	
	 _insertMeta(item) {
		this._metasBusiness.insertMeta(this._matricula.val(), item);
	 }

	 _deleteMeta(item){
		this._metasBusiness.deleteMeta(this._matricula.val(), item);
	 }

	 _updateMeta(item) {
		this._metasBusiness.updateMeta(this._matricula.val(), item);
	 }
}
