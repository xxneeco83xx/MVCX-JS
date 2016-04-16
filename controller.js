Controller.create("main");

function cargar()
{
	var newValue = $$.getValue("nuevoMensaje");
	return $$.setValue("textBox1", newValue);
}

function comprobar()
{
	if ( $$.getValue("nuevoMensaje") == $$.getValue("textBox1"))
	{
		alert("Los campos son iguales");
	}
	else
	{
		alert("Los campos se pueden cambiar");
	}
}

function saludar(params, len)
{
	for ( var x = 0; x < len; x++ )
	{
		console.log(params[x]);
	}
	
	return alert($$.getValue("textBox1"));
}

function limpiar()
{
	$$.setValue("textBox1", "");
	$$.setValue("nuevoMensaje", "");

	return;
}

//Esta funcion no se va a utilizar.
function manipular(data)
{
	console.log(data);
}

Controller.behavior("main", [ cargar, comprobar, saludar, limpiar, manipular ]);