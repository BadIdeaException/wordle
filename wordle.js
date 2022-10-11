'use strict'

let attempt = 0;
let j = 0;

let word = '';
let input = '';

function type(key) {
	if (j > 4) return;
	let tgt = document.getElementById(`place-${attempt}-${j++}`);
	tgt.innerText = key.dataset.letter;
	input += key.dataset.letter;
}

function backspace() {
	let tgt = document.getElementById(`place-${attempt}-${--j}`);
	tgt.innerText = '';
	input = input.slice(0, -1);
}

function enter() {
	if (j < 5 || !GUESSES.includes(input)) {
		let places = Array.from([0,1,2,3,4].map(index => document.getElementById(`place-${attempt}-${index}`)));
		places.forEach(place => {
			place.classList.add('shaking');		
			let shake = place.getAnimations()[0];
			shake.onfinish = () => place.classList.remove('shaking');
		});
		return;
	}

	let results = rate(input, word);
	for (let i = 0; i < j; i++) {
		document.getElementById(`place-${attempt}-${i}`).classList.add(results[i]);		
	}
	if (results.every(result => result === 'correct'))
		return win();
	else
		for (let i = 0; i < j; i++) document.getElementById(`key-${input[i]}`).classList.add(results[i]);

	attempt++;
	j = 0;
	input = '';
	if (attempt > 5)
		lose();
}

function clearAll() {
	while (j > 0)
		backspace();
}

function rate(input, word) {
	input = input.toUpperCase();
	word = word.toUpperCase();
	return [...input].map((character, index) => 
		word[index] === character ? 
		'correct' : 
		{ true: 'misplaced', false: 'wrong' }[word.includes(character)]
	)
}

function init() {
	document.getElementById('resultscreen').classList.add('hidden');
	document.getElementById('board').classList.remove('hidden');
	document.getElementById(`keyboard`).classList.remove('hidden');

	Array.from(document.getElementsByClassName('place')).forEach(element => {
		element.innerText = '';
		['correct', 'misplaced', 'wrong'].forEach(rating => element.classList.remove(rating));
	});
	Array.from(document.getElementsByClassName('key')).forEach(element => {
		['correct', 'misplaced', 'wrong'].forEach(rating => element.classList.remove(rating));
	});

	attempt = 0;
	j = 0;
	input = '';
	word = WORDS[Math.floor(Math.random() * WORDS.length)];
}

function win() {
	document.getElementById('win').classList.remove('hidden');
	document.getElementById('lose').classList.add('hidden');
	document.getElementById('resultscreen').classList.remove('hidden');
	document.getElementById(`keyboard`).classList.add('hidden');
}

function lose() {
	document.getElementById('win').classList.add('hidden');
	document.getElementById('lose').classList.remove('hidden');
	document.getElementById('solution').innerText = word.toUpperCase();
	document.getElementById('resultscreen').classList.remove('hidden');
	document.getElementById(`keyboard`).classList.add('hidden');
}