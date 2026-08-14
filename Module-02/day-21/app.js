const STORAGE_KEY = 'signup';
const ETHIOPIAN_PHONE_REGEX = /^(?:\+251|251|0)?[79]\d{8}$/;

const signupForm = document.getElementById('signup-form');
const nameInput = document.getElementById('full-name');
const phoneInput = document.getElementById('phone-number');
const errorMessageDiv = document.getElementById('error-message');
const signupCounterDiv = document.getElementById('signup-counter');

function getStoredSignups() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function updateSignupCount() {
  const signups = getStoredSignups();
  const count = signups.length;
  signupCounterDiv.textContent = `${count} ${count === 1 ? 'person has' : 'people have'} signed up.`;
}

function handleFormSubmit(event) {
  event.preventDefault();

  const trimmedName = nameInput.value.trim();
  const trimmedPhone = phoneInput.value.trim();

  errorMessageDiv.textContent = '';

  if (trimmedName.length < 2) {
    errorMessageDiv.textContent = 'Name must be at least two characters long.';
    return;
  }

  if (!ETHIOPIAN_PHONE_REGEX.test(trimmedPhone)) {
    errorMessageDiv.textContent = 'Please enter a valid Ethiopian phone number (e.g., 0912345678 or +251912345678).';
    return;
  }

  const currentSignups = getStoredSignups();
  const newEntry = { name: trimmedName, phone: trimmedPhone, timestamp: new Date().toISOString() };
  currentSignups.push(newEntry);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSignups));

  signupForm.reset();
  updateSignupCount();
}

document.addEventListener('DOMContentLoaded', () => {
  updateSignupCountUI();
  signupForm.addEventListener('submit', handleFormSubmit);
});