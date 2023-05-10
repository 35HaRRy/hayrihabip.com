
npm install;
npm run build;

Remove-Item dist\* -Recurse -Include *.html;

Compress-Archive -Path dist\* -DestinationPath dist.zip;
