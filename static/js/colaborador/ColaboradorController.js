/**
 * Gerencia pesquisa e cadastro de colaboradores
 */
class ColaboradorController extends PLRController {
    constructor() {
		super();
		this._business = new ColaboradorBusiness();
		this._authBusiness = new AuthBusiness();
		this._perfilController = new PerfilController();

		let $body = $("body");
        $(document).on({
            ajaxStart: function() { $body.addClass("loading");    },
            ajaxStop: function() { $body.removeClass("loading"); }
        });

		this.applyConstraintsOnFields(['#colaboradoresTab', '#cadastroColaborador'], [], this._perfilController.hasPermissionToArea(4));
    }

    initFields() {
		if (!this._hasStartedColaborador) {
			this._initFieldsPesquisa();
			this._initFieldsCadastro();

			this._hasStartedColaborador = true;
		} 
	}

	/** Inicializar */

	_initFieldsPesquisa() {
		var key = document.getElementById("cadastroColaborador");
		key.addEventListener("keydown", e => {if (e.keyCode === 13) this.pesquisarColaborador();});

		this._matricula = $("#matriculaPesquisa");
		this._colaborador = $("#colaboradorPesquisa");
		this._cargo = $("#cargoPesquisa");
		this._diretoria = $("#diretoriaPesquisa");
		this._time = $("#timePesquisa");
		this._situacao = $("#situacaoPesquisa");

		this._gridPesquisaColaboradores = $('#jsGridPesquisaColaborador');

		this._loadGridPesquisaColaboradores([]);
	}

	_initFieldsCadastro() {
		this._fieldMatricula = $("#cadastroMatricula");
		this._fieldNome = $("#cadastroNome");
		this._fieldCargo = $("#cadastroCargo");
		this._fieldDiretoria = $("#cadastroDiretoria");
		this._fieldTime = $("#cadastroTime");
		this._fieldFilial = $("#cadastroFilial");
		this._fieldSituacao = $("#cadastroSituacao");
		this._fieldDataAdmissao = $("#cadastroDtAdmissao");
		this._fieldDataDemissao = $("#cadastroDtDemissao");
		this._fieldElegivel = $("#cadastroElegivel");
		this._fieldPerfil = $("#cadastroColabPerfil");
		this._fieldSituacaoPerfil = $("#cadastroColabPerfilSituacao");
		this._checkBoxResetSenha = $("#checkboxResetSenha");
		this._checkBoxResetSenhaArea = $('#checkboxResetSenhaArea');
		this._isNewColaborador = true;

		
		this._fieldsCadastroList = [this._fieldMatricula, this._fieldNome, this._fieldCargo, this._fieldDiretoria, this._fieldTime, this._fieldFilial, 
			this._fieldSituacao, this._fieldDataAdmissao, this._fieldDataDemissao, this._fieldElegivel, this._fieldPerfil];

		this._labelCaptionEquivalenciaCargo = $("#captionEquivalenciaCargo");
		this._listaCargos = [];
		this._regexDataValidator = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;
		this._modalCadastroColaboradores = $("#modalCadastroColaborador");

		$.datepicker.setDefaults({
			dateFormat: 'dd/mm/yy'
		 });
		  
		 this._fieldDataAdmissao.datepicker({
			numberOfMonths: 3,
			dateFormat: 'dd/mm/yy',
			dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'],
			dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
			dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
			monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
			monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
		});

		this._fieldDataDemissao.datepicker({
			numberOfMonths: 3,
			dateFormat: 'dd/mm/yy',
			dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'],
			dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
			dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
			monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
			monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
		});

		if (this._perfilController.hasPermissionToArea(4)) {
			this.carregarListaPerfis();
			this.carregarListaCargos();
			this.carregarListaDiretoria();
			this.carregarListaFiliais();
			this.carregarListaTimes();
		}

		this._modalCadastroColaboradores.dialog({
			autoOpen: false,
			resizable: false,
			width: 1400,
            minHeight : 600,
			show: {effect: "fade", duration: 200},
			hide: {effect: "explode", duration: 200},
			position: {my: "center", at: "center", of: window}
		});
	}

