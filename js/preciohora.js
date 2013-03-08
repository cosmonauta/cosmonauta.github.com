var CalcApp = angular.module('CalcApp', ['ui']);


CalcApp.controller('calcCtrl', function CalculadoraCtrl($scope) {
  $scope.salario_mensual_promedio = null;
  $scope.horas = 8;
  $scope.dias = 5;
  $scope.semanas = 52;
  $scope.meses = 12;
  $scope.aguinaldo = 0.5;
  $scope.feriados = null;
  $scope.vacaciones = null;
  $scope.prima = 0.25;
  $scope.incapacidad = null;
  $scope.tiempo_admin = null;
  $scope.porcentaje_utilidad = null;
  $scope.renta_mensual = null;
  $scope.servicios_mensuales = null;
  $scope.papeleria_mensual = null;
  $scope.otros_mensuales = null;
  $scope.hora_diseno = 0.0;

  $scope.salario_anual = function(){
    return $scope.salario_mensual_promedio * ($scope.meses + $scope.aguinaldo);
  };

  $scope.costo_basico = function(){
    return $scope.salario_anual() / $scope.horas_posibles();
  };

  $scope.horas_posibles = function(){
    return $scope.horas * $scope.dias * $scope.semanas;
  };

  $scope.horas_feriados = function(){ return $scope.feriados * $scope.horas;};

  $scope.horas_vacaciones = function(){ return $scope.vacaciones * $scope.horas;};

  $scope.horas_prima = function() { return $scope.horas_vacaciones() * $scope.prima;};

  $scope.horas_incapacidad = function() { return $scope.incapacidad * $scope.horas;};

  $scope.horas_no_posibles = function(){
    return $scope.horas_feriados() +
      $scope.horas_vacaciones() +
      $scope.horas_prima() +
      $scope.horas_incapacidad();
    };

  $scope.costo_no_posibles = function(){
    return $scope.horas_no_posibles() * $scope.costo_basico();
  };

  $scope.horas_efectivas = function(){
    return $scope.horas_posibles() - $scope.horas_no_posibles();
  };

  $scope.horas_admin = function(){
    return $scope.horas_efectivas() * $scope.tiempo_admin / 100;
  };

  $scope.horas_vendibles = function(){
    return $scope.horas_efectivas() - $scope.horas_admin();
  };

  $scope.costo_admin = function(){
    return $scope.horas_admin() * $scope.costo_basico();
  };

  $scope.horas_no_vendibles = function(){
    return $scope.horas_no_posibles() + $scope.horas_admin();
  };

  $scope.fijos_mensuales = function(){
    return $scope.renta_mensual + $scope.servicios_mensuales + $scope.papeleria_mensual + $scope.otros_mensuales;
  };

  $scope.fijos_anuales = function(){
    return $scope.fijos_mensuales() * $scope.meses;
  };

  $scope.costo_no_vendibles = function(){
      return $scope.horas_no_vendibles() * $scope.costo_basico();
    };

  $scope.costo_extra_anual = function(){
    return $scope.fijos_anuales() + $scope.costo_no_vendibles();
  };

  $scope.ganancia_anual = function(){
    return $scope.horas_vendibles() * $scope.costo_basico();
  };

  $scope.porcentaje_rentabilidad = function(){
    if($scope.ganancia_anual() == 0){return 0;}
    return $scope.costo_extra_anual() * 100 / $scope.ganancia_anual();
  };

  $scope.porcentaje_rentabilidad_pesos = function(){
    return $scope.costo_basico() * $scope.porcentaje_rentabilidad() / 100;
  };

  $scope.hora_justa = function(){
    //return $scope.costo_basico() + ($scope.costo_basico() * $scope.porcentaje_rentabilidad() / 100);
    return $scope.costo_basico() + $scope.porcentaje_rentabilidad_pesos();
  };

  $scope.utilidad = function(){
    return $scope.hora_justa() * $scope.porcentaje_utilidad / 100;
  };

  $scope.h_d = function(){
    $scope.hora_diseno = $scope.hora_justa() + $scope.utilidad();
    if(!$scope.hora_diseno){return 0;}
    return $scope.hora_diseno;
  };

  $scope.venta_anual = function(){
    return $scope.h_d() * $scope.horas_vendibles();
  };

  $scope.venta_mensual = function(){
    return $scope.venta_anual() / $scope.meses;
  };
});

$(function(){
  $("input").change(function(event){
    mixpanel.track("cambio en " + $(event.target).attr("ng-model"));
  });

  $("#saberMas").click(function(event){
    $(".explicacionrow").toggle();
    mixpanel.track("Click en saber más");
  });

});