const appState = {
	momName: null,
	dadName: null,
	babyNickname: null,
	dueDate: null,
	lmp: null,
	hospital: null,
};

const storageKey = 'albanuun.settings';
const appointmentsStorageKey = 'albanuun.appointments';
const checkinsStorageKey = 'albanuun.checkins';
const dadNoteStorageKey = 'albanuun.dad-note';
const milestonesStorageKey = 'albanuun.milestones';
const albanuunStorageKeys = [storageKey, appointmentsStorageKey, checkinsStorageKey, dadNoteStorageKey, milestonesStorageKey];
const views = {
	journey: document.querySelector('#journey'),
	home: document.querySelector('#home'),
	care: document.querySelector('#care'),
};
const settingsDialog = document.querySelector('#settings-dialog');
const settingsForm = document.querySelector('#settings-form');
const resetDialog = document.querySelector('#reset-dialog');
const careView = document.querySelector('#care');
const appointmentDialog = document.querySelector('#appointment-dialog');
const appointmentForm = document.querySelector('#appointment-form');
const homeSetup = document.querySelector('#home-setup');
const homeContent = document.querySelector('#home-content');
const setupNote = document.querySelector('#setup-note');
const checkinForm = document.querySelector('#checkin-form');
const dadNoteForm = document.querySelector('#dad-note-form');
const journeyView = document.querySelector('#journey');
const milestoneDialog = document.querySelector('#milestone-dialog');
const milestoneForm = document.querySelector('#milestone-form');
const forMomSection = document.querySelector('#for-mom');
let pregnancy = null;
let appointments = [];
let checkins = [];
let editingAppointmentId = null;
let dadNote = '';
let milestones = [];
let editingMilestoneId = null;

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

