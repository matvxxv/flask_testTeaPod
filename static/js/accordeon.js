document.addEventListener('DOMContentLoaded', (e) => {
	var water_level = document.getElementById('teapod_water'),
		water_volume = document.getElementById('water_volume').value;
	

	$('#params').submit(function(e){
	    e.preventDefault();
	    $.ajax({
	        url: '',
	        type: 'POST',
	        data:$('#params').serialize(),
	        success:function(){
	        	//
	        }
	    });
	});
//
//	$('#stop_boil').submit(function(e){
//	    e.preventDefault();
//	    $.ajax({
//	        url: '',
//	        type: 'POST',
//	        data:$('#stop_boil').serialize(),
//	        success:function(){
//	        	//
//	        }
//	    });
//	});

    var my_form = document.querySelector('.params')

	// Динамическое изменение уровня воды в чайнике в зависимости от объема чайника
	$("#water_volume").on("input",function() {
	  	let new_style = water_level.style.height = ($("#water_level").val()/$("#water_volume").val()) * 100 + '%';
		// Если уровень воды больше допустимого (объема чайника), то ошибка
		if($("#water_level").val() > $("#water_volume").val()){
			$("#water_level").addClass('input_error')
		}else{
			$("#water_level").removeClass('input_error')

		}
	});

	// Динамическое изменение уровня воды в чайнике
	$("#water_level").on("input",function() {
	  	let new_style = water_level.style.height = ($("#water_level").val()/$("#water_volume").val()) * 100 + '%';
		// Если уровень воды больше допустимого (объема чайника), то ошибка
		if($("#water_level").val() > $("#water_volume").val()){
			$("#water_level").addClass('input_error')
		}else{
			$("#water_level").removeClass('input_error')
		}
	});

	// Динамическое изменение показателя температуры воды в зависимости от данных пользователя.
	$("#water_temp").on("input",function() {
	  	console.log($("#water_temp").val());
		document.getElementById('celcium_num').innerHTML = $("#water_temp").val();
	});

	// Получаем блок форомы и извлекаем все поля ввода (инпуты).
	let form = document.querySelector('.params'),
			formInputs = document.querySelectorAll('.item__input')

	// Пользовательская валидация формы 
	form.onsubmit = function check_form() {
		let emptyInputs = Array.from(formInputs).filter(input => input.value === '');
		
		// Проверяем каждый инпут на наличие данных
		formInputs.forEach( function(input) {
			if (input.value === ''){
				input.classList.add('input_error');
				return false;
			} else {
				input.classList.remove('input_error');
			}

			if (emptyInputs.length !== 0){
				console.log('Inputs not filled');
				return false;
			}
		})

		// Если все поля заполнены корректно, то кипятим чайник
		if(!$('input').hasClass('input_error')){
		    $('.on').val('Выключить');
		    $('.on').addClass('off');
			$('#is_stopped_by_user').prop("checked", false);
			$('#is_boiled').prop("checked", false);
			$('input').addClass('turnoff_inputs');
			$('#on').removeClass('turnoff_inputs');
			// Создаем счетчик
			var isPaused = false;
			var time = 0;
			var my_time = window.setInterval(boil_water, 1000);


			$('.off').on('click', function(e) {
			    $('.on').val('Включить')

			    $('.on').removeClass('off')
			  	e.preventDefault();
				$('input').removeClass('turnoff_inputs');
			  	isPaused = true;
//				$('#water_temp').val(document.querySelector('.celcium_num').innerHTML);
				is_stopped_by_user = true;
				$('#turn_off_temperature').val(document.querySelector('.celcium_num').innerHTML);
				console.log($('#turn_off_temperature').val());
				$('#is_stopped_by_user').prop("checked", true);
				$('#is_boiled').prop("checked", false);
				my_form.submit()
			});



			// Кипятим чайник
			const c = 4183 // Теплоемкость воды

			let water_level = $("#water_level").val(); // Количество воды в чайнике
				power = $("#power").val(); // Получаем мощность
				water_temp = document.querySelector('.celcium_num').innerHTML // Получаем НАЧАЛЬНУЮ температуру воды из html
				temperature_change_per_second = power / (c * water_level) // Считаем изменение температуры за секунду
				function boil_water(){
					if(!isPaused){
						// Получаем Текущую температуру воды из html в процессе кипячения
						let celcium = document.querySelector('.celcium_num').innerHTML;
						// Измененная температура воды (T + dT)
						let new_temp = Math.round(Number(celcium) + temperature_change_per_second);
						// Если T воды меньше ста, продолжаем кипятить
						if(new_temp<100){
							document.querySelector('.celcium_num').innerHTML = new_temp;
							time++
						}
						// В противном случае выключаем чайник, T воды = 100, больше быть не может
						else{
						    $('.on').val('Включить')
							$('#is_boiled').prop("checked", true);
							$('#is_stopped_by_user').prop("checked", false);
							$('#turn_off_temperature').val('100');
							$('input').removeClass('turnoff_inputs');
							is_boiled = true;
							document.querySelector('.celcium_num').innerHTML = 100;
							clearInterval(my_time);
							my_form.submit()
						}
					}
				}

			}
	}

});

