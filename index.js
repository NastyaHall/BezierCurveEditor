// global variables
var pointNum = 0;
var coordX = [];
var coordY = [];
var canvasWidth;
var canvasHeight;
var easing = 'linear';
var speed = 1000;
var terms = [];
var dragSrcEl = null;
var draggables = document.querySelectorAll('#draggables .draggable');
var flgCanvasDown = false;
var mousePos = {x: 0, y: 0};
var targetIndex = -1;
var canvas;
var context;
let isMatrix = false;
const formulaSelect = document.getElementById('formulaSelect');
const tInput = document.getElementById('tInput');
const tInput2 = document.getElementById('tInput2');
const stepInput = document.getElementById('stepInput');
const generateBtn = document.getElementById('generate');
const maxPointForMatrix = 30;
const maxPointForParametric = 170;
const colorInput = document.getElementById('colorInput');
let matrixFileContent = '';
let fileContent;

colorInput.addEventListener('input', () => {
	propInit();
	canvasInit();
});

formulaSelect.addEventListener('change', (event) => {
	var generatePointsAmount = document.getElementById('generatePointsAmount');
	var addBtn = document.querySelector('#add');
	if (event.target.value == 'matrix') {
		isMatrix = true;
		generatePointsAmount.setAttribute('max', maxPointForMatrix);
		generatePointsAmount.value = maxPointForMatrix;
		if (coordX.length == maxPointForMatrix) {
			addBtn.disabled = true;
			addBtn.style.cursor = 'not-allowed';
			addBtn.classList.add('disabled');

			var allAddUpBtns = document.querySelectorAll('.addUp');
			allAddUpBtns.forEach(function (addUpBtn) {
				addUpBtn.disabled = true;
				addUpBtn.style.cursor = 'not-allowed';
			});

			var allAddDownBtns = document.querySelectorAll('.addDown');
			allAddDownBtns.forEach(function (addDownBtn) {
				addDownBtn.disabled = true;
				addDownBtn.style.cursor = 'not-allowed';
			});
		}
		else {
			addBtn.disabled = false;
			addBtn.style.cursor = 'pointer';
			addBtn.classList.remove('disabled');

			var allAddUpBtns = document.querySelectorAll('.addUp');
			allAddUpBtns.forEach(function (addUpBtn) {
				addUpBtn.disabled = false;
				addUpBtn.style.cursor = 'pointer';
			});

			var allAddDownBtns = document.querySelectorAll('.addDown');
			allAddDownBtns.forEach(function (addDownBtn) {
				addDownBtn.disabled = false;
				addDownBtn.style.cursor = 'pointer';
			});
		}
	}
	else {
		document.querySelector('.fileMessage').style.display = 'none'; 
		isMatrix = false;
		generatePointsAmount.setAttribute('max', 170);
		generatePointsAmount.value = 170;
		if (coordX.length < maxPointForParametric) {
			addBtn.disabled = false;
			addBtn.style.cursor = 'pointer';
			addBtn.classList.remove('disabled');

			var allAddUpBtns = document.querySelectorAll('.addUp');
			allAddUpBtns.forEach(function (addUpBtn) {
				addUpBtn.disabled = true;
				addUpBtn.style.cursor = 'not-allowed';
			});

			var allAddDownBtns = document.querySelectorAll('.addDown');
			allAddDownBtns.forEach(function (addDownBtn) {
				addDownBtn.disabled = true;
				addDownBtn.style.cursor = 'not-allowed';
			});
		}
		else {
			addBtn.disabled = true;
			addBtn.style.cursor = 'not-allowed';
			addBtn.classList.add('disabled');

			var allAddUpBtns = document.querySelectorAll('.addUp');
			allAddUpBtns.forEach(function (addUpBtn) {
				addUpBtn.disabled = false;
				addUpBtn.style.cursor = 'pointer';
			});

			var allAddDownBtns = document.querySelectorAll('.addDown');
			allAddDownBtns.forEach(function (addDownBtn) {
				addDownBtn.disabled = false;
				addDownBtn.style.cursor = 'pointer';
			});
		}
	}

});

generateBtn.addEventListener('click', function () {
	var generatePointsAmount = document.getElementById('generatePointsAmount');
	if (isMatrix) {
		generate('matrix', 30);
	}
	
	else generate('parametric',parseInt(generatePointsAmount.value));
});

function generate(method, amount) {
	var items = document.querySelectorAll('.inputCoord');
	for (let i = items.length - 1; i >= 0; i--)
		items[i].remove();
	if ((isMatrix && coordX.length < maxPointForMatrix) || (!isMatrix && coordX.length < maxPointForParametric)) {
		var addBtn = document.querySelector('#add');
		addBtn.disabled = false;
		addBtn.style.cursor = 'pointer';
		addBtn.classList.remove('disabled');
	}
	let pointX = -48.80;
	let pointY = 27.20;
	for (let i = 0; i < amount; i++){
		addClick(pointX.toFixed(2), pointY.toFixed(2));
		if (pointX >= 42.20) {
			pointX = -48.80;
			pointY -= 3;
		}
		else {
			pointX += 9.1;
		}
		
	}
	propInit();
	canvasInit();
	downloadFile();

	if ((isMatrix && coordX.length >= maxPointForMatrix) || (!isMatrix && coordX.length >= maxPointForParametric)) {
		var addBtn = document.querySelector('#add');
		addBtn.disabled = true;
		addBtn.style.cursor = 'not-allowed';
		addBtn.classList.add('disabled');

		var allAddUpBtns = document.querySelectorAll('.addUp');
			allAddUpBtns.forEach(function (addUpBtn) {
				addUpBtn.disabled = true;
				addUpBtn.style.cursor = 'not-allowed';
			});

			var allAddDownBtns = document.querySelectorAll('.addDown');
			allAddDownBtns.forEach(function (addDownBtn) {
				addDownBtn.disabled = true;
				addDownBtn.style.cursor = 'not-allowed';
			});
	}
	
	
}

