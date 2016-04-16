/*
#############################################################################
#	MvcX JS Framework 0.0.0.1 Alpha - Desarrollado en JavaScript			#
#	Fecha de version : 04/04/2016											#
#	Autor : Claudio Nicolas Buzzi											#
#############################################################################
*/


var Models = [];
var names = [];
var functions = [];
var controllerName = '', webPage = '';
var routeList = [{controllerName : [], webPage : []}];
var id = 0;
var Controllers = [ {names : [], functions: []}];
var splitedContent = false;
var firstTime = false, alreadySplitted = false;
var previousId = '';

/*Simple functions*/
var isString = function (string) { return ( Boolean( typeof string == 'string' ) ); };
var isUndefined = function (obj){return (typeof obj == 'undefined');};
var isNull = function (obj) {return Boolean(obj == null);};
var lowercase = function (string) {return isString(string) ? string.toLowerCase() : string;};
var uppercase = function (string) {return isString(string) ? string.toUpperCase() : string;};
var getType = function (obj) { return typeof obj; };

function getType(obj)
{
    return (typeof obj);
}

function hidden(id)
{
    return document.getElementById(id).style.display = 'none';
}

function show(id)
{
    return document.getElementById(id).style.display = 'block';
}

function forEach(obj, funct) { 
	if ( typeof obj != 'array' )
	{
		console.log(obj + " is not array");
		return;
	}

	for ( var i = 0; i < obj.length; i ++ )
	{
		funct(obj[i], i);
	}

	return;
}

setPosition = function(id, width, height, top, left)
{
	var element = document.getElementById(id);

	if ( isNull(element) || isUndefined ( element ) )
	{
		console.error("This error was caused by null or undefined element.");
		return false;
	}

	element.style.position = 'relative';

	if ( ! isUndefined ( width ) && ! isNull ( height ) )
	{
		element.style.width = width + "px";
	}

	if ( ! isUndefined ( height ) && ! isNull ( height ) )
	{
		element.style.height = height + "px";
	}

	if ( ! isUndefined ( top ) && ! isNull ( top ) )
	{
		element.style.top = top + "px";
	}

	if ( ! isUndefined( left ) && ! isNull ( left ) )
	{
		element.style.left = left + "px";
	}

	return true;
}

//Convert JSON
var convert = {

	getJSON:function(obj)
	{
		//Convert to JSON object
		return JSON.parse(obj)
	},
	toJSON:function(obj)
	{
		//Convert String array to JSON object.
		return JSON.stringify(obj)
	}
};

//Document ready...
document.onreadystatechange = function () {
	if (document.readyState == "complete") {
		initApplication();
		//setInterval(loadRoute(), 10);
	}
	/*document.readyState == 'interactive' , 'loading'*/
}

//This function not work yet
function loadRoute()
{
	if ( isNull ( routeList ) || isUndefined ( routeList ) || routeList.length == 1 )
	{
		return;
	}

	for ( var i = 1; i < routeList.length; i ++ )
	{
		if ( document.URL.split("/")[1] == routeList[i].controllerName )
		{
			window.location.href = routeList[i].webPage;
		}
	}

	return;
}

function redefine(functionName, newFunction)
{
	if ( typeof newFunction != 'function' )
	{
		return console.error("This: " + newFunction + " not is a function.");
	}

	for ( var i = 0; i < Controllers[0].functions.length; i ++)
	{
		if ( functionName == Controllers[0].functions[i] )
		{
			Controllers[0].functions[i] = newFunction;
			return true;
		}
	}

	return console.error("Function:" + functionName + " not found");
}

