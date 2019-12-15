class MetaMensalController extends PLRController {

    constructor() {
        super();
        this._business = new MetaMensalBusiness();
        this._perfilController = new PerfilController();

        let $body = $("body");
        $(document).on({
            ajaxStart: function() { $body.addClass("loading");    },
            ajaxStop: function() { $body.removeClass("loading"); }
        });

        this.applyConstraintsOnFields(['#metasMensaisTab'], [], this._perfilController.hasPermissionToArea(6));
        this.initFields();
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

        this._indicadorMensal.selectpicker();

        this._hasEditedGridMetas = false;

        this._listaIndicadores = [];
        this._listaCamposMes = ['valJan', 'valFev', 'valMar', 'valAbr', 'valMai', 'valJun', 'valJul', 'valAgo', 'valSet', 'valOut', 'valNov', 'valDez'];
        this._listaCamposMesNum = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        this._listaCamposIdMes = ['idJan', 'idFev', 'idMar', 'idAbr', 'idMai', 'idJun', 'idJul', 'idAgo', 'idSet', 'idOut', 'idNov', 'idDez'];
        this._dataMetaMensalArray = [{tipoMeta : "META"},{tipoMeta : "REAL"}];

        this._modalCopiaMetasMensais.dialog({
			autoOpen: false,
			resizable: false,
            width: 1400,
			show: {effect: "fade", duration: 200},
			hide: {effect: "explode", duration: 200},
			position: {my: "center", at: "center", of: window}
        });
        
        this.setInputFilter(document.getElementById("copiaMetaMensalPlan"), function(value) {
            return /[-\d,.\t]*$/.test(value); });

        this.setInputFilter(document.getElementById("copiaMetaMensalReal"), function(value) {
                return /[-\d,.\t]*$/.test(value); });

        this.carregarListaMetas();
        this._loadGridMetasMensais([]);
	}

    carregarListaMetas() {
		let self = this;
		$.when(self._business.getLista("/metas/quantitativas/" + getPeriodoPLR()))
		.done(function (serverData) {
            let listaIndicadoresFiltered = serverData;
			listaIndicadoresFiltered.forEach(item => {
                item.value = item.id;
				item.text = item.descricao;
            });
            
            self._listaIndicadores = listaIndicadoresFiltered;
            listaIndicadoresFiltered.unshift({});

            self.buildSelectOptions(self._indicadorMensal, listaIndicadoresFiltered);
		}).fail((xhr, textStatus, errorThrown) =>
			MessageView.showSimpleErrorMessage(("Erro ao pesquisar lista de Indicadores! Erro : " + xhr.responseText)));
    }

    copiarMetasMensais() {
        if (!this._indicadorMensal.val()) {
            MessageView.showWarningMessage("Por favor, escolha um indicador.");
            return;
        }

        this._modalCopiaMetasMensais.dialog('open');
    }

    /** onchange _indicadorMensal */
    findMetasMensaisForIndicador() {
        let self = this;

        if (!self._indicadorMensal.val()) {
            self.limparCamposPesquisaIndicador();
            return;
        }

        let selectedIndicador = this._indicadorMensal.val();
        let metaSelecionada = this._listaIndicadores.filter(item => item.id == selectedIndicador);
        self._preencheCamposPesquisaIndicador(metaSelecionada);

        $.when(self._business.findMetasMensais(selectedIndicador))
        .done(function (serverData) {
            self._acumuladoMetaPlan.val("");
            self._acumuladoMetaReal.val("");

            if (serverData && serverData.length > 0) {
                self._dataMetaMensalArray = [...serverData];
                self._loadGridMetasMensais(self._dataMetaMensalArray); 

                self._calcularAcumuladosViaCopia();
            } else {
                self._dataMetaMensalArray = [{tipoMeta : "META"},{tipoMeta : "REAL"}];
                self._loadGridMetasMensais(self._dataMetaMensalArray);
            }
        }).fail((xhr, textStatus, errorThrown) =>
             MessageView.showSimpleErrorMessage(("Erro ao pesquisar as Metas mensais para o indicador informado! Erro : " + xhr.responseText)));
    }

    limparCamposPesquisaIndicador() {
        this._codigoMetaMensal.val("");
        this._tipoIndicadorMensal.val("");
        this._formulaIndicadorMensal.val("");
        this._tipoMedicaoMensal.val("");
        this._pontuacaoMensal.val("");
        this._loadGridMetasMensais([]);
    }

    pushItemToDataMetaMensal(tipoMeta, item) {
        if (tipoMeta == "META") {
            this._dataMetaMensalArray[0] = item;
        } else {
            this._dataMetaMensalArray[1] = item;
        }
    }

    salvarMetasMensais() {
        let self = this;
        let mensalPlanejado = self._dataMetaMensalArray[0];
        let mensalReal = self._dataMetaMensalArray[1];
        let itensMetasMensais = [];
		
		if (!self._indicadorMensal.val()) {
            MessageView.showWarningMessage("Por favor, escolha um indicador.");
            return;
        }

        if (!self._hasEditedGridMetas) {
            MessageView.showWarningMessage("Nenhuma edição detectada.");
            return;
        }
		
        for (var i = 0; i < self._listaCamposMes.length; i ++) {
            let itemUnificado = {
                id : mensalReal[self._listaCamposIdMes[i]], 
                idMeta : self._indicadorMensal.val(), 
                valorReal : parseFloat(formatDecimalToBigDecimal(mensalReal[self._listaCamposMes[i]])), 
                valorMeta : parseFloat(formatDecimalToBigDecimal(mensalPlanejado[self._listaCamposMes[i]])), 
                prazo : {id :getPeriodoPLR() + self._listaCamposMesNum[i] + "01"}
            };

            itensMetasMensais.push(itemUnificado);
        }

        $.when(self._business.saveMetasMensais(self._indicadorMensal.val(), itensMetasMensais))
        .done(function (serverData) {
            MessageView.showSuccessMessage("Metas mensais salvas!");
            self.findMetasMensaisForIndicador();
        }).fail((xhr, textStatus, errorThrown) =>
            MessageView.showSimpleErrorMessage(("Erro ao salvar os itens de Meta Mensal! Erro : " + xhr.responseText)));
    }

    salvarCopiaMetasMentais() {
        this._hasEditedGridMetas= true;

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
        
        let itemMetaPlan = {tipoMeta : "META"};
        for (var i = 0; i < capturedValuesPlan.length; i ++) {
            let valuePlan = capturedValuesPlan[i];
            if (!/(^-?\d*[.,]?\d{0,4}\t?)$/.test(valuePlan)) {
                MessageView.showWarningMessage("Valores informados para Metas Mensais Planejado são inválidos!\n Exemplos de formatos válidos: 2.312,2321\n2312,2321\n2312]");
                this._copiaMetaMensalPlan.focus();
                return;
            }

            itemMetaPlan[this._listaCamposMes[i]] = valuePlan;
        }

        this.pushItemToDataMetaMensal("META", itemMetaPlan);
    }

    salvarCopiaMetasMensaisReal() {
        let capturedValuesReal = this._copiaMetaMensalReal.val().split("\t");

        if (capturedValuesReal && capturedValuesReal.length > 12) {
            MessageView.showWarningMessage("Valores informados para Metas Mentais Planejado são inválidos!\n Informe no máximo 12 valores");
            this._copiaMetaMensalReal.focus();
            return;
        } 
        
        let itemMetaReal = {tipoMeta : "REAL"};
        for (var i = 0; i < capturedValuesReal.length; i ++) {
            let valueReal = capturedValuesReal[i];
            if (!/(^-?\d*[.,]?\d{0,4}\t?)$/.test(valueReal)) {
                MessageView.showWarningMessage("Valores informados para Metas Mensais Real são inválidos!\n Exemplos de formatos válidos: 2.312,2321\n2312,2321\n2312]");
                this._copiaMetaMensalReal.focus();
                return;
            }

            itemMetaReal[this._listaCamposMes[i]] = valueReal;
        }

        this.pushItemToDataMetaMensal("REAL", itemMetaReal);
    }

    closeCopiarMetasMensais() {
        this._modalCopiaMetasMensais.dialog('close');
        this._limpaCamposCopiarMetasMensais();
    }

    _calcularAcumuladosViaCopia() {
        let self = this;
        let aggMetaPlan = 0;
        let aggMetaReal = 0;
        let denominadorMediaPlan = 0;
        let denominadorMediaReal = 0;
        let itemMetaPlan = self._dataMetaMensalArray[0];
        let itemMetaReal = self._dataMetaMensalArray[1];
        for (var i = 0; i < self._listaCamposMes.length; i ++) {
            let valMetaPlan = itemMetaPlan[self._listaCamposMes[i]];
            if (valMetaPlan && parseFloat(formatDecimalToBigDecimal(valMetaPlan)) != 0) {
                aggMetaPlan += parseFloat(formatDecimalToBigDecimal(valMetaPlan));
                denominadorMediaPlan += 1;
            }

            let valMetaReal = itemMetaReal[self._listaCamposMes[i]];
            if (valMetaReal && parseFloat(formatDecimalToBigDecimal(valMetaReal)) != 0) {
                aggMetaReal += parseFloat(formatDecimalToBigDecimal(valMetaReal));
                denominadorMediaReal += 1;
            }
        }

        if (this._formulaIndicadorMensal.val() == "SOMA") {
            self._acumuladoMetaPlan.val(accounting.formatMoney(aggMetaPlan, "", 4, ".", ","));
            self._acumuladoMetaReal.val(accounting.formatMoney(aggMetaReal, "", 4, ".", ","));    
        } else {
            self._acumuladoMetaPlan.val(accounting.formatMoney((aggMetaPlan / denominadorMediaPlan), "", 4, ".", ","));
            self._acumuladoMetaReal.val(accounting.formatMoney((aggMetaReal / denominadorMediaReal), "", 4, ".", ","));    
        }
    }

    _limpaCamposCopiarMetasMensais() {
        this._copiaMetaMensalPlan.val("");
        this._copiaMetaMensalReal.val("");
    }

    _preencheCamposPesquisaIndicador(meta) {
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
        if (tipoMeta == "META") {
            if (this._formulaIndicadorMensal.val() == "SOMA") {
                this._acumuladoMetaPlan.val(accounting.formatMoney(valMeta, "", 4, ".", ","));
            } else {
                this._acumuladoMetaPlan.val(accounting.formatMoney((valMeta / denominadorMedia), "", 4, ".", ","));                
            }
        } else {
            if (this._formulaIndicadorMensal.val() == "SOMA") {
                this._acumuladoMetaReal.val(accounting.formatMoney(valMeta, "", 4, ".", ","));
            } else {
                this._acumuladoMetaReal.val(accounting.formatMoney((valMeta / denominadorMedia), "", 4, ".", ","));
            }
        }
    }

    /** GRID */

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

            invalidNotify: function(args) {	
				var messageHeader = 'Campos obrigatórios não informados ou inválidos:';
				var messages = messageHeader + $.map(args.errors, function(error) {
		            return "\n" + error.message;
		        });
				showTemporalMessage("warning", messages);
			},

            onItemUpdating : function (args) {
                self._hasEditedGridMetas= true;
                let denominadorMedia = 0;
                aggMeta = 0;
                for (var i = 2; i <= 13; i ++) {
                    let valMeta = self._gridCadastroMetasMensais.jsGrid("option","fields")[i].editControl.val()
                    if (valMeta && parseFloat(formatDecimalToBigDecimal(valMeta)) != 0) {
                        aggMeta += parseFloat(formatDecimalToBigDecimal(valMeta));
                        denominadorMedia += 1;
                    }
                }

                self._preencheValoresAgregados(aggMeta, denominadorMedia, args.item.tipoMeta);
            },

            fields : [
                {type : "control", width : 60, deleteButton : false}, //[0]
                {name : "tipoMeta", title : "Tipo", type : "select", align : "center", width : 100, items : [{id : "META", descricao : "PLANEJADO"}, {id : "REAL", descricao : "REAL"}],
                    valueField : "id", textField : "descricao", readOnly : true
                }, //[1]
                {name : "valJan",  title : "Jan", type : "decimal", align : "center", width : 150, //[2]
                 validate: {
                        validator : function (value) {
                            return /^-?\d{1,3}(\.?\d{3})*(,\d{0,4})?$/.test(value);
                        },
                        message : "Por favor, informe um número válido"
                    }
                },
                {name : "valFev", title : "Fev", type : "decimal", align : "center", width : 150, 
                 validate: {
                        validator : function (value) {
                            return /^-?\d{1,3}(\.?\d{3})*(,\d{0,4})?$/.test(value);
                         },
                        message : "Por favor, informe um número válido"
                    }
                }, //[3]
                {name : "valMar",  title : "Mar", type : "decimal", align : "center", width : 150,
                    validate: {
                        validator : function (value) {
                            return /^-?\d{1,3}(\.?\d{3})*(,\d{0,4})?$/.test(value);
                        },
                        message : "Por favor, informe um número válido"
                    }
                }, //[4]
                {name : "valAbr",  title : "Abr", type : "decimal", align : "center", width : 150,
                 validate: {
                        validator : function (value) {
                            return /^-?\d{1,3}(\.?\d{3})*(,\d{0,4})?$/.test(value);
                        },
                        message : "Por favor, informe um número válido"
                    }
                },//[5]
                {name : "valMai",  title : "Mai", type : "decimal", align : "center", width : 150,
                    validate: {
                        validator : function (value) {
                            return /^-?\d{1,3}(\.?\d{3})*(,\d{0,4})?$/.test(value);
                        },
                        message : "Por favor, informe um número válido"
                    }
                },//[6]
                {name : "valJun", title : "Jun", type : "decimal", align : "center", width : 150,
                    validate: {
                        validator : function (value) {
                            return /^-?\d{1,3}(\.?\d{3})*(,\d{0,4})?$/.test(value);
                        },
                        message : "Por favor, informe um número válido"
                    }
                },//[7]
                {name : "valJul",  title : "Jul", type : "decimal", align : "center", width : 150,
                    validate: {
                        validator : function (value) {
                            return /^-?\d{1,3}(\.?\d{3})*(,\d{0,4})?$/.test(value);
                        },
                        message : "Por favor, informe um número válido"
                    }
                },//[8]
                {name : "valAgo", title : "Ago", type : "decimal", align : "center", width : 150,
                    validate: {
                        validator : function (value) {
                            return /^-?\d{1,3}(\.?\d{3})*(,\d{0,4})?$/.test(value);
                        },
                        message : "Por favor, informe um número válido"
                    }
                },//[9]
                {name : "valSet",  title : "Set", type : "decimal", align : "center", width : 150,
                    validate: {
                        validator : function (value) {
                            return /^-?\d{1,3}(\.?\d{3})*(,\d{0,4})?$/.test(value);
                        },
                        message : "Por favor, informe um número válido"
                    }
                },//[10]
                {name : "valOut",  title : "Out", type : "decimal", align : "center", width : 150,
                    validate: {
                        validator : function (value) {
                            return /^-?\d{1,3}(\.?\d{3})*(,\d{0,4})?$/.test(value);
                        },
                        message : "Por favor, informe um número válido"
                    }
                },//[11]
                {name : "valNov",  title : "Nov", type : "decimal", align : "center", width : 150,
                    validate: {
                        validator : function (value) {
                            return /^-?\d{1,3}(\.?\d{3})*(,\d{0,4})?$/.test(value);
                        },
                        message : "Por favor, informe um número válido"
                    }
                },//[12]
                {name : "valDez", title : "Dez",  type : "decimal", align : "center", width : 150,
                    validate: {
                        validator : function (value) {
                            return /^-?\d{1,3}(\.?\d{3})*(,\d{0,4})?$/.test(value);
                        },
                        message : "Por favor, informe um número válido"
                    }
                }//[13]
            ]
        });
    }
}