function deleteAllPoints() {
	var items = document.querySelectorAll('.inputCoord');
	for (let i = items.length - 1; i >= 1; i--) {
		items[i].remove();
	}
	propInit();
	canvasInit();
	downloadFile();


	if ((isMatrix && coordX.length >= maxPointForMatrix) || (!isMatrix && coordX.length >= maxPointForParametric)) {
		var addBtn = document.querySelector('#add');
		addBtn.disabled = true;
		addBtn.style.cursor = 'not-allowed';
		addBtn.classList.add('disabled');

		var allAddUpBtns = document.querySelectorAll('.addUp');
		allAddUpBtns.forEach(function (addUpBtn) {
			addUpBtn.disabled = true;
			addUpBtn.style.cursor = 'not-allowed';
		});

		var allAddDownBtns = document.querySelectorAll('.addDown');
		allAddDownBtns.forEach(function (addDownBtn) {
			addDownBtn.disabled = true;
			addDownBtn.style.cursor = 'not-allowed';
		});
	}
	else if((isMatrix && coordX.length < maxPointForMatrix) || (!isMatrix && coordX.length < maxPointForParametric)) {
		var addBtn = document.querySelector('#add');
		addBtn.disabled = false;
		addBtn.style.cursor = 'pointer';
		addBtn.classList.remove('disabled');

		var allAddUpBtns = document.querySelectorAll('.addUp');
		allAddUpBtns.forEach(function (addUpBtn) {
			addUpBtn.disabled = false;
			addUpBtn.style.cursor = 'pointer';
		});

		var allAddDownBtns = document.querySelectorAll('.addDown');
		allAddDownBtns.forEach(function (addDownBtn) {
			addDownBtn.disabled = false;
			addDownBtn.style.cursor = 'pointer';
		});
	}
}

/* ============== Properties and points (re)initialization ============== */
function propInit() {
	var inputCoord = document.getElementsByClassName('inputCoord');
	pointNum = inputCoord.length;
    easing = 'linear';
	speed = 1000;

	coordX = [];
	coordY = [];

	let centerX = canvasWidth / 2;
	let centerY = canvasHeight / 2;

	for (var i = 0; i < inputCoord.length; i++) {
		let x = +inputCoord[i].querySelector('.inputX').value || 0;
		inputCoord[i].querySelector('.inputX').value = inputCoord[i].querySelector('.inputX').value || 0;
		x = x * 10 + centerX;
		

		let y = +inputCoord[i].querySelector('.inputY').value || 0;
		inputCoord[i].querySelector('.inputY').value = inputCoord[i].querySelector('.inputY').value || 0;
		y = centerY - y * 10;
			
		coordX.push(x);
		coordY.push(y);
		
		inputCoord[i].querySelector('span').innerHTML = i;
	}
}
/* ============================================================= */

/* ============== Initialization of input fields ============== */
function inputInit() {
	var inputs = document.getElementsByClassName('inputItem');
	[].forEach.call(inputs, function(input) {
		input.addEventListener('change', onInputChange, false);
		input.addEventListener('keyup', onInputChange, false);
	});
	formulaSelect.addEventListener('change', onSelectChange);
}
/* ============================================================= */


/* ============== Initialization of delete buttons ============== */
function deleteInit() {
	var items = document.getElementsByClassName('inputCoord');
	[].forEach.call(items, function(item) {
		item.addEventListener('click', onDeleteClick,false);
	});
}
/* ============================================================== */


/* ============== Initialization of delete all points button ============== */
function replayInit() {
	var replay = document.getElementById('replayBtn');
	// replay.addEventListener('click', canvasInit, false);
	replay.addEventListener('click', deleteAllPoints);
}
/* ========================================================================= */


/* ============== Initialization of adding buttons ============== */
function addInit() {
	var add = document.getElementById('add');
	add.addEventListener('click', onAddClick, false);
	const addUpBtns = document.querySelectorAll('.addUp');
	const addDownBtns = document.querySelectorAll('.addDown');

	addUpBtns.forEach(function (addUpBtn) {
		addUpBtn.addEventListener('click', function () {
			addInIndexClick(true, this.closest('.inputCoord'));
		});
	});
	addDownBtns.forEach(function (addDownBtn) {
		addDownBtn.addEventListener('click', function () {
			addInIndexClick(false, this.closest('.inputCoord'));
		});
	});
}
/* ==================================================== */

/* ============== Deleting points handling ============== */
function onDeleteClick(e) {
	if (e.target.className === 'delete' && coordX.length > 1) {
		this.parentNode.removeChild(this);
		propInit();
		canvasInit();
		downloadFile();
		
		// gogogo
		if ((isMatrix && coordX.length < maxPointForMatrix) || (!isMatrix && coordX.length < maxPointForParametric)) {
			var addBtn = document.querySelector('#add');
			addBtn.disabled = false;
			addBtn.style.cursor = 'pointer';
			addBtn.classList.remove('disabled');

			var allAddUpBtns = document.querySelectorAll('.addUp');
			allAddUpBtns.forEach(function (addUpBtn) {
				addUpBtn.disabled = false;
				addUpBtn.style.cursor = 'pointer';
			});

			var allAddDownBtns = document.querySelectorAll('.addDown');
			allAddDownBtns.forEach(function (addDownBtn) {
				addDownBtn.disabled = false;
				addDownBtn.style.cursor = 'pointer';
			});
		}
	}
}