/*Functions in ajax*/
var Ajax = {

	post:function (url, data, response, error)
	{
		xmlHttp = new XMLHttpRequest()

		if ( isNull ( xmlHttp ) || isUndefined ( xmlHttp ) )
		{
			return
		}
		
		xmlHttp.onreadystatechange = function()
		{
			if ( xmlHttp.readyState == 4 && xmlHttp.status == 200 )
			{
				response(xmlHttp.responseText)
			}
		}

		if ( typeof error != undefined && typeof error == 'function')
		{
			xmlHttp.onerror = error
		}

		xmlHttp.open("POST", url, true)
		xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
		xmlHttp.send(data)
	},

	get:function (url, response, error, headers)
	{
		xmlHttp = new XMLHttpRequest()

		if ( xmlHttp == null || typeof xmlHttp == undefined )
		{
			return
		}

		xmlHttp.onreadystatechange = function()
		{
			if ( xmlHttp.readyState == 4 && xmlHttp.status == 200)
			{
				if ( ! isNull ( headers ) && ! isUndefined ( headers ) )
				{
					if ( headers.type.toUpperCase() == 'JSON' )
					{
						response(xmlHttp.responseText)
					}
					else if ( headers.type.toUpperCase() == 'XML' )
					{
						response(xmlHttp.responseXml)
					}
					else
					{
						console.error("Unknown headers type" + headers.type.toUpperCase())
						return
					}
				}
				else
				{
					//Default
					response(xmlHttp.responseText)
				}
				
			}
		}

		if ( getType ( error ) == 'function' )
		{
			xmlHttp.onerror = error
		}

		xmlHttp.open("GET", url, true)
		xmlHttp.send()
	}
};

//Get object from Models array, using the modelName
function getObject(modelName)
{
	for ( var x = 0; x < Models.length; x++)
	{
		if ( Models[x].id == modelName)
		{
			return Models[x];
		}
	}
	return console.error("Model not found");
}

function getObjectId(id)
{
	var elements = document.getElementsByTagName("*");
	for ( var x = 0; x < elements.length; x++)
	{
		if ( elements[x].id == id )
		{
			return elements[x];
		}
	}
	
	console.error("Error ID:" + id + " not found");
	return null;
}

function getElementByModel(modelName)
{
	var Model = null;

	for ( var i = 0; i < Models.length; i++ )
	{
		if ( Models[i].getModelName() == modelName)
		{
			Model = Models[i];
		}
	}

	if ( ! isNull ( Model ) )
	{
		Model = document.getElementById(Model.getId());
	}

	return Model;

}

function getElementsByController(controllerName)
{
	var modelList = [];

	for ( var i = 0; i < Models.length; i++ )
	{
		if ( modelList.indexOf(Models[i]) == -1 && Models[i].getControllerName() == controllerName )
		{
			modelList.push(Models[i]);
		}
	}

	return modelList;
}

function reflectionExecute(functionName, paremetersIn, dataSend)
{
	for ( var o = 0; o < Controllers[0].functions.length; o ++)
	{
		if ( Controllers[0].functions[o].name == functionName )
		{
			if ( paremetersIn )
			{
				return Controllers[0].functions[o](dataSend, dataSend.length);
			}
			else
			{
				return Controllers[0].functions[o]();
			}
		}
	}
}

