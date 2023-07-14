import { App, WorkspaceLeaf, Notice, FileView} from 'obsidian';
import { PasswordPrompt, NewPasswordPrompt } from './PasswordPrompt';
import * as cryptoSource from './cryptsidian'; //does this need to be converted w/ path for x-OS?
import {renameFiles} from './RenameFiles'

/* How to implement it.
new PasswordPrompt(this.app, (password: String) => {
	new Notice(`Your password is: ${password}`);
  }).open();
*/

function checkOperation (file_name: string){
  
  var fs = require('fs');
  const vaultPath = (app.vault.adapter as any).basePath
  var files = fs.readdirSync(vaultPath);
  
  if (files.indexOf(file_name + ".md.encrypted") >= 0){
    return 'DECRYPT' 
  }else if (files.indexOf(file_name + ".md") >= 0){
    return 'ENCRYPT' 
  }else{
    new Notice("No password file found. Please, check the plugin settings");
    return 'NO_FILE'
  }
}

export function runEncryption (settings: any) {
  var operation: string;
  operation = checkOperation(settings.file_name);
  console.log(operation);
  
  if (operation !== 'NO_FILE'){
    new PasswordPrompt(this.app, (password: string) => {

      var aes256 = require('aes256');
      
      var decryptedPlainText = aes256.decrypt(password, process.env.pwSECRET);
      // console.log(`Password: ${password}, Decrypted: ${decryptedPlainText} and Original: ${process.env.SECRET_KEY}`)

      if (process.env.SECRET_KEY == decryptedPlainText){

        if (operation == 'DECRYPT'){
          new Notice(`Password correct, your data was decrypted.`);
          renameFiles(settings.file_name + ".md.encrypted", settings.file_name + ".md");
        }else {
          new Notice(`Password correct, your data was encrypted.`);
        }

        //derive the secret key via scrypt from user's password.
        cryptoSource.setUserSecretKey(password); 
        
        //Close open notes to prevent post-encryption access, which can corrupt files and make them irrecoverable
        const emptyLeaf = async (leaf: WorkspaceLeaf): Promise<void> => {
          leaf.setViewState({type:'empty'});
        }

        const closeLeaves = async (): Promise<void> => { // we use this function construction to get async/await and keep the right "this"
          let leaves: WorkspaceLeaf[] = [];

          this.app.workspace.iterateAllLeaves( (leaf: any) => {
            leaves.push(leaf);
          });

          for (const leaf of leaves){
            if( leaf.view instanceof FileView ){
              await emptyLeaf(leaf);
              leaf.detach();
            }
          }
        }

        const processFiles = async (): Promise<void> => {
          await closeLeaves();
          cryptoSource.fileProcessor(files, operation); 

          if (operation == 'ENCRYPT'){
            renameFiles(settings.file_name + ".md", settings.file_name + ".md.encrypted");
          }
        }
        
        //run the encryption or decryption
        const vaultPath = (app.vault.adapter as any).basePath
        let files = cryptoSource.getVaultFiles(vaultPath, settings.file_name);
        // console.log(files)
        processFiles();

      }else{
        new Notice(`Please, check your password.`);

      }
    }).open();
  }
}


//This functions will enable the script to work with passwords and check the password is correct before execute any encryption/decription process. 
//IMPORTANT: The user password is not saved in the script at anytime. 
function generatePassword(length: number) {
  var charset = "!@-+=?abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

export function checkPasswordSetup(app: App, settings: any){

  var update_file: boolean;
  update_file = false;

  if  (process.env.SECRET_KEY == ""){
    process.env.SECRET_KEY = generatePassword(20)
  }

  if ((process.env.pwSECRET == "")){
    
    var aes256 = require('aes256');

    new NewPasswordPrompt(app, (password: string) => {
    
      var encryptedPassword = aes256.encrypt(password, process.env.SECRET_KEY);
      process.env.pwSECRET = encryptedPassword
      
      //Write it in .env file.
      var fs = require('fs');
      const envPath = (app.vault.adapter as any).basePath + "/.obsidian/plugins/obsidian-password-vault/.env"
      fs.writeFile(envPath, `pwSECRET="${process.env.pwSECRET}"\nSECRET_KEY="${process.env.SECRET_KEY}"`, 
      function (err: any, file: any) {
        if (err) throw err;
        // console.log('Password Updated');
      });						

    }).open();
  }
};