function getLocalDateKey(date = new Date()) {
	const { year, month, day } = getDateParts(date);
	return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function addCalendarDays(date, days) {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

function loadCheckins() {
	try {
		const savedCheckins = JSON.parse(localStorage.getItem(checkinsStorageKey));
		if (Array.isArray(savedCheckins)) {
			checkins = savedCheckins
				.filter((checkin) => checkin && typeof checkin === 'object')
				.map((checkin) => ({
					date: typeof checkin.date === 'string' ? checkin.date : '',
					feeling: ['Good', 'Okay', 'Rough'].includes(checkin.feeling) ? checkin.feeling : '',
					needs: Array.isArray(checkin.needs) ? checkin.needs.filter((need) => ['Rest', 'Food', 'Water', 'Quiet', 'Help'].includes(need)) : [],
					note: typeof checkin.note === 'string' ? checkin.note : '',
				}));
		}
	} catch (error) {
		console.warn('Albanuun check-ins could not be loaded.', error);
	}
}

function saveCheckins() {
	try {
		localStorage.setItem(checkinsStorageKey, JSON.stringify(checkins));
	} catch (error) {
		console.warn('Albanuun check-ins could not be saved.', error);
	}
}

function loadDadNote() {
	try {
		const savedNote = localStorage.getItem(dadNoteStorageKey);
		dadNote = typeof savedNote === 'string' ? savedNote : '';
	} catch (error) {
		console.warn('Albanuun Dad Mode note could not be loaded.', error);
	}
}

function saveDadNote() {
	try {
		localStorage.setItem(dadNoteStorageKey, dadNote);
	} catch (error) {
		console.warn('Albanuun Dad Mode note could not be saved.', error);
	}
}

function loadMilestones() {
	try {
		const savedMilestones = JSON.parse(localStorage.getItem(milestonesStorageKey));
		if (Array.isArray(savedMilestones)) {
			milestones = savedMilestones
				.filter((milestone) => milestone && typeof milestone === 'object')
				.map((milestone) => ({
					id: typeof milestone.id === 'string' ? milestone.id : createAppointmentId(),
					title: typeof milestone.title === 'string' ? milestone.title.trim() : '',
					date: typeof milestone.date === 'string' ? milestone.date : '',
					note: typeof milestone.note === 'string' ? milestone.note : '',
				}))
				.filter((milestone) => milestone.title && parseDateInput(milestone.date));
		}
	} catch (error) {
		console.warn('Albanuun milestones could not be loaded.', error);
	}
}

function saveMilestones() {
	try {
		localStorage.setItem(milestonesStorageKey, JSON.stringify(milestones));
	} catch (error) {
		console.warn('Albanuun milestones could not be saved.', error);
	}
}

function getJourneyStages() {
	const trimesterStages = [
		{ name: 'First trimester', weeks: 'Weeks 1-13', description: 'The beginning of the shared journey.' },
		{ name: 'Second trimester', weeks: 'Weeks 14-28', description: 'A middle stretch to notice and move through together.' },
		{ name: 'Third trimester', weeks: 'Weeks 29-40', description: 'The final stretch toward meeting your baby.' },
	];
	const startOffsets = [-280, -182, -84];
	return trimesterStages.map((stage, index) => ({
		...stage,
		index,
		date: addCalendarDays(pregnancy.dueDate, startOffsets[index]),
		status: index < pregnancy.trimester - 1 ? 'past' : index === pregnancy.trimester - 1 ? 'current' : 'upcoming',
	}));
}

function createJourneyStage(stage) {
	const item = document.createElement('li');
	item.className = `journey-stage journey-stage-${stage.status}`;
	const marker = document.createElement('span');
	marker.className = 'journey-stage-marker';
	marker.setAttribute('aria-hidden', 'true');
	const content = document.createElement('div');
	content.className = 'journey-stage-content';
	const status = document.createElement('p');
	status.className = 'journey-stage-status';
	status.textContent = stage.status === 'current' ? 'You are here' : stage.status === 'past' ? 'Passed' : 'Ahead';
	const title = document.createElement('h3');
	title.textContent = stage.name;
	const details = document.createElement('p');
	details.className = 'journey-stage-details';
	details.textContent = `${stage.weeks} · Begins ${formatDisplayDate(stage.date)}`;
	const description = document.createElement('p');
	description.className = 'journey-stage-description';
	description.textContent = stage.description;
	content.append(status, title, details, description);
	item.append(marker, content);
	return item;
}

function renderJourneyTimeline() {
	const emptyState = document.querySelector('[data-journey-empty]');
	const context = document.querySelector('[data-journey-context]');
	const timeline = document.querySelector('#journey-timeline');
	emptyState.hidden = pregnancy.isConfigured;
	context.hidden = !pregnancy.isConfigured;
	timeline.hidden = !pregnancy.isConfigured;
	if (!pregnancy.isConfigured) {
		return;
	}

	const stages = getJourneyStages();
	const currentStage = stages[pregnancy.trimester - 1];
	document.querySelector('[data-journey-current-title]').textContent = pregnancy.dueDatePassed
		? 'The estimated due date has passed.'
		: `${formatDuration(pregnancy.gestationalWeek, 'week')}, ${formatDuration(pregnancy.gestationalDay, 'day')} · ${currentStage.name}`;
	document.querySelector('[data-journey-current-summary]').textContent = pregnancy.dueDatePassed
		? 'The timeline stays here as a record of the journey. Take the next steps with your care team.'
		: currentStage.description;
	timeline.replaceChildren(...stages.map(createJourneyStage));
}

function createMilestoneItem(milestone) {
	const item = document.createElement('article');
	item.className = 'milestone-item';
	const heading = document.createElement('div');
	heading.className = 'milestone-heading';
	const title = document.createElement('h3');
	title.textContent = milestone.title;
	const date = document.createElement('p');
	date.className = 'milestone-date';
	date.textContent = formatDisplayDate(parseDateInput(milestone.date));
	heading.append(title, date);
	item.append(heading);
	if (milestone.note) {
		const note = document.createElement('p');
		note.className = 'milestone-note';
		note.textContent = milestone.note;
		item.append(note);
	}
	const actions = document.createElement('div');
	actions.className = 'milestone-actions';
	[
		{ action: 'edit-milestone', label: 'Edit' },
		{ action: 'delete-milestone', label: 'Delete' },
	].forEach(({ action, label }) => {
		const button = document.createElement('button');
		button.type = 'button';
		button.className = action === 'delete-milestone' ? 'text-button danger-button' : 'text-button';
		button.dataset.action = action;
		button.dataset.id = milestone.id;
		button.textContent = label;
		actions.append(button);
	});
	item.append(actions);
	return item;
}

function renderMilestones() {
	const list = document.querySelector('#milestone-list');
	const sortedMilestones = [...milestones].sort((first, second) => first.date.localeCompare(second.date));
	list.replaceChildren(...sortedMilestones.map(createMilestoneItem));
	document.querySelector('[data-milestone-empty]').hidden = sortedMilestones.length > 0;
}

function renderJourney() {
	renderJourneyTimeline();
	renderMilestones();
}

function getDadModeContent() {
	if (!pregnancy.isConfigured) {
		return {
			understanding: 'Set an estimated due date in Settings to see guidance for this stage.',
			need: 'For now, start by asking what would make today feel a little easier.',
			actions: ['Ask how she is feeling and listen before offering solutions.', 'Take one practical task off her plate today.', 'Add helpful details to your private notes.'],
		};
	}

	const contentByTrimester = {
		1: {
			understanding: 'Early pregnancy can bring changeable energy and emotions. A steady, low-pressure presence may matter more than having answers.',
			need: 'Patience, rest, simple food or water, and space to have a slower day.',
			actions: ['Ask what sounds manageable before making plans.', 'Keep easy food and water within reach.', 'Take over one ordinary task without waiting to be asked.'],
		},
		2: {
			understanding: 'The middle months can feel more settled, while new discomforts and appointments become part of the rhythm. Keep making room for her changing energy.',
			need: 'Practical help, comfortable plans, and someone who remembers the small details.',
			actions: ['Check what kind of help would be useful today.', 'Plan outings with time to pause and get comfortable.', 'Keep appointment questions or reminders somewhere easy to find.'],
		},
		3: {
			understanding: 'Later pregnancy often asks more of her body and attention. Being prepared and easy to reach can make everyday decisions lighter.',
			need: 'More rest, comfort, flexibility, and calm help with preparation.',
			actions: ['Keep plans flexible around rest and comfort.', 'Work through one birth or hospital preparation task together.', 'Confirm the practical details for the next appointment.'],
		},
	};
	return contentByTrimester[pregnancy.trimester] || contentByTrimester[3];
}

function renderDadMode() {
	const content = getDadModeContent();
	const dadName = appState.dadName || 'Dad';
	document.querySelector('[data-dad-mode-heading]').textContent = pregnancy.isConfigured
		? `A little guidance for ${dadName}.`
		: 'Stay close to what matters today.';
	document.querySelector('[data-dad-mode-intro]').textContent = appState.momName
		? `A private, practical place to support ${appState.momName} through this stage.`
		: 'A private, practical place to support Mom through this stage.';
	document.querySelector('[data-dad-mom-name]').textContent = appState.momName || 'Not set';
	document.querySelector('[data-dad-pregnancy-age]').textContent = pregnancy.isConfigured
		? `${formatDuration(pregnancy.gestationalWeek, 'week')}, ${formatDuration(pregnancy.gestationalDay, 'day')}`
		: 'Not set';
	document.querySelector('[data-dad-trimester]').textContent = pregnancy.isConfigured ? `Trimester ${pregnancy.trimester}` : 'Not set';
	document.querySelector('[data-dad-understanding]').textContent = content.understanding;
	document.querySelector('[data-dad-mom-need]').textContent = content.need;
	document.querySelector('[data-dad-actions]').replaceChildren(...content.actions.map((action) => {
		const item = document.createElement('li');
		item.textContent = action;
		return item;
	}));
	dadNoteForm.elements.namedItem('note').value = dadNote;
}

function getTodayCheckin() {
	return checkins.find((checkin) => checkin.date === getLocalDateKey());
}

function fillTodayCheckin() {
	const todayCheckin = getTodayCheckin();
	checkinForm.reset();
	if (!todayCheckin) {
		return;
	}
	const feeling = checkinForm.querySelector(`input[name="feeling"][value="${todayCheckin.feeling}"]`);
	if (feeling) {
		feeling.checked = true;
	}
	todayCheckin.needs.forEach((need) => {
		const input = checkinForm.querySelector(`input[name="needs"][value="${need}"]`);
		if (input) {
			input.checked = true;
		}
	});
	checkinForm.elements.namedItem('note').value = todayCheckin.note;
}

function createCheckinHistoryItem(checkin) {
	const item = document.createElement('article');
	item.className = 'checkin-history-item';
	const date = document.createElement('p');
	date.className = 'checkin-history-date';
	date.textContent = checkin.date === getLocalDateKey() ? 'Today' : formatDisplayDate(parseDateInput(checkin.date));
	const feeling = document.createElement('h4');
	feeling.textContent = checkin.feeling;
	item.append(date, feeling);
	if (checkin.needs.length > 0) {
		const needs = document.createElement('p');
		needs.className = 'checkin-history-needs';
		needs.textContent = `Would help: ${checkin.needs.join(', ')}`;
		item.append(needs);
	}
	if (checkin.note) {
		const note = document.createElement('p');
		note.className = 'checkin-history-note';
		note.textContent = checkin.note;
		item.append(note);
	}
	return item;
}

function renderCheckin() {
	const todayCheckin = getTodayCheckin();
	const historyList = document.querySelector('#checkin-history-list');
	const sortedCheckins = [...checkins].sort((first, second) => second.date.localeCompare(first.date));
	historyList.replaceChildren(...sortedCheckins.map(createCheckinHistoryItem));
	document.querySelector('[data-checkin-empty]').hidden = sortedCheckins.length > 0;
	fillTodayCheckin();
	document.querySelector('[data-mom-care-heading]').textContent = appState.momName
		? `How are you feeling today, ${appState.momName}?`
		: 'How are you feeling today?';
	document.querySelector('[data-mom-supporting-copy]').textContent = appState.dadName
		? `A small daily check-in for ${appState.dadName} to listen and support.`
		: 'A small daily check-in to help Dad listen and support.';
	return todayCheckin;
}

function saveTodayCheckin(event) {
	event.preventDefault();
	const formData = new FormData(checkinForm);
	const savedCheckin = {
		date: getLocalDateKey(),
		feeling: formData.get('feeling'),
		needs: formData.getAll('needs'),
		note: String(formData.get('note') || '').trim(),
	};
	checkins = checkins.some((checkin) => checkin.date === savedCheckin.date)
		? checkins.map((checkin) => checkin.date === savedCheckin.date ? savedCheckin : checkin)
		: [...checkins, savedCheckin];
	saveCheckins();
	renderCheckin();
	renderHome();
	const message = document.querySelector('#checkin-save-message');
	message.textContent = 'Today\'s check-in saved.';
	window.setTimeout(() => { message.textContent = ''; }, 1800);
}

function createAppointmentId() {
	return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
		? crypto.randomUUID()
		: `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatAppointmentTime(value) {
	const [hour, minute] = value.split(':').map(Number);
	return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date(2000, 0, 1, hour, minute));
}

function getAppointmentTimestamp(appointment) {
	const date = parseDateInput(appointment.date);
	if (!date || !/^\d{2}:\d{2}$/.test(appointment.time)) {
		return Number.POSITIVE_INFINITY;
	}
	const [hour, minute] = appointment.time.split(':').map(Number);
	date.setHours(hour, minute, 0, 0);
	return date.getTime();
}

function getAppointmentGroups() {
	const now = Date.now();
	const upcoming = appointments
		.filter((appointment) => !appointment.completed && getAppointmentTimestamp(appointment) >= now)
		.sort((first, second) => getAppointmentTimestamp(first) - getAppointmentTimestamp(second));
	const past = appointments
		.filter((appointment) => appointment.completed || getAppointmentTimestamp(appointment) < now)
		.sort((first, second) => getAppointmentTimestamp(second) - getAppointmentTimestamp(first));
	return { upcoming, past };
}

function saveAppointments() {
	try {
		localStorage.setItem(appointmentsStorageKey, JSON.stringify(appointments));
	} catch (error) {
		console.warn('Albanuun appointments could not be saved.', error);
	}
}

function loadAppointments() {
	try {
		const savedAppointments = JSON.parse(localStorage.getItem(appointmentsStorageKey));
		if (Array.isArray(savedAppointments)) {
			appointments = savedAppointments
				.filter((appointment) => appointment && typeof appointment === 'object')
				.map((appointment) => ({
					id: typeof appointment.id === 'string' ? appointment.id : createAppointmentId(),
					title: typeof appointment.title === 'string' ? appointment.title : '',
					date: typeof appointment.date === 'string' ? appointment.date : '',
					time: typeof appointment.time === 'string' ? appointment.time : '',
					provider: typeof appointment.provider === 'string' ? appointment.provider : '',
					location: typeof appointment.location === 'string' ? appointment.location : '',
					notes: typeof appointment.notes === 'string' ? appointment.notes : '',
					questions: typeof appointment.questions === 'string' ? appointment.questions : '',
					completed: appointment.completed === true,
				}));
		}
	} catch (error) {
		console.warn('Albanuun appointments could not be loaded.', error);
	}
}

function addAppointmentDetail(parent, label, value) {
	if (!value) {
		return;
	}
	const detail = document.createElement('span');
	detail.className = 'appointment-detail';
	detail.textContent = `${label}: ${value}`;
	parent.append(detail);
}

function createAppointmentCard(appointment) {
	const card = document.createElement('article');
	card.className = `appointment-card${appointment.completed ? ' is-completed' : ''}`;

	const heading = document.createElement('div');
	heading.className = 'appointment-card-heading';
	const title = document.createElement('h3');
	title.textContent = appointment.title;
	heading.append(title);
	if (appointment.completed) {
		const status = document.createElement('span');
		status.className = 'appointment-status';
		status.textContent = 'Completed';
		heading.append(status);
	}
	card.append(heading);

	const when = document.createElement('p');
	when.className = 'appointment-when';
	when.textContent = `${formatDisplayDate(parseDateInput(appointment.date))} at ${formatAppointmentTime(appointment.time)}`;
	card.append(when);

	const details = document.createElement('div');
	details.className = 'appointment-details';
	addAppointmentDetail(details, 'Provider', appointment.provider);
	addAppointmentDetail(details, 'Location', appointment.location);
	addAppointmentDetail(details, 'Notes', appointment.notes);
	addAppointmentDetail(details, 'Questions', appointment.questions);
	card.append(details);

	const actions = document.createElement('div');
	actions.className = 'appointment-actions';
	[
		{ action: 'toggle-appointment', label: appointment.completed ? 'Mark upcoming' : 'Mark completed' },
		{ action: 'edit-appointment', label: 'Edit' },
		{ action: 'delete-appointment', label: 'Delete' },
	].forEach(({ action, label }) => {
		const button = document.createElement('button');
		button.type = 'button';
		button.className = action === 'delete-appointment' ? 'text-button danger-button' : 'text-button';
		button.dataset.action = action;
		button.dataset.id = appointment.id;
		button.textContent = label;
		actions.append(button);
	});
	card.append(actions);
	return card;
}

function renderAppointments() {
	const { upcoming, past } = getAppointmentGroups();
	const upcomingList = document.querySelector('#upcoming-appointments');
	const pastList = document.querySelector('#past-appointments');
	upcomingList.replaceChildren(...upcoming.map(createAppointmentCard));
	pastList.replaceChildren(...past.map(createAppointmentCard));
	document.querySelector('[data-upcoming-count]').textContent = upcoming.length;
	document.querySelector('[data-past-count]').textContent = past.length;
	document.querySelector('[data-upcoming-empty]').hidden = upcoming.length > 0;
	document.querySelector('[data-past-empty]').hidden = past.length > 0;
}

function renderHomeAppointment() {
	const { upcoming } = getAppointmentGroups();
	const title = document.querySelector('[data-home-appointment-title]');
	const details = document.querySelector('[data-home-appointment-details]');
	const viewButton = document.querySelector('[data-action="view-care"]');
	const nextAppointment = upcoming[0];
	if (!nextAppointment) {
		title.textContent = 'Nothing scheduled yet.';
		details.textContent = 'Appointments you add later will appear here.';
		viewButton.hidden = true;
		return;
	}
	title.textContent = nextAppointment.title;
	details.textContent = `${formatDisplayDate(parseDateInput(nextAppointment.date))} at ${formatAppointmentTime(nextAppointment.time)}${nextAppointment.provider ? ` · ${nextAppointment.provider}` : ''}`;
	viewButton.hidden = false;
}

function renderHome() {
	const isConfigured = pregnancy.isConfigured;
	renderHomeAppointment();
	const todayCheckin = renderCheckin();
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
	document.querySelectorAll('[data-home-feeling]').forEach((button) => {
		button.setAttribute('aria-pressed', todayCheckin?.feeling === button.dataset.homeFeeling ? 'true' : 'false');
	});
	document.querySelector('[data-dad-heading]').textContent = appState.dadName
		? `For Dad, ${appState.dadName}`
		: 'For Dad';
}

function setCareFeature(featureName) {
	document.querySelectorAll('[data-care-feature]').forEach((feature) => {
		feature.hidden = feature.dataset.careFeature !== featureName;
	});
	document.querySelectorAll('.care-switcher-button').forEach((button) => {
		const isSelected = button.dataset.action === `show-${featureName}`;
		if (button.classList.contains('care-switcher-button')) {
			button.classList.toggle('active', isSelected);
			button.setAttribute('aria-selected', isSelected ? 'true' : 'false');
		}
	});
}

function saveDadNoteFromForm(event) {
	event.preventDefault();
	dadNote = String(new FormData(dadNoteForm).get('note') || '').trim();
	saveDadNote();
	const message = document.querySelector('#dad-note-save-message');
	message.textContent = 'Note saved on this device.';
	window.setTimeout(() => { message.textContent = ''; }, 1800);
}

function clearDadNote() {
	dadNote = '';
	dadNoteForm.elements.namedItem('note').value = '';
	saveDadNote();
	const message = document.querySelector('#dad-note-save-message');
	message.textContent = 'Note cleared.';
	window.setTimeout(() => { message.textContent = ''; }, 1800);
}

function loadSettings() {
	try {
		const savedSettings = JSON.parse(localStorage.getItem(storageKey));
		Object.keys(appState).forEach((key) => {
			appState[key] = savedSettings && typeof savedSettings[key] === 'string' ? savedSettings[key] : null;
		});
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

function openResetDialog() {
	resetDialog.showModal();
}

function closeResetDialog() {
	resetDialog.close();
}

function resetAllData() {
	albanuunStorageKeys.forEach((key) => localStorage.removeItem(key));
	Object.keys(appState).forEach((key) => {
		appState[key] = null;
	});
	appointments = [];
	checkins = [];
	dadNote = '';
	milestones = [];
	refreshPregnancy();
	renderHome();
	renderAppointments();
	renderCheckin();
	renderDadMode();
	renderJourney();
	settingsDialog.close();
	resetDialog.close();
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
	renderDadMode();
	renderJourney();

	const saveMessage = document.querySelector('#save-message');
	saveMessage.textContent = 'Details saved on this device.';
	window.setTimeout(() => {
		closeSettings();
		saveMessage.textContent = '';
	}, 700);
}

function setActiveView(viewName, careFeature = 'mom') {
	document.querySelectorAll('[data-view]').forEach((link) => {
		const isActive = link.dataset.view === viewName;
		link.classList.toggle('active', isActive);
		if (isActive) {
			link.setAttribute('aria-current', 'page');
		} else {
			link.removeAttribute('aria-current');
		}
	});
	Object.entries(views).forEach(([name, view]) => {
		view.hidden = name !== viewName;
	});
	if (viewName === 'care') {
		setCareFeature(careFeature);
	}
}

function openMilestoneForm(milestoneId = null) {
	editingMilestoneId = milestoneId;
	milestoneForm.reset();
	const milestone = milestones.find((item) => item.id === milestoneId);
	if (milestone) {
		milestoneForm.elements.namedItem('title').value = milestone.title;
		milestoneForm.elements.namedItem('date').value = milestone.date;
		milestoneForm.elements.namedItem('note').value = milestone.note;
	}
	document.querySelector('#milestone-form-title').textContent = milestone ? 'Edit a first' : 'Add a first';
	milestoneDialog.showModal();
}

function closeMilestoneForm() {
	milestoneDialog.close();
	editingMilestoneId = null;
}

function saveMilestone(event) {
	event.preventDefault();
	const formData = new FormData(milestoneForm);
	const savedMilestone = {
		id: editingMilestoneId || createAppointmentId(),
		title: String(formData.get('title') || '').trim(),
		date: String(formData.get('date') || ''),
		note: String(formData.get('note') || '').trim(),
	};
	if (editingMilestoneId) {
		milestones = milestones.map((milestone) => milestone.id === editingMilestoneId ? savedMilestone : milestone);
	} else {
		milestones.push(savedMilestone);
	}
	saveMilestones();
	renderMilestones();
	closeMilestoneForm();
}

function deleteMilestone(milestoneId) {
	const milestone = milestones.find((item) => item.id === milestoneId);
	if (!milestone || !window.confirm(`Delete "${milestone.title}"?`)) {
		return;
	}
	milestones = milestones.filter((item) => item.id !== milestoneId);
	saveMilestones();
	renderMilestones();
}

function openAppointmentForm(appointmentId = null) {
	editingAppointmentId = appointmentId;
	appointmentForm.reset();
	const appointment = appointments.find((item) => item.id === appointmentId);
	if (appointment) {
		Object.keys(appointment).forEach((key) => {
			const field = appointmentForm.elements.namedItem(key);
			if (field && typeof appointment[key] === 'string') {
				field.value = appointment[key];
			}
		});
	}
	document.querySelector('#appointment-form-title').textContent = appointment ? 'Edit appointment' : 'Add appointment';
	appointmentDialog.showModal();
}

function closeAppointmentForm() {
	appointmentDialog.close();
	editingAppointmentId = null;
}

function saveAppointment(event) {
	event.preventDefault();
	const formData = new FormData(appointmentForm);
	const details = Object.fromEntries(['title', 'date', 'time', 'provider', 'location', 'notes', 'questions'].map((key) => {
		const value = formData.get(key);
		return [key, typeof value === 'string' ? value.trim() : ''];
	}));
	const existingAppointment = appointments.find((appointment) => appointment.id === editingAppointmentId);
	const savedAppointment = {
		id: editingAppointmentId || createAppointmentId(),
		...details,
		completed: existingAppointment ? existingAppointment.completed : false,
	};
	if (existingAppointment) {
		appointments = appointments.map((appointment) => appointment.id === editingAppointmentId ? savedAppointment : appointment);
	} else {
		appointments.push(savedAppointment);
	}
	saveAppointments();
	renderAppointments();
	renderHomeAppointment();
	closeAppointmentForm();
}

function toggleAppointment(appointmentId) {
	appointments = appointments.map((appointment) => appointment.id === appointmentId
		? { ...appointment, completed: !appointment.completed }
		: appointment);
	saveAppointments();
	renderAppointments();
	renderHomeAppointment();
}

function deleteAppointment(appointmentId) {
	const appointment = appointments.find((item) => item.id === appointmentId);
	if (!appointment || !window.confirm(`Delete "${appointment.title}"?`)) {
		return;
	}
	appointments = appointments.filter((item) => item.id !== appointmentId);
	saveAppointments();
	renderAppointments();
	renderHomeAppointment();
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

document.querySelectorAll('[data-action="view-care"]').forEach((button) => {
	button.addEventListener('click', () => setActiveView('care', 'appointments'));
});

document.querySelectorAll('[data-action="view-mom"]').forEach((button) => {
	button.addEventListener('click', () => {
		setActiveView('care', 'mom');
		forMomSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
	});
});

document.querySelectorAll('[data-action="show-mom"]').forEach((button) => {
	button.addEventListener('click', () => setCareFeature('mom'));
});

document.querySelectorAll('[data-action="show-dad"]').forEach((button) => {
	button.addEventListener('click', () => setCareFeature('dad'));
});

document.querySelectorAll('[data-action="show-appointments"]').forEach((button) => {
	button.addEventListener('click', () => setCareFeature('appointments'));
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

document.querySelector('[data-action="open-reset"]').addEventListener('click', openResetDialog);
document.querySelector('[data-action="close-reset"]').addEventListener('click', closeResetDialog);
document.querySelector('[data-action="confirm-reset"]').addEventListener('click', resetAllData);
resetDialog.addEventListener('click', (event) => {
	if (event.target === resetDialog) {
		closeResetDialog();
	}
});

document.querySelectorAll('[data-action="add-appointment"]').forEach((button) => {
	button.addEventListener('click', () => openAppointmentForm());
});

document.querySelectorAll('[data-action="close-appointment"]').forEach((button) => {
	button.addEventListener('click', closeAppointmentForm);
});

appointmentForm.addEventListener('submit', saveAppointment);
appointmentDialog.addEventListener('click', (event) => {
	if (event.target === appointmentDialog) {
		closeAppointmentForm();
	}
});

document.querySelector('[data-action="add-milestone"]').addEventListener('click', () => openMilestoneForm());
document.querySelectorAll('[data-action="close-milestone"]').forEach((button) => {
	button.addEventListener('click', closeMilestoneForm);
});
milestoneForm.addEventListener('submit', saveMilestone);
milestoneDialog.addEventListener('click', (event) => {
	if (event.target === milestoneDialog) {
		closeMilestoneForm();
	}
});

journeyView.addEventListener('click', (event) => {
	const button = event.target.closest('[data-action]');
	if (!button) {
		return;
	}
	if (button.dataset.action === 'edit-milestone') {
		openMilestoneForm(button.dataset.id);
	}
	if (button.dataset.action === 'delete-milestone') {
		deleteMilestone(button.dataset.id);
	}
});

careView.addEventListener('click', (event) => {
	const button = event.target.closest('[data-action]');
	if (!button || !button.dataset.id) {
		return;
	}
	if (button.dataset.action === 'edit-appointment') {
		openAppointmentForm(button.dataset.id);
	}
	if (button.dataset.action === 'toggle-appointment') {
		toggleAppointment(button.dataset.id);
	}
	if (button.dataset.action === 'delete-appointment') {
		deleteAppointment(button.dataset.id);
	}
});

document.querySelectorAll('[data-home-feeling]').forEach((button) => {
	button.addEventListener('click', () => {
		document.querySelectorAll('[data-home-feeling]').forEach((option) => {
			option.setAttribute('aria-pressed', option === button ? 'true' : 'false');
		});
	});
});

checkinForm.addEventListener('submit', saveTodayCheckin);
dadNoteForm.addEventListener('submit', saveDadNoteFromForm);
document.querySelector('[data-action="clear-dad-note"]').addEventListener('click', clearDadNote);

loadSettings();
loadAppointments();
loadCheckins();
loadDadNote();
loadMilestones();
refreshPregnancy();
renderHome();
renderDadMode();
renderJourney();
renderAppointments();
renderCheckin();
setActiveView('home');

window.albanuun = {
	appState,
	calculatePregnancy,
	getPregnancy: () => calculatePregnancy(appState),
	get pregnancy() {
		return pregnancy;
	},
};
