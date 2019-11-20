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
	   //this._initFieldsCadastro();

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
    
    pesquisarMetas() {
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
}
