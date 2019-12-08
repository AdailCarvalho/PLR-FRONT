class MetasPeriodoController extends PLRController {

    constructor() {
        super();

        this._business = new MetasPeriodoBusiness();
        this._authBusiness = new AuthBusiness();

        this._perfilController = new PerfilController();

        this.applyConstraintsOnFields(['#configMetasPeriodoTab', '#configMetasPeriodoTabContent'], [],  this._perfilController.hasPermissionToArea(9));
        this.initFields();
    }

    initFields() {
        this._listaMetas = [];
        this._listaPeriodos = [];
        this._gridMetasPeriodo = $("#jsGridMetasPeriodo");
        
        if (this._perfilController.hasPermissionToArea(9)) {
            this._carregarListaMetas();
            this._carregarPeriodosAtivos();
            this._carregarDadosMetasPeriodo();
        }
    }
    
	_carregarListaMetas() {
		let self = this;
		$.when(self._business.getLista("/metas"))
		.done(function (serverData) {
			self._listaMetas = serverData.filter(item => item.isQuantitativa ==  "1");
		}).fail((xhr, textStatus, errorThrown) =>
			MessageView.showSimpleErrorMessage(("Erro ao pesquisar lista de Metas! Erro : " + xhr.responseText)));
    }
    
    _carregarPeriodosAtivos() {
        let self = this;
        $.when(self._authBusiness.getPeriodosAtivos())
        .done(function (serverData) {
            serverData.forEach(item => self._listaPeriodos.push({ano : item}));
        }).fail((xhr, textStatus, errorThrown) =>
            MessageView.showSimpleErrorMessage(("Erro ao pesquisar lista de Metas! Erro : " + xhr.responseText)));
    }

    _carregarDadosMetasPeriodo() {
        let self = this;
        $.when(self._business.getDadosMetasPeriodo())
        .done(function (serverData) {
            self._loadGridMetasPeriodo(serverData);
        }).fail((xhr, textStatus, errorThrown) =>
            MessageView.showSimpleErrorMessage(("Erro ao recuperar dados de Indicadores Por Período! Erro : " + xhr.responseText)));
    }

    _loadGridMetasPeriodo(metasPeriodoData) {
        let self = this;
        self._gridMetasPeriodo.jsGrid({
            width: "70%",
            height: "auto",
            inserting: self._perfilController.hasPermissionToArea(9),
            deleting : self._perfilController.hasPermissionToArea(9),
            editing: self._perfilController.hasPermissionToArea(9),
            sorting: self._perfilController.hasPermissionToArea(9),
            paging: true,
            pageSize: 20,
            pagerFormat: 'Páginas: {first} {prev} {pages} {next} {last} &nbsp;&nbsp; {pageIndex} de {pageCount}',
            pageNextText: 'Próxima',
            pagePrevText: 'Anterior',
            pageFirstText: 'Primeira',
            pageLastText: 'Última', 
            deleteConfirm : "Deseja realmente excluir o item selecionado?",
            data: metasPeriodoData,

            onItemInserting : function (args) {
                let items = self._gridMetasPeriodo.jsGrid("option", "data");
                args.item.tempo.id = args.item.tempo.ano + '0101';

                for (var i = 0; i < items.length; i ++) {
                    if (args.item.meta.id == items[i].meta.id && args.item.tempo.id == items[i].tempo.id) {
                        MessageView.showWarningMessage('Já existe um item com o Indicador e Período PLR informado');
                        args.cancel = true;
                        return;
                    }
                }

                self._insertItem(args.item);
            },

            onItemUpdating : function (args) {
                let items = self._gridMetasPeriodo.jsGrid("option", "data");
                args.item.tempo.id = args.item.tempo.ano + '0101';

                for (var i = 0; i < items.length; i ++) {
                    if ((args.item.meta.id == items[i].meta.id && args.previousItem.meta.id != items[i].meta.id) 
                         && (args.item.tempo.id == items[i].tempo.id && args.previousItem.tempo.id != items[i].tempo.id)) {
                        MessageView.showWarningMessage('Já existe um item com o Indicador e Período PLR informado');
                        args.cancel = true;
                        return;
                    }
                }

                self._insertItem(args.item);
            },

            onItemDeleting : function (args) {
                args.item.tempo.id = args.item.tempo.ano + '0101';
                self._deleteItem(args.item);
            },

            fields : [
                {type : "control", width : 60, editButton : self._perfilController.hasPermissionToArea(9), deletButton : self._perfilController.hasPermissionToArea(9)}, //[0]
                {name : "meta.id", title : "Indicador", type : "select", align : "center", width : 200, items : self._listaMetas,
                    valueField : "id", textField : "descricao",
                    validate : {
                        validator : "required",
                        message : "Favor informar o Indicador"
                    }                
                }, //[1]
                {name : "tempo.ano",  title : "Período PLR", type : "select", align : "center", width : 100, valueField : "ano", 
                 textField : "ano", items : self._listaPeriodos,
                 validate : {
                    validator : "required",
                    message : "Favor informar o Período"
                 }
                }, //[2]
                {name : "situacao", title : "Situação", type : "select", align : "center", width : 100, valueField : "codigo", textField : "descricao", 
                 items : [{codigo : "", descricao : ""}, {codigo : "A", descricao : "ATIVO"}, {codigo : "I", descricao : "INATIVO"}],
                 validate : {
                     validator : "required",
                     message : "Favor informar a Situação"
                 }
                } //[3]
            ]
        });
    }

    _insertItem(item) {
        let self = this;
        $.when(self._business.insertItem(item))
        .done(function(serverData) {
            MessageView.showSuccessMessage('Item salvo');
        }).fail((xhr, textStatus, errorThrown) =>
            MessageView.showSimpleErrorMessage(("Erro ao salvar item de Indicador por Período! Erro : " + xhr.responseText)));
    }

    _deleteItem(item) {
        this._business.deleteItem(item);
    }
}