	/** Carrega Dados */

	carregarListaCargos() {
		let self = this;
		$.when(self._business.getLista("/cargos"))
		.done(function (serverData) {
			serverData.forEach(item => {
				item.value = item.id;
				item.text = item.nome;
			});

			serverData.unshift({});
			self._listaCargos = serverData;
			self.buildSelectOptions(self._fieldCargo, serverData);
		}).fail((xhr, textStatus, errorThrown) =>
			MessageView.showSimpleErrorMessage(("Erro ao pesquisar lista de Cargos! Erro : " + xhr.responseText)));
	}

	carregarListaDiretoria() {
		let self = this;
		$.when(self._business.getLista("/diretorias"))
		.done(function (serverData) {
			serverData.forEach(item => {
				item.value = item.id;
				item.text = item.nome;
			});

			serverData.unshift({});
			self.buildSelectOptions(self._fieldDiretoria, serverData);
		}).fail((xhr, textStatus, errorThrown) =>
			MessageView.showSimpleErrorMessage(("Erro ao pesquisar lista de Diretorias! Erro : "  + xhr.responseText)));
	}

	carregarListaFiliais() {
		let self = this;
		$.when(self._business.getLista("/filiais"))
		.done(function (serverData) {
			serverData.forEach(item => {
				item.value = item.id;
				item.text = item.nome;
			});

			serverData.unshift({});
			self.buildSelectOptions(self._fieldFilial, serverData);
		}).fail((xhr, textStatus, errorThrown) =>
			MessageView.showSimpleErrorMessage(("Erro ao pesquisar lista de Filiais! Erro : "  + xhr.responseText)));
	}

	carregarListaPerfis() {
		let self = this;
		$.when(self._business.getLista("/perfis"))
		.done(function (serverData) {
			serverData.forEach(item => {
				item.value = item.id;
				item.text = item.nome.toUpperCase();
			});

			serverData.unshift({});
			self.buildSelectOptions(self._fieldPerfil, serverData);
		}).fail((xhr, textStatus, errorThrown) =>
		MessageView.showSimpleErrorMessage(("Erro ao pesquisar lista de Perfis! Erro : "  + xhr.responseText)));
	}

	carregarListaTimes() {
		let self = this;
		$.when(self._business.getLista("/times"))
		.done(function (serverData) {
			serverData.forEach(item => {
				item.value = item.codigo;
				item.text = item.nome;
			});

			serverData.unshift({});
			self.buildSelectOptions(self._fieldTime, serverData);
		}).fail((xhr, textStatus, errorThrown) =>
			MessageView.showSimpleErrorMessage(("Erro ao pesquisar lista de Times! Erro : "  + xhr.responseText)));
	}

	avaliarEquivalenciaCargo() {
		let selectedCargo = this._fieldCargo.val();
		let resultCargo = this._listaCargos.filter(cargo => cargo.id == selectedCargo);
		if (resultCargo && resultCargo.length > 0) {
			this._labelCaptionEquivalenciaCargo.text("Equiv.: " + resultCargo[0].equivalencia.descricao);
		}
	}

	exportColaboradores() {
		this._business.exportColaboradores();
	}

	limparPesquisaColaborador() {
		this._matricula.val("");
		this._colaborador.val("");
		this._cargo.val("");
		this._diretoria.val("");
		this._time.val("");
		this._situacao.val("");
		this._loadGridPesquisaColaboradores([]);
	}

	pesquisarColaborador() {
		let self = this;
		let colaborador = self._colaboradorDataPesquisa;
		if (!self._validatePesquisa()) {
			self._loadGridPesquisaColaboradores([]);
			return;
		}

		$.when(self._business.findByFilter(colaborador.matricula, colaborador.nome, colaborador.situacao, colaborador.cargo.nome, 
										   colaborador.diretoria.nome,  colaborador.time.nome))
		.done(function (serverData) {
			self._loadGridPesquisaColaboradores(serverData);
		}).fail((xhr, textStatus, errorThrown) =>
			MessageView.showSimpleErrorMessage(("Erro ao pesquisar dados do colaborador! Erro : " + xhr.responseText)));
	}


	/** Cadastro */