function deleteClick(item) {
	console.log(item);
	var parent = document.getElementById('draggables');
	parent.removeChild(item);
	
	if ((isMatrix && coordX.length < maxPointForMatrix) || (!isMatrix && coordX.length < maxPointForParametric)) {
		var addBtn = document.querySelector('#add');
		addBtn.disabled = false;
		addBtn.style.cursor = 'pointer';
		addBtn.classList.remove('disabled');

		var allAddUpBtns = document.querySelectorAll('.addUp');
		allAddUpBtns.forEach(function (addUpBtn) {
			addUpBtn.disabled = false;
			addUpBtn.style.cursor = 'pointer';
		});

		var allAddDownBtns = document.querySelectorAll('.addDown');
		allAddDownBtns.forEach(function (addDownBtn) {
			addDownBtn.disabled = false;
			addDownBtn.style.cursor = 'pointer';
		});
	}
}
/* ==================================================== */


/* ============== Adding new points handling ============== */
function addInIndexClick(insertAbove, btn) {
	var parent = document.getElementById('draggables');
	if (parent.children.length == 0) {
		var htmlCode = `
			<div class="inputItem inputCoord draggable">
				<span>1</span>
				<label>X</label>
				<input class="inputX" type="text" value="5">
				<label>Y</label>
				<input class="inputY" type="text" value="5">
				<button class="addUp"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-row-insert-top" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M4 18v-4a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1z" />
                                <path d="M12 9v-4" />
                                <line x1="10" y1="7" x2="14" y2="7" />
                              </svg></button>
                            <button class="addDown"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-row-insert-bottom" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M20 6v4a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1z" />
                                <line x1="12" y1="15" x2="12" y2="19" />
                                <line x1="14" y1="17" x2="10" y2="17" />
                              </svg></button>
				<div class="delete"></div>
			</div>
		`;

		// Insert the HTML code into the parent element
		parent.innerHTML += htmlCode;
		return;
	} 
    var clone = parent.querySelector('.inputCoord').cloneNode(true);
    var lastCoord = parent.lastElementChild;

	clone.addEventListener('click', onDeleteClick, false);
	clone.addEventListener('keyup', onInputChange, false);

    var inputs = clone.querySelectorAll('input');
    let lastCoordX = parseInt(lastCoord.querySelector('.inputX').value);
	let lastCoordY = parseInt(lastCoord.querySelector('.inputY').value);

    [].forEach.call(inputs, function (input) {
        if (input.classList.contains('inputX')) {
            if (lastCoordX + 10 < 42)
                input.value = lastCoordX + 10;
            else
                input.value = lastCoordX - 10;
        }
        if (input.classList.contains('inputY')) {
            if (lastCoordY + 5 < 28)
                input.value = lastCoordY + 5;
            else
                input.value = lastCoordY - 5;
        }
            
	});
	
	draggables = document.querySelectorAll('#draggables .draggable');
	clone.addEventListener('dragstart', handleDragStart, false);
	clone.addEventListener('dragenter', handleDragEnter, false);
	clone.addEventListener('dragover', handleDragOver, false);
	clone.addEventListener('dragleave', handleDragLeave, false);
	clone.addEventListener('drop', handleDrop, false);
	clone.addEventListener('dragend', handleDragEnd, false);
	clone.querySelector('.addUp').addEventListener('click', function () {
        addInIndexClick(true, this.closest('.inputCoord'));
    });
	clone.querySelector('.addDown').addEventListener('click', function () {
        addInIndexClick(false, this.closest('.inputCoord'));
	});
	
	if (insertAbove) {
		parent.insertBefore(clone, btn);
	}
	else {
		parent.insertBefore(clone, btn.nextSibling);
	}

	propInit();
	canvasInit();
	downloadFile();
	if ((isMatrix && coordX.length >= maxPointForMatrix) || (!isMatrix && coordX.length >= maxPointForParametric)) {
		var addBtn = document.querySelector('#add');
		addBtn.disabled = true;
		addBtn.style.cursor = 'not-allowed';
		addBtn.classList.add('disabled');

		var allAddUpBtns = document.querySelectorAll('.addUp');
		allAddUpBtns.forEach(function (addUpBtn) {
			addUpBtn.disabled = true;
			addUpBtn.style.cursor = 'not-allowed';
		});

		var allAddDownBtns = document.querySelectorAll('.addDown');
		allAddDownBtns.forEach(function (addDownBtn) {
			addDownBtn.disabled = true;
			addDownBtn.style.cursor = 'not-allowed';
		});
	}
	
}
function onAddClick(e) {
	var parent = document.getElementById('draggables');
	if (parent.children.length == 0) {
		var htmlCode = `
			<div class="inputItem inputCoord draggable">
				<span>1</span>
				<label>X</label>
				<input class="inputX" type="text" value="5">
				<label>Y</label>
				<input class="inputY" type="text" value="5">
				<button class="addUp"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-row-insert-top" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M4 18v-4a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1z" />
                                <path d="M12 9v-4" />
                                <line x1="10" y1="7" x2="14" y2="7" />
                              </svg></button>
                            <button class="addDown"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-row-insert-bottom" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M20 6v4a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1z" />
                                <line x1="12" y1="15" x2="12" y2="19" />
                                <line x1="14" y1="17" x2="10" y2="17" />
                              </svg></button>
				<div class="delete"></div>
			</div>
		`;

		// Insert the HTML code into the parent element
		parent.innerHTML += htmlCode;
		return;
	} 
    var clone = parent.querySelector('.inputCoord').cloneNode(true);
    var lastCoord = parent.lastElementChild;

	// parent.appendChild(clone);

	clone.addEventListener('click', onDeleteClick, false);
	clone.addEventListener('keyup', onInputChange, false);

    var inputs = clone.querySelectorAll('input');
    let lastCoordX = parseInt(lastCoord.querySelector('.inputX').value);
	let lastCoordY = parseInt(lastCoord.querySelector('.inputY').value);
	//thisshit


    [].forEach.call(inputs, function (input) {
        if (input.classList.contains('inputX')) {
            if (lastCoordX + 10 < 42)
                input.value = lastCoordX + 10;
            else
                input.value = lastCoordX - 10;
        }
        if (input.classList.contains('inputY')) {
            if (lastCoordY + 5 < 28)
                input.value = lastCoordY + 5;
            else
                input.value = lastCoordY - 5;
        }
            
	});
	parent.appendChild(clone);
	
	draggables = document.querySelectorAll('#draggables .draggable');
	clone.addEventListener('dragstart', handleDragStart, false);
	clone.addEventListener('dragenter', handleDragEnter, false);
	clone.addEventListener('dragover', handleDragOver, false);
	clone.addEventListener('dragleave', handleDragLeave, false);
	clone.addEventListener('drop', handleDrop, false);
	clone.addEventListener('dragend', handleDragEnd, false);
	clone.querySelector('.addUp').addEventListener('click', function () {
        addInIndexClick(true, this.closest('.inputCoord'));
    });
	clone.querySelector('.addDown').addEventListener('click', function () {
        addInIndexClick(false, this.closest('.inputCoord'));
    });
	

	propInit();
	canvasInit();
	downloadFile();
	if ((isMatrix && coordX.length >= maxPointForMatrix) || (!isMatrix && coordX.length >= maxPointForParametric)) {
		var addBtn = document.querySelector('#add');
		addBtn.disabled = true;
		addBtn.style.cursor = 'not-allowed';
		addBtn.classList.add('disabled');

		var allAddUpBtns = document.querySelectorAll('.addUp');
		allAddUpBtns.forEach(function (addUpBtn) {
			addUpBtn.disabled = true;
			addUpBtn.style.cursor = 'not-allowed';
		});

		var allAddDownBtns = document.querySelectorAll('.addDown');
		allAddDownBtns.forEach(function (addDownBtn) {
			addDownBtn.disabled = true;
			addDownBtn.style.cursor = 'not-allowed';
		});
	}
}
function addClick(lastCoordX, lastCoordY) {
	var parent = document.getElementById('draggables');
	if (parent.children.length == 0) {
		var htmlCode = `
			<div class="inputItem inputCoord draggable">
				<span>1</span>
				<label>X</label>
				<input class="inputX" type="text" value="${lastCoordX}">
				<label>Y</label>
				<input class="inputY" type="text" value="${lastCoordY}">
				<button class="addUp"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-row-insert-top" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M4 18v-4a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1z" />
                                <path d="M12 9v-4" />
                                <line x1="10" y1="7" x2="14" y2="7" />
                              </svg></button>
                            <button class="addDown"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-row-insert-bottom" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M20 6v4a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1z" />
                                <line x1="12" y1="15" x2="12" y2="19" />
                                <line x1="14" y1="17" x2="10" y2="17" />
                              </svg></button>
				<div class="delete"></div>
			</div>
		`;

		// Insert the HTML code into the parent element
		parent.innerHTML += htmlCode;
		return;
	} 
	
    var clone = parent.querySelector('.inputCoord').cloneNode(true);

	parent.appendChild(clone);

	clone.addEventListener('click', onDeleteClick, false);
	clone.addEventListener('keyup', onInputChange, false);

    var inputs = clone.querySelectorAll('input');
    [].forEach.call(inputs, function (input) {
        if (input.classList.contains('inputX')) {
            input.value = lastCoordX;
        }
        if (input.classList.contains('inputY')) {
			input.value = lastCoordY;
        }
            
	});

	draggables = document.querySelectorAll('#draggables .draggable');
	clone.addEventListener('dragstart', handleDragStart, false);
	clone.addEventListener('dragenter', handleDragEnter, false);
	clone.addEventListener('dragover', handleDragOver, false);
	clone.addEventListener('dragleave', handleDragLeave, false);
	clone.addEventListener('drop', handleDrop, false);
	clone.addEventListener('dragend', handleDragEnd, false);
	clone.querySelector('.addUp').addEventListener('click', function () {
        addInIndexClick(true, this.closest('.inputCoord'));
    });
	clone.querySelector('.addDown').addEventListener('click', function () {
        addInIndexClick(false, this.closest('.inputCoord'));
	});
}
/* ==================================================== */


