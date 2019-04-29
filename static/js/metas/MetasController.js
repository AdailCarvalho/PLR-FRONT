class MetasController extends PLRController {
	
	constructor() {
		super();

		this._metasBusiness = new MetasBusiness();
		this._colaboradorBusiness = new ColaboradorBusiness();
		this._historicoBusiness = new HistoricoBusiness();
		this._perfilController = new PerfilController();

		this._dialogVersao = $('#dialogVersao');
		this._dialogMetaMensal = $('#dialogMetaMensal');
		this._dialogCancelaMetaMensal = $('#dialogMetaMensalCancelar');
		this._dialogAnexo = $('#dialogAnexaFoto');
		this.MAX_METAS_ESPECIFICAS = 14;
		this.HAS_EDITED_METAS_MENSAIS = false;
		
		this._initFields();
		this._findHistorico();
	}
	
	_initFields() {
		//Info geral
		this._matricula = $('#matriculaMeta');
		this._nome = $('#nomeMeta');
		this._cargo = $('#cargoMeta');
		this._diretoria = $('#diretoriaMeta');
		
		//Anexo
		this._imageArea = $('#idImageArea');
		this._imageLoaded = document.getElementById('idImageArea');
		this._image = null;

		//Valida somatorio de individuais a este valor
		this._bonusIndivMeta = $('#bonusIndivMeta');

		//Adicionais
		this._blocoMetaExtra = $('#blocoMetaExtra');
		this._blocoInfoMeta = $('#blocoInfoMeta');

		//Grids metas individuais
		this._gridMetaQuantitativa = $("#jsGridMetaQuantitativa");
		this._gridMetaProjeto = $("#jsGridMetaProjeto");
		
		//historico
		this._gridHistoricoRegistrado = $('#jsGridHistoricoRegistrado');
		this._gridHistoricoPertencente = $('#jsGridHistoricoPertencente');
		this._numeroDoc = $('#idNumDoc');
		this._numeroVersao = $('#idNumVersao');
		this._historicVersion = null;
		this._historicVersionSelecionado = null;
		this._matriculaSelecionadaHistorico = null;

		this._idsInputsMetas = [{id : '#matriculaMeta', required : true},{id: '#nomeMeta', required : true},{id: '#cargoMeta', required : true},
								{id: '#diretoriaMeta',required : true},{id : '#bonusEbitdaMeta', required : true},{id : '#valMetaGeralMeta', required : true},
								{id : '#obsBonusEbitdaMeta', required : false},{id : '#bonusIndivMeta', required : true},
								{id : '#obsMetaIndivMeta', required : false},{id : '#bonusParticipacaoMeta', required : true},
								{id : '#obsParticipacaoMeta', required : false},{id : "#bonusPerformanceMeta", required : true},
								{id : "#obsPerformanceMeta", required : false}, {id : "#bonusMetaExtra", required : false},
								{id : "#obsMetaExtra", required : false}];

		//Buttons
		this._btnCriarVersao = $('#btnCriarVersao');
		this._btnLabelAnexo = $('#idLabelAnexo');

		this._idsButtons = [{id : '#btnEditar'}, {id : '#btnCancel'},{id : "#btnExport"},{id : "#btnCriarVersao"}, {id : "#btnAnexarFoto"}];

		//Select grids
		this._selectFrequenciaAvaliacao = [{frequencia : ""}, {frequencia : "Mensal"},{frequencia : "Bimestral"},{frequencia : "Trimestral"},
										   {frequencia : "Semestral"},{frequencia : "Anual"},{frequencia : "Data Específica"}];
		this._selectTipoMetas = [{tipoMeta : ""},{tipoMeta : "Quanto Maior, Melhor"},{tipoMeta : "Quanto Menor, Melhor"},{tipoMeta : "Cumpriu/Não Cumpriu"}];										   
		this._selectSituacao = [{situacao : "A", descSituacao : "Ativo"}, {situacao : "I", descSituacao : "Inativo"}];
		
		//Mensal
		this._sampleDataGridMetasMensais = [
			{numMes : 1, mes : "Janeiro", 	valorMeta : "", valorRealizado : ""},
			{numMes : 2, mes : "Fevereiro", 	valorMeta : "", valorRealizado : ""},
			{numMes : 3, mes : "Março", 	valorMeta : "", valorRealizado : ""},
			{numMes : 4, mes : "Abril", 	valorMeta : "", valorRealizado : ""},
			{numMes : 5, mes : "Maio", 	valorMeta : "", valorRealizado : ""},
			{numMes : 6, mes : "Junho", 	valorMeta : "", valorRealizado : ""},
			{numMes : 7, mes : "Julho", 	valorMeta : "", valorRealizado : ""},
			{numMes : 8, mes : "Agosto", 	valorMeta : "", valorRealizado : ""},
			{numMes : 9, mes : "Setembro", 	valorMeta : "", valorRealizado : ""},
			{numMes : 10, mes : "Outubro", 	valorMeta : "", valorRealizado : ""},
			{numMes : 11, mes : "Novembro", 	valorMeta : "", valorRealizado : ""},
			{numMes : 12, mes : "Dezembro", 	valorMeta : "", valorRealizado : ""},

		];

		this._sumPesoMetasIndividuais = 0;

		this._loadGridMetasIndividuais(this._gridMetaQuantitativa,[], 1);
		this._loadGridMetasIndividuais(this._gridMetaProjeto,[], 2);
		this._loadGridHistorico(this._gridHistoricoRegistrado, []);
		this._loadGridHistorico(this._gridHistoricoPertencente, []);

		this._adminHTMLAreasToHide = ['#meusCadastrosTab', '#idLabelAnexo', '#btnAnexo', '#btnCriarVersao', '#btnEditar'];
		this._adminHTMLAreasToBlock = [{id : '#matriculaMeta'}];

		this.enableDisableElements(this._idsButtons, true);
		this.applyConstraintsOnFields(this._adminHTMLAreasToHide, this._adminHTMLAreasToBlock, this._perfilController.isEditable());

		this._dialogVersao.dialog({
			resizable: false,
			height: "auto",
			width: 600,
			modal: true,
			autoOpen: false,
			closeOnEscape: true
		});

		this._dialogMetaMensal.dialog({
			resizable: true,
			height: "auto",
			width: 600,
			modal: true,
			autoOpen: false,
			closeOnEscape: true
		});

		this._dialogCancelaMetaMensal.dialog({
			resizable: false,
			height: "auto",
			width: 600,
			modal: true,
			autoOpen: false,
			closeOnEscape: true
		});

		this._dialogAnexo.dialog({
			resizable: false,
			height: 500,
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

	getPerfilUsuarioLogado() {
		this._pefil
	}

	getColaborador(matricula, version) {
		let self = this;
		
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
			self._btnCriarVersao.attr('disabled', true);

			self._setMetaInfo(colaborador.numDoc, version);
		} else {
			self._enableGridEdition = true;
			self._btnCriarVersao.removeAttr('disabled');

			self.hideElements([self._blocoInfoMeta]);
			self.showHiddenElement(this._btnLabelAnexo);
		}

		if (colaborador.possuiMetaExtra == 'S') {
			self.showHiddenElement(self._blocoMetaExtra);
		} else {
			self.hideElements([self._blocoMetaExtra]);
		}

		self._exibeImagem(colaborador.base64Img);

		if (metasGerais.length > 0) {
			metasGerais.forEach(element => self._setMetaGeralDoColaborador(element));
		}

		if (colaborador.metasQuantitativas.length > 0) {
			colaborador.metasQuantitativas.forEach(meta => meta.prazo = meta.prazo.toDate(portugueseCalendar.dateFormat));
		}

		if (colaborador.metasProjetos.length > 0) {
			colaborador.metasProjetos.forEach(meta => meta.prazo = meta.prazo.toDate(portugueseCalendar.dateFormat));
		}

		self._loadGridMetasIndividuais(this._gridMetaQuantitativa, colaborador.metasQuantitativas, 1);
		self._loadGridMetasIndividuais(this._gridMetaProjeto, colaborador.metasProjetos, 2);
	}

	_setMetaInfo(numDoc, version) {
		this.showHiddenElement(this._blocoInfoMeta);
		
		this._numeroDoc.val('Nº: ' + numDoc);
		this._numeroVersao.val('V. ' + version);
	}

	_setMetaGeralDoColaborador(meta) {
		let self = this;
		switch(meta.id) {
			case 1: 
				self.setFieldValue("bonusEbitdaMeta", meta.bonus);
				self.setFieldValue("valMetaGeralMeta", accounting.formatMoney(meta.valor, "", 2, ".", ","));
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
			case 6:
				self.setFieldValue("bonusCustoGlobal", meta.bonus);
				self.setFieldValue("valMetaGeralCustoGlobal", accounting.formatMoney(meta.valor, "", 2, ".", ","));
				self.setFieldValue("obsBonusCustoGlobal", meta.observacao);
				break;
			case 7:
				self.setFieldValue("bonusMargemDerivados", meta.bonus);
				self.setFieldValue("valMetaGeralMargemDerivados", accounting.formatMoney(meta.valor, "", 2, ".", ","));
				self.setFieldValue("obsBonusMargemDerivados", meta.observacao);
				break;
			case 8:
				self.setFieldValue("bonusIogurte", meta.bonus);
				self.setFieldValue("obsBonusIogurte", meta.observacao);
				break;
			default:
				break;
		}
	}

	_clearInfoColaborador() {
		this._idsInputsMetas.forEach(item => $(item.id).val(""));
		this._enableGridEdition = false;
		this._imageLoaded.src = "";
		this._blocoMetaExtra.hide();
		this._blocoInfoMeta.hide();
		this._loadGridMetasIndividuais(this._gridMetaQuantitativa, [], 1);
		this._loadGridMetasIndividuais(this._gridMetaProjeto, [], 2);
	}


	/** 
	 * Anexos de Imagem
	 */

	anexaImagem(photo) {
		let self = this;
		
		var file    = photo.files[0]; 
		var reader  = new FileReader();
		
		if (file.size > 1000000) {
			alert('Tamanho máximo permitido da imagem : 1 MB');
			return;
		}
 
		if (file) {
			reader.readAsDataURL(file); //reads the data as a URL
		} else {
			self._imageLoaded.src = "";
		}

		reader.onloadend = function () {
			self._imageLoaded.src = reader.result;
			self._image = reader.result;

			self.showHiddenElement(self._imageArea);
			self._salvaImagem();
		}
	}

	downloadImagem() {
		if (this._image) {
			var url = this._image.replace(/^data:image\/[^;]+/, 'data:application/octet-stream');
			window.open(url);
		}
	}

	printImagem() {
		let self = this;
		if (self._image) {
			self._imageArea.printThis();
		}
	}

	openDialogAnexoViaEditor() {
		this._exibeImagem(this._image);
		this._dialogAnexo.dialog('open');
	}

	openDialogAnexoViaHistorico(base64Img) {
		this._exibeImagem(base64Img);
		this._dialogAnexo.dialog('open');
	}

	closeDialogAnexo() {
		this._dialogAnexo.dialog('close');
	}

	_exibeImagem(base64Img) {
		let self = this;
		if (base64Img) {
			self._image = base64Img;
			self.showHiddenElement(self._imageArea);
			self._imageLoaded.src = base64Img;
		} else {
			self._imageLoaded.src = "";
			self.hideElements([self._imageArea]);
		}
	}
	_salvaImagem() {
		let self = this;
		let matricula = self._matricula ? self._matricula.val() : "";
		let mat = matricula == "" ? self._matriculaSelecionadaHistorico : matricula;
		if (self._image) {
			$.when(self._historicoBusiness.uploadAnexo(mat, self._historicVersionSelecionado, self._image))
			 .done(function () {
				alert('Anexo salvo.');
				self._findHistorico();
			 })
			 .fail(function (xhr, errorThrown, textStatus) {
				alert('Erro ao salvar anexo!');
			 }) ;
		}
	}

	/** 
	 * Metas Individuais
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

				if (gridObject.jsGrid("option", "data").length + 1 > self.MAX_METAS_ESPECIFICAS) {
					alert("Limite de metas atingido.");
					args.cancel = true;
					return;
				}

				self._calculaPesosMetasIndividuais(args.item.peso);
				if(!self._validateForGrid()) {
					alert("O resultado das metas está excedendo o valor das Metas Individuais! Reveja os pesos das metas informadas.");
					args.cancel = true;
					return;
				}

				if (self._matricula.val() == "") {
					alert("Informe um colaborador antes de adicionar uma meta.");
					args.cancel = true;
					return;
				}

				var maxSequencia = 0;
				for (var i = 0; i < gridObject.jsGrid("option", "data").length; i ++) {
					var currentSequencia = gridObject.jsGrid("option", "data")[i].sequencia;
					if (currentSequencia > maxSequencia) {
						maxSequencia = currentSequencia;
					}
				}

				args.item.sequencia = maxSequencia == 0 ? 1 : (maxSequencia + 1);
				args.item.prazo = args.item.prazo.toLocaleDateString('pt-BR');
				args.item.responsavel = getLoggedUser();
				args.item.valMeta = formatDecimalToBigDecimal(args.item.valMeta);

				self._insertMeta(args.item);
				self.getColaborador(self._matricula.val());
			},

			onItemUpdating : function(args) {
				self._calculaPesosMetasIndividuais(args.item.peso, args.previousItem.peso);
				if(!self._validateForGrid()) {
					alert("O resultado das metas está excedendo o valor das Metas Individuais! Reveja os pesos das metas informadas.");
					args.cancel = true;
					return;
				}
			},
			
			onItemUpdated : function(args) {
				args.item.valMeta = formatDecimalToBigDecimal(args.item.valMeta);
				self._updateMeta(args.item);
				self.getColaborador(self._matricula.val());
			},

			deleteConfirm: "Deseja realmente excluir a meta selecionada?",
			onItemDeleting : function (args) {
				self._deleteMeta(args.item);
				self._calculaPesosMetasIndividuais();
			},
			fields: [
				{name : "id", type : "number", visible : false},
				{ name: "sequencia", title : "Seq.", type: "number", width: 40, align : "center",
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
				{ name: "peso", title : "Peso (%)", type: "number", width: 60, align : "center",
					validate : {
						message : "Informe um peso válido (>=0)",
						validator : function (value) {
							return value >= 0;
						}
					}
				},
				{name: "valMeta", title : "Meta", type : "decimal", width: 70 , align : "center"},
				{name: "observacao", title : "Observações", type: "text", width: 170 , align : "center"},
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
				 align : "center", valueField : "tipoMeta", textField : "tipoMeta", validate : "required", width : 120},
				{type: "control", width : 70, align : "center", inserting : self._enableGridEdition,
						deleteButton : self._enableGridEdition, editButton : self._enableGridEdition, 
						itemTemplate: function(value, item) {
							if (item.sequencia == null) {
								return;
							}

							var $result = this.__proto__.itemTemplate.call(this, value, item);
							
							var $calendario = $("<a style='color: #003cbe'><i class='fas fa-calendar-alt' " +
							" title='Metas Mensais' style= 'margin-left: 7px;'></i></a>")
										   .click(function() {
												self.loadMetasMensais(item);
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

	_calculaPesosMetasIndividuais(newValue, previousValue) {
		let dadosQuantitativas = this._gridMetaQuantitativa.jsGrid('option', 'data');
		let dadosProjetos = this._gridMetaProjeto.jsGrid('option', 'data');
		let sumQuantitativas = 0;
		let sumProjetos = 0;
		for (var i = 0; i < dadosQuantitativas.length; i ++) {
			sumQuantitativas += dadosQuantitativas[i].peso;
		}

		for (var i = 0; i < dadosProjetos.length; i ++) {
			sumProjetos += dadosProjetos[i].peso;
		}

		this._sumPesoMetasIndividuais = sumQuantitativas + sumProjetos;
		if (previousValue) {
			this._sumPesoMetasIndividuais -= previousValue;
		}
		if (newValue) {
			this._sumPesoMetasIndividuais += newValue;
		}
	}

	_validateForGrid() {
		return ((this._sumPesoMetasIndividuais) <= this._bonusIndivMeta.val());
	}

	 _validateForVersion() {
		this._calculaPesosMetasIndividuais();
		if ((this._sumPesoMetasIndividuais) != this._bonusIndivMeta.val()) {
			alert("O somatório das metas quantitativas e de projetos está diferente do valor da Meta Individual. Reveja as metas.");
			return false;
		} 
		return true;
	}

	 _deleteMeta(item){
		this._metasBusiness.deleteMeta(this._matricula.val(), item);
	 }
	
	 _insertMeta(item) {
		this._metasBusiness.insertMeta(this._matricula.val(), item);
	 }

	 _updateMeta(item) {
		this._metasBusiness.updateMeta(this._matricula.val(), item);
	 }

	/**
	 * HISTORICO
	 */

	closeDialogVersao() {
		this._dialogVersao.dialog('close');
	}
	
	criaVersao() {
		let self = this;
		self.closeDialogVersao();
		$.when(self._historicoBusiness.generateHistoricVersion(this._historico))
		 .done(function(historico) {
			if (historico) {
				alert('Versão criada com sucesso!');
				self._findHistorico();
			}
		 })
		 .fail(function(xhr, textStatus, errorThrown) {
			alert('Colaborador não encontrado.');
			self._clearInfoColaborador();
		 });
	}

	openDialogVersao() {
		if (this._validateForVersion()) {
			this._dialogVersao.dialog('open');
		}
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

	_findHistorico() {
		let self = this;
		self._findHistoricoOwnedByLoggedUser();
		if (self._perfilController.isEditable()) {
			self._findHistoricoRegisteredByLoggedUser();
		}
	}

	_findHistoricoRegisteredByLoggedUser() {
		let self = this;
		$.when(self._historicoBusiness.findHistoricoForResponsavel(getLoggedUser()))
		 .done(function(historico) {
			if (historico && historico.length > 0) {
				self._loadGridHistorico(self._gridHistoricoRegistrado ,historico);
			}
		 })
		 .fail(function(xhr, textStatus, errorThrown) {
			alert('Colaborador não encontrado.');
			self._clearInfoColaborador();
		 });
	}

	_findHistoricoOwnedByLoggedUser() {
		let self = this;
		$.when(self._historicoBusiness.findHistoricoForColaborador(getLoggedUser()))
		 .done(function(historico) {
			if (historico && historico.length > 0) {
				self._loadGridHistorico(self._gridHistoricoPertencente ,historico);
			}
		 })
		 .fail(function(xhr, textStatus, errorThrown) {
			alert('Colaborador não encontrado.');
			self._clearInfoColaborador();
		 });
	}

	_loadGridHistorico(gridObject, historicoData) {
		let self = this;
		gridObject.jsGrid({
			width: "1280px",
			height: "auto",
	 
			inserting: false,
			editing: true,
			sorting: true,
			paging: true,
			pageSize: 10,
			data: historicoData,
			pagerFormat: 'Páginas: {first} {prev} {pages} {next} {last} &nbsp;&nbsp; {pageIndex} de {pageCount}',
			pageNextText: 'Próxima',
			pagePrevText: 'Anterior',
			pageFirstText: 'Primeira',
			pageLastText: 'Última', 
			deleteConfirm: "Deseja realmente excluir a versão de meta selecionada?",
			
			rowClick : function(args) {
				return false;
			},
			
			onItemUpdating : function (args) {
				self._historicoBusiness.updateHistorico(args.item);	
			},

			onItemDeleting : function (args) {
				self._historicoBusiness.deleteHistorico(args.item.id, args.item.matricula);
			},

			onItemDeleted : function (args) {
				alert('Versão excluída com sucesso. ');
				self._findHistorico();
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
				{type: "control", width : 50, align : "center", deleteButton : self._perfilController.isEditable(), inserting : false, 
						editButton : self._perfilController.isEditable(), 
						itemTemplate: function(value, item) {
							var $result = this.__proto__.itemTemplate.call(this, value, item);
							
							var $view = $("<a style='color: #003cbe'><i class='fas fa-eye fa-lg' " +
							" title='Visualizar Meta' style= 'margin-left: 7px;'></i></a>")
										   .click(function() {
												$('.nav a[href="#' + 'metas' + '"]').tab('show');
												self.getColaborador(item.matricula, item.versao);
										   });

							$result = $result.add($view);

							var $download = $("<a style='color: #003cbe'><i class='fas fa-file-download fa-lg' " +
								  " title='Baixar Versão de Meta' style= 'margin-left: 7px;'></i></a>")
								  		.click(function() { 
											self._historicoBusiness.exportHistorico(item.matricula, item.versao);
								  		});

							$result = $result.add($download);
							
							var $anexo = $("<a style='color : #003cbe'><i class='fas fa-image fa-lg' " + 
								 " title='Anexar Imagem' style= 'margin-left : 7px;'></i></a>")
										  .click(function() {
												self._matriculaSelecionadaHistorico = item.matricula;
												self._historicVersionSelecionado = item.versao;
												self.openDialogAnexoViaHistorico(item.base64Img);
										  });
							
							$result = $result.add($anexo);

							return $result;
					}
				 }
			]
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
			base64Img : this._image,
			comentario : $('#idComentarioVersao').val(),
		}
	}

	
	/**
	* Metas Mensais
	*/
	cleanDialogMetasMensaisFields() {
		$('#idMetaMensal').val('');
		$('#idDescMetaMensal').val('');
		$('#idTipoMetaMensal').val('');

		$('#idMetaMensalSomaPlan').val('');
		$('#idMetaMensalMediaPlan').val('');
		$('#idMetaMensalRealizadoSoma').val('');
		$('#idMetaMensalRealizadoMedia').val('');

		this._sampleDataGridMetasMensais.forEach(item => (item.valorMeta = "", item.valorRealizado = ""));
	}

	configDialogMetasMensais(item, metasMensaisData) {
		
		let tipoMeta = '';
		if (item.id == 1) {
			tipoMeta = 'Quantitativa';
		} else {
			tipoMeta = 'Projeto';
		}

		this.cleanDialogMetasMensaisFields();
		this.openDialogMetasMensais();

		$('#idMetaMensal').val(item.sequencia);
		$('#idDescMetaMensal').val(item.descricao);
		$('#idTipoMetaMensal').val(tipoMeta);

		if (metasMensaisData && metasMensaisData.length > 0) {
			this._loadGridMetaMensal($('#jsGridMetaMensal'), metasMensaisData);
		} else {
			this._sampleDataGridMetasMensais
				.forEach(dataItem => (dataItem.idMeta = item.id, dataItem.sequencia = item.sequencia, dataItem.matricula = this._matricula.val()));
			this._loadGridMetaMensal($('#jsGridMetaMensal'), this._sampleDataGridMetasMensais);
		}
	}

	loadMetasMensais(item) {
		let self = this;
		$.when(self._metasBusiness.findMetasMensais(item.id, item.sequencia, self._matricula.val()), self._historicVersion)
		 .done(function (serverData) {
			self.configDialogMetasMensais(item, serverData[0]);
		 }).fail(function(xhr, textStatus, errorThrown) {
			alert('Erro ao carregar dados mensais do colaborador.');
		 });
	}

	openDialogMetasMensais() {
		this._dialogMetaMensal.dialog('open');
	}

	confirmDialogMetasMensais() {
		if (this.HAS_EDITED_METAS_MENSAIS) {
			this._dialogCancelaMetaMensal.dialog('open');
		} else {
			this.closeDialogMetasMensais();
		}
	}

	closeDialogMetasMensais() {
		this._dialogCancelaMetaMensal.dialog('close');
		this._dialogMetaMensal.dialog('close');
	}

	saveMetasMensais() {
		let dadosMetasMensais = $('#jsGridMetaMensal').jsGrid('option', 'data');
		dadosMetasMensais.forEach(item => {
			item.valorMeta = formatDecimalToBigDecimal(item.valorMeta);
			item.valorRealizado = formatDecimalToBigDecimal(item.valorRealizado);
		});

		if (this.HAS_EDITED_METAS_MENSAIS) {
			$.when(this._metasBusiness.saveMetasMensais(this._matricula.val(), 	dadosMetasMensais))
			 .done(function() {
				alert('Informacoes salvas!');
			 })
			 .fail(function(xhr, textStatus, errorThrown) {
				alert('Erro ao salvar informacoes de metas mensais para o colaborador');
			 });
		}
		this.closeDialogMetasMensais();
	}

	_calculaAgregadosMensais(dadosMensais) {
		let totLinhasPreenchidasMeta = 0;
		let totLinhasPreenchidasReal = 0;
		let sumPlanejado = 0;
		let sumRealizado = 0;
		let avgPlanejado = 0;
		let avgRealizado = 0; 
		
		for (var i = 0; i < dadosMensais.length; i ++) {
			if (dadosMensais[i].valorMeta != "" && dadosMensais[i].valorMeta != null) {
				sumPlanejado += parseFloat(formatDecimalToBigDecimal(dadosMensais[i].valorMeta));
				totLinhasPreenchidasMeta++
			}
			if (dadosMensais[i].valorRealizado != "" && dadosMensais[i].valorRealizado != null) {
				sumRealizado += parseFloat(formatDecimalToBigDecimal(dadosMensais[i].valorRealizado));
				totLinhasPreenchidasReal++;
			}
		}

		if (totLinhasPreenchidasMeta > 0) {
			avgPlanejado = sumPlanejado / totLinhasPreenchidasMeta;
		}

		if (totLinhasPreenchidasReal > 0) {
			avgRealizado = sumRealizado / totLinhasPreenchidasReal;
		}
		this._configValoresCalculados(sumPlanejado, avgPlanejado, sumRealizado, avgRealizado);
	}

	_configValoresCalculados(sumPlanejado, avgPlanejado, sumRealizado, avgRealizado) {
		$('#idMetaMensalSomaPlan').val(accounting.formatMoney(sumPlanejado, "", 2, ".", ","));
		$('#idMetaMensalMediaPlan').val(accounting.formatMoney(avgPlanejado, "", 2, ".", ","));
		$('#idMetaMensalRealizadoSoma').val(accounting.formatMoney(sumRealizado, "", 2, ".", ","));
		$('#idMetaMensalRealizadoMedia').val(accounting.formatMoney(avgRealizado, "", 2, ".", ","));
	}

	_loadGridMetaMensal(gridObject, metaMensalData) {
		let self = this;

		self.HAS_EDITED_METAS_MENSAIS = false;
		if (metaMensalData && metaMensalData.length > 0) {
			self._calculaAgregadosMensais(metaMensalData);
		}

		gridObject.jsGrid({
			width: "100%",
			height: "auto",
	 
			inserting: false,
			editing: self._enableGridEdition,
			sorting: false,
			paging: true,
			pageSize: 6,
			pagerFormat: 'Páginas: {first} {prev} {pages} {next} {last} &nbsp;&nbsp; {pageIndex} de {pageCount}',
			pageNextText: 'Próxima',
			pagePrevText: 'Anterior',
			pageFirstText: 'Primeira',
			pageLastText: 'Última', 
			data: metaMensalData,
			onItemUpdating : function (args) {
				self.HAS_EDITED_METAS_MENSAIS = true;
			},
			onItemUpdated : function(args) {
				let currentData = gridObject.jsGrid('option', 'data');
				self._calculaAgregadosMensais(currentData);
			},
			fields: [
				{name : "numMes", type : "number", title : "Número Mês", visible : false},
				{name : "mes", title : "Mês", type : "text", align : "center", width : 80, editing: false, sorting : false},
				{name : "valorMeta", title: "Meta", type : "decimal", align : "center", width : 50, sorting : false},
				{name : "valorRealizado", title: "Realizado", type : "decimal", align : "center", width : 50, sorting : false},
				{type: "control", width : 30, align : "center", deleteButton : false, editButton : self._enableGridEdition}
			]
		});
	}
}