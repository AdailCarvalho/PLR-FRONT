class CardapioMetasController extends PLRController {

    constructor() {
        super();
        
		this._business = new CardapioMetasBusiness();
		this.initFields();

        let $body = $("body");
        $(document).on({
            ajaxStart: function() { $body.addClass("loading");    },
            ajaxStop: function() { $body.removeClass("loading"); }
        });
    }

    initFields() {
	   this._initFieldsPesquisa();
	   this._initFieldsCadastro();

    }

    _initFieldsPesquisa() {
        this._nomeMeta = $('#nomeMeta');
        this._tipoMeta = $("#tipoMeta");
        this._frequenciaMedicao = $("#frequenciaMedicao");
        this._tipoMedicao = $("#tipoMedicao");
        this._formulaMeta = $("#formulaMeta");
        this._situacaoMeta = $("#situacaoMeta");

        this._gridPesquisaMetas = $("#jsGridPesquisaMetas");

        this._loadGridPesquisaMetas([]);
	}
	
	_initFieldsCadastro() {
		this._fieldNomeMeta = $('#cadastroNomeMeta');
		this._fieldTipoMeta = $("#cadastroTipoMeta");
		this._fieldFrequenciaMedicao = $("#cadastroFrequenciaMedicao");
		this._fieldTipoMedicao = $("#cadastroTipoMedicao");
		this._fieldFormula = $("#cadastroFormula");
		this._fieldQualidade = $("#cadastroQualidade");
		this._fieldValorMeta = $("#cadastroValorMeta");
		this._fieldPrazo = $("#cadastroPrazo");
		this._fieldSituacaoMeta = $("#cadastroSituacaoMeta");
		this._fieldObservacaoMeta = $("#cadastroObservacaoMeta");
		this._idMeta = null;
		this._isNewMeta = true;

		this._fieldsCadastroMetasList = [this._fieldNomeMeta, this._fieldTipoMeta, this._fieldFrequenciaMedicao, this._fieldTipoMedicao, this._fieldFormula, this._fieldQualidade, 
			this._fieldValorMeta, this._fieldPrazo, this._fieldSituacaoMeta, this._fieldObservacaoMeta];

		this._modalCadastroCardapioMeta = $("#modalCadastroMetas");

		this._fieldPrazo.datepicker({
			numberOfMonths: 3,
			dateFormat: 'dd/mm/yy',
			dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'],
			dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
			dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
			monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
			monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
		});

		this.carregarListaFrequenciaMedicao();
		this.carregarListaFormula();
		this.carregarListaTipoMedicao();
		this.carregarListaTipoMetas();
		
		this._modalCadastroCardapioMeta.dialog({
			autoOpen: false,
			resizable: false,
			draggable : false,
			width: 1024,
			show: {effect: "fade", duration: 200},
			hide: {effect: "explode", duration: 200},
			position: {my: "center", at: "center", of: window}
		});
	}

	/** Carregar Dados */

	carregarListaFrequenciaMedicao() {
		let self = this;
		$.when(self._business.getLista("/frequenciasmedicao"))
		.done(function (serverData) {
			serverData.forEach(item => {
				item.value = item.id;
				item.text = item.descricao;
			});

			serverData.unshift({});
			self.buildSelectOptions(self._fieldFrequenciaMedicao, serverData);
		}).fail((xhr, textStatus, errorThrown) =>
			MessageView.showSimpleErrorMessage(("Erro ao pesquisar lista de Fórmulas! Erro : " + xhr.responseText)));
	}

	carregarListaFormula() {
		let self = this;
		$.when(self._business.getLista("/formulas"))
		.done(function (serverData) {
			serverData.forEach(item => {
				item.value = item.id;
				item.text = item.nome;
			});

			serverData.unshift({});
			self.buildSelectOptions(self._fieldFormula, serverData);
		}).fail((xhr, textStatus, errorThrown) =>
			MessageView.showSimpleErrorMessage(("Erro ao pesquisar lista de Fórmulas! Erro : " + xhr.responseText)));
	}

	carregarListaTipoMedicao() {
		let self = this;
		$.when(self._business.getLista("/tiposmedicao"))
		.done(function (serverData) {
			serverData.forEach(item => {
				item.value = item.id;
				item.text = item.descricao;
			});

			serverData.unshift({});
			self.buildSelectOptions(self._fieldTipoMedicao, serverData);
		}).fail((xhr, textStatus, errorThrown) =>
			MessageView.showSimpleErrorMessage(("Erro ao pesquisar lista de Tipos de Medicao! Erro : " + xhr.responseText)));
	}
	
	carregarListaTipoMetas() {
		let self = this;
		$.when(self._business.getLista("/tiposmeta"))
		.done(function (serverData) {
			serverData.forEach(item => {
				item.value = item.id;
				item.text = item.descricao;
			});

			serverData.unshift({});
			self.buildSelectOptions(self._fieldTipoMeta, serverData);
		}).fail((xhr, textStatus, errorThrown) =>
			MessageView.showSimpleErrorMessage(("Erro ao pesquisar lista de Tipos de Meta! Erro : " + xhr.responseText)));
	}


	/** PESQUISA */
    
    pesquisarMeta() {
        let self = this;
		let meta = self._metaDataPesquisa;
		if (!self._validatePesquisa()) {
			self._loadGridPesquisaMetas([]);
			return;
		}

		$.when(self._business.findByFilter(meta.descricao, meta.situacao, meta.tipoMedicao.descricao, meta.tipoMeta.descricao, 
										   meta.formula.nome, meta.frequenciaMedicao.descricao))
		.done(function (serverData) {
			self._loadGridPesquisaMetas(serverData);
		}).fail((xhr, textStatus, errorThrown) =>
			MessageView.showSimpleErrorMessage(("Erro ao pesquisar dados de Metas! Erro : " + xhr.responseText)));
	}

	/** CADASTRO */

	cadastrarMeta(metaItem) {
		let self = this;
		self._modalCadastroCardapioMeta.dialog('open');
		if (metaItem) {
			self._preencheFormCadastroMeta(metaItem);
			self._isNewMeta = false;
		} else {
			self._idMeta = null;
			self._isNewMeta = true;
		}
	}

	cancelarCadastroMeta() {
		this._fechaCadastroMeta();
	}
	
	salvarMeta() {
		let self = this;
		let novaMeta = this._metaDataCadastro;
		if(new Validation().validateFields(self._validateCadastro())) {
			$.when(self._business.salvarMeta(novaMeta))
			.done(function (serverData) {
				MessageView.showSuccessMessage('Dados da Meta salvos com sucesso!');
				self._idMeta = serverData.id;
				self._nomeMeta.val(serverData.descricao);
				self._fechaCadastroMeta();
				self.pesquisarMeta();
			}).fail((xhr, textStatus, errorThrown) =>
				MessageView.showSimpleErrorMessage(("Erro ao salvar os dados da Meta! Erro : " + xhr.responseText)));
		}
	}

	_fechaCadastroMeta() {
		this._limpaCamposCadastroMeta();
		this._modalCadastroCardapioMeta.dialog('close');
	}

	_limpaCamposCadastroMeta() {
		this._fieldsCadastroMetasList.forEach(field => field.val(""));
	}

	_preencheFormCadastroMeta(metaItem) {
		this._idMeta = metaItem.id;
		this._fieldNomeMeta.val(metaItem.descricao);
		this._fieldTipoMeta.val(metaItem.tipoMeta.id);
		this._fieldFrequenciaMedicao.val(metaItem.frequenciaMedicao.id);
		this._fieldTipoMedicao.val(metaItem.tipoMedicao.id);
		this._fieldFormula.val(metaItem.formula.id);
		this._fieldQualidade.val(metaItem.isQuantitativa);
		this._fieldValorMeta.val(metaItem.valor);
		this._fieldPrazo.val(metaItem.prazo);
		this._fieldSituacaoMeta.val(metaItem.situacao);
		this._fieldObservacaoMeta.val(metaItem.observacao);
	}

    /** Grids */

	_loadGridPesquisaMetas(itemsMetas) {
		let self = this;
		self._gridPesquisaMetas.jsGrid({
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
				self.cadastrarMeta(args.item);
				return false;
			},
			fields : [
				{name : "descricao", title : "Meta", type : "text", align : "left", width : 200, editing : false},
                {name : "tipoMeta.descricao", title : "Tipo de Meta", type : "text", align : "center", width : 100, editing: false},
                {name : "frequenciaMedicao.descricao", title : "Frequência", type : "text", align : "center", width : 50, editing: false},
				{name : "tipoMedicao.descricao", title: "Tipo de Medição", type : "text", align : "center", width : 50, editing: false},
				{name : "formula.nome", title : "Fórmula", type : "text", align : "center", width : 50},
				{name : "situacao", title : "Status", type : "select", items : [{id : "A", nome : "Ativo"}, {id : "I", nome : "Inativo"}],
				 valueField : "id", textField : "nome", align : "center", width : 50, editing: false}
			]
		});
    }

	/** Objetos */
	
	get _metaDataCadastro() {
		return {
			id : this._idMeta,
			descricao : this._fieldNomeMeta.val(),
			situacao : this._fieldSituacaoMeta.val(),
			observacao : this._fieldObservacaoMeta.val(),
			prazo : this._fieldPrazo.val(),
			valor : this._fieldValorMeta.val(),
			tipoMeta : {id : this._fieldTipoMeta.val()},
			tipoMedicao : {id : this._fieldTipoMedicao.val()},
			frequenciaMedicao : {id : this._fieldFrequenciaMedicao.val()},
			formula : {id : this._fieldFormula.val()},
			isNewMeta : this._isNewMeta,
			isQuantitativa : this._fieldQualidade.val()
		}
	}
    
    get _metaDataPesquisa() {
		return {
			descricao : this._nomeMeta.val(),
			situacao : this._situacaoMeta.val(),
			tipoMedicao : {
				descricao : this._tipoMedicao.val()
            },
            tipoMeta : {
                descricao : this._tipoMeta.val()
            },
			formula : {
				nome : this._formulaMeta.val()
			},
			frequenciaMedicao : {
				descricao : this._frequenciaMedicao.val()
			}			
		};
	}
    
    /** Validacoes */

	_validatePesquisa() {
		if (!this._nomeMeta.val() && !this._tipoMeta.val() && !this._frequenciaMedicao.val() && !this._tipoMedicao.val() && !this._formulaMeta.val() && !this._situacaoMeta.val()) {
			MessageView.showWarningMessage("Por favor, informe ao menos um filtro de pesquisa");
			return false;
		}

		return true;
	}

	_validateCadastro() {
		let validationFieldsArray = [];
		
		validationFieldsArray.push(this.getFieldValidation(
						this._fieldNomeMeta.val(), 'Descrição da Meta', 
						[Validation.types.NOT_EMPTY]));
		
		validationFieldsArray.push(this.getFieldValidation(
				this._fieldTipoMedicao.val(), 'Tipo de Medição', 
				[Validation.types.NOT_EMPTY]));

		validationFieldsArray.push(this.getFieldValidation(
					this._fieldTipoMeta.val(), 'Tipo de Meta', 
					[Validation.types.NOT_EMPTY]));
			
		validationFieldsArray.push(this.getFieldValidation(
					this._fieldFrequenciaMedicao.val(), 'Frequência de Medição', 
					[Validation.types.NOT_EMPTY]));

		validationFieldsArray.push(this.getFieldValidation(
					this._fieldQualidade.val(), 'Quantitativa / Qualitativa', 
					[Validation.types.NOT_EMPTY]));
		
		validationFieldsArray.push(this.getFieldValidation(
					this._fieldPrazo.val(), 'Prazo', 
					[Validation.types.NOT_EMPTY]));
						
		validationFieldsArray.push(this.getFieldValidation(
					this._fieldValorMeta.val(), 'Valor', 
					[Validation.types.NOT_EMPTY]));

		validationFieldsArray.push(this.getFieldValidation(
					this._fieldSituacaoMeta.val(), 'Situação', 
					[Validation.types.NOT_EMPTY]));

		validationFieldsArray.push(this.getFieldValidation(
					this._fieldFormula.val(), 'Fórmula', 
					[Validation.types.NOT_EMPTY]));
		
		return validationFieldsArray;
	}
}