/* ============== Input change handling ============== */
function onInputChange(e) {
	if(e.target === document.querySelector('#canvasHeight') || e.target === document.querySelector('#canvasWidth')) {
		resetCanvas();
	}
	propInit();
	canvasInit();
}
function onSelectChange() {
	if (isMatrix && coordX.length > maxPointForMatrix) {
		var overlayMask = document.getElementById('overlayMask');
		var warningX = document.querySelector('#formulaSelect').offsetLeft;
		var warningY = document.querySelector('#formulaSelect').offsetTop;
		var warning = document.querySelector('.warning');
		var warningText = document.querySelector('#warningText');
		warningText.textContent = `Do you want to remove the last ${coordX.length - maxPointForMatrix} points to draw a curve using matrix method? Otherwise no changes will be done.`;
		overlayMask.style.display = 'block';
		warning.style.display = 'block';
		warning.style.left = warningX - 60 + 'px';
		warning.style.top = warningY + 30 + 'px';

		var cancelRemovalBtn = document.querySelector('#cancelRemovalBtn');
		var removePointsBtn = document.querySelector('#removePointsBtn');

		cancelRemovalBtn.addEventListener('click', function () {
			overlayMask.style.display = 'none';
			warning.style.display = 'none';
			formulaSelect.value = 'parametric';
		});

		removePointsBtn.addEventListener('click', function () {
			overlayMask.style.display = 'none';
			warning.style.display = 'none';
			var items = document.querySelectorAll('.inputCoord');
			var parent = document.getElementById('draggables');
			for (let i = items.length - 1; i > items.length - 1 - (coordX.length - maxPointForMatrix); i--) {
				items[i].remove();
			}
			if (isMatrix && coordX.length < maxPointForMatrix) {
				var addBtn = document.querySelector('#add');
				addBtn.disabled = false;
				addBtn.style.cursor = 'pointer';
				addBtn.classList.remove('disabled');
			}
			// propInit();
			// canvasInit();
			formulaSelect.value = 'matrix';
			propInit();
			canvasInit();
			if (isMatrix && coordX.length >= maxPointForMatrix) {
				var addBtn = document.querySelector('#add');
				addBtn.disabled = true;
				addBtn.style.cursor = 'not-allowed';
				addBtn.classList.add('disabled');
			}
		});
	}
	else {

		propInit();
		canvasInit();
		
		downloadFile();
	}
}
/* ==================================================== */


