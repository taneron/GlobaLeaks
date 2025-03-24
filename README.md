> Important check out 'pilger' branch for the latest Globaleaks version
>
> This branch is deprecated

# How to build and deploy changed client

Client consists of *index.html* and *scripts.min.js* which is located at `/usr/share/globaleaks/client` and `/usr/share/globaleaks/client/js`

1. Build your changed files using the command `grunt build` in the repositories directory named /client
2. Copy js files to any directory of your server `scp -r ./build/js admin@myserverip:/any/folder/adminuser/owns`
3. Now Copy files to the production folder in `/usr/share/globaleaks/client/js`
4. Restart Globaleaks and make sure it runs `/etc/init.d/globaleaks restart`
5. Upload the hinweisgeberschutz.css to the Custom Css tab in the admin page page.com/#/admin/content (it takes some time to be activated)


Todo

	- [x] Allow html in footer for linking to custom pages
  - [x] Restyle

## Backup
When making updates first backup the site [backup guide](https://docs.globaleaks.org/en/stable/user/admin/BackupAndRestore.html) and then run `sudo zip -r ~/backup.zip /var/globaleaks` and then copy that file to your local machine with `scp -i  ~/.ssh/id_rsa_vg admin@3.65.210.230:~/backup.zip  ~/Desktop/globaleaksbackup.zip`
