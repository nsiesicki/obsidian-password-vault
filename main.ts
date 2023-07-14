import { App, ButtonComponent, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, WorkspaceLeaf, FileView } from 'obsidian';
import * as encryption from './src/Encryption'
import { SampleSettingTab } from './src/SettingsPlugin'

const envPath = (app.vault.adapter as any).basePath + "/.obsidian/plugins/obsidian-password-vault/.env"
require('dotenv').config({path: envPath})
console.log(process.env)

interface PasswordVaultSettings {
	file_name: string;
}

const DEFAULT_SETTINGS: PasswordVaultSettings = {
	file_name: 'passwords',
}

export default class PasswordVaultPlugin extends Plugin {
	settings: PasswordVaultSettings;

	async onload() {
		await this.loadSettings();

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'password-vault-execute',
			name: 'Encryprt/Decrypt Passwords',
			callback: () => {
				encryption.checkPasswordSetup(this.app, this.settings)
				encryption.runEncryption(this.settings);
			}
		});

		const ribbonIconEl = this.addRibbonIcon('lock', 'PasswordVaultPlugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			encryption.checkPasswordSetup(this.app, this.settings)
			encryption.runEncryption(this.settings);
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {
		//Pass
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}