function downloadFile() {
	if (isMatrix) {
		fetch('/write-to-file', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ data: fileContent, matrixData: matrixFileContent})
		})
		.then(response => response.text())
		.then(result => {
			console.log(result); 
			var fileMessage = document.querySelector('.fileMessage');
			fileMessage.style.display = 'flex'; 
			fileMessage.classList.add('fadeInAnimation');
			fileMessage.addEventListener('animationend', () => {
				fileMessage.classList.remove('fadeInAnimation');
			}, { once: true });
		})
		.catch(error => console.error('Error:', error));
	}
}

/* ============== Moving points on canvas events ============== */
function onCanvasDown(e) {
	targetIndex = -1;
	var canvasWrap = document.querySelector('.canvasWrap');
	mousePos.x = e.pageX - canvasWrap.offsetLeft;
	mousePos.y = e.pageY - canvasWrap.offsetTop;


	for(var i = 0; i < pointNum; i++) {
		var pointX = coordX[i];
		var pointY = coordY[i];
		var offset = 10;
		// console.log(mousePos.x, pointX, mousePos.y, pointY);
		if((mousePos.x >= pointX-offset) && (mousePos.x <= pointX+offset) && (mousePos.y >= pointY-offset) && (mousePos.y <= pointY+offset)) {
			targetIndex = i;
			break;
		}
	}
	if(targetIndex !== -1) {
		flgCanvasDown = true;
	}
}
function onCanvasUp(e) {
	flgCanvasDown = false;
}
function onCanvasMove(e) {
	if(flgCanvasDown) {
		var canvasWrap = document.querySelector('.canvasWrap');
		mousePos.x = e.pageX - canvasWrap.offsetLeft;
		mousePos.y = e.pageY - canvasWrap.offsetTop;

		var coords = document.getElementsByClassName('inputCoord');
		var target = coords[targetIndex];
		
		const rect = document.getElementById('canvas').getBoundingClientRect();
		let centerX = canvasWidth / 2;
		let centerY = canvasHeight / 2;
		const x = (mousePos.x - rect.left - centerX) / 10;
		const y = (centerY - mousePos.y + rect.top) / 10 - 7;

		// target.querySelector('.inputX').value = mousePos.x;
		// target.querySelector('.inputY').value = mousePos.y;

		target.querySelector('.inputX').value = x.toFixed(2);
		target.querySelector('.inputY').value = y.toFixed(2);
		
		// fuckingshit
		propInit();
		canvasInit();
	}
}
/* ============================================================ */

