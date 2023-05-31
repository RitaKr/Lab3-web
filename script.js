let items = [
	{ name: "Помідори", amount: 2, bought: true },
	{ name: "Печиво", amount: 2, bought: false },
	{ name: "Сир", amount: 1, bought: false },
];
function updateLocalStorage() {
	localStorage.buyListApp = JSON.stringify(items);

	//console.log(items);
}
function fetchFromLocalStorage() {
	if (localStorage.getItem("buyListApp") != null) {
		items = JSON.parse(localStorage.getItem("buyListApp"));
		//console.log("Parsed from localStorage", items);
	}
}
function clearStorage() {
	localStorage.removeItem("buyListApp");
}

function renderHTML() {
	const itemsContainer = document.getElementById("items-container");
	const notBoughtList = document.getElementById("not-bought");
	const boughtList = document.getElementById("bought");

	itemsContainer.innerHTML = "";
	notBoughtList.innerHTML = "";
	boughtList.innerHTML = "";

	items.forEach((item) => {
		renderItemPanel(item);
		renderAsideListItem(item);
	});

	function renderItemPanel(item) {
		const itemSection = document.createElement("section");
		itemSection.classList.add("item-panel");

		let label = document.createElement("p");
		label.innerText = item.name;
		itemSection.appendChild(label);

		if (!item.bought) {
			let input = document.createElement("input");
			input.classList.add("hidden");
			input.type = "text";
			input.value = item.name;
            input.name = item.name;
			itemSection.appendChild(input);

			input.addEventListener("input", (e) => {
				item.name = input.value;
				//console.log("input focused. New name: ", input.value);
			});

			input.addEventListener("blur", (e) => {
				//console.log("input submitted");
                updateLocalStorage();
                label.innerText = input.value;

                notBoughtList.innerHTML = "";
	                boughtList.innerHTML = "";
                items.forEach((item) => {
                    renderAsideListItem(item);
                });
				setTimeout(() => {
		
                    label.classList.remove("hidden");
				    input.classList.add("hidden");

                    
				}, 300);
			});

			label.addEventListener("click", (e) => {
				//console.log("click");
				label.classList.add("hidden");
				input.classList.remove("hidden");
				input.focus();
			});
		}

		const amountContainer = document.createElement("div");

		const lessButton = document.createElement("button");
		lessButton.classList.add("less-btn");

		lessButton.dataset.tooltip = "Зменшити кількість";
		lessButton.textContent = "–";
		if (item.amount < 2) lessButton.disabled = true;
		amountContainer.appendChild(lessButton);

		const amountSpan = document.createElement("span");
		amountSpan.classList.add("amount");
		amountSpan.textContent = item.amount;
		amountContainer.appendChild(amountSpan);

		const moreButton = document.createElement("button");
		moreButton.classList.add("more-btn");
		moreButton.dataset.tooltip = "Збільшити кількість";
		moreButton.textContent = "+";
		amountContainer.appendChild(moreButton);

		itemSection.appendChild(amountContainer);

		const submissionContainer = document.createElement("div");
		submissionContainer.classList.add("submission");

		const buyButton = document.createElement("button");
		buyButton.type = "submit";
		buyButton.classList.add("buy-btn");
		buyButton.dataset.tooltip = "Змінити статус покупки";
		buyButton.textContent = item.bought ? "Не куплено" : "Куплено";
		submissionContainer.appendChild(buyButton);

		const deleteButton = document.createElement("button");
		deleteButton.classList.add("delete-btn");

		deleteButton.dataset.tooltip = "Видалити товар";
		deleteButton.textContent = "✖";
		submissionContainer.appendChild(deleteButton);

		itemSection.appendChild(submissionContainer);

		if (item.bought) {
			label.classList.add("crossed");
			lessButton.classList.add("hidden");
			moreButton.classList.add("hidden");
			deleteButton.classList.add("hidden");
		}

		itemsContainer.appendChild(itemSection);

		moreButton.addEventListener("click", (e) => {
			e.preventDefault();
			item.amount++;
			updateLocalStorage();
			renderHTML();
		});

		lessButton.addEventListener("click", (e) => {
			e.preventDefault();
			if (item.amount > 1) item.amount--;
			updateLocalStorage();
			renderHTML();
		});

		buyButton.addEventListener("click", (e) => {
			e.preventDefault();
			item.bought = !item.bought;
			updateLocalStorage();
			renderHTML();
		});

		deleteButton.addEventListener("click", (e) => {
			e.preventDefault();
			items.splice(items.indexOf(item), 1);
			updateLocalStorage();
			renderHTML();
		});
	}

	function renderAsideListItem(item) {
		const li = document.createElement("li");
		const nameSpan = document.createElement("span");
		nameSpan.classList.add("name");
		nameSpan.innerText = item.name;
		li.appendChild(nameSpan);

		const amountSpan = document.createElement("span");
		amountSpan.classList.add("amount");
		amountSpan.innerText = item.amount;
		li.appendChild(amountSpan);

		if (item.bought) boughtList.appendChild(li);
		else notBoughtList.appendChild(li);
	}
}

function addItemToObject(name) {
	let names = items.map((obj) => obj.name);
	//console.log(names);
	if (names.indexOf(name) == -1) {
		items.push({ name: name, amount: 1, bought: false });
	} else {
		alert("This item is already in your list!");
	}
	//console.log(items);
	updateLocalStorage();
	renderHTML();
}

function addItemAndRerender(input) {
	let inputValue = input.value;

	if (inputValue.trim().length !== 0) addItemToObject(inputValue);
	input.value = "";
	input.focus();
}


window.onload = () => {

	//clearStorage();
	if (localStorage.getItem("buyListApp") == null) {
		localStorage.setItem("buyListApp", JSON.stringify(items));
	}
	fetchFromLocalStorage();
	renderHTML();

	document.getElementById("add-item").addEventListener("click", (e) => {
		e.preventDefault();
		let input = document.getElementById("search");
		addItemAndRerender(input);
	});
};