	associarColaboradorPerfil() {
		this._perfilController.associaPerfilUsuario(this._colaboradorPerfilDataCadastro);
	}

	cadastrarColaborador(colaboradorItem) {
		let self = this;
		self._modalCadastroColaboradores.dialog('open');
		if (colaboradorItem) {
			self._preencheFormCadastroColaborador(colaboradorItem);
			self._isNewColaborador = false;
		} else {
			self._fieldMatricula.prop('disabled', false);
			self._isNewColaborador = true;

			self.hideElements(['#' + self._checkBoxResetSenhaArea.attr('id')]);
		}
	}

	cancelarCadastroColaborador() {
		this._fechaCadastroColaborador();
	}

	resetarSenhaColaborador() {
		let self = this;
		if (self._checkBoxResetSenha.prop('checked')) {
			self._authBusiness.redefinePrimeiroAcesso({ login : self._fieldMatricula.val()});
		}
	}

	salvarColaborador() {
		let self = this;
		let novoColaborador = this._colaboradorDataCadastro;
		if(new Validation().validateFields(self._validateCadastro())) {
			$.when(self._business.salvarColaborador(novoColaborador))
			.done(function (serverData) {
				self._matricula.val(serverData.matricula);
				self.associarColaboradorPerfil();
				self.resetarSenhaColaborador();
				self.pesquisarColaborador();
				
				MessageView.showSuccessMessage('Dados do Colaborador salvos com sucesso!');
			}).fail((xhr, textStatus, errorThrown) =>
				MessageView.showSimpleErrorMessage(("Erro ao salvar os dados do Colaborador! Erro : " + xhr.responseText)));
		} 
	}

	_fechaCadastroColaborador() {
		this._limpaCamposCadastroColaborador();
		this._modalCadastroColaboradores.dialog('close');
	}

	_limpaCamposCadastroColaborador() {
		this._fieldsCadastroList.forEach(field => field.val(""));
		this._checkBoxResetSenha.prop('checked', false);
	}

	_preencheFormCadastroColaborador(colaboradorItem) {
		this._fieldMatricula.prop('disabled', true);
		this._fieldMatricula.val(colaboradorItem.matricula);
		this._fieldNome.val(colaboradorItem.nome);
		this._fieldCargo.val(colaboradorItem.cargo.id);
		this._fieldDiretoria.val(colaboradorItem.diretoria.id);
		this._fieldTime.val(colaboradorItem.time.codigo);
		this._fieldFilial.val(colaboradorItem.filial.id);
		this._fieldSituacao.val(colaboradorItem.situacao);
		this._fieldDataAdmissao.val(colaboradorItem.dataAdmissao);
		this._fieldDataDemissao.val(colaboradorItem.dataDemissao);
		this._fieldElegivel.val(colaboradorItem.elegivel);
		if (colaboradorItem.usuario) {
			let perfilUsuario = colaboradorItem.usuario.perfilUsuario;
			this._fieldPerfil.val(perfilUsuario.perfil.id);
			this._fieldSituacaoPerfil.val(perfilUsuario.situacao);	
		}

		this.showHiddenElement(this._checkBoxResetSenhaArea);

		this._labelCaptionEquivalenciaCargo.text("Equiv.: " + colaboradorItem.cargo.equivalencia.descricao);
	}

	/** Grids */

	_loadGridPesquisaColaboradores(itemsColaboradores) {
		let self = this;
		self._gridPesquisaColaboradores.jsGrid({
			width: "100%",
			height: "auto",
	 
			inserting: false,
			editing: false,
			sorting: true,
			paging: true,
			pageSize: 10,
			data: itemsColaboradores,
			pagerFormat: 'Páginas: {first} {prev} {pages} {next} {last} &nbsp;&nbsp; {pageIndex} de {pageCount}',
			pageNextText: 'Próxima',
			pagePrevText: 'Anterior',
			pageFirstText: 'Primeira',
			pageLastText: 'Última', 

			rowClick : function(args) {
				self.cadastrarColaborador(args.item);
				return false;
			},

			fields : [
				{name : "matricula", title : "Matrícula", type : "text", align : "center", width : 50, editing : false},
				{name : "nome", title : "Colaborador", type : "text", align : "left", width : 100, editing: false},
				{name : "cargo.nome", title: "Cargo", type : "text", align : "center", width : 100, editing: false},
				{name : "diretoria.nome", title : "Diretoria", type : "text", align : "center", width : 100, editing: false},
				{name : "time.nome", title : "Time", type : "text", align : "center", width : 100},
				{name : "situacao", title : "Status", type : "select", items : [{id : "A", nome : "Ativo"}, {id : "I", nome : "Inativo"}],
				 valueField : "id", textField : "nome", align : "center", width : 50, editing: false}
			]
		});
	}