/* ============== Canvas Initialization And Reset ============== */
function resetCanvas() {
	canvas = document.getElementById('canvas');
    canvasWidth = 1000;
	canvasHeight = 590;

	canvas.width = canvasWidth || 900;
	canvas.height = canvasHeight || 500;
	context = canvas.getContext('2d');

	canvas.addEventListener('mousedown', onCanvasDown, false);
	canvas.addEventListener('mouseup', onCanvasUp, false);
	canvas.addEventListener('mousemove', onCanvasMove, false);
}
function canvasInit() {
	function drawGrid() {
		var loopW = canvasWidth / 10;
		var loopH = canvasHeight / 10;

		for(var i = 0; i < loopW; i++) {
			context.strokeStyle = '#eee';
			context.beginPath();
			context.moveTo(i * 10, 0);
			context.lineTo(i * 10, canvasHeight);
			context.stroke();
		}
		for(var j = 0; j < loopH; j++) {
			context.strokeStyle = '#eee';
			context.beginPath();
			context.moveTo(0, j * 10);
			context.lineTo(canvasWidth, j * 10);
			context.stroke();
		}
	}

	function drawPoint() {
		context.font = 'normal 14px Arial';

		for(var i = 0; i < pointNum; i++) {
			// ポイント
			context.fillStyle = '#666';
			context.strokeStyle = '#666';
			context.beginPath();
			context.arc(coordX[i], coordY[i], 6, 0, Math.PI*2, false);
			context.stroke();
			if(i === 0 || i === pointNum - 1) {
				context.fill();
			}

			// 直線
			if(i !== pointNum - 1) {
				context.strokeStyle = '#ccc';
				context.beginPath();
				context.moveTo(coordX[i], coordY[i]);
				context.lineTo(coordX[i+1], coordY[i+1]);
				context.stroke();
			}

			// 座標
			context.fillStyle = '#e40056';
			const rect = document.getElementById('canvas').getBoundingClientRect();
			let centerX = canvasWidth / 2;
			let centerY = canvasHeight / 2 + 5;
			const x = (coordX[i] - rect.left - centerX) / 10;
        	const y = (centerY - coordY[i] + rect.top)  / 10 - 7;
			// context.fillText('(' + coordX[i] + ',' + coordY[i] + ')', coordX[i] - 12, coordY[i] - 12);
			// context.fillText('(' + (x + 1).toFixed(2) + ',' + (y + 0.5).toFixed(2) + ')', coordX[i] - 12, coordY[i] - 12);
		}

		const points = document.querySelectorAll('.inputCoord');
		let pointX, pointY;
		[].forEach.call(points, function (point, i) {
			var inputs = point.querySelectorAll('input');
			pointX = inputs[0].value;
			pointY = inputs[1].value;
			context.fillText('(' + pointX + ',' + pointY + ')', coordX[i] - 12, coordY[i] - 12);
		});
	}

	function drawAxes() {
		let centerX = canvasWidth / 2;
		let centerY = canvasHeight / 2 - 5;

		context.strokeStyle = '#8b8b8b';

		// малювання x-осі
		context.beginPath();
		context.moveTo(0, centerY);
		context.lineTo(canvasWidth, centerY);
		context.lineTo(canvasWidth - 10, centerY - 5);
		context.moveTo(canvasWidth, centerY);
		context.lineTo(canvasWidth - 10, centerY + 5);
		context.stroke();
	
		// малювання y-осі
		context.beginPath();
		context.moveTo(centerX, 0);
		context.lineTo(centerX, canvasHeight);
		context.moveTo(centerX, 0);
		context.lineTo(centerX - 5, 10);
		context.moveTo(centerX, 0);
		context.lineTo(centerX + 5, 10);
		context.stroke();

		// Draw unit marker on x-axis
		context.font = '10px Arial';
		for (let i = 1; i < 48; i++) {
			context.beginPath();
			context.moveTo(centerX + 20 * i, centerY - 3);
			context.lineTo(centerX + 20 * i, centerY + 3);
			context.stroke();
			context.fillText(`${i*2}`, centerX + 20 * i, centerY + 15);
		}
		for (let i = 1; i < 48; i++) {
			context.beginPath();
			context.moveTo(centerX - 20 * i, centerY - 3);
			context.lineTo(centerX - 20 * i, centerY + 3);
			context.stroke();
			context.fillText(`-${i*2}`, centerX - 20 * i - 6, centerY + 15);
		}
	
		// Draw unit marker on y-axis
		for (let i = 1; i < 28; i++) {
			context.beginPath();
			context.moveTo(centerX - 3, centerY - 20*i);
			context.lineTo(centerX + 3, centerY - 20*i);
			context.stroke();
			context.fillText(`${i*2}`, centerX - 15, centerY - 20*i);
		}
		for (let i = 1; i < 28; i++) {
			context.beginPath();
			context.moveTo(centerX - 3, centerY + 20*i);
			context.lineTo(centerX + 3, centerY + 20*i);
			context.stroke();
			context.fillText(`-${i*2}`, centerX - 18, centerY + 20*i + 4);
		}

		// малювання міток 'x' та 'y'
		context.fillStyle = '#8b8b8b';
		context.font = '16px Arial';
		context.fillText('x', canvasWidth - 15, centerY - 10);
		context.fillText('y', centerX + 10, 10);
	}

	(function draw() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		drawGrid();
		drawPoint();
		drawAxes();

		const controlPoints = coordX.map((x, index) => ({ x, y: coordY[index] }));
		if (!isMatrix)
			drawBezierCurve(context, controlPoints);
		else
			drawBezierCurveMatrix(context, controlPoints);
	})();
}
/* ============================================================== */

