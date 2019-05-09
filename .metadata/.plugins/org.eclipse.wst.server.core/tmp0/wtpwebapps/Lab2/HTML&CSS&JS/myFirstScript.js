function validateMyForm() {
	var FirstName = document.IndexForm.FirstName.value;
	var LastName = document.IndexForm.LastName.value;
	var BirthDate = document.IndexForm.BirthDate.value;
	var Sex = document.getElementsByName("Sex");

	if (null == FirstName || "" == FirstName) {
		alert("First name must be filled.");

		return false;
	}
	else if (null == LastName || "" == LastName) {
		alert("Last name must be filled.");

		return false;
	}
	else if (null == BirthDate || "" == BirthDate) {
		alert("BirthDate must be filled.");

		return false;
	}
	else if (null == Sex || (!Sex[0].checked && !Sex[1].checked)) {
		alert("Sex must be filled.");

		return false;
	}
	else {
		alert("First Name = " + FirstName
			+ "\nLast Name = " + LastName
			+ "\nBirth Date = " + BirthDate
			+ "\nSex = " + (Sex[0].checked ? Sex[0].value : Sex[1].value));

		return true;
	}
}

function onClickMale() {
	var FieldSet = document.getElementsByTagName("fieldset");
	var Legend = document.getElementsByTagName("legend");
	var Input = document.getElementsByTagName("input");
	var Head = document.getElementById("Head");

	for (var fieldsetCount = 0; fieldsetCount < FieldSet.length; fieldsetCount++)
		FieldSet[fieldsetCount].style.borderColor = "blue";
	for (var legendCount = 0; legendCount < Legend.length; legendCount++)
		Legend[legendCount].style.color = "blue";
	for (var inputCount = 0; inputCount < Input.length; inputCount++)
		Input[inputCount].style.borderColor = "blue";
	Head.innerHTML = "Hello Sir!";

	return true;
}

function onClickFemale() {
	var FieldSet = document.getElementsByTagName("fieldset");
	var Legend = document.getElementsByTagName("legend");
	var Input = document.getElementsByTagName("input");
	var Head = document.getElementById("Head");

	for (var fieldsetCount = 0; fieldsetCount < FieldSet.length; fieldsetCount++)
		FieldSet[fieldsetCount].style.borderColor = "red";
	for (var legendCount = 0; legendCount < Legend.length; legendCount++)
		Legend[legendCount].style.color = "red";
	for (var inputCount = 0; inputCount < Input.length; inputCount++)
		Input[inputCount].style.borderColor = "red";
	Head.innerHTML = "Hello Madam!";

	return true;
}