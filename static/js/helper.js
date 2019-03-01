/**
 * Script com funções globais / auxiliares.
 *  
 */

//JS Grid Date Type Field 
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
 
var CustomDateField = function(config) {
      jsGrid.Field.call(this, config);
  };
   
CustomDateField.prototype = new jsGrid.Field({
 
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
      var result = this._editPicker = $("<input>").datepicker(portugueseCalendar).datepicker("setDate", new Date(value).toLocaleDateString(dateLocale, formatDateOptions));
      return result;
    },
 
    insertValue: function() {
        var dateValue = this._insertPicker.datepicker("getDate");
        var strDateValue = $.datepicker.formatDate(portugueseCalendar.dateFormat, dateValue)
        return strDateValue.toDate(portugueseCalendar.dateFormat);
    },
 
    editValue: function() {
        var dateValue = this._editPicker.datepicker("getDate");
        var strDateValue = $.datepicker.formatDate(portugueseCalendar.dateFormat, dateValue)
        return strDateValue.toDate(portugueseCalendar.dateFormat);
    }
});

jsGrid.fields.date = CustomDateField;

//Date Formatter
String.prototype.toDate = function(format)
{
  var normalized      = this.replace(/[^a-zA-Z0-9]/g, '-');
  var normalizedFormat= format.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  var formatItems     = normalizedFormat.split('-');
  var dateItems       = normalized.split('-');

  var monthIndex  = formatItems.indexOf("mm");
  var dayIndex    = formatItems.indexOf("dd");
  var yearIndex   = formatItems.indexOf("yyyy");
  var hourIndex     = formatItems.indexOf("hh");
  var minutesIndex  = formatItems.indexOf("ii");
  var secondsIndex  = formatItems.indexOf("ss");

  var today = new Date();

  var year  = yearIndex >-1  ? dateItems[yearIndex]    : today.getFullYear();
  var month = monthIndex >-1 ? dateItems[monthIndex]-1 : today.getMonth()-1;
  var day   = dayIndex >-1   ? dateItems[dayIndex]     : today.getDate();
 
  return new Date(year,month,day);
};


/**
 * JS Grid custom currency
 */
var optionsCurrency = {
  digitGroupSeparator: '.',
  decimalCharacter: ',',
  decimalCharacterAlternative: '.',
  currencySymbol: 'R$',
  currencySymbolPlacement: 's',
  decimalPlacesOverride: 2,
  minimumValue: '0.00',
  emptyInputBehavior: 'zero',
  leadingZero: 'deny',
  defaultValueOverride: '0.00'
};

var CustomCurrencyField = function (config) {
  jsGrid.Field.call(this, config);
};

CustomCurrencyField.prototype = new jsGrid.Field({
  sorter: function (num1, num2) {
    return num1 - num2;
  },
  
  itemTemplate: function (value) {
   // return $.fn.autoFormat(value, optionsCurrency);
   return value;
  },
  
  insertTemplate: function (value) {
    this._insertPicker = $('<input type="text">').val(value);
    this._insertPicker.autoNumeric('init', optionsCurrency);
    return this._insertPicker;
  },
  
  editTemplate: function (value) {
    this._editPicker = $('<input type="text">').val(value);
    this._editPicker.autoNumeric('init', optionsCurrency);
    return this._editPicker;
  },
  
  filterTemplate: function () {
    if (!this.filtering)
      return '';
    var grid = this._grid,
      $result = $('<input type="text">').val(0);
    if (this.autosearch) {
      $result.on('change', function (e) {
        grid.search();
      });
    }
    return $result;
  },
  
  filterValue: function () {
    return this._insertPicker.val();
  },
  
  insertValue: function () {
    return this._insertPicker.autoNumeric('get');
  },
  
  editValue: function () {
    return this._editPicker.autoNumeric('get');
  }
});

jsGrid.fields.decimalReal = CustomCurrencyField;
 
//Logged user
function setLoggedUser(user) {
  let userName = user.nome.split(" ");
  let finalName = userName[0] + ' ' + userName[1];
  localStorage.setItem("plrLoggedUser",user.matricula);
  localStorage.setItem("plrLoggedName", finalName);
  localStorage.setItem("plrLoggedPhrase", user.phrase);
  localStorage.setItem("plrIsFirstAccess", user.inPrimeiroAcesso);
  registerBrowserSession(user.matricula);
}

function getLoggedUser() {
  return localStorage.getItem("plrLoggedUser"); 
}

function getLoggedName() {
  return localStorage.getItem("plrLoggedName");
}

function getLoggedPhrase() {
  return localStorage.getItem("plrLoggedPhrase");
}

function isPrimeiroAcesso() {
  return localStorage.getItem("plrIsFirstAccess") == 'S';
}

//Session (half hour as default = 1800s)
var MAX_SESSION_TIME = 1800;
function registerBrowserSession(matricula) {
  let localDateTime = new Date().toISOString();
  localStorage.setItem(matricula, localDateTime);
}

function sessionRemainingMin (){
  let userSessionStartTime = localStorage.getItem(getLoggedUser());
  return (MAX_SESSION_TIME - (new Date() - new Date(userSessionStartTime)) / 1000) / 60;
}

function resetBrowserSession() {
  let sessionStartTime = localStorage.getItem(getLoggedUser());
  if (sessionStartTime != null && ((new Date() - new Date(sessionStartTime)) / 1000) <= MAX_SESSION_TIME) {
    return false;
  } else {
    removeSession();
    return true;
  }
}

function removeSessionItens(itens) {
  itens.forEach(item => localStorage.removeItem(item));
}

function removeSession() {
  localStorage.removeItem(getLoggedUser());
  localStorage.removeItem("plrLoggedUser");
  localStorage.removeItem("plrIsFirstAccess");
  localStorage.removeItem("plrLoggedPhrase");
  localStorage.removeItem("plrLoggedName");
}

//Properties
app_properties = {
  profile : 'tomcat'
}

app_standalone_properties = {
    app_base_uri : 'http://localhost:8080/plr',
    api_base_uri : 'http://localhost:8040'
}

app_tomcat_properties = {
    app_base_uri : 'http://localhost:8080/plr',
    api_base_uri : 'http://localhost:8080/plr-api'
}

function getPropertyVal(key) {
  let val = '';
  switch(app_properties.profile) {
    case('standalone'):
      val = app_standalone_properties[key];
      break;
    case('tomcat'):
      val = app_tomcat_properties[key];
      break;
    default:
      break;
  }
  return val;
}
