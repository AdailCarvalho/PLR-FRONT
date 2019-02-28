class MetasController extends PLRController {
	
	constructor() {
		super();

		this._metasBusiness = new MetasBusiness();
		this._colaboradorBusiness = new ColaboradorBusiness();
		this._historicoBusiness = new HistoricoBusiness();

		this._dialogVersao = $('#dialogVersao');
		this._dialogMetaMensal = $('#dialogMetaMensal');
		this.MAX_METAS_ESPECIFICAS = 7;
		
		this._initFields();
		this._findHistoricoByLoggedUser();
	}
	
	_initFields() {
		this._matricula = $('#matriculaMeta');
		this._nome = $('#nomeMeta');
		this._cargo = $('#cargoMeta');
		this._diretoria = $('#diretoriaMeta');
		this._bonusIndivMeta = $('#bonusIndivMeta');
		this._blocoMetaExtra = $('#blocoMetaExtra');
		this._historicVersion = null;

		this._gridMetaQuantitativa = $("#jsGridMetaQuantitativa");
		this._gridMetaProjeto = $("#jsGridMetaProjeto");
		this._divGridHistoricoUsuarioLogado = $('#idJsGridHistorico');
		this._gridHistorico = $('#jsGridHistorico');

		this._idsInputsMetas = [{id : '#matriculaMeta', required : true},{id: '#nomeMeta', required : true},{id: '#cargoMeta', required : true},
								{id: '#diretoriaMeta',required : true},{id : '#bonusEbitdaMeta', required : true},{id : '#valMetaGeralMeta', required : true},
								{id : '#obsBonusEbitdaMeta', required : false},{id : '#bonusIndivMeta', required : true},
								{id : '#obsMetaIndivMeta', required : false},{id : '#bonusParticipacaoMeta', required : true},
								{id : '#obsParticipacaoMeta', required : false},{id : "#bonusPerformanceMeta", required : true},
								{id : "#obsPerformanceMeta", required : false}, {id : "#bonusMetaExtra", required : false},
								{id : "#obsMetaExtra", required : false}];

		//Buttons
		this._idsButtons = [{id : '#btnSave'}, {id : '#btnCancel'},{id : "#btnExport"},{id : "#btnCriarVersao"}];

		//GRIDS
		this._selectFrequenciaAvaliacao = [{frequencia : ""}, {frequencia : "Mensal"},{frequencia : "Bimestral"},{frequencia : "Trimestral"},
										   {frequencia : "Semestral"},{frequencia : "Anual"},{frequencia : "Data Específica"}];
		this._selectTipoMetas = [{tipoMeta : ""},{tipoMeta : "Quanto Maior, Melhor"},{tipoMeta : "Quanto Menor, Melhor"},{tipoMeta : "Cumpriu/Não Cumpriu"}];										   
		this._selectSituacao = [{situacao : "A", descSituacao : "Ativo"}, {situacao : "I", descSituacao : "Inativo"}];
		
		//Mensal
		this._sampleDataGridMetasMensais = [
			{mes : "Janeiro", 	valorMeta : "", valorRealizado : ""},
			{mes : "Fevereiro", 	valorMeta : "", valorRealizado : ""},
			{mes : "Março", 	valorMeta : "", valorRealizado : ""},
			{mes : "Abril", 	valorMeta : "", valorRealizado : ""},
			{mes : "Maio", 	valorMeta : "", valorRealizado : ""},
			{mes : "Junho", 	valorMeta : "", valorRealizado : ""},
			{mes : "Julho", 	valorMeta : "", valorRealizado : ""},
			{mes : "Agosto", 	valorMeta : "", valorRealizado : ""},
			{mes : "Setembro", 	valorMeta : "", valorRealizado : ""},
			{mes : "Outubro", 	valorMeta : "", valorRealizado : ""},
			{mes : "Novembro", 	valorMeta : "", valorRealizado : ""},
			{mes : "Dezembro", 	valorMeta : "", valorRealizado : ""},

		];

		this._sumPesoMetaQuantitativa = 0;
		this._sumPesoMetaProjeto = 0;

		this._loadGridMetasIndividuais(this._gridMetaQuantitativa,[], 1);
		this._loadGridMetasIndividuais(this._gridMetaProjeto,[], 2);
		this._loadGridHistorico(this._gridHistorico, []);
		this.enableDisableElements(this._idsButtons, true);

		this._dialogVersao.dialog({
			resizable: false,
			height: "auto",
			width: 600,
			modal: true,
			autoOpen: false,
			closeOnEscape: true
		});

		this._dialogMetaMensal.dialog({
			resizable: false,
			height: "auto",
			width: 600,
			modal: true,
			autoOpen: false,
			closeOnEscape: true
		});
	}

	/**
	 * Info Colaborador 
	 */

	editColaborador() {
		if (this._matricula.val() != "" && this._historicVersion) {
			this._historicVersion = null;
			this.getColaborador(this._matricula.val());
		}
	}

	getColaborador(matricula, version) {
		let self = this;

		this._sumPesoMetaQuantitativa = 0;
		this._sumPesoMetaProjeto = 0;
		
		$.when(self._colaboradorBusiness.findByMatricula(matricula, version))
		 .done(function (serverResponse) {
			if (serverResponse.matricula && serverResponse.matricula != null) {
				self._setColaborador(serverResponse, version);
			} else {
				alert('Colaborador não encontrado.');
				self._clearInfoColaborador();
			}
		 })
		 .fail(function (xhr, textStatus, errorThrown) {
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
		this._loadGridHistorico(this._gridHistorico, []);
	}

	/**
	 * CADASTRO
	 */
	_setColaborador(colaborador, version){
		let self = this;
		if (colaborador.matricula == undefined) {
			self._clearInfoColaborador();
			self.enableDisableElements(self._idsButtons, true);
			return;
		} else {
			self.enableDisableElements(self._idsButtons, false);
		}

		let cargo = colaborador.cargo;
		let metasGerais = colaborador.metasGerais; 

		self._matricula.val(colaborador.matricula);
		self._nome.val(colaborador.nome);
		self._cargo.val(cargo.nome);
		self._diretoria.val(cargo.diretoria.nome);
		self._historicVersion = version;

		if (version) {
			self._enableGridEdition = false;
			$('#btnCriarVersao').attr('disabled', true);
		} else {
			self._enableGridEdition = true;
			$('#btnCriarVersao').removeAttr('disabled');
		}

		if (cargo.diretoria.possuiMetaExtra == 'S') {
			self.showHiddenElement(self._blocoMetaExtra);
		} else {
			self.hideElement(self._blocoMetaExtra);
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
				self.setFieldValue("bonusEbitdaMeta", meta.bonus);
				self.setFieldValue("valMetaGeralMeta", meta.valor);
				self.setFieldValue("obsBonusEbitdaMeta", meta.observacao);
				break;
			case 2:
				self.setFieldValue("bonusIndivMeta", meta.bonus);
				self.setFieldValue("obsMetaIndivMeta", meta.observacao);
				break;
			case 3:
				self.setFieldValue("bonusParticipacaoMeta", meta.bonus);
				self.setFieldValue("obsParticipacaoMeta", meta.observacao);
				break;
			case 4:
				self.setFieldValue("bonusPerformanceMeta", meta.bonus);
				self.setFieldValue("obsPerformanceMeta", meta.observacao);
				break;
			case 5:
				self.setFieldValue("bonusMetaExtra", meta.bonus);
				self.setFieldValue("obsMetaExtra", meta.observacao);
				break;
			default:
				break;
		}
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
				console.log('Debug grid metas');
				if (args.item.id == null) {
					args.item.id = idTipoMeta; 
				}

				if (gridObject.jsGrid("option", "data").length + 1 > self.MAX_METAS_ESPECIFICAS) {
					alert("Limite de metas atingido.");
					args.cancel = true;
					return;
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
				args.item.responsavel = getLoggedUser();

				self._insertMeta(args.item);
				self.getColaborador(self._matricula.val());
				self._findHistoricoByLoggedUser();
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
		
				self._findHistoricoByLoggedUser();
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
				{ name: "sequencia", title : "Seq.", type: "number", width: 60, align : "center",
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
				{ name: "descricao", title : "Descrição", type: "text", width: 120 , align : "center"},
				{ name: "peso", title : "Peso (%)", type: "number", width: 70, align : "center",
					validate : {
						message : "Informe um peso válido (>=0)",
						validator : function (value) {
							return value >= 0;
						}
					}
				},
				{name: "meta", title : "Meta", type: "text", width: 150 , align : "center"},
				{name: "observacao", title : "Observações", type: "text", width: 120 , align : "center"},
				{name: "prazo", title : "Prazos", type : "date", align : "center", width : 90, 
					validate: {
						message : "Informe um prazo",
						validator : function (value) {
							return (value != undefined && value != null);
						}
					}
				},
				{name : "frequenciaMedicao", title : "Freq. Medição", type : "select", items : self._selectFrequenciaAvaliacao, 
				 align : "center", valueField : "frequencia", textField : "frequencia", validate : "required", width : 90},
				{name : "tipoMeta", title : "Tipo", type : "select", items : self._selectTipoMetas, 
				 align : "center", valueField : "tipoMeta", textField : "tipoMeta", validate : "required", width : 90},
				{type: "control", width : 70, align : "center", inserting : self._enableGridEdition,
						deleteButton : self._enableGridEdition, editButton : self._enableGridEdition, 
						itemTemplate: function(value, item) {
							if (item.sequencia == null) {
								return;
							}

							var $result = this.__proto__.itemTemplate.call(this, value, item);
							
							var $calendario = $("<a style='color: green'><i class='fas fa-calendar-alt' " +
							" title='Metas Mensais' style= 'margin-left: 7px;'></i></a>")
										   .click(function() {
												self.configDialogMetasMensais(item);
										   });

							$result = $result.add($calendario);
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

	exportar() {
		if (this._matricula.val() == "") {
			alert("Pesquise um colaborador primeiro, para que seja possível realizar o export.");
			return;
		} 
		
		if (this._historicVersion) {
			this._historicoBusiness.exportHistorico(this._matricula.val(), this._historicVersion);
		} else {
			this._colaboradorBusiness.exportXls(this._matricula.val());
		}
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

	/**
	 * HISTORICO
	 */

	_findHistoricoByLoggedUser() {
		let self = this;
		$.when(self._historicoBusiness.findHistoricoForResponsavel(getLoggedUser()))
		 .done(function(historico) {
			if (historico && historico.length > 0) {
				self.showHiddenElement(self._divGridHistoricoUsuarioLogado);
				self._loadGridHistorico(self._gridHistorico ,historico);
			}
		 })
		 .fail(function(xhr, textStatus, errorThrown) {
			alert('Colaborador não encontrado.');
			self._clearInfoColaborador();
		 });
	}

	openDialogVersao() {
		this._dialogVersao.dialog('open');
	}

	closeDialogVersao() {
		this._dialogVersao.dialog('close');
	}

	validateDialogVersao() {
		let inicioVigencia = $('#idInicioVigencia');
		let fimVigencia = $('#idFimVigencia');

		if (inicioVigencia.val() == "") {
			alert('Informe o início da vigência!');
			inicioVigencia.focus();
			return;
		}

		if (fimVigencia.val() == "") {
			alert('Informe o fim da vigência!');
			fimVigencia.focus();
			return;
		}

		if (new Date(fimVigencia.val()) < new Date(inicioVigencia.val())) {
			alert('O fim da vigência não pode ser menor que o início!');
			fimVigencia.focus();
			return;
		}

		this.criaVersao();
	}

	criaVersao() {
		let self = this;
		self.closeDialogVersao();
		$.when(self._historicoBusiness.generateHistoricVersion(this._historico))
		 .done(function(historico) {
			if (historico) {
				alert('Versão criada com sucesso!');
				self._findHistoricoByLoggedUser();
			}
		 })
		 .fail(function(xhr, textStatus, errorThrown) {
			alert('Colaborador não encontrado.');
			self._clearInfoColaborador();
		 });
	}

	get _historico() {
		let situacaoFinal = 'A';
		if ($('#idInativo').is(':checked')) {
			situacaoFinal = 'I';
		}

		return {
			matricula : this._matricula.val(),
			matriculaResponsavel : getLoggedUser(),
			inicioVigencia : $('#idInicioVigencia').val(),
			fimVigencia : $('#idFimVigencia').val(),
			situacao : situacaoFinal,
			comentario : $('#idComentarioVersao').val(),
		}
	}

	_loadGridHistorico(gridObject, historicoData) {
		let self = this;
		gridObject.jsGrid({
			width: "100%",
			height: "auto",
	 
			inserting: false,
			editing: true,
			sorting: true,
			paging: true,
			pageSize: 15,
			data: historicoData,
			rowClick : function (args) {
				return false;
			},
			onItemUpdating : function (args) {
				self._historicoBusiness.updateHistorico(args.item);	
			},
			fields: [
				{name : "id", title : "Nº Doc.", type : "number", align : "center", width : 30, editing: false},
				{name : "versao", title: "Versão", type : "number", align : "center", width : 30, editing: false},
				{name : "dataInclusao", title: "Criação", type : "text", align : "center", width : 40, editing: false},
				{name : "situacao", title : "Status", type : "select", items : self._selectSituacao, valueField : "situacao", 
						textField : "descSituacao", align : "center", width : 40},
				{name : "nomeColaborador", title : "Colaborador", type : "text", align : "center", width : 60, editing: false},
				{name : "comentario", title : "Comentário", type : "text", align : "left", width : 120},
				{name : "inicioVigencia", title : "Ini. Vigência", type : "text", align : "center", width : 45, editing: false},
				{name : "fimVigencia", title : "Fim Vigência", type : "text", align : "center", width : 45, editing: false},
				{type: "control", width : 50, align : "center", deleteButton : false, inserting : false,
						itemTemplate: function(value, item) {
							var $result = this.__proto__.itemTemplate.call(this, value, item);
							
							var $view = $("<a style='color: inherit'><i class='fas fa-eye fa-lg' " +
							" title='Visualizar Meta' style= 'margin-left: 7px;'></i></a>")
										   .click(function() {
												$('.nav a[href="#' + 'metas' + '"]').tab('show');
												self.getColaborador(item.matricula, item.versao);
										   });

							$result = $result.add($view);

							var $download = $("<a style='color: inherit'><i class='fas fa-file-download fa-lg' " +
								  " title='Baixar Versão de Meta' style= 'margin-left: 7px;'></i></a>")
								  		.click(function() { 
											self._historicoBusiness.exportHistorico(item.matricula, item.versao);
								  		});

							$result = $result.add($download);

							return $result;
					}
				 }
			]
		
		});
	}

	
	/**
	* Metas Mensais
	*/
	configDialogMetasMensais(item) {
		this.openDialogMetasMensais();
		let tipoMeta = '';
		if (item.id == 1) {
			tipoMeta = 'Quantitativa';
		} else {
			tipoMeta = 'Projeto';
		}

		$('#idMetaMensal').val(item.sequencia);
		$('#idDescMetaMensal').val(item.descricao);
		$('#idTipoMetaMensal').val(tipoMeta);

		this._loadGridMetaMensal($('#jsGridMetaMensal'), this._sampleDataGridMetasMensais);
	}

	openDialogMetasMensais() {
		this._dialogMetaMensal.dialog('open');
	}

	closeDialogMetasMensais() {
		this._dialogMetaMensal.dialog('close');
	}

	_loadGridMetaMensal(gridObject, metaMensalData) {
		let self = this;
		gridObject.jsGrid({
			width: "100%",
			height: "auto",
	 
			inserting: false,
			editing: true,
			sorting: false,
			paging: true,
			pageSize: 6,
			data: metaMensalData,
			rowClick : function (args) {
				return false;
			},
			fields: [
				{name : "mes", title : "Mês", type : "text", align : "center", width : 80, editing: false, sorting : false},
				{name : "valorMeta", title: "Acumulado", type : "number", align : "center", width : 50, sorting : false},
				{name : "valorRealizado", title: "Realizado", type : "number", align : "center", width : 50, sorting : false},
				{type: "control", width : 30, align : "center", deleteButton : false}
			]
		});
	}
}