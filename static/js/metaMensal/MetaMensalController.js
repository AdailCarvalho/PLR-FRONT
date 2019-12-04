class MetaMensalController extends PLRController {

    constructor() {
        super();
        this._business = new MetaMensalBusiness();
        this._perfilController = new PerfilController();

        this.applyConstraintsOnFields(['#metasMensaisTab'], [], this._perfilController.hasPermissionToArea(6));
        this.initFields();

        let $body = $("body");
        $(document).on({
            ajaxStart: function() { $body.addClass("loading");    },
            ajaxStop: function() { $body.removeClass("loading"); }
        });
    }

    initFields() {
        this._codigoMetaMensal  = $("#codigoMetaMensal");
        this._indicadorMensal = $("#selectIndicadorMensal");
        this._tipoIndicadorMensal = $("#tipoIndicadorMensal");
        this._pontuacaoMensal = $("#pontuacaoMensal");
        this._tipoMedicaoMensal= $("#tipoMedicaoMensal");
        this._formulaIndicadorMensal = $("#formulaIndicadorMensal");
        this._situacaoMetaMensal = $("#situacaoMetaMensal");
        
        this._gridCadastroMetasMensais = $("#jsGridCadastroMetasMensais");

        this._listaIndicadores = [];
        this._dataMetaMensalSample = [
            {
                tipoMeta : 1,
            },
            {
                tipoMeta : 2
            }
        ];
        this._loadGridMetasMensais(this._dataMetaMensalSample);

        this.carregarListaMetas();
	}

    carregarListaMetas() {
		let self = this;
		$.when(self._business.getLista("/metas"))
		.done(function (serverData) {
			serverData.forEach(item => {
				item.value = item.id;
				item.text = item.descricao;
            });
            
            self._listaIndicadores = serverData;

            serverData.unshift({});

            self.buildSelectOptions(self._indicadorMensal, serverData);
		}).fail((xhr, textStatus, errorThrown) =>
			MessageView.showSimpleErrorMessage(("Erro ao pesquisar lista de Indicadores! Erro : " + xhr.responseText)));
    }
    
    preencheCampos() {
        let selectedIndicador = this._indicadorMensal.val();
        let meta = this._listaIndicadores.filter(item => item.id == selectedIndicador);

        if (meta.length > 0) {
            this._codigoMetaMensal.val(meta[0].id);
            this._tipoIndicadorMensal.val(meta[0].tipoMeta.descricao);
            this._pontuacaoMensal.val(meta[0].frequenciaMedicao.descricao);
            this._formulaIndicadorMensal.val(meta[0].formula.nome);
            this._situacaoMetaMensal.val(meta[0].situacao);
        }

    }

    _loadGridMetasMensais(metasMensaisData) {
        this._gridCadastroMetasMensais.jsGrid({
            width: "2320px",
            height: "auto",
            inserting: false,
            editing: true,
            sorting: true,
            paging: true,
            pageSize: 5,
            pagerFormat: 'Páginas: {first} {prev} {pages} {next} {last} &nbsp;&nbsp; {pageIndex} de {pageCount}',
            pageNextText: 'Próxima',
            pagePrevText: 'Anterior',
            pageFirstText: 'Primeira',
            pageLastText: 'Última', 
            deleteConfirm : "Deseja realmente excluir o item selecionado?",
            data: metasMensaisData,

            fields : [
                {type : "control", width : 60},
                {name : "tipoMeta", title : "Tipo", type : "select", align : "center", width : 100, items : [{id : 1, descricao : "PLANEJADO"}, {id : 2, descricao : "REAL"}],
                    valueField : "id", textField : "descricao", readOnly : true
                },
                {name : "valJan",  title : "Jan", type : "decimal", align : "center", width : 150},
                {name : "valFev", title : "Fev", type : "decimal", align : "center", width : 150},
                {name : "valMar",  title : "Mar", type : "decimal", align : "center", width : 150},
                {name : "valAbr",  title : "Abr", type : "decimal", align : "center", width : 150},
                {name : "valMai",  title : "Mai", type : "decimal", align : "center", width : 150},
                {name : "valJun", title : "Jun", type : "decimal", align : "center", width : 150},
                {name : "valJul",  title : "Jul", type : "decimal", align : "center", width : 150},
                {name : "valAgo", title : "Ago", type : "decimal", align : "center", width : 150},
                {name : "valSet",  title : "Set", type : "decimal", align : "center", width : 150},
                {name : "valOut",  title : "Out", type : "decimal", align : "center", width : 150},
                {name : "valNov",  title : "Nov", type : "decimal", align : "center", width : 150},
                {name : "valDez", title : "Dez",  type : "decimal", align : "center", width : 150}
            ]
        });
    }
}