/* ============== Bezier curve calculation and drawing ============== */
function drawBezierCurve(ctx, controlPoints) {
	
    if (controlPoints.length < 2) {
        return; // Need at least two points to draw a curve
	}
	
	var pointsList = document.querySelector('#pointsListTextArea');
	pointsList.value = '';
	ctx.strokeStyle = colorInput.value;
    ctx.beginPath();
    ctx.moveTo(controlPoints[0].x, controlPoints[0].y);

    const n = controlPoints.length - 1;

    for (let t = 0; t <= 1; t += 0.0001) {
        let x = 0;
        let y = 0;

        for (let i = 0; i <= n; i++) {
            const coefficient = binomialCoefficient(n, i) * Math.pow(1 - t, n - i) * Math.pow(t, i);
            x += coefficient * controlPoints[i].x;
            y += coefficient * controlPoints[i].y;
        }

        ctx.lineTo(x, y);
	}
	ctx.stroke();
	ctx.strokeStyle = '#ccc';

	let pointsListString = '';
	
	var Xs = Array.from(document.querySelectorAll('.inputCoord .inputX')).map(input => input.value);
	var Ys = Array.from(document.querySelectorAll('.inputCoord .inputY')).map(input => input.value);
	controlPoints = Xs.map((x, index) => ({ x, y: Ys[index] }));
	for (let t = parseFloat(tInput.value); t <= parseFloat(tInput2.value); t += parseFloat(stepInput.value))
	{
		let x = 0;
        let y = 0;

        for (let i = 0; i <= n; i++) {
            const coefficient = binomialCoefficient(n, i) * Math.pow(1 - t, n - i) * Math.pow(t, i);
            x += coefficient * controlPoints[i].x;
            y += coefficient * controlPoints[i].y;
		}
		pointsListString += `(${x.toFixed(2)}; ${y.toFixed(2)}), `;
	}
	pointsList.value = pointsListString;
}
function drawBezierCurveMatrix(ctx, controlPoints) {
	var pointsList = document.querySelector('#pointsListTextArea');
	pointsList.value = '';
    const n = controlPoints.length - 1;

    // Matrix of coefficients
    const N = [];
    for (let i = 0; i <= n; i++) {
        N[i] = [];
        for (let j = 0; j <= n; j++) {
			N[i][j] = binomialCoefficient(n, i) * binomialCoefficient(n - i, j) * Math.pow(-1, n - i - j);
        }
	}
	const nonZeroValues = [];
	N.forEach((row, x) => {
		row.forEach((value, y) => {
			if (value !== 0) {
				nonZeroValues.push({ x, y, value });
			}
		});
	});

	const jsonContent = JSON.stringify(nonZeroValues, null, 2);
	fileContent = jsonContent;

	const nonZeros = [];
	N.forEach((row, x) => {
		row.forEach((value, y) => {
			if (y >= N.length - x - 1) {
				nonZeros.push({ x, y, value });
			}
		});
	});

	let matrixString = '';
	for (let i = 0; i <= n; i++) {
		for (let j = 0; j <= n; j++) {
			if (N[i][j] !== 0) {
				matrixString += `${N[i][j]} `;
			} else {
				matrixString += '  '; // Add empty spaces for missing values
			}
		}
		matrixString += '\n'; // Add newline after each row
	}
	matrixFileContent = matrixString;
	
	ctx.strokeStyle = colorInput.value;
    ctx.beginPath();
	ctx.moveTo(controlPoints[0].x, controlPoints[0].y);
	
	
    for (let t = 0; t <= 1; t += 0.001) {
        const { x, y } = calculatePoint(t, n, N, controlPoints);
		ctx.lineTo(x, y);
	}

	var Xs = Array.from(document.querySelectorAll('.inputCoord .inputX')).map(input => input.value);
	var Ys = Array.from(document.querySelectorAll('.inputCoord .inputY')).map(input => input.value);
	controlPoints = Xs.map((x, index) => ({ x, y: Ys[index] }));
	let pointsListString = '';
	for (let t = parseFloat(tInput.value); t <= parseFloat(tInput2.value); t += parseFloat(stepInput.value))
	{
		const { x, y } = calculatePoint(t, n, N, controlPoints);
		pointsListString += `(${x.toFixed(2)}; ${y.toFixed(2)}), `;
	}
	pointsList.value = pointsListString;
	ctx.stroke();
	ctx.strokeStyle = '#ccc';

}
function convertControlPointsToMatrix(controlPoints) {
    return controlPoints.map(point => [point.x, point.y]);
}
function calculatePoint(t, n, N, P) {
    let T = [];
    for (let i = n; i >= 0; i--) {
        T.push(Math.pow(t, i));
    }
	P = convertControlPointsToMatrix(P);
    let result = { x: 0, y: 0 };
    for (let i = 0; i <= n; i++) {
        result.x = multiplyMatrices(T, N, P)[0];
        result.y = multiplyMatrices(T, N, P)[1];
    }
    return result;
}
function multiplyMatrices(vector, matrix1, matrix2) {

    let result = [];
    for (let i = 0; i < vector.length; i++) {
        let sum = 0;
        for (let j = 0; j < matrix1.length; j++) {
            sum += vector[j] * matrix1[j][i];
        }
        result.push(sum);
    }

    let finalResult = [];
    for (let i = 0; i < 2; i++) {
        let sum = 0;
        for (let j = 0; j < vector.length; j++) {
            sum += result[j] * matrix2[j][i];
        }
        finalResult.push(sum);
    }

    return finalResult;
}
function binomialCoefficient(n, k) {
    let coeff = 1;
    for (let i = n - k + 1; i <= n; i++) {
        coeff *= i;
    }
    for (let i = 1; i <= k; i++) {
        coeff /= i;
    }
    return coeff;
}
/* ============================================================== */


