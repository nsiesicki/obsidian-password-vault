import { App, PluginSettingTab, Setting } from 'obsidian';
import {renameFiles} from './RenameFiles'


export class SampleSettingTab extends PluginSettingTab {
	file_name: string;
    plugin: any;

	constructor(app: App, plugin: any) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;
		this.file_name = this.plugin.settings.file_name;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Password Storage Settings'});

		new Setting(containerEl)
			.setName('File Name')
			.setDesc('This is the file name used to save passwords. If the password file exists will be renamed.')
			.addText(text => text
				.setPlaceholder('Enter the file_name')
				.setValue(this.plugin.settings.file_name)
				.onChange(async (value) => {
					this.file_name = value;
	    }));

		new Setting(containerEl)
			.addButton((btn) =>
				btn
				.setButtonText("SAVE")
				.setCta()
				.onClick(async () => {

					//List files in a Vault.
					const vaultPath = (app.vault.adapter as any).basePath
					var fs = require('fs');
					var files = fs.readdirSync(vaultPath);

					//This conditional renames the passwords file.
					if (this.plugin.settings.file_name != this.file_name) {
						
						// console.log('Secret: ' + this.file_name);
						if (files.indexOf(this.plugin.settings.file_name + ".md.encrypted") >= 0){
                            await renameFiles(this.plugin.settings.file_name + ".md.encrypted", this.file_name + ".md.encrypted");
						}else if (files.indexOf(this.plugin.settings.file_name + ".md") >= 0){
							//Rename the file.
                            await renameFiles(this.plugin.settings.file_name + ".md", this.file_name + ".md");
						}else{
							const Path = require('path')
							const newPath = Path.join(vaultPath, this.file_name + ".md")
							fs.writeFile(newPath, '--- \n### Welcome to the password note.\n\n Please start adding your passwords to this file.\n IMPORTANT: DO not modify when encrypted. The file will be hidden after encryption\n\n\n\n---', 
								function (err: any, file: any) {
								if (err) throw err;
								console.log('New File Created');
							});
						}

						//Save new file_name
						this.plugin.settings.file_name = this.file_name;
						await this.plugin.saveSettings();

					}
				}));
	}
}
