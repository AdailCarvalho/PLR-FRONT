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
        this._copiaMetaMensalPlan = $("#copiaMetaMensalPlan");
        this._copiaMetaMensalReal = $("#copiaMetaMensalReal");
        this._acumuladoMetaPlan = $("#acumuladoMetaPlan");
        this._acumuladoMetaReal = $("#acumuladoMetaReal");
        
        this._gridCadastroMetasMensais = $("#jsGridCadastroMetasMensais");
        this._modalCopiaMetasMensais = $("#modalCopiaMetasMensais");

        this._listaIndicadores = [];
        this._listaCamposMes = ['valJan', 'valFev', 'valMar', 'valAbr', 'valMai', 'valJun', 'valJul', 'valAgo', 'valSet', 'valOut', 'valNov', 'valDez'];
        this._dataMetaMensalArray = [
            {
                tipoMeta : 1,
            },
            {
                tipoMeta : 2
            }
        ];

        this._modalCopiaMetasMensais.dialog({
			autoOpen: false,
			resizable: false,
			width: 1500, 
			show: {effect: "fade", duration: 200},
			hide: {effect: "explode", duration: 200},
			position: {my: "center", at: "center", of: window}
        });
        
        this.setInputFilter(document.getElementById("copiaMetaMensalPlan"), function(value) {
            return /[-\d,.\t]*$/.test(value); });

        this.setInputFilter(document.getElementById("copiaMetaMensalReal"), function(value) {
                return /[-\d,.\t]*$/.test(value); });

        this.carregarListaMetas();
        this._loadGridMetasMensais(this._dataMetaMensalArray);
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

    _calcularAcumuladosViaCopia() {
        let self = this;
        let aggMetaPlan = 0;
        let aggMetaReal = 0;
        let itemMetaPlan = self._dataMetaMensalArray[0];
        let itemMetaReal = self._dataMetaMensalArray[1];
        for (var i = 0; i < self._listaCamposMes.length; i ++) {
            let valMetaPlan = itemMetaPlan[self._listaCamposMes[i]];
            if (valMetaPlan) {
                aggMetaPlan += parseFloat(formatDecimalToBigDecimal(valMetaPlan));
            }

            let valMetaReal = itemMetaReal[self._listaCamposMes[i]];
            if (valMetaReal) {
                aggMetaReal += parseFloat(formatDecimalToBigDecimal(valMetaReal));
            }
        }

        self._acumuladoMetaPlan.val(accounting.formatMoney(aggMetaPlan, "", 4, ".", ","));
        self._acumuladoMetaReal.val(accounting.formatMoney(aggMetaReal, "", 4, ".", ","));
    }

    copiarMetasMensais() {
        this._modalCopiaMetasMensais.dialog('open');
    }

    pushItemToDataMetaMensal(tipoMeta, item) {
        if (tipoMeta == 1) {
            this._dataMetaMensalArray[0] = item;
        } else {
            this._dataMetaMensalArray[1] = item;
        }
    }

    salvarCopiaMetasMentais() {
        this._loadGridMetasMensais(this._dataMetaMensalArray);
        this._calcularAcumuladosViaCopia();
        MessageView.showSuccessMessage('Valores copiados!');
    }

    salvarCopiaMetasMensaisPlan() {
        let capturedValuesPlan = this._copiaMetaMensalPlan.val().split("\t");
        if (capturedValuesPlan && capturedValuesPlan.length > 12) {
            MessageView.showWarningMessage("Valores informados para Metas Mentais Planejado são inválidos!\n Informe no máximo 12 valores");
            this._copiaMetaMensalPlan.focus();
            return;
        } 
        
        let itemMetaPlan = {tipoMeta : 1};
        for (var i = 0; i < capturedValuesPlan.length; i ++) {
            let valuePlan = capturedValuesPlan[i];
            if (!/(^-?\d*[.,]?\d{0,4}\t?)$/.test(valuePlan)) {
                MessageView.showWarningMessage("Valores informados para Metas Mensais Planejado são inválidos!\n Exemplos de formatos válidos: 2.312,2321\n2312,2321\n2312]");
                this._copiaMetaMensalPlan.focus();
                return;
            }

            itemMetaPlan[this._listaCamposMes[i]] = valuePlan;
        }

        this.pushItemToDataMetaMensal(1, itemMetaPlan);
    }

    salvarCopiaMetasMensaisReal() {
        let capturedValuesReal = this._copiaMetaMensalReal.val().split("\t");
        if (capturedValuesReal && capturedValuesReal.length > 12) {
            MessageView.showWarningMessage("Valores informados para Metas Mentais Planejado são inválidos!\n Informe no máximo 12 valores");
            this._copiaMetaMensalReal.focus();
            return;
        } 
        
        let itemMetaReal = {tipoMeta : 2};
        for (var i = 0; i < capturedValuesReal.length; i ++) {
            let valueReal = capturedValuesReal[i];
            if (!/(^-?\d*[.,]?\d{0,4}\t?)$/.test(valueReal)) {
                MessageView.showWarningMessage("Valores informados para Metas Mensais Real são inválidos!\n Exemplos de formatos válidos: 2.312,2321\n2312,2321\n2312]");
                this._copiaMetaMensalReal.focus();
                return;
            }

            itemMetaReal[this._listaCamposMes[i]] = valueReal;
        }

        this.pushItemToDataMetaMensal(2, itemMetaReal);
    }

    closeCopiarMetasMensais() {
        this._modalCopiaMetasMensais.dialog('close');
        this._limpaCamposCopiarMetasMensais();
    }

    _limpaCamposCopiarMetasMensais() {
        this._copiaMetaMensalPlan.val("");
        this._copiaMetaMensalReal.val("");
    }
    
    preencheCampos() {
        let selectedIndicador = this._indicadorMensal.val();
        let meta = this._listaIndicadores.filter(item => item.id == selectedIndicador);

        if (meta.length > 0) {
            this._codigoMetaMensal.val(meta[0].id);
            this._tipoIndicadorMensal.val(meta[0].tipoMeta.descricao);
            this._pontuacaoMensal.val(meta[0].frequenciaMedicao.descricao);
            this._formulaIndicadorMensal.val(meta[0].formula.nome);
            this._tipoMedicaoMensal.val(meta[0].tipoMedicao.descricao);
            this._situacaoMetaMensal.val(meta[0].situacao);
        }
    }

    _preencheValoresAgregados(valMeta, denominadorMedia, tipoMeta) {
        if (tipoMeta == 1) {
            if (this._tipoMedicaoMensal.val() == "SOMA") {
                this._acumuladoMetaPlan.val(accounting.formatMoney(valMeta, "", 4, ".", ","));
            } else {
                this._acumuladoMetaPlan.val(accounting.formatMoney((valMeta / denominadorMedia), "", 4, ".", ","));                
            }
        } else {
            if (this._tipoMedicaoMensal.val() == "SOMA") {
                this._acumuladoMetaReal.val(accounting.formatMoney(valMeta, "", 4, ".", ","));
            } else {
                this._acumuladoMetaReal.val(accounting.formatMoney((valMeta / denominadorMedia), "", 4, ".", ","));
            }
        }
    }

    _loadGridMetasMensais(metasMensaisData) {
        let self = this;
        let aggMeta = 0;
        self._gridCadastroMetasMensais.jsGrid({
            width: "2320px",
            height: "auto",
            inserting: false,
            deleting : false,
            editing: true,
            sorting: false,
            paging: true,
            pageSize: 5,
            pagerFormat: 'Páginas: {first} {prev} {pages} {next} {last} &nbsp;&nbsp; {pageIndex} de {pageCount}',
            pageNextText: 'Próxima',
            pagePrevText: 'Anterior',
            pageFirstText: 'Primeira',
            pageLastText: 'Última', 
            deleteConfirm : "Deseja realmente excluir o item selecionado?",
            data: metasMensaisData,

            onItemUpdating : function (args) {
                let denominadorMedia = 0;
                aggMeta = 0;
                for (var i = 3; i < 12; i ++) {
                    let valMeta = self._gridCadastroMetasMensais.jsGrid("option","fields")[i].editControl.val()
                    if (valMeta && parseFloat(formatDecimalToBigDecimal(valMeta)) > 0) {
                        aggMeta += parseFloat(formatDecimalToBigDecimal(valMeta));
                        denominadorMedia += 1;
                    }
                }

                self._preencheValoresAgregados(aggMeta, denominadorMedia, args.item.tipoMeta);
            },

            fields : [
                {type : "control", width : 60, deleteButton : false}, //[0]
                {name : "tipoMeta", title : "Tipo", type : "select", align : "center", width : 100, items : [{id : 1, descricao : "PLANEJADO"}, {id : 2, descricao : "REAL"}],
                    valueField : "id", textField : "descricao", readOnly : true
                }, //[1]
                {name : "valJan",  title : "Jan", type : "decimal", align : "center", width : 150}, //[2]
                {name : "valFev", title : "Fev", type : "decimal", align : "center", width : 150}, //[3]
                {name : "valMar",  title : "Mar", type : "decimal", align : "center", width : 150}, //[4]
                {name : "valAbr",  title : "Abr", type : "decimal", align : "center", width : 150},//[5]
                {name : "valMai",  title : "Mai", type : "decimal", align : "center", width : 150},//[6]
                {name : "valJun", title : "Jun", type : "decimal", align : "center", width : 150},//[7]
                {name : "valJul",  title : "Jul", type : "decimal", align : "center", width : 150},//[8]
                {name : "valAgo", title : "Ago", type : "decimal", align : "center", width : 150},//[9]
                {name : "valSet",  title : "Set", type : "decimal", align : "center", width : 150},//[10]
                {name : "valOut",  title : "Out", type : "decimal", align : "center", width : 150},//[11]
                {name : "valNov",  title : "Nov", type : "decimal", align : "center", width : 150},//[12]
                {name : "valDez", title : "Dez",  type : "decimal", align : "center", width : 150}//[13]
            ]
        });
    }
}
