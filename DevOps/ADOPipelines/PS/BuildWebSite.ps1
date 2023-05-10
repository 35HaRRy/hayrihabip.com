
npm install;
npm run build;

Remove-Item dist\* -Recurse -Include *.txt;

Compress-Archive -Path dist\* -DestinationPath dist.zip;
