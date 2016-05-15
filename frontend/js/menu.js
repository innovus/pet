$(document).ready(main);

var contador=1;

function main(){

	//manejador de eventos
	//cuando le de click 
	$('.menu_barsito').click(function(){
		//aparece y desaparece
		//$('nav').toggle();

		//si la variable cuenta 1 quiere decir que nuestro menu esta activado sino lo alcontrario

		if(contador==1){
			$('nav').animate({

				left:'0'
			});
			contador=0;
		}else{
			contador=1;
			$('nav').animate({

				left:'-550'
			});
		}
	});

};