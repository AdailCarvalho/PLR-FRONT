/**
 * Gerencia pesquisa e cadastro de colaboradores
 */
class ColaboradorController {
    constructor() {
		this._business = new ColaboradorBusiness();
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

	/** Inicializar */

	_initFieldsPesquisa() {
		this._matricula = $("#matricula");
		this._colaborador = $("#colaborador");
		this._cargo = $("#cargo");
		this._diretoria = $("#diretoria");
		this._time = $("#time");
		this._situacao = $("#situacao");

		this._gridPesquisaColaboradores = $('#jsGridPesquisaColaborador');

		this._loadGridPesquisaColaboradores([]);
	}

	_initFieldsCadastro() {

	}

	/** Carrega Dados */

	pesquisarColaborador() {
		let self = this;
		let colaborador = self._colaboradorData;
		console.dir(colaborador);
		if (!self._validatePesquisa()) {
			return;
		}

		$.when(self._business.findByFilter(colaborador.matricula, colaborador.nome, colaborador.situacao, colaborador.cargo.nome, 
										   colaborador.diretoria.nome,  colaborador.time.nome))
		.done(function (serverData) {
			self._loadGridPesquisaColaboradores(serverData);
		}).fail((xhr, textStatus, errorThrown) =>
			MessageView.showSimpleErrorMessage(("Erro ao pesquisar dados do colaborador! Erro : " + xhr.responseText)));
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
				return false;
			},

			fields : [
				{name : "matricula", title : "Matrícula", type : "text", align : "center", width : 50, editing : false},
				{name : "nome", title : "Colaborador", type : "text", align : "center", width : 100, editing: false},
				{name : "cargo.nome", title: "Cargo", type : "text", align : "center", width : 100, editing: false},
				{name : "diretoria.nome", title : "Diretoria", type : "text", align : "center", width : 100, editing: false},
				{name : "time.nome", title : "Time", type : "text", align : "center", width : 100},
				{name : "situacao", title : "Status", type : "text", align : "center", width : 50, editing: false}
			]
		});
	}

	/** Objetos */
	get _colaboradorData() {
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

	/** Validacoes */

	_validatePesquisa() {
		if (!this._matricula.val() && !this._colaborador.val() && !this._cargo.val() && !this._diretoria.val() && !this._time.val() && !this._situacao.val()) {
			MessageView.showWarningMessage("Informe ao menos um parâmetro de pesquisa!");
			return false;
		}

		return true;
	}
}
