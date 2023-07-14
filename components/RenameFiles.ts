
//This function rename files in the vault folder. 
export function renameFiles (oldName: string, newName: string){
    const Path = require('path');
    const vaultPath = (app.vault.adapter as any).basePath;
    const { promises: Fs } = require('fs');
    const oldPath = Path.join(vaultPath, oldName);  
    const newPath = Path.join(vaultPath, newName);
    try {
        Fs.rename(oldPath, newPath);
    } catch (err) {
        console.error("Error when renaming the file due to a settings change.");
		throw new Error(err);
    }
}