function initApplication()
{
	var inputs = document.body.getElementsByTagName("input");
	var buttons = document.body.getElementsByTagName("button");
	var elems = [];

	for ( var a = 0; a < inputs.length; a ++)
	{
		elems.push(inputs[a]);
	}

	for ( var a = 0; a < buttons.length; a ++)
	{
		elems.push(buttons[a]);
	}

	for ( var i = 0; i < elems.length; i++ )
	{
		var dataTmp, _dataTmp;
		var id, html, value, modelSimple, controllerSimple, onClick = null, onChange = null, dataSend, _dataSend, parameters = false, _parameters = false;
		var formSend = false, formSend = null;
		id = elems[i].id;
		html = elems[i].innerHTML;
		value = elems[i].value;
		tagType = elems[i].tagName;

		var modelDefined = false, controllerDefined = false, clickEvent = false, changeEvent = false;

		//Model property
		if ( typeof elems[i].outerHTML.split("model")[1] != "undefined" )
		{
			modelSimple = elems[i].outerHTML.split("model")[1].split("=")[1].split('"')[1];
			if ( ! isNull( modelDefined ) && ! isUndefined ( modelDefined ) )
			{
				modelDefined = true;
			}
		}

		//Controller property
		if ( typeof elems[i].outerHTML.split("controller")[1] != "undefined" )
		{
			controllerSimple = elems[i].outerHTML.split("controller")[1].split("=")[1].split('"')[1];
			if ( ! isNull( controllerDefined ) && ! isUndefined ( controllerDefined ) )
			{
				controllerDefined = true;
			}
		}

		//Form submit property
		if ( typeof elems[i].outerHTML.split("form-send")[1] != "undefined" )
		{
			formSend = elems[i].outerHTML.split("form-send")[1].split("=")[1].split('"')[1];
			if ( ! isNull( formSend ) && ! isUndefined ( formSend ) )
			{
				formDefined = true;
			}
		}

		//Event Click property
		if ( typeof elems[i].outerHTML.split("event-click")[1] != "undefined" )
		{
			onClick = elems[i].outerHTML.split("event-click")[1].split("=")[1].split('"')[1];
			if ( ! isNull( onClick ) && ! isUndefined ( onClick ) )
			{
				clickEvent = true;
			}
		}

		//Event change property
		if ( typeof elems[i].outerHTML.split("event-change")[1] != "undefined" )
		{
			onChange = elems[i].outerHTML.split("event-click")[1].split("=")[1].split('"')[1];
			changeEvent = true;
			if ( ! isNull( changeEvent ) && ! isUndefined ( changeEvent ) )
			{
				changeEvent = true;
			}
		}

		var tmp = onClick;
		if ( clickEvent )
		{
			if ( typeof onClick.split("(")[1] != 'undefined' )
			{
				onClick = onClick.split("(")[0];
				parameters = true;
				dataTmp = tmp.split("('")[1].split("')")[0];

				dataTmp = dataTmp.split(",");
				dataSend = [];

				for ( var tmpx = 0; tmpx < dataTmp.length; tmpx ++ )
				{
					dataSend.push(dataTmp[tmpx]);
				}
			}
		}

		var _tmp = onChange;
		if ( changeEvent )
		{
			if ( typeof onChange.split("(")[1] != 'undefined' )
			{
				onChange = onChange.split("(")[0];
				_parameters = true;
				_dataTmp = _tmp.split("('")[1].split("')")[0];

				_dataTmp = _dataTmp.split(",");
				_dataSend = [];

				for ( var tmpx = 0; tmpx < dataTmp.length; tmpx ++ )
				{
					_dataSend.push(_dataTmp[tmpx]);
				}
			}
		}

		//Bind to model and controller tag with events.
		if ( modelSimple != null && modelSimple != '' && modelDefined == true && controllerDefined == true )
		{
			var currentPosition = Models.length;
			var controllerCurrentPosition = Controllers.length;

			//Set models
			if ( Models.indexOf(modelSimple) == -1 )
			{
				Models.push(modelSimple);

				if ( currentPosition == 0 )
				{

					Models[0] = {
						getHtml:function()
						{
							return document.getElementById(this._id).innerHTML
						},
						getValue:function()
						{
							return document.getElementById(this._id).value
						},
						setValue:function(newValue)
						{
							return document.getElementById(this._id).value = newValue
						},
						setHtml:function(newHtml)
						{
							return document.getElementById(this._id).innerHTML = newHtml
						},
						getType:function()
						{
							return document.getElementById(this._id).type
						},
						getName:function()
						{
							return document.getElementById(this._id).name
						},
						getId:function()
						{
							return this._id
						},
						getModelName:function()
						{
							 return this.id
						},
						getControllerName:function()
						{
							return this.controllerName
						},
						getEvent:function()
						{
							return this.event
						},
						getData:function()
						{
							if ( this.param)
								return this.data
						},
						getTag:function()
						{
							return this.tagName
						},
						id:modelSimple,
						_id:elems[i].id,
						controllerName:controllerSimple,
						event:onClick,
						change:onChange,
						param:parameters,
						data:dataSend,
						dat:_dataSend,
						tagName:tagType
					};
				}
				else
				{
					Models[currentPosition] = {
						getHtml:function()
						{
							return document.getElementById(id).innerHTML
						},
						getControllerName:function()
						{
							return this.controllerName
						},
						getValue:function()
						{
							return document.getElementById(this._id).value
						},
						setValue:function(newValue)
						{
							return document.getElementById(this._id).value = newValue
						},
						setHtml:function(newHtml)
						{
							return document.getElementById(this._id).innerHTML = newHtml
						},
						getType:function()
						{
							return document.getElementById(this._id).type
						},
						getName:function()
						{
							return document.getElementById(this._id).name
						},
						getId:function()
						{
							return this._id
						},
						getModelName:function()
						{
							 return this.id
						},
						getEvent:function()
						{
							return this.event
						},
						getData:function()
						{
							if ( this.param)
								return this.data
						},
						getTag:function()
						{
							return this.tagName
						},
						id:modelSimple,
						_id:elems[i].id,
						controllerName:controllerSimple,
						event:onClick,
						change:onChange,
						param:parameters,
						data:dataSend,
						dat:_dataSend,
						tagName:tagType
					};
				}
			}

			if ( onClick != '' && ! isNull ( onClick ) && ! isUndefined ( onClick ) )
			{
				var dataSend, paremetersIn = false;
				if ( typeof onClick == 'string' )
				{
					var foundFunction = false;
					for ( var functionsSearch = 0; functionsSearch < Controllers[0].functions.length; functionsSearch++ )
					{
						if ( Controllers[0].functions[functionsSearch].name == onClick )
						{
							foundFunction = true;
						}
					}

					if ( ! foundFunction )
					{
						console.error("Error " + onClick + "()" + " function not found");
						return;
					}

					//Function for onsubmit event in form
					elems[i].onsubmit = function(formInJson)
					{
						for ( var x = 0; x < Models.length; x++ )
						{
							if ( this.id == Models[x].getId() )
							{
								if ( this.tagName == Models[x].getTag() && formDefined )
								{
									reflectionExecute(formSend, true, formInJson);
								}
							}
						}

						return;
					}
					
					//Set onclick event
					elems[i].onclick = function(params)
					{
						var firstTime = false;
						for ( var x = 0; x < Models.length; x ++ )
						{
							if ( this.id == Models[x].getId() )
							{
								onClick = Models[x].getEvent();
								if ( Models[x].param )
								{
									paremetersIn = true;
									if ( dataSend[0] == Models[x].getData()[0] && dataSend[1] == Models[x].getData()[1] && alreadySplitted == true)
									{
										alreadySplitted = true;
									}
									else
									{
										dataSend = Models[x].getData();

										if ( dataSend.length > 1 )
										{
											for ( var check = 0; check < dataSend.length-1; check++ )
											{
												if ( ! firstTime )
												{
													dataSend[check] = dataSend[check].split("'")[0];
													firstTime = true;
												}
												else
												{
													dataSend[check] = dataSend[check].split("'")[1];
												}
											}

											dataSend[dataSend.length-1] = dataSend[dataSend.length-1].split("'")[1];
											alreadySplitted = true;
										}
										else
										{
											dataSend[0] = dataSend[0].split("'")[1];
											alreadySplitted = true;
										}
									}		
								}
							}
						}

						reflectionExecute(onClick, paremetersIn, dataSend);
					}
				}

				if ( typeof onChange == 'string' )
				{
					var foundFunction = false;
					for ( var functionsSearch = 0; functionsSearch < Controllers[0].functions.length; functionsSearch++ )
					{
						if ( Controllers[0].functions[functionsSearch].name == onChange )
						{
							foundFunction = true;
						}
					}

					if ( ! foundFunction )
					{
						console.error("Error " + onChange + "()" + " function not found");
						return;
					}

					elems[i].onchange = function(params)
					{
						for ( var x = 0; x < Models.length; x ++ )
						{
							if ( this.id == Models[x].getId() )
							{
								onClick = Models[x].getEvent();
								if ( Models[x].param )
								{
									paremetersIn = true;
									dataSend = Models[x].getData();

									if ( dataSend.length > 1 && alreadySplitted == false )
									{
										for ( var check = 0; check < (dataSend.length-1); check++ )
										{
											if ( ! firstTime )
											{
												dataSend[check] = dataSend[check].split("'")[0];
												firstTime = true;
											}
											else
											{
												dataSend[check] = dataSend[check].split("'")[1];
											}
										}

										dataSend[dataSend.length-1] = dataSend[dataSend.length-1].split("'")[1];
										alreadySplitted = true;
									}
									else
									{
										dataSend[0] = dataSend[0].split("'")[1];
										alreadySplitted = true;
									}
								}
							}
						}
						
						for ( var o = 0; o < Controllers[0].functions.length; o ++)
						{
							if ( Controllers[0].functions[o].name == onClick)
							{
								if ( paremetersIn )
								{
									//Send array with parameters and length
									return Controllers[0].functions[o](dataSend, dataSend.length);
								}
								else
								{
									return Controllers[0].functions[o]();
								}
							}
						}
					}
				}
			}
		}
	}

	return checkFunctions(Controllers[0].functions, Controllers[0].functions.length);
}