/* ============== drag point events ============== */
function handleDragStart(e) {
	console.log(this);
	this.style.opacity = '0.4';
	dragSrcEl = this;
	e.dataTransfer.effectAllowed = 'move';
	e.dataTransfer.setData('text/html', this.innerHTML);
	// console.log(this.innerHTML);
}
function handleDragOver(e) {
	if (e.preventDefault) {
		e.preventDefault();
	}
	e.dataTransfer.dropEffect = 'move';
	return false;
}
function handleDragEnter(e) {
	this.classList.add('over');
}
function handleDragLeave(e) {
	this.classList.remove('over');
}
function handleDrop(e) {
	console.log(e.dataTransfer.getData('text/html'));
	if (e.stopPropagation) {
		e.stopPropagation();
	}
	if (dragSrcEl != this) {
		dragSrcEl.innerHTML = this.innerHTML;
		this.innerHTML = e.dataTransfer.getData('text/html');
	}
	return false;
}
function handleDragEnd(e) {
	[].forEach.call(draggables, function (draggable) {
		draggable.style.opacity = 1;
		draggable.classList.remove('over');
		propInit();
		canvasInit();
	});
}
function dragInit() {
	draggables = document.querySelectorAll('#draggables .draggable');
	[].forEach.call(draggables, function(draggable) {
		draggable.addEventListener('dragstart', handleDragStart, false);
		draggable.addEventListener('dragenter', handleDragEnter, false);
		draggable.addEventListener('dragover', handleDragOver, false);
		draggable.addEventListener('dragleave', handleDragLeave, false);
		draggable.addEventListener('drop', handleDrop, false);
		draggable.addEventListener('dragend', handleDragEnd, false);
	});
}
/* ================================================ */


/* ============== Initialization ============== */
function setQuery() {
	var url = location.href;
	var queryStr = url.split('?')[1];
	if(!queryStr) {
		return false;
	}
	var queryArr = queryStr.split('&');
	var easing = queryArr[0].split('=')[1];
	var speed = queryArr[1].split('=')[1];
	var canvasW = queryArr[2].split('=')[1];
	var canvasH = queryArr[3].split('=')[1];
	var coords = queryArr[4].split('=')[1].split(',');
	var count = coords.length / 2;
	var inputs = '';

	document.getElementById('easingSelect').value = easing;
	document.getElementById('speed').value = speed;
	document.getElementById('canvasWidth').value = canvasW;
	document.getElementById('canvasHeight').value = canvasH;
	
	for (var i = 0; i < count; i++) {
		inputs += '<div class="inputItem inputCoord draggable">';
		inputs += '<span>';
		inputs += i;
		inputs += '</span>';
		inputs += '<label>X</label><input class="inputX" type="text" value="';
		inputs += coords[i * 2];
		inputs += '">';
		inputs += '<label>Y</label><input class="inputY" type="text" value="';
		inputs += coords[i * 2 + 1];
		inputs += '">';
		inputs += '<div class="delete"></div>';
		inputs += '</div>';
	}
	document.getElementById('draggables').innerHTML = inputs;
}

/* ============== Help tutorial ============== */
var help = {
	conf: {
		overlayMask: {}
	},
	init: function() {
		var self = this;
		var conf = self.conf;
		var trigger = document.querySelector('.help');
		conf.overlayMask = document.getElementById('overlayMask');
		// debil
		trigger.addEventListener('click', function() {
			self.setOverlay();
		});
		conf.overlayMask.addEventListener('click', function() {
			self.hideOverlay();
		});
		function goNext(remove, add, scroll, offset) {
			document.querySelector(remove).classList.remove('is-show');
			document.querySelector(add).classList.add('is-show');
			document.body.scrollTop = document.querySelector(scroll).offsetTop + (offset || 0);
		}
		document.querySelector('.guide01 .next').addEventListener('click', function() {
			goNext('.guide01', '.guide02', '#inputArea');
		});
		document.querySelector('.guide02 .closeOverlay').addEventListener('click', function() {
			self.hideOverlay();
		});
	},
	setOverlay: function() {
		var self = this;
		var conf = self.conf;
		var winWidth = window.getComputedStyle(document.querySelector('.container')).width;
		var winHeight = window.getComputedStyle(document.querySelector('.container')).height;
		conf.overlayMask.style.width = winWidth;
		conf.overlayMask.style.height = winHeight;
		conf.overlayMask.classList.add('is-show');
		document.querySelector('.guide01').classList.add('is-show');
		var guide01X = document.querySelector('.canvasWrap').offsetLeft;
		var guide01Y = document.querySelector('.canvasWrap').offsetTop;
		document.querySelector('.guide01').style.left = guide01X + 40 + 'px';
		document.querySelector('.guide01').style.top = guide01Y + 200 + 'px';
		var guide02X = document.querySelector('#inputArea').offsetLeft;
		var guide02Y = document.querySelector('#inputArea').offsetTop;
		document.querySelector('.guide02').style.left = guide02X + 20 + 'px';
		document.querySelector('.guide02').style.top = guide02Y + 100 + 'px';
		var guide03X = document.querySelector('#url').offsetLeft;
		var guide03Y = document.querySelector('#url').offsetTop;
		document.querySelector('.guide03').style.left = guide03X + 180 + 'px';
		document.querySelector('.guide03').style.top = guide03Y - 60 + 'px';
		var guide04X = document.querySelector('#outputBtn').offsetLeft;
		var guide04Y = document.querySelector('#outputBtn').offsetTop;
		document.querySelector('.guide04').style.left = guide04X + 40 + 'px';
		document.querySelector('.guide04').style.top = guide04Y + 50 + 'px';
		
	},
	hideOverlay: function() {
		var self = this;
		var conf = self.conf;
		var guides = document.getElementsByClassName('overlayContent');
		conf.overlayMask.classList.remove('is-show');
		[].forEach.call(guides, function(guide) {
			guide.classList.remove('is-show');
		});
	}
};

// Ініціалізація
setQuery();
dragInit();
resetCanvas();
propInit();
replayInit();
inputInit();
deleteInit();
addInit();
help.init();

setTimeout(function() {
	canvasInit();
}, 100);
