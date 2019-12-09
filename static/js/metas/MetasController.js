class MetasController extends PLRController {
	
	constructor() {
		super();

		this._metasBusiness = new MetasBusiness();
		this._perfilController = new PerfilController();
		this._colaboradorBusiness = new ColaboradorBusiness();

		this._dialogVersao = $('#dialogVersao');
		
		this.applyConstraintsOnFields(['#meusCadastrosTab',], [], this._perfilController.hasPermissionToArea(2));
		this.applyConstraintsOnFields(['#cadastros-tab'], [], this._perfilController.hasPermissionToArea(8));

		this._initFields();
		this._findMetas();

		let $body = $("body");
		$(document).on({
			ajaxStart: function() { $body.addClass("loading");    },
			ajaxStop: function() { $body.removeClass("loading"); }
		});
	}
	
	_initFields() {
		//Info geral
		this._numFolha = $('#numeroFolha')
		this._status = $('#status');
		this._matricula = $('#matriculaMeta');
		this._nome = $('#nomeMeta');
		this._cargo = $('#cargoMeta');
		this._diretoria = $('#diretoriaMeta');
		
		this._gridFolhaMetas = $("#jsGridFolhaMetas");
		this._gridFolhaMetasArea = $('#idGridFolhaMetasArea');
		
		//historico
		this._gridMetasRegistrado = $('#jsGridMetasRegistrado');
		this._gridMetasPertencente = $('#jsGridMetasPertencente');
		this._gridmetasPendentes = $('#jsGridMetasPendentes');

		//Buttons
		this._btnCriarVersao = $('#btnCriarVersao');
		this._btnLabelAnexo = $('#idLabelAnexo');

		this._idsButtons = [{id : '#btnEditar'}, {id : '#btnCancel'},{id : "#btnExport"},{id : "#btnCriarVersao"}, {id : "#btnAnexarFoto"}];

		//Select grids
		this._selectFrequenciaAvaliacao = [{frequencia : ""}, {frequencia : "Mensal"},{frequencia : "Bimestral"},{frequencia : "Trimestral"},
										   {frequencia : "Semestral"},{frequencia : "Anual"},{frequencia : "Data Específica"}];
		this._selectTipoMetas = [{tipoMeta : ""},{tipoMeta : "Quanto Maior, Melhor"},{tipoMeta : "Quanto Menor, Melhor"},{tipoMeta : "Cumpriu/Não Cumpriu"}];										   
		this._selectSituacao = [{situacao : "A", descSituacao : "ATIVO"}, {situacao : "I", descSituacao : "INATIVO"}, {situacao : "P", descSituacao : "PENDENTE"}];

		this._dialogVersao.dialog({
			resizable: false,
			height: "auto",
			width: 600,
			modal: true,
			autoOpen: false,
			closeOnEscape: true
		});

		this._loadGridFolhaMetas(this._folhaMetasData);
	}

	getColaborador(idFolhaMeta, status, matricula) {
		let self = this;
		
		$.when(self._colaboradorBusiness.findByMatricula(matricula))
		 .done(function (serverData) {
			self._fillColaboradorInfo(serverData, idFolhaMeta, status);
		 })
		 .fail(function (xhr, textStatus, errorThrown) {
			MessageView.showWarningMessage('Informações do Colaborador não encontradas.');
			self._clearInfoColaborador();
		 });
	}

	_fillColaboradorInfo(dadosColaborador, idFolhaMeta, status) {
		this._numFolha.val(idFolhaMeta); 
		this._status.val(status);
		this._matricula.val(dadosColaborador.matricula);
		this._nome.val(dadosColaborador.nome);
		this._cargo.val(dadosColaborador.cargo.nome);
		this._diretoria.val(dadosColaborador.diretoria.nome);
	}

	_findMetas() {
		let self = this;
		self._findMetasCadastradasUsuarioLogado();
		self._findMetasPendentesUsuarioLogado();
		if (self._perfilController.isEditable()) {
			self._findMetasPertencentesUsuarioLogado();
		}
	}

	_findMetasCadastradasUsuarioLogado() {
		let self = this;
		$.when(self._metasBusiness.findMetasCadastradasUsuarioLogado(getPeriodoPLR()))
		 .done(function(metas) {
			if (metas && metas.length > 0) {
				self._loadGridMetas(self._gridMetasRegistrado, metas);
			}
		 })
		 .fail(function(xhr, textStatus, errorThrown) {
			MessageView.showSimpleErrorMessage('Erro ao carregar metas do Usuário logado. ');
		 });
	}

	_findMetasPertencentesUsuarioLogado() {
		let self = this;
		$.when(self._metasBusiness.findMetasPertencentesUsuarioLogado(getPeriodoPLR()))
		 .done(function(metas) {
			if (metas && metas.length > 0) {
				self._loadGridMetas(self._gridMetasPertencente, metas);
			}
		 })
		 .fail(function(xhr, textStatus, errorThrown) {
			MessageView.showSimpleErrorMessage('Erro ao carregar metas registradas pelo Usuário. ');
		 });
	}

	_findMetasPendentesUsuarioLogado() {
		let self = this;
		$.when(self._metasBusiness.findMetasPendentesUsuarioLogado(getPeriodoPLR()))
		 .done(function(metas) {
			if (metas && metas.length > 0) {
				self._loadGridMetas(self._gridmetasPendentes, metas);
			}
		 })
		 .fail(function(xhr, textStatus, errorThrown) {
			MessageView.showSimpleErrorMessage('Erro ao carregar metas registradas pelo Usuário. ');
		 });
	}

	_findValoresMetasForFolhaMeta(idFolhaMeta, status, matricula) {
		let self = this;
		$.when(self._metasBusiness.findValoresMetasForFolhaMeta(idFolhaMeta))
		 .done(function(metas) {
			if (metas && metas.length > 0) {
				self._loadGridFolhaMetas(metas);
				self.getColaborador(idFolhaMeta, status, matricula);
			}
		 })
		 .fail(function(xhr, textStatus, errorThrown) {
			MessageView.showSimpleErrorMessage('Erro ao carregar os valores de metas para a folha informada. ');
		 });
	}

	_loadGridMetas(gridObject, itemsMetas) {
		let self = this;
		gridObject.jsGrid({
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

			rowClick : function(args) {
				return false;
			},

			fields: [
				{type: "control", width : 50, align : "center", deleteButton : false, inserting : false, 
						editButton : false, 
						itemTemplate: function(value, item) {
							var $result = this.__proto__.itemTemplate.call(this, value, item);
							
							var $view = $("<a style='color: #003cbe'><i class='fas fa-eye fa-lg' " +
							" title='Visualizar Meta' style= 'margin-left: 7px;'></i></a>")
										   .click(function() {
												$('.nav a[href="#' + 'metas' + '"]').tab('show');
												self._findValoresMetasForFolhaMeta(item.id, item.situacao, item.colaborador.matricula);
										   });
							
							if (item.situacao != 'P') {
								$result = $result.add($view);
							}

							return $result;
					}
				},
				{name : "id", title : "Nº Folha", type : "number", align : "center", width : 100, editing: false},
				{name : "colaborador.nome", title: "Colaborador", type : "text", align : "center", width : 225, editing: false},
				{name : "situacao", title: "Status", type : "select", items : self._selectSituacao, valueField : "situacao", 
						 textField : "descSituacao", align : "center", width : 50, editing: false},
				{name : "inicioVigencia", title : "Início Vigência", type : "text", align : "center", width : 100, editing: false},
				{name : "fimVigencia", title : "Fim Vigência", type : "text", align : "center", width : 100},
				{name : "responsavel.nome", title : "Responsável", type : "text", align : "center", width : 225, editing: false}
			]
		});
	}

	_loadGridFolhaMetas(folhaMetasData) {
		let self = this;

		self._gridFolhaMetas.jsGrid({
		width: "3200px",
		height: "auto",
		inserting: false,
		editing: false,
		sorting: true,
		paging: true,
		pageSize: 5,
		pagerFormat: 'Páginas: {first} {prev} {pages} {next} {last} &nbsp;&nbsp; {pageIndex} de {pageCount}',
		pageNextText: 'Próxima',
		pagePrevText: 'Anterior',
		pageFirstText: 'Primeira',
		pageLastText: 'Última', 
		deleteConfirm : "Deseja realmente excluir o item selecionado?",
		data: folhaMetasData,

		fields: [
			//600
			{name : "sequencia", title : "Nº", type : "number", width : 60, align : "center", editing : false},
			{name : "meta.tipoMeta.abreviacao", title : "Tipo", type : "text", align : "center", width : 70, readonly : true},
			{name : "meta.descricao", title : "Descrição", type : "text", align : "center", width : 200, readonly : true},
			{name : "meta.prazo", title: "Prazo", type : "text", align : "center", width : 120, readonly : true},
			{name : "meta.tipoMedicao.descricao", title: "Medição", type : "text", align : "center", width : 100, readonly : true},
			{name : "meta.formula.nome", title : "Fórmula", type : "text", align : "center", width : 100, readonly : true},
			{width : 1975  , align : "center", //Mensal
			 headerTemplate : function () {
				var headerContainer = "<div class='row mt-2 ml-2'>";
				var headerContent = "<div>";
				var $headerAninhado = $(headerContainer)
					.append($(headerContent).text("Tipo").width(100))
					.append($(headerContent).text("Jan").width(150))
					.append($(headerContent).text("Fev").width(150))
					.append($(headerContent).text("Mar").width(150))
					.append($(headerContent).text("Abr").width(150))
					.append($(headerContent).text("Mai").width(150))
					.append($(headerContent).text("Jun").width(150))
					.append($(headerContent).text("Jul").width(150))
					.append($(headerContent).text("Ago").width(150))
					.append($(headerContent).text("Set").width(150))
					.append($(headerContent).text("Out").width(150))
					.append($(headerContent).text("Nov").width(150))
					.append($(headerContent).text("Dez").width(150))
					.append($(headerContent).text("Meta").width(150));
				
				return $headerAninhado;
			 },

			 itemTemplate : function (value, mainItem) {
				var $nestedGridMensal = $("<div style='overflow : auto'>");         
				$nestedGridMensal.click(function(e) {
					e.stopPropagation();
				});

				$nestedGridMensal.jsGrid({
					width: "2100px",
					height: "auto",
					editing : false,
				  	inserting: false,
				  	heading : false,
					data: mainItem.viewMetasMensais,
					rowClick: function(args) {
						if(self.editing) {
							self.editItem($(args.event.target).closest("tr"));
							args.event.stopPropagation();
						}
					},

					fields : [
						{name : "tipoMeta", type : "text", align : "center", width : 100, readonly :true},
						{name : "valJan",  type : "decimal", align : "center", width : 150, readonly : true},
						{name : "valFev", type : "decimal", align : "center", width : 150, readonly : true},
						{name : "valMar",  type : "decimal", align : "center", width : 150, readonly : true},
						{name : "valAbr",  type : "decimal", align : "center", width : 150, readonly : true},
						{name : "valMai",  type : "decimal", align : "center", width : 150, readonly : true},
						{name : "valJun", type : "decimal", align : "center", width : 150, readonly : true},
						{name : "valJul",  type : "decimal", align : "center", width : 150, readonly : true},
						{name : "valAgo", type : "decimal", align : "center", width : 150, readonly : true},
						{name : "valSet",  type : "decimal", align : "center", width : 150, readonly : true},
						{name : "valOut",  type : "decimal", align : "center", width : 150, readonly : true},
						{name : "valNov",  type : "decimal", align : "center", width : 150, readonly : true},
						{name : "valDez",  type : "decimal", align : "center", width : 150, readonly : true},
						{name : "sumMeta",  type : "decimal", align : "center", width : 150, readonly : true},

					] ,
				});

				return $nestedGridMensal;
			 },
			},
			{name : "desempenho", title : "Desempenho %",  type : "decimal", align : "center", width : 140, editing : false},
			{name : "peso",  title : "Peso", type : "decimal", align : "center", width : 100, editing : false},
			{name : "pontuacao",  title : "Pontuação", type : "decimal", align : "center", width : 120, editing : false}	
		  ]
		});
	}
}