function checkFunctions(functionList, len)
{
	var count = 0, previous = '', notFound = '';

	for ( var i = 0; i < Models.length; i ++)
	{
		for ( var e = 0; e < len; e ++ )
		{
			if ( Models[i].getEvent() == functionList[e] )
			{
				console.error("Function:" + Models[i].getEvent() + " is not declared.");
			}
		}
	}

	for ( var i = 0; i < len; i ++)
	{
		for ( var e = 0; e < Models.length; e ++ )
		{
			if ( functionList[i] != Models[e].getEvent() )
			{
				count++;
				if ( previous == functionList[i] )
				{
					notFound = functionList[i];
				}

				previous = functionList[i];
			}
		}
	}

	if ( count >= Models.length )
	{
		console.warn("Function:" + notFound.name + " not used.");
	}
}

getModel = function(name)
{
	for ( var i = 0; i < Models.length; i++ )
	{
		if ( Models[i].getModelName() == name)
		{
			return Models[i];
		}
	}

	console.error("Error Model:" + name + " not found");
	return null;
}

showModels = function()
{
	for ( var i = 0; i < Models.length; i++ )
	{
		if ( ! isUndefined ( Models[i].getModelName() ) && ! isUndefined ( Models[i].getTag() ) )
		console.log("Name:" + Models[i].getModelName() + " Type:" + Models[i].getTag() );
	}
}

