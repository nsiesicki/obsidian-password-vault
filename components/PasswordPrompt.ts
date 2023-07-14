import { App, Modal } from 'obsidian';

/* How to implement it.
new PasswordPrompt(this.app, (password: String) => {
	new Notice(`Your password is: ${password}`);
  }).open();
*/
export class PasswordPrompt extends Modal {

	onSubmit: (password: string) => void;

	constructor(app: App, onSubmit: (password: string) => void) {
		super(app);
		this.onSubmit = onSubmit;
	}

	onOpen() {
		//Initialise a empty modal to contain the password prompt.
		const { contentEl } = this;

		contentEl.createEl("h1", { text: "Password" });

		//make a div for user's pw input
		const inputPwContainerEl = contentEl.createDiv();
		const pwInputEl = inputPwContainerEl.createEl('input', { type: 'password', value: '' });
		pwInputEl.placeholder = 'Please enter your password';
		pwInputEl.style.width = '90%';
		pwInputEl.style.marginLeft = '5%';
		pwInputEl.focus();


		//message modal - to fire if either input is empty
		const messageCheckPwd = contentEl.createDiv();
		messageCheckPwd.style.marginTop = '1em';
		messageCheckPwd.style.marginLeft = '7%';
		messageCheckPwd.style.color = 'red';
		messageCheckPwd.setText('Please check your password.');
		messageCheckPwd.hide();

		//make a submit button for the crypto operation
		const buttonContainerEl = contentEl.createDiv();
		const confirmBtnEl = buttonContainerEl.createEl('button', { text: 'Submit' });
		confirmBtnEl.style.float = 'right';
		confirmBtnEl.style.marginTop = '2rem';
		confirmBtnEl.style.marginBottom = '2rem';
		confirmBtnEl.style.marginRight = '7%';
		confirmBtnEl.style.width = '20%';
		confirmBtnEl.style.background = '#8C52FF';

		//confirmBtnEl.style.marginLeft = '1em';
		const btn_onClick = (ev: any) => {
			ev.preventDefault();

			if ((pwInputEl.value == '') || (pwInputEl.value == null) || ((pwInputEl.value.length < 8))) {
				messageCheckPwd.show();
			} else {
				this.close();
				this.onSubmit(pwInputEl.value);
			}
		};

		confirmBtnEl.addEventListener('click', btn_onClick);

		//allow enter to submit
		const enterSubmits = function (ev: any, value: any) {
			if ((ev.code === 'Enter' || ev.code === 'NumpadEnter')
				&& value.length > 0
				&& confirmBtnEl.disabled === false) {
				ev.preventDefault();
				confirmBtnEl.click();
			} else {
				messageCheckPwd.hide();
			}
		};

		pwInputEl.addEventListener('keypress', function (ev) { enterSubmits(ev, pwInputEl.value); });

	}

	onClose() {
		let { contentEl } = this;
		contentEl.empty();
	}
}


export class NewPasswordPrompt extends Modal {

	onSubmit: (password: string) => void;

	constructor(app: App, onSubmit: (password: string) => void) {
		super(app);
		this.onSubmit = onSubmit;
	}

	onOpen() {
		//Initialise a empty modal to contain the password prompt.
		const { contentEl } = this;

		contentEl.createEl("h1", { text: "New Password" });

		//make a div for user's pw input
		const inputPwContainerEl = contentEl.createDiv();
		const pwInputEl = inputPwContainerEl.createEl('input', { type: 'password', value: '' });
		pwInputEl.placeholder = 'Please enter your password';
		pwInputEl.style.width = '90%';
		pwInputEl.style.marginLeft = '5%';
		pwInputEl.focus();

		//make a div for user's pw input
		const inputCnfPwContainerEl = contentEl.createDiv();
		const inputPwCnfEl = inputCnfPwContainerEl.createEl('input', { type: 'password', value: '' });
		inputPwCnfEl.placeholder = 'Please confirm your password';
		inputPwCnfEl.style.width = '90%';
		inputPwCnfEl.style.marginLeft = '5%';
		inputPwCnfEl.style.marginTop = '2%';
		inputPwCnfEl.focus();


		//message modal - to fire if either input is empty
		const messageCheckPwd = contentEl.createDiv();
		messageCheckPwd.style.marginTop = '1em';
		messageCheckPwd.style.marginLeft = '7%';
		messageCheckPwd.style.color = 'red';
		messageCheckPwd.setText('Please check your password. Recommendations: Both passwords must be the same, use at least 8 characters, including upper case, lower case, numbers and special characters such as ! or @');
		messageCheckPwd.hide();

		//make a submit button for the crypto operation
		const buttonContainerEl = contentEl.createDiv();
		const confirmBtnEl = buttonContainerEl.createEl('button', { text: 'Submit' });
		confirmBtnEl.style.float = 'right';
		confirmBtnEl.style.marginTop = '2rem';
		confirmBtnEl.style.marginBottom = '2rem';
		confirmBtnEl.style.marginRight = '7%';
		confirmBtnEl.style.width = '20%';
		confirmBtnEl.style.background = '#8C52FF';

		//confirmBtnEl.style.marginLeft = '1em';
		const btn_onClick = (ev: any) => {
			ev.preventDefault();

			if ((pwInputEl.value == '') || (pwInputEl.value == null) || (pwInputEl.value.length < 8) || (inputPwCnfEl.value == '') || (inputPwCnfEl.value == null) || (inputPwCnfEl.value.length < 8)) {
				messageCheckPwd.show();
			} else if (pwInputEl.value !== inputPwCnfEl.value){
				messageCheckPwd.show();
			}
			else {
				this.close();
				this.onSubmit(pwInputEl.value);
			}
		};

		confirmBtnEl.addEventListener('click', btn_onClick);

		//allow enter to submit
		const enterSubmits = function (ev: any, value: any) {
			if ((ev.code === 'Enter' || ev.code === 'NumpadEnter')
				&& value.length > 0
				&& confirmBtnEl.disabled === false) {
				ev.preventDefault();
				confirmBtnEl.click();
			} else {
				messageCheckPwd.hide();
			}
		};

		pwInputEl.addEventListener('keypress', function (ev) { enterSubmits(ev, pwInputEl.value); });

	}

	onClose() {
		let { contentEl } = this;
		contentEl.empty();
	}
}
