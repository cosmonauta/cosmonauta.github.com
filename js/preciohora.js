'use strict';

var CalcApp = angular.module('CalcApp', ['ui']);

CalcApp.value('ui.config', {
   // The ui-jq directive namespace
   jq: {
      // The Tooltip namespace
      tooltip: {
         // Tooltip options. This object will be used as the defaults
         placement: 'top',
         trigger: 'focus',
         delay: {show:500, hide:20},
      }
   }
});

CalcApp.factory('Data', function(){
  return {
    salario: null,
    diasFeriados: null,
    diasVacaciones: null,
    diasIncapacidad: null,
    porcentajeAdmin: null,
    porcentajeUtilidad: null,
    rentaMensual: null,
    serviciosMensual: null,
    papeleriaMensual: null,
    otrosMensual: null
  };
});

CalcApp.factory('Config', function(){
  return {
    horas: 8,
    dias: 5,
    semanas: 52,
    meses: 12,
    porcentajeAguinaldo: 0.5,
    porcentajePrima: 0.25
  };
});

CalcApp.controller('calcCtrl', function CalculadoraCtrl($scope, Data, Config) {

  var data = Data;
  var conf = Config;

  $scope.data = data;
  $scope.conf = conf;

  data.salarioAnual = function(){
    return data.salario * (conf.meses + conf.porcentajeAguinaldo);
  };

  data.costoBasico = function(){
    return data.salarioAnual() / data.horasPosibles();
  };

  data.costoNoPosibles = function(){
    return data.horasNoPosibles() * data.costoBasico();
  };

  data.costoAdmin = function(){
    return data.horasAdmin() * data.costoBasico();
  };

  data.costoNoVendibles = function(){
      return data.horasNoVendibles() * data.costoBasico();
    };

  data.costoExtraAnual = function(){
    return data.fijosAnuales() + data.costoNoVendibles();
  };

  data.fijosMensuales = function(){
    return data.rentaMensual + data.serviciosMensual + data.papeleriaMensual + data.otrosMensual;
  };

  data.fijosAnuales = function(){
    return data.fijosMensuales() * conf.meses;
  };

  data.gananciaAnual = function(){
    return data.horasVendibles() * data.costoBasico();
  };

  data.horasEfectivas = function(){
    return data.horasPosibles() - data.horasNoPosibles();
  };

  data.horasAdmin = function(){
    return data.horasEfectivas() * data.porcentajeAdmin / 100;
  };

  data.horasPosibles = function(){
    return conf.horas * conf.dias * conf.semanas;
  };

  data.horasNoPosibles = function(){
    return data.horasFeriados() +
      data.horasVacaciones() +
      data.horasporcentajePrima() +
      data.horasIncapacidad();
  };

  data.horasFeriados = function(){ return data.diasFeriados * conf.horas;};

  data.horasVacaciones = function(){ return data.diasVacaciones * conf.horas;};

  data.horasporcentajePrima = function() { return data.horasVacaciones() * conf.porcentajePrima;};

  data.horasIncapacidad = function() { return data.diasIncapacidad * conf.horas;};

  data.horasVendibles = function(){
    return data.horasEfectivas() - data.horasAdmin();
  };

  data.horasNoVendibles = function(){
    return data.horasNoPosibles() + data.horasAdmin();
  };

  data.porcentajeRentabilidad = function(){
    if(!data.gananciaAnual()){return 0;}
    return data.costoExtraAnual() * 100 / data.gananciaAnual();
  };

  data.porcentajeRentabilidadPesos = function(){
    return data.costoBasico() * data.porcentajeRentabilidad() / 100;
  };

  data.horaJusta = function(){
    return data.costoBasico() + data.porcentajeRentabilidadPesos();
  };

  data.horaDiseno = function(){
    return data.horaJusta() + data.utilidad();
  };

  data.utilidad = function(){
    return data.horaJusta() * data.porcentajeUtilidad / 100;
  };

  data.ventaAnual = function(){
    return data.horaDiseno() * data.horasVendibles();
  };

  data.ventaMensual = function(){
    return data.ventaAnual() / conf.meses;
  };
});

$(function(){
  $('#saberMas').click(function(event){
    $('.explicacionrow').toggle();
  });
});