class ItemMetasController extends PLRController {

    constructor() {
        super();

        this._business = new ItemMetasBusiness();

		this.initFields();

        let $body = $("body");
        $(document).on({
            ajaxStart: function() { $body.addClass("loading");    },
            ajaxStop: function() { $body.removeClass("loading"); }
        });
    }

    initFields() {
        this._initFieldsPesquisa();
    }

    _initFieldsPesquisa() {
        this._matriculaItemPesquisa = $("#matriculaItemPesquisa");
        this._colaboradorItemPesquisa = $("#colaboradorItemPesquisa");
        this._responsavelItemPesquisa = $("#responsavelItemPesquisa");
        this._inicioVigenciaItemPesquisa = $("#inicioVigenciaItemPesquisa");
        this._fimVigenciaItemPesquisa = $("#fimVigenciaItemPesquisa");
        this._situacaoMetaItemPesquisa = $("#situacaoMetaItemPesquisa");

        this._gridPesquisaItemMetas = $("#jsGridPesquisaItemMetas");

        this._inicioVigenciaItemPesquisa.datepicker({
			numberOfMonths: 3,
			dateFormat: 'dd/mm/yy',
			dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'],
			dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
			dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
			monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
			monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
        });
        
        this._fimVigenciaItemPesquisa.datepicker({
			numberOfMonths: 3,
			dateFormat: 'dd/mm/yy',
			dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'],
			dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
			dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
			monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
			monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
		});

        this._loadGridPesquisaItemMetas([]);
    }

    /** PESQUISA */
    
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
			fields : [
				{name : "colaborador.matricula", title : "Matrícula", type : "text", align : "center", width : 50, editing : false},
				{name : "colaborador.nome", title : "Colaborador", type : "text", align : "left", width : 200, editing : false},
                {name : "inicioVigencia", title : "Início Vigência", type : "text", align : "center", width : 100, editing: false},
                {name : "fimVigencia", title : "Fim Vigência", type : "text", align : "center", width : 100, editing: false},
				{name : "responsavel.nome", title: "Responsável", type : "text", align : "center", width : 200, editing: false},
				{name : "situacao", title : "Status", type : "select", items : [{id : "A", nome : "Ativo"}, {id : "I", nome : "Inativo"}],
				 valueField : "id", textField : "nome", align : "center", width : 50, editing: false}
			]
		});
    }

    get _itemMetasDataPesquisa() {
        return {
            matricula : this._matriculaItemPesquisa.val(),
            colaborador : this._colaboradorItemPesquisa.val(),
            inicioVigencia : this._inicioVigenciaItemPesquisa.val(),
            fimVigencia : this._fimVigenciaItemPesquisa.val(),
            responsavel : this._responsavelItemPesquisa.val(),
            situacao : this._situacaoMetaItemPesquisa.val()
        }                                         
    }
    
	_validatePesquisa() {
        if (!this._matriculaItemPesquisa.val() && !this._colaboradorItemPesquisa.val() && !this._inicioVigenciaItemPesquisa.val() && !this._fimVigenciaItemPesquisa.val() 
             && !this._responsavelItemPesquisa.val() && !this._situacaoMetaItemPesquisa.val()) {
			MessageView.showWarningMessage("Por favor, informe ao menos um filtro de pesquisa");
			return false;
        }

		return true;
	}
}
