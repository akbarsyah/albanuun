const appState = {
	momName: null,
	dadName: null,
	babyNickname: null,
	dueDate: null,
	lmp: null,
	hospital: null,
};

const storageKey = 'albanuun.settings';
const views = {
	home: document.querySelector('#home'),
};
const settingsDialog = document.querySelector('#settings-dialog');
const settingsForm = document.querySelector('#settings-form');
const homeSetup = document.querySelector('#home-setup');
const homeContent = document.querySelector('#home-content');
const setupNote = document.querySelector('#setup-note');
let pregnancy = null;

function getDateParts(date) {
	return {
		year: date.getFullYear(),
		month: date.getMonth(),
		day: date.getDate(),
	};
}

function parseDateInput(value) {
	if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
		return null;
	}

	const [year, month, day] = value.split('-').map(Number);
	const date = new Date(year, month - 1, day);
	if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
		return null;
	}
	return date;
}

function getCalendarDayNumber(date) {
	const { year, month, day } = getDateParts(date);
	return Date.UTC(year, month, day) / 86400000;
}

function getTrimester(totalDays) {
	if (totalDays < 98) {
		return 1;
	}
	if (totalDays < 196) {
		return 2;
	}
	return 3;
}

function getPregnancyStage(totalDays, dueDatePassed) {
	if (dueDatePassed) {
		return 'estimated-due-date-passed';
	}
	if (totalDays < 98) {
		return 'first-trimester';
	}
	if (totalDays < 196) {
		return 'second-trimester';
	}
	return 'third-trimester';
}

function calculatePregnancy(state, today = new Date()) {
	const dueDate = parseDateInput(state.dueDate);
	const lmp = parseDateInput(state.lmp);
	if (!dueDate) {
		return {
			isConfigured: false,
			dueDate: null,
			lmp,
			today,
			gestationalWeek: null,
			gestationalDay: null,
			trimester: null,
			daysRemaining: null,
			pregnancyProgress: null,
			pregnancyStage: 'not-configured',
		};
	}

	const daysUntilDueDate = getCalendarDayNumber(dueDate) - getCalendarDayNumber(today);
	const dueDatePassed = daysUntilDueDate < 0;
	const totalGestationalDays = 280 - daysUntilDueDate;
	const gestationalWeek = Math.floor(totalGestationalDays / 7);
	const gestationalDay = totalGestationalDays % 7;

	return {
		isConfigured: true,
		dueDate,
		lmp,
		today,
		gestationalWeek,
		gestationalDay,
		trimester: getTrimester(totalGestationalDays),
		daysRemaining: Math.max(0, daysUntilDueDate),
		pregnancyProgress: Math.min(100, Math.max(0, (totalGestationalDays / 280) * 100)),
		pregnancyStage: getPregnancyStage(totalGestationalDays, dueDatePassed),
		dueDatePassed,
	};
}

function refreshPregnancy() {
	pregnancy = calculatePregnancy(appState);
}

function formatDisplayDate(date) {
	if (!date) {
		return '';
	}
	return new Intl.DateTimeFormat(undefined, {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	}).format(date);
}

function formatDuration(value, singular, plural = `${singular}s`) {
	return `${value} ${value === 1 ? singular : plural}`;
}

function renderHome() {
	const isConfigured = pregnancy.isConfigured;
	homeSetup.hidden = isConfigured;
	homeContent.hidden = !isConfigured;
	setupNote.hidden = isConfigured;
	if (!isConfigured) {
		return;
	}

	document.querySelector('[data-home-title]').textContent = appState.momName
		? `${appState.momName}'s pregnancy`
		: 'Your pregnancy';
	document.querySelector('[data-home-age]').textContent = `${formatDuration(pregnancy.gestationalWeek, 'week')}, ${formatDuration(pregnancy.gestationalDay, 'day')}`;
	document.querySelector('[data-home-trimester]').textContent = `Trimester ${pregnancy.trimester}`;
	document.querySelector('[data-home-due-date]').textContent = formatDisplayDate(pregnancy.dueDate);
	document.querySelector('[data-home-countdown]').textContent = pregnancy.dueDatePassed
		? 'The estimated due date has passed'
		: `${pregnancy.daysRemaining} days to go`;
	document.querySelector('[data-mom-heading]').textContent = appState.momName
		? `How are you feeling today, ${appState.momName}?`
		: 'How are you feeling today?';
	document.querySelector('[data-dad-heading]').textContent = appState.dadName
		? `For Dad, ${appState.dadName}`
		: 'For Dad';
}

function loadSettings() {
	try {
		const savedSettings = JSON.parse(localStorage.getItem(storageKey));
		if (savedSettings && typeof savedSettings === 'object') {
			Object.keys(appState).forEach((key) => {
				if (typeof savedSettings[key] === 'string') {
					appState[key] = savedSettings[key];
				}
			});
		}
	} catch (error) {
		console.warn('Albanuun settings could not be loaded.', error);
	}
}

function fillSettingsForm() {
	Object.keys(appState).forEach((key) => {
		const field = settingsForm.elements.namedItem(key);
		if (field) {
			field.value = appState[key] || '';
		}
	});
}

function openSettings() {
	fillSettingsForm();
	settingsDialog.showModal();
}

function closeSettings() {
	settingsDialog.close();
}

function saveSettings(event) {
	event.preventDefault();
	const formData = new FormData(settingsForm);

	Object.keys(appState).forEach((key) => {
		const value = formData.get(key);
		appState[key] = typeof value === 'string' && value.trim() ? value.trim() : null;
	});

	try {
		localStorage.setItem(storageKey, JSON.stringify(appState));
	} catch (error) {
		console.warn('Albanuun settings could not be saved.', error);
	}
	refreshPregnancy();
	renderHome();

	const saveMessage = document.querySelector('#save-message');
	saveMessage.textContent = 'Details saved on this device.';
	window.setTimeout(() => {
		closeSettings();
		saveMessage.textContent = '';
	}, 700);
}

function setActiveView(viewName) {
	document.querySelectorAll('[data-view]').forEach((link) => {
		const isActive = link.dataset.view === viewName;
		link.classList.toggle('active', isActive);
		if (isActive) {
			link.setAttribute('aria-current', 'page');
		} else {
			link.removeAttribute('aria-current');
		}
	});
}

document.querySelectorAll('[data-view]').forEach((link) => {
	link.addEventListener('click', (event) => {
		const viewName = link.dataset.view;
		if (!views[viewName]) {
			event.preventDefault();
			return;
		}
		setActiveView(viewName);
	});
});

document.querySelectorAll('[data-action="settings"]').forEach((button) => {
	button.addEventListener('click', openSettings);
});

document.querySelectorAll('[data-action="close-settings"]').forEach((button) => {
	button.addEventListener('click', closeSettings);
});

settingsForm.addEventListener('submit', saveSettings);
settingsDialog.addEventListener('click', (event) => {
	if (event.target === settingsDialog) {
		closeSettings();
	}
});

document.querySelectorAll('[data-feeling]').forEach((button) => {
	button.addEventListener('click', () => {
		document.querySelectorAll('[data-feeling]').forEach((option) => {
			option.setAttribute('aria-pressed', option === button ? 'true' : 'false');
		});
	});
});

loadSettings();
refreshPregnancy();
renderHome();

window.albanuun = {
	appState,
	calculatePregnancy,
	getPregnancy: () => calculatePregnancy(appState),
	get pregnancy() {
		return pregnancy;
	},
};
