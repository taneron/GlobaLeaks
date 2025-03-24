



## UI Update-Flow

On Build Repo
1. Create a build on ./client by running `grunt build``
2. Zip it `zip js.zip build/js/*`
3. Download the js.zip file
4. On Local Computer: Upload it either by drag and drop on vscode or by `scp -i  ~/.ssh/id_rsa_vg ~/Downloads/js.zip  admin@3.65.210.230:~/js.zip`
5. On Server backup `sudo cp -r /usr/share/globaleaks/client/js /usr/share/globaleaks/client/js-old`
6. Remove `sudo rm /usr/share/globaleaks/client/js/*`
7. `unzip ~/js.zip -d /usr/share/globaleaks/client/js`
8. `sudo mv /usr/share/globaleaks/client/js/build/js/* /usr/share/globaleaks/client/js/`