import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { BlocklyPage } from './blockly';
import { LoggingProvider } from '../../providers/logging/logging';

@NgModule({
  declarations: [
    BlocklyPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(BlocklyPage)
  ],
  providers: [
    LoggingProvider,
  ]
})
export class BlocklyPageModule {}