	/** Objetos */
	
	get _colaboradorDataPesquisa() {
		return {
			matricula : this._matricula.val(),
			nome : this._colaborador.val(),
			situacao : this._situacao.val(),
			cargo : {
				nome : this._cargo.val()
			},
			diretoria : {
				nome : this._diretoria.val()
			},
			time : {
				nome : this._time.val()
			}			
		};
	}

	get _colaboradorDataCadastro() {
		return {
			matricula : this._fieldMatricula.val(),
			nome : this._fieldNome.val(),
			situacao : this._fieldSituacao.val(),
			cargo : {id : this._fieldCargo.val()},
			diretoria : {id : this._fieldDiretoria.val()},
			time : {codigo : this._fieldTime.val()},
			filial : {id : this._fieldFilial.val()},
			dataAdmissao : this._fieldDataAdmissao.val(),
			dataDemissao : this._fieldDataDemissao.val(),
			elegivel : this._fieldElegivel.val(),
			isNewColaborador : this._isNewColaborador
		}
	}

	get _colaboradorPerfilDataCadastro() {
		return {
			situacao : this._fieldSituacaoPerfil.val(),
			perfil : {
				id : this._fieldPerfil.val(),
			},
			usuario : {
				login : this._fieldMatricula.val()
			}
		}
	}

	/** Validacoes */

	_validatePesquisa() {
		if (!this._matricula.val() && !this._colaborador.val() && !this._cargo.val() && !this._diretoria.val() && !this._time.val() && !this._situacao.val()) {
			MessageView.showWarningMessage("Por favor, informe ao menos um filtro de pesquisa");
			return false;
		}

		return true;
	}

	_validateCadastro() {
		let validationFieldsArray = [];
		
		validationFieldsArray.push(this.getFieldValidation(
						this._fieldMatricula.val(), 'Matrícula', 
						[Validation.types.NOT_EMPTY]));
		
		validationFieldsArray.push(this.getFieldValidation(
				this._fieldNome.val(), 'Nome', 
				[Validation.types.NOT_EMPTY]));

		validationFieldsArray.push(this.getFieldValidation(
					this._fieldCargo.val(), 'Cargo', 
					[Validation.types.NOT_EMPTY]));
			
		validationFieldsArray.push(this.getFieldValidation(
					this._fieldDiretoria.val(), 'Diretoria', 
					[Validation.types.NOT_EMPTY]));
		
		validationFieldsArray.push(this.getFieldValidation(
					this._fieldTime.val(), 'Time', 
					[Validation.types.NOT_EMPTY]));
						
		validationFieldsArray.push(this.getFieldValidation(
					this._fieldFilial.val(), 'Filial', 
					[Validation.types.NOT_EMPTY]));

		validationFieldsArray.push(this.getFieldValidation(
					this._fieldSituacao.val(), 'Situação', 
					[Validation.types.NOT_EMPTY]));

		validationFieldsArray.push(this.getFieldValidation(
				   this._fieldDataAdmissao.val(), 'Data de Admissão', 
						[Validation.types.NOT_EMPTY]));

		validationFieldsArray.push(this.getFieldValidation(
					this._fieldPerfil.val(), 'Perfil', 
						[Validation.types.NOT_EMPTY]));	
						
		validationFieldsArray.push(this.getFieldValidation(
					this._fieldSituacaoPerfil.val(), 'Situação do Perfil', 
						[Validation.types.NOT_EMPTY]));	
																
		return validationFieldsArray;
	}
}
