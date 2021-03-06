class ItemMetasController extends PLRController {

    constructor(widthCadastro, minHeightCadastro) {
        super();

        this._business = new ItemMetasBusiness();
		this._perfilController = new PerfilController();
		this._minHeightCadastro = minHeightCadastro ;
		this._widthCadastro = widthCadastro;

		let $body = $("body");
        $(document).on({
            ajaxStart: function() { $body.addClass("loading");    },
            ajaxStop: function() { $body.removeClass("loading"); }
        });

		this.applyConstraintsOnFields(['#itemMetasTab'], [],  this._perfilController.hasPermissionToArea(7));
		this.applyConstraintsOnFields(['#idPesquisaItemMetaCompleta'], [],  this._perfilController.hasPermissionToArea(10));
		this.applyConstraintsOnFields(['#idPesquisaItemMetaBasica'], [],  this._perfilController.hasPermissionToArea(11));
		this.applyConstraintsOnFields(['#aprovarCadastroItemMetaArea'], [], this._perfilController.hasPermissionToArea(12));
		this.applyConstraintsOnFields(['#metaMensalDetalheTab'], [], this._perfilController.hasPermissionToArea(13));

		this.initFields();
    }

    initFields() {
		if (!this._hasStartedItemMetas) {
			this._initFieldsPesquisa();
			this._initFieldsCadastro();
			
			this._hasStartedItemMetas = true;
		}
    }

    _initFieldsPesquisa() {
		var keyItem = document.getElementById("cadastroItemMeta");
		keyItem.addEventListener("keydown", e => {if (e.keyCode === 13) this.pesquisarItemMeta();});

        this._matriculaItemPesquisa = $("#matriculaItemPesquisa");
        this._colaboradorItemPesquisa = $("#colaboradorItemPesquisa");
        this._responsavelItemPesquisa = $("#responsavelItemPesquisa");
        this._inicioVigenciaItemPesquisa = $("#inicioVigenciaItemPesquisa");
        this._fimVigenciaItemPesquisa = $("#fimVigenciaItemPesquisa");
        this._situacaoMetaItemPesquisa = $("#situacaoMetaItemPesquisa");

		this._gridPesquisaItemMetas = $("#jsGridPesquisaItemMetas");
		this._gridPesquisaColaboradorSimples = $("#jsGridMiniPesquisaColaborador");
		this._areaPesquisaSimplesColaborador = $("#divExtraPesquisaColaboradorSimples");

        this._inicioVigenciaItemPesquisa.datepicker({
			numberOfMonths: 3,
			minDate : new Date(getPeriodoPLR(), 0, 1) ,
			maxDate : new Date(getPeriodoPLR(), 11, 31),
			dateFormat: 'dd/mm/yy',
			dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'],
			dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
			dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
			monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
			monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
        });
        
        this._fimVigenciaItemPesquisa.datepicker({
			numberOfMonths: 3,
			minDate : new Date(getPeriodoPLR(), 0, 1) ,
			maxDate : new Date(getPeriodoPLR(), 11, 31),
			dateFormat: 'dd/mm/yy',
			dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'],
			dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
			dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
			monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
			monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
		});

        this._loadGridPesquisaItemMetas([]);
	}
	
	_initFieldsCadastro() {
		let self = this;
		
		self._fieldMatriculaItemCadastro = $("#matriculaItemCadastro");
		self._fieldColaboradorItemCadastro = $("#colaboradorItemCadastro");
		self._fieldInicioVigenciaItemCadastro = $("#inicioVigenciaItemCadastro");
		self._fieldFimVigenciaItemCadastro = $("#fimVigenciaItemCadastro");
		self._fieldResponsavelItemCadastro = $("#responsavelItemCadastro");
		self._fieldNumeroFolhaMeta = $("#numeroFolhaMeta");
		self._fieldCargoItemCadastro = $("#cargoItemCadastro");
		self._fieldDiretoriaItemCadastro = $("#diretoriaItemCadastro");
		self._fieldTimeItemCadastro = $("#timeItemCadastro");
		self._fieldFilialItemCadastro = $("#filialItemCadastro");
		
		self._fieldSomatorioPeso = $('#somatorioPeso');
		self._fieldSomatorioAvaliacao = $('#somatorioAvaliacao');
		self._fieldSomatorioProjeto = $('#somatorioProjetos');
		self._fieldSomatorioGatilho = $('#somatorioGatilho');
		self._fieldSomatorioTime = $('#somatorioTime');
		self._fieldSomatorioCorporativo = $('#somatorioCorporativa');
		self._fieldSomatorioExtra = $('#somatorioExtras');
		self._fieldSomatorioQuantitativa = $('#somatorioQuantitativa');

		self._gridCadastroItensMeta = $("#jsGridCadastroItensMeta");		
		self._gridMetaMensalDetalhe = $("#jsGridMetaMensalDetalhes");

		self._fieldsCadastroItemMetasList = [self._fieldMatriculaItemCadastro, self._fieldColaboradorItemCadastro, 
											self._fieldInicioVigenciaItemCadastro, self._fieldFimVigenciaItemCadastro, 
											self._fieldResponsavelItemCadastro, self._fieldSomatorioPeso, self._fieldNumeroFolhaMeta, 
											self._fieldCargoItemCadastro, self._fieldDiretoriaItemCadastro, self._fieldTimeItemCadastro, 
											self._fieldFimVigenciaItemCadastro];

		self._fieldsCadastroSomatoriosAgrupamento = 
						[{field : self._fieldSomatorioAvaliacao, descricao : "Avaliação"}, 
						 {field : self._fieldSomatorioProjeto, descricao : "Projetos"}, 
						 {field : self._fieldSomatorioGatilho, descricao : "Gatilho"},
						 {field : self._fieldSomatorioTime, descricao : "Time"},
						 {field : self._fieldSomatorioCorporativo, descricao : "Corporativa"},
						 {field : self._fieldSomatorioExtra, descricao : "Extras"},
						 {field : self._fieldSomatorioQuantitativa, descricao : "Quantitativa"}]; 
													
		self._listaMetas = [];
		self._idItemMeta = null;
		self._isNewItemMeta = true;
		self._isFolhaEditavel = true;

		self._fieldInicioVigenciaItemCadastro.datepicker({
			numberOfMonths: 3,
			minDate : new Date(getPeriodoPLR(), 0, 1) ,
			maxDate : new Date(getPeriodoPLR(), 11, 31),
			dateFormat: 'dd/mm/yy',
			dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'],
			dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
			dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
			monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
			monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
		});

		self._fieldFimVigenciaItemCadastro.datepicker({
			numberOfMonths: 3,
			minDate : new Date(getPeriodoPLR(), 0, 1) ,
			maxDate : new Date(getPeriodoPLR(), 11, 31),
			dateFormat: 'dd/mm/yy',
			dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'],
			dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
			dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
			monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
			monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
		});
		
		self._modalCadastroItemMetas = $("#modalCadastroItemMetas");
		self._modalConfirmacaoAprovacaoFolhaMeta = $("#modalConfirmacaoAprovacaoFolhaMeta");	

		self._carregarListaMetas();
		self._loadGridCadastroItemMetas([]);
		self._loadGridPesquisaColaboradorSimples([]);
		self._loadGridMetasMensais([]);

		self._modalCadastroItemMetas.dialog({
			autoOpen: false,
			resizable: true,
			minHeight : self._minHeightCadastro ? self._minHeightCadastro : 600,
			width: self._widthCadastro ? self._widthCadastro : 1700,
			show: {effect: "fade", duration: 200},
			hide: {effect: "explode", duration: 200},
			position: {my: "center", at: "center", of: window}
		});

		self._modalConfirmacaoAprovacaoFolhaMeta.dialog({
			autoOpen: false,
			resizable: false,
			height : 250,
			width: 350,
			show: {effect: "fade", duration: 200},
			hide: {effect: "explode", duration: 200},
			position: {my: "center", at: "center", of: window},
			buttons: {
				"Sim": function() {
					self.aprovarItemMeta();
					$(this).dialog("close");
				},
				"Não": function() {
					$(this).dialog("close");
				}
			}
		});
	}
	
	/** Carregar Dados */
	
	_carregarListaMetas() {
		let self = this;
		
		$.when(self._business.getLista("/metas/" + getPeriodoPLR()))
		.done(function (serverData) {
			let firstElement = [{}];
			self._listaMetas = serverData;
			self._listaMetas.push.apply(firstElement, self._listaMetas);
		}).fail((xhr, textStatus, errorThrown) =>
			MessageView.showSimpleErrorMessage(("Erro ao pesquisar lista de Metas! Erro : " + xhr.responseText)));
	}

	/** PESQUISA */
	
	limparPesquisaItemMeta() {
		this._matriculaItemPesquisa.val("");
        this._colaboradorItemPesquisa.val("");
        this._responsavelItemPesquisa.val("");
        this._inicioVigenciaItemPesquisa.val("");
        this._fimVigenciaItemPesquisa.val("");
		this._loadGridPesquisaItemMetas([]);
	}
    
    pesquisarItemMeta() {
        let self = this;
		let itemMeta = self._itemMetasDataPesquisa;
		if (!self._validatePesquisa()) {
			self._loadGridPesquisaItemMetas([]);
			return;
		}

		$.when(self._business.findByFilter(itemMeta.matricula, itemMeta.colaborador, itemMeta.inicioVigencia, itemMeta.fimVigencia, itemMeta.responsavel, 
										   itemMeta.situacao))
		.done(function (serverData) {
			self._loadGridPesquisaItemMetas(serverData);
		}).fail((xhr, textStatus, errorThrown) =>
			MessageView.showSimpleErrorMessage(("Erro ao pesquisar dados de Item de Metas! Erro : " + xhr.responseText)));
	}

	pesquisarColaboradorSimples() {
		let self = this;
		let colaboradorSimples = self._colaboradorSimplesDataPesquisa;
		if (!self._validatePesquisaColaboradorSimples()) {
			self._loadGridPesquisaColaboradorSimples([]);
			return;
		}

		$.when(self._business.findColaboradorByFilter(colaboradorSimples.matricula, colaboradorSimples.nome))
		.done(function (serverData) {
			self._loadGridPesquisaColaboradorSimples(serverData)
		}).fail((xhr, textStatus, errorThrown) =>
				MessageView.showSimpleErrorMessage(("Erro ao pesquisar dados de Colaboradores! Erro : " + xhr.responseText)));
	}

	/** CADASTRO */

	cadastrarItemMeta(itemMeta) {
		let self = this;
		self._modalCadastroItemMetas.dialog('open');
		if (itemMeta) {
			self._preencheFormCadastroItemMeta(itemMeta);
			self.hideElements([self._areaPesquisaSimplesColaborador]);
			
			self._isNewItemMeta = false;
			self._fieldMatriculaItemCadastro.prop('disabled', true)
			self._fieldColaboradorItemCadastro.prop('disabled', true);

			self.applyConstraintsOnFields(['#salvarCadastroItemMeta'],
				[self._fieldInicioVigenciaItemCadastro, self._fieldFimVigenciaItemCadastro, self._fieldMatriculaItemCadastro, self._fieldColaboradorItemCadastro], 
				self._isFolhaEditavel);			

		} else {
			self.showHiddenElement(self._areaPesquisaSimplesColaborador);
			self.showHiddenElement($("#salvarCadastroItemMeta"));

			self._idItemMeta = null;
			self._isNewItemMeta = true;
			self._isFolhaEditavel = true;
			self._fieldMatriculaItemCadastro.val("");
			self._fieldColaboradorItemCadastro.val("");
			self._fieldMatriculaItemCadastro.removeAttr('disabled');
			self._fieldColaboradorItemCadastro.removeAttr('disabled');
			self._fieldInicioVigenciaItemCadastro.val("01/01/" + getPeriodoPLR());
			self._fieldFimVigenciaItemCadastro.val("31/12/" + getPeriodoPLR());
			self._loadGridPesquisaColaboradorSimples([]);
			self._loadGridCadastroItemMetas([]);
		}

		self.applyConstraintsOnFields(['#aprovarCadastroItemMetaArea'], [], self._isFolhaEditavel && self._perfilController.hasPermissionToArea(12));
		self.applyConstraintsOnFields(['#baixarFolhaMetaArea'], [], !self._isFolhaEditavel);
	}
	
	aprovarItemMetaDialog() {
		this._modalConfirmacaoAprovacaoFolhaMeta.dialog('open');
	}

	aprovarItemMeta() {
		let self = this;
		if (!confirm('Deseja realmente aprovar a Folha de Meta?')) {
			return;
		}

		if (!self._fieldNumeroFolhaMeta) {
			MessageView.showWarningMessage("Salve a folha de meta primeiro, para prosseguir para aprovação.");
			return;
		}

		if (self._fieldSomatorioPeso.val() != 100) {
			MessageView.showWarningMessage("Itens de folha não cadastrados ou inválidos!\nConfira se os itens foram informados" 
			+ " e se o somatório de pesos atingiu o valor = 100, para que seja possível concluir o cadastro da Folha. ");
			return;
		}

		if(new Validation().validateFields(self._validateCadastro()) && self._validateVigencias()) {
			$.when(self._business.aprovarFolhaMeta(self._fieldNumeroFolhaMeta.val()))
			.done(function (serverData) {
				MessageView.showSuccessMessage('Folha de Metas aprovada!');
				syncGridsHome();
			}).fail((xhr, textStatus, errorThrown) =>
				MessageView.showSimpleErrorMessage(("Erro ao aprovar a Folha da Meta! Erro : " + xhr.responseText)));
		}
	}

	cancelarCadastroItemMeta() {
		this._fechaCadastroItemMeta();
	}
	
	deleteFolhaMeta(id) {
		this._business.deleteFolhaMeta(id);
	}

	exportFolhaMeta(matricula, idFolhaMeta) {
		let paramMatricula = matricula ? matricula : this._fieldMatriculaItemCadastro.val(); 
		let paramIdFolhaMeta = idFolhaMeta ? idFolhaMeta : this._fieldNumeroFolhaMeta.val();
		this._business.exportFolhaMeta(paramMatricula, paramIdFolhaMeta);	
	}

	salvarItemMeta() {
		let self = this;
		let novaFolhaMeta = this._itemMetasDataCadastro;
		
		if (self._fieldSomatorioPeso.val() != 100) {
			MessageView.showWarningMessage("Itens de folha não cadastrados ou inválidos!\nConfira se os itens foram informados" 
			+ " e se o somatório de pesos atingiu o valor = 100, para que seja possível concluir o cadastro da Folha. ");
			return;
		}

		if(new Validation().validateFields(self._validateCadastro()) && self._validateVigencias()) {
			$.when(self._business.salvarItemMeta(novaFolhaMeta))
			.done(function (serverData) {
				if (novaFolhaMeta.id) {
					showTemporalCadastroMessage('success', 'Dados da Folha de Meta atualizados com sucesso!');
				} else {
					showTemporalCadastroMessage('success', 'Dados da Folha de Meta salvos com sucesso!\nAnote os dados da Folha de Meta\nNúmero: ' 
						+ serverData.id + '\nColaborador: ' + self._fieldColaboradorItemCadastro.val() + '\nMatrícula: '+ self._fieldMatriculaItemCadastro.val());
				}
				
				self._idItemMeta = serverData.id;
				$('.nav a[href="#' + 'dadosFolhaMeta' + '"]').tab('show');
				self._fieldNumeroFolhaMeta.val(serverData.id);
				self._fieldNumeroFolhaMeta.focus();
				self._loadGridMetasMensais(serverData.folhaMetasMensais);
				
				syncGridsHome();
			}).fail((xhr, textStatus, errorThrown) =>
				MessageView.showSimpleErrorMessage(("Erro ao salvar os dados da Folha da Meta! Erro : " + xhr.responseText)));
		}
	}

	_calculaSomatorios(itemsMeta) {
		let self = this;
		self._fieldsCadastroSomatoriosAgrupamento.forEach(fieldSum => {
			let filterItemsMeta = itemsMeta.filter(item => item.meta.tipoMeta.descricao.toUpperCase() == fieldSum.descricao.toUpperCase());
			if (filterItemsMeta && filterItemsMeta.length > 0) {
				fieldSum.field.val(filterItemsMeta.reduce((agg, currValue) => agg + currValue.peso, 0));	
			} else {
				fieldSum.field.val("-");
			}
		});
	}
	
	_fechaCadastroItemMeta() {
		this._limpaCamposCadastroItemMeta();
		this._modalCadastroItemMetas.dialog('close');
	}

	limparPesquisaItemMetaSimples() {
		this._fieldMatriculaItemCadastro.val("");
		this._fieldColaboradorItemCadastro.val("");
		this._fieldCargoItemCadastro.val("");
		this._fieldDiretoriaItemCadastro.val("");
		this._fieldTimeItemCadastro.val("");
		this._fieldFilialItemCadastro.val("");
		this._loadGridPesquisaColaboradorSimples([]);
	}

	_limpaCamposCadastroItemMeta() {
		this._fieldsCadastroItemMetasList.forEach(field => field.val(""));
		this._fieldsCadastroSomatoriosAgrupamento.forEach(fieldSum => fieldSum.field.val(""));
		this._loadGridCadastroItemMetas([]);
		this._loadGridMetasMensais([]);
	}

	_preencheFormCadastroItemMeta(metaItem) {
		this._idItemMeta = metaItem.id;
		this._isFolhaEditavel = metaItem.situacao == 'P';
		this._fieldNumeroFolhaMeta.val(metaItem.id);
		this._fieldNumeroFolhaMeta.focus();
		this._fieldMatriculaItemCadastro.val(metaItem.colaborador.matricula);
		this._fieldColaboradorItemCadastro.val(metaItem.colaborador.nome);
		this._fieldCargoItemCadastro.val(metaItem.colaborador.cargo.nome);
		this._fieldDiretoriaItemCadastro.val(metaItem.colaborador.diretoria.nome);
		this._fieldTimeItemCadastro.val(metaItem.colaborador.time.nome);
		this._fieldFilialItemCadastro.val(metaItem.colaborador.filial.nome);
		this._fieldInicioVigenciaItemCadastro.val(metaItem.inicioVigencia);
		this._fieldFimVigenciaItemCadastro.val(metaItem.fimVigencia);
		this._fieldResponsavelItemCadastro.val(metaItem.responsavel.nome);		
		this._loadGridCadastroItemMetas(metaItem.folhasMetaItem);
		this._loadGridMetasMensais(metaItem.folhaMetasMensais);
	}

	_preencheFormDadosColaboradorSimples(itemColaborador) {
		this._fieldMatriculaItemCadastro.removeAttr('disabled');
		this._fieldColaboradorItemCadastro.removeAttr('disabled');

		this._fieldMatriculaItemCadastro.val(itemColaborador.matricula);
		this._fieldColaboradorItemCadastro.val(itemColaborador.nome);
		this._fieldDiretoriaItemCadastro.val(itemColaborador.diretoria.nome);
		this._fieldFilialItemCadastro.val(itemColaborador.filial.nome);
		this._fieldCargoItemCadastro.val(itemColaborador.cargo.nome);
		this._fieldTimeItemCadastro.val(itemColaborador.time.codigo);

		let metasEquivalentes = itemColaborador.cargo.equivalencia.metasEquivalentes;
		this._loadGridCadastroItemMetas(metasEquivalentes.filter(item => item.idTempo == getPeriodoPLR() + '0101'));
	}

    _loadGridPesquisaItemMetas(itemsMetas) {
		let self = this;
		self._gridPesquisaItemMetas.jsGrid({
			width: "100%",
			height: "auto",
	 
			inserting: false,
			editing: false,
			sorting: true,
			paging: true,
			pageSize: 10,
			data: itemsMetas,
			pagerFormat: 'Páginas: {first} {prev} {pages} {next} {last} &nbsp;&nbsp; {pageIndex} de {pageCount}',
			pageNextText: 'Próxima',
			pagePrevText: 'Anterior',
			pageFirstText: 'Primeira',
			pageLastText: 'Última', 
			rowClick : function (args) {
				self.cadastrarItemMeta(args.item);
				return false;
			},
			fields : [
				{name : "id", title : "N. Folha", width : 50, align : "center", editing : false},
				{name : "colaborador.matricula", title : "Matrícula", type : "text", align : "center", width : 50, editing : false},
				{name : "colaborador.nome", title : "Colaborador", type : "text", align : "left", width : 200, editing : false},
                {name : "inicioVigencia", title : "Início Vigência", type : "text", align : "center", width : 100, editing: false},
                {name : "fimVigencia", title : "Fim Vigência", type : "text", align : "center", width : 100, editing: false},
				{name : "responsavel.nome", title: "Responsável", type : "text", align : "center", width : 200, editing: false},
				{name : "situacao", title : "Status", type : "select", items : [{id : "A", nome : "Ativo"}, {id : "I", nome : "Inativo"}, {id : "P", nome : "Pendente"}],
				 valueField : "id", textField : "nome", align : "center", width : 50, editing: false}
			]
		});
	}

	_loadGridPesquisaColaboradorSimples(itemsColaboradores) {
		let self = this;
		self._gridPesquisaColaboradorSimples.jsGrid({
			width: "100%",
			height: "auto",
	 
			inserting: false,
			editing: false,
			sorting: true,
			paging: true,
			pageSize: 3,
			data: itemsColaboradores,
			pagerFormat: 'Páginas: {first} {prev} {pages} {next} {last} &nbsp;&nbsp; {pageIndex} de {pageCount}',
			pageNextText: 'Próxima',
			pagePrevText: 'Anterior',
			pageFirstText: 'Primeira',
			pageLastText: 'Última', 

			rowClick : function(args) {
				self._preencheFormDadosColaboradorSimples(args.item);
				return false;
			},

			fields : [
				{name : "matricula", title : "Matrícula", type : "text", align : "center", width : 50, editing : false},
				{name : "nome", title : "Colaborador", type : "text", align : "left", width : 100, editing: false},
				{name : "cargo.nome", title : "Cargo", type :"text", align : "center", width : 100, editing :false},
				{name : "diretoria.nome", title : "Diretoria", type :"text", align : "center", width : 100, editing :false},
				{name : "time.codigo", title : "Time", type :"text", align : "center", width : 100, editing :false},
				{name : "filial.nome", title : "Filial", type :"text", align : "center", width : 100, editing :false}
			]
		});
	}
	
	_loadGridCadastroItemMetas(itemsMetas) {
		let self = this;
		
		let somaPeso = 0;
		let lastDeletedSequence = -1;
		itemsMetas.forEach(item => {
			somaPeso += item.peso;
		});
		

		self._configFieldSomatorioPeso(somaPeso);		
		self._calculaSomatorios(itemsMetas);

		self._gridCadastroItensMeta.jsGrid({
			width: "100%",
			height: "auto",
	 
			inserting: self._isFolhaEditavel,
			editing: self._isFolhaEditavel,
			sorting: true,
			paging: true,
			autoload : true,
			pageSize: 15,
			data: itemsMetas,
			pagerFormat: 'Páginas: {first} {prev} {pages} {next} {last} &nbsp;&nbsp; {pageIndex} de {pageCount}',
			pageNextText: 'Próxima',
			pagePrevText: 'Anterior',
			pageFirstText: 'Primeira',
			pageLastText: 'Última', 
			deleteConfirm : 'Deseja excluir o item selecionado?',
			invalidNotify: function(args) {	
				var messageHeader = 'Campos obrigatórios não informados ou inválidos:';
				var messages = messageHeader + $.map(args.errors, function(error) {
		            return "\n" + error.message;
		        });
				showTemporalMessage("warning", messages);
			},
			onItemInserting : function (args) {
				let dados = self._gridCadastroItensMeta.jsGrid("option","data");
				let valorInserido = args.item.peso;

				args.item.tipoSugerida = 'N';

				let previousSomaPeso = somaPeso;
				somaPeso = 0;
				for (var i = 0; i < dados.length; i ++) {
					somaPeso += dados[i].peso;
				}

				somaPeso += parseFloat(formatDecimalToBigDecimal(valorInserido));
				if (somaPeso > 100) {
					MessageView.showWarningMessage('A somatória de Peso não pode exceder a 100!');
					args.cancel = true;
					somaPeso = previousSomaPeso;
					return;
				}

				let maxSequence = 0;
				let arraySequence = [];
				for (var i = 0; i < dados.length; i ++) {
					arraySequence.push(dados[i].sequencia);
					if (dados[i].sequencia > maxSequence) {
						maxSequence = dados[i].sequencia;
					}
				}

				if (lastDeletedSequence == -1) {
					args.item.sequencia = maxSequence + 1;
				} else if (arraySequence.length > 0 && arraySequence.includes(lastDeletedSequence)){
					args.item.sequencia = maxSequence + 1;
				} else {
					args.item.sequencia = lastDeletedSequence;
				}

				args.item.folhaMeta = {id : self._idItemMeta};
				self._configFieldSomatorioPeso(somaPeso)
			},

			onItemInserted : function (args) {
				self._calculaSomatorios(self._gridCadastroItensMeta.jsGrid("option","data"));
			},
			onItemUpdating : function (args) {
				let dados = self._gridCadastroItensMeta.jsGrid("option","data");
				let sequenciaAtualizada = self._gridCadastroItensMeta.jsGrid("option", "fields")[1].editControl.val();
				let valorAtualizado = self._gridCadastroItensMeta.jsGrid("option", "fields")[5].editControl.val();

				if (args.item.tipoSugerida == 'S') {
					MessageView.showWarningMessage("Essa meta é sugerida e não pode ser editada!");
					args.cancel = true;
					return;
				} 
				
				let previousSomaPeso = somaPeso;
				somaPeso = 0;
				for (var i = 0; i < dados.length; i ++) {
					if (dados[i].tipoSugerida == 'N' && dados[i].sequencia == sequenciaAtualizada) {
						somaPeso += parseFloat(formatDecimalToBigDecimal(valorAtualizado));
					} else {
						somaPeso += dados[i].peso;
					}


					if (somaPeso > 100) {
						MessageView.showWarningMessage('A somatória de Peso não pode exceder a 100!');
						args.cancel = true;
						somaPeso = previousSomaPeso;
						return;
					}
				}

				self._configFieldSomatorioPeso(somaPeso)
			},
			
			onItemUpdated : function (args) {
				self._calculaSomatorios(self._gridCadastroItensMeta.jsGrid("option","data"));
			},
			onItemDeleting : function (args) {
				if (args.item.tipoSugerida == 'S') {
					MessageView.showWarningMessage("Essa meta é sugerida e não pode ser editada!");
					args.cancel = true;
					return;
				}

				lastDeletedSequence = args.item.sequencia;
				somaPeso = somaPeso - parseFloat(formatDecimalToBigDecimal(args.item.peso));
				self._configFieldSomatorioPeso(somaPeso);
			},
			onItemDeleted : function (args) {
				self._calculaSomatorios(self._gridCadastroItensMeta.jsGrid("option","data"));
			},
			fields : [
				{type : "control", width : 40, deleteButton : self._isFolhaEditavel, editButton : self._isFolhaEditavel, visible : self._isFolhaEditavel}, //[0]
				{name : "sequencia", type : "number", title : "Sequência", width : 100, align : "center", readOnly : true, //[1]
				 insertTemplate : function () {
					var grid = this._grid;
					var $fieldSequencia = jsGrid.fields.number.prototype.insertTemplate.call(this, arguments);

					$fieldSequencia.css("background-color", "#d4d6d9");

					return $fieldSequencia;
				 },

				 editTemplate : function (value, editItem) {
					var grid = this._grid;
					var $fieldSequencia = jsGrid.fields.number.prototype.editTemplate.apply(this, arguments);

					$fieldSequencia.css("background-color", "#d4d6d9");

					return $fieldSequencia;
				 },
				},
				{
					name : "meta.id", type : "number", title : "Código", width : 100, align : "center", readOnly : true, //[2]
					insertTemplate : function () {
						var grid = this._grid;
						var $fieldCodigo = jsGrid.fields.number.prototype.insertTemplate.call(this, arguments);
	
						$fieldCodigo.css("background-color", "#d4d6d9");
	
						return $fieldCodigo;
					 },
	
					 editTemplate : function (value, editItem) {
						var grid = this._grid;
						var $fieldCodigo = jsGrid.fields.number.prototype.editTemplate.apply(this, arguments);
	
						$fieldCodigo.css("background-color", "#d4d6d9");
	
						return $fieldCodigo;
					 },
				},
				{name : "meta.tipoMeta.descricao", title : "Tipo", type : "text", width : 100, readOnly : true, //[3]
					insertTemplate : function () {
						var grid = this._grid;
						var $fieldTipoMeta = jsGrid.fields.text.prototype.insertTemplate.call(this, arguments);

						$fieldTipoMeta.css("background-color", "#d4d6d9");

						return $fieldTipoMeta;
				 	},

				 	editTemplate : function (value, editItem) {
						var grid = this._grid;
						var $fieldTipoMeta = jsGrid.fields.text.prototype.editTemplate.apply(this, arguments);

						$fieldTipoMeta.css("background-color", "#d4d6d9");

						return $fieldTipoMeta;
				 	},
				},
				{name : "meta.id", type : "select", title : "Indicador", items : self._listaMetas, valueField : "id", textField : "descricao", width : 300, align : "left", //[4]
					validate : {
						validator : "required",
						message : "Informe o Indicador"
					},
					insertTemplate: function(value, item) {
						var grid = this._grid;
						var $selectIndicador = jsGrid.fields.select.prototype.insertTemplate.call(this);
						$selectIndicador.addClass('selectpicker form-control');
						$selectIndicador.attr("data-live-search", "true");
			   			$selectIndicador.attr("data-container", "body");
						
						$selectIndicador.on("change", function () {
							let selectedIndicador = $selectIndicador.val();
							$.each(self._listaMetas, function (_, item) {
								if (item.id == selectedIndicador) {
									grid.option("fields")[3].insertControl.val(item.tipoMeta.descricao);
									return;
								}
							});
						});

						setTimeout(function() {
							$selectIndicador.selectpicker({
								liveSearch: true
							});		             		
							$selectIndicador.selectpicker('refresh');
							$selectIndicador.selectpicker('render');
						   });
						   return $selectIndicador;
					},
					editTemplate : function (value, editItem) {
						var grid = this._grid;
						var $selectIndicador = jsGrid.fields.select.prototype.editTemplate.apply(this, arguments);
						$selectIndicador.addClass('selectpicker form-control');
						$selectIndicador.attr("data-live-search", "true");
						$selectIndicador.attr("data-container", "body");
						
						$selectIndicador.on("change", function () {
							let selectedIndicador = $selectIndicador.val();
							$.each(self._listaMetas, function (_, item) {
								if (item.id == selectedIndicador) {
									grid.option("fields")[3].editControl.val(item.tipoMeta.descricao);
									return;
								}
							});
					   });

						setTimeout(function() {
							$selectIndicador.selectpicker({
								liveSearch: true
							});		             		
							$selectIndicador.selectpicker('refresh');
							$selectIndicador.selectpicker('render');
						});
						return $selectIndicador;
					}
				},
				{name : "peso", type : "floatNumber", title : "Peso", width : 100, align : "center", //[5]
				 validate : 
					{
						validator : function (value) {
							return !Number.isNaN(value) && parseFloat(formatDecimalToBigDecimal(value)) > 0;
						},
						message : "Informe um valor de Peso > 0"
					}
				}
			]
		});
	}

	_loadGridMetasMensais(metasMensaisData) {
        let self = this;
        self._gridMetaMensalDetalhe.jsGrid({
            width: "2980px",
            height: "auto",
            inserting: false,
            deleting : false,
            editing: false,
            sorting: false,
            paging: true,
            pageSize: 10,
            pagerFormat: 'Páginas: {first} {prev} {pages} {next} {last} &nbsp;&nbsp; {pageIndex} de {pageCount}',
            pageNextText: 'Próxima',
            pagePrevText: 'Anterior',
            pageFirstText: 'Primeira',
            pageLastText: 'Última', 
            deleteConfirm : "Deseja realmente excluir o item selecionado?",
            data: metasMensaisData,
            fields : [
				{name : "meta.descricao", title : "Indicador", type : "text", align : "center", width : 800},
				{name : "aprovador.nome", title : "Aprovador", type : "text", align : "center", width : 200 },
				{name : "prazo.descricao", title : "Entrega", type : "text", align : "center", width : 100},
                {name : "valJan",  title : "Jan", type : "decimal", align : "center", width : 150}, //[1]
                {name : "valFev", title : "Fev", type : "decimal", align : "center", width : 150}, //[2]
                {name : "valMar",  title : "Mar", type : "decimal", align : "center", width : 150}, //[3]
                {name : "valAbr",  title : "Abr", type : "decimal", align : "center", width : 150},//[4]
                {name : "valMai",  title : "Mai", type : "decimal", align : "center", width : 150},//[5]
                {name : "valJun", title : "Jun", type : "decimal", align : "center", width : 150},//[6]
                {name : "valJul",  title : "Jul", type : "decimal", align : "center", width : 150},//[7]
                {name : "valAgo", title : "Ago", type : "decimal", align : "center", width : 150},//[8]
                {name : "valSet",  title : "Set", type : "decimal", align : "center", width : 150},//[9]
                {name : "valOut",  title : "Out", type : "decimal", align : "center", width : 150},//[10]
                {name : "valNov",  title : "Nov", type : "decimal", align : "center", width : 150},//[11]
                {name : "valDez", title : "Dez",  type : "decimal", align : "center", width : 150}//[12]
            ]
        });
    }

	_configFieldSomatorioPeso(value) {
		this._fieldSomatorioPeso.val(value);
		if (value == 100) {
			this._fieldSomatorioPeso.css('background-color', '#47d147');
		} else {
			this._fieldSomatorioPeso.css('background-color', '#ff4d4d');
		}
	}

	get _colaboradorSimplesDataPesquisa() {
		return {
			matricula : this._fieldMatriculaItemCadastro.val(),
			nome : this._fieldColaboradorItemCadastro.val()
		}
	}

    get _itemMetasDataPesquisa() {
        return {
            matricula : this._matriculaItemPesquisa.val(),
            colaborador : this._colaboradorItemPesquisa.val(),
            inicioVigencia : this._inicioVigenciaItemPesquisa.val() ? this._inicioVigenciaItemPesquisa.val() : "01/01/" + getPeriodoPLR(),
            fimVigencia : this._fimVigenciaItemPesquisa.val() ? this._fimVigenciaItemPesquisa.val() : "31/12/" + getPeriodoPLR(),
			responsavel : this._responsavelItemPesquisa.val(),
			situacao : ""
        }                                         
	}
	
	get _itemMetasDataCadastro() {
		let self = this;
		let itemsCadastrados = [];
		self._gridCadastroItensMeta.jsGrid("option", "data").forEach(item => 
			{
				item.folhaMeta = {id : self._idItemMeta};
				itemsCadastrados.push(item);
		});
		
		return {
			id : self._idItemMeta ? self._idItemMeta : self._fieldNumeroFolhaMeta.val(),
			situacao : "P",
			inicioVigencia : self._fieldInicioVigenciaItemCadastro.val(),
			fimVigencia : self._fieldFimVigenciaItemCadastro.val(),
			colaborador : {
				matricula : self._fieldMatriculaItemCadastro.val()
			},
			responsavel : {
				matricula : getLoggedUser()
			},
			folhasMetaItem : itemsCadastrados
		};
	}
	
	_validateCadastro() {
		let validationFieldsArray = [];
		
		validationFieldsArray.push(this.getFieldValidation(
						this._fieldMatriculaItemCadastro.val(), 'Matrícula', 
						[Validation.types.NOT_EMPTY]));
		
		validationFieldsArray.push(this.getFieldValidation(
				this._fieldInicioVigenciaItemCadastro.val(), 'Início da Vigência', 
				[Validation.types.NOT_EMPTY]));

		validationFieldsArray.push(this.getFieldValidation(
					this._fieldFimVigenciaItemCadastro.val(), 'Fim da Vigência', 
					[Validation.types.NOT_EMPTY]));
							
		return validationFieldsArray;
	}

	_validateVigencias() {
		let self = this;
		if (!self._fieldInicioVigenciaItemCadastro.val()) {
			return false;
		} else if (!self._fieldFimVigenciaItemCadastro.val()) {
			return false;
		}

		let inicioVigenciaTxt = self._fieldInicioVigenciaItemCadastro.val().substring(3,5) + '/' + self._fieldInicioVigenciaItemCadastro.val().substring(0,2) + '/'
							  + self._fieldInicioVigenciaItemCadastro.val().substring(6,10);
		let fimVigenciaTxt = self._fieldFimVigenciaItemCadastro.val().substring(3,5) + '/' + self._fieldFimVigenciaItemCadastro.val().substring(0,2) + '/'
							  + self._fieldFimVigenciaItemCadastro.val().substring(6,10);							  

		let inicioVigencia = new Date(inicioVigenciaTxt);
		let fimVigencia = new Date(fimVigenciaTxt);
		if (inicioVigencia > fimVigencia) {
			MessageView.showWarningMessage("O Fim de Vigência não pode ser menor que o Início da Vigência!");
			return false;
		}

		let periodoVigenteIni = new Date('01/01/' + getPeriodoPLR());
		let periodoVigenteFim = new Date('12/31/' + getPeriodoPLR());
		if (inicioVigencia < periodoVigenteIni || inicioVigencia > periodoVigenteFim) {
			MessageView.showWarningMessage("Início da Vigência informada está fora do período.\nPor favor, escolha uma data dentro do período ativo.");
			return false;
		}

		if (fimVigencia < periodoVigenteIni || fimVigencia > periodoVigenteFim) {
			MessageView.showWarningMessage("Fim da Vigência informada está fora do período.\nPor favor, escolha uma data dentro do período ativo.");
			return false;
		}

		return true;
	}

	_validatePesquisa() {
        if (!this._matriculaItemPesquisa.val() && !this._colaboradorItemPesquisa.val() && !this._inicioVigenciaItemPesquisa.val() && !this._fimVigenciaItemPesquisa.val() 
             && !this._responsavelItemPesquisa.val()) {
			MessageView.showWarningMessage("Por favor, informe ao menos um filtro de pesquisa");
			return false;
        }

		return true;
	}

	_validatePesquisaColaboradorSimples() {
		if (!this._fieldMatriculaItemCadastro.val() && !this._fieldColaboradorItemCadastro.val()) {
			MessageView.showWarningMessage("Por favor, informe a Matrícula e/ou o Nome do Colaborador");
			return false;
		}

		return true;
	}

}
