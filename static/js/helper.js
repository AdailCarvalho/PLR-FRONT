/**
 * Script com funções globais / auxiliares.
 *  
 */

//JS Grid Date Type Field 
var MyDateField = function(config) {
    jsGrid.Field.call(this, config);
};

var formatDateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
var dateLocale = 'pt-BR';

var portugueseCalendar = {
    dateFormat: 'dd/mm/yy',
    dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
    dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
    dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab','Dom'],
    monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
    monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
    nextText: 'Próximo',
    prevText: 'Anterior',
    defaultDate : new Date()};
 
MyDateField.prototype = new jsGrid.Field({
 
    css: "date-field",            // redefine general property 'css'
    align: "center",              // redefine general property 'align'


 
    sorter: function(date1, date2) {
        return new Date(date1) - new Date(date2);
    },
 
    itemTemplate: function(value) {
        return new Date(value).toLocaleDateString(dateLocale, formatDateOptions);
    },
 
    insertTemplate: function(value) {
        return this._insertPicker = $("<input>").datepicker(portugueseCalendar);
    },
 
    editTemplate: function(value) {
        return this._editPicker = $("<input>").datepicker().datepicker("setDate", new Date(value));
    },
 
    insertValue: function() {
        return this._insertPicker.datepicker("getDate").toISOString();
    },
 
    editValue: function() {
        return this._editPicker.datepicker("getDate").toISOString();
    }
});
 
jsGrid.fields.date = MyDateField;


app_properties = {
    base_uri :  'http://localhost:8040'
}