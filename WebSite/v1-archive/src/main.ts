import { AppModule } from './app/setup/app.module';
import { platformBrowser } from '@angular/platform-browser';

platformBrowser()
  .bootstrapModule(AppModule, {})
  .catch(err => console.error(err));