showControllers = function()
{
	for ( var i = 0; i < Controllers[0].names.length; i++ )
	{
		if ( ! isUndefined ( Controllers[0].names[i] ) )
			console.log(Controllers[0].names[i]);
	}
}

var $$ = {
	get:function(modelName)
	{
		return getModel(modelName)
	},
	getValue:function(modelName)
	{
		return getModel(modelName).getValue()
	},
	getTagName:function(modelName)
	{
		return getModel(modelName).getTag()
	},
	getId:function(modelName)
	{
		return getModel(modelName).getId()
	},
	getEvent:function(modelName)
	{
		return getModel(modelName).getEvent()
	},
	getHtml:function(modelName)
	{
		return getModel(modelName).getHtml()
	},
	setHtml:function(modelName, value)
	{
		return getModel(modelName).setHtml(value)
	},
	getController:function(controllerName)
	{
		for ( var i = 0; i < Controllers.length; i++ )
		{
			if ( Controllers[i].getControllerName() == name)
			{
				return Controllers[i]
			}
		}

		console.error("Error Controller:" + controllerName + " not found")
		return null
	},
	setValue:function(modelName, value)
	{
		return getModel(modelName).setValue(value)
	}
}

var Controller = {

	foC:0,
	create:function(name)
	{
		for ( var i = 0; i < Controllers[0].names.length+1; i ++ )
		{
			if ( Controllers[0].names.indexOf(name) == -1 )
			{
				Controllers[0].names.push(name)
				this.foC++
			}
			else
			{
				if (this.foC >= 2)
				{
					console.warn("Controller: " + name + " redefined")
				}
			}
		}
	},
	behavior:function(name, functions)
	{
		for ( var e = 0; e < Controllers[0].names.length+1; e++ )
		{
			if ( Controllers[0].names[e] == name )
			{
				Controllers[0].names[e].functions = [];

				for ( var i = 0; i < functions.length; i++ )
				{
					if ( Controllers[0].functions.indexOf(functions[i]) == -1 )
					{
						Controllers[0].functions.push(functions[i])
					}
					else
					{
						console.warn("Function:" + functions[i] + " redefined")
					}
				}
			}
		}
	},
	route:function(controllerName, webPage)
	{
		if ( routeList.indexOf ( [controllerName, webPage] ) == -1 )
		{
			routeList.push ( [controllerName, webPage] )
		}
		else
		{
			console.warn ( "Route: " + controllerName + " redefined.")
		}
	}
};