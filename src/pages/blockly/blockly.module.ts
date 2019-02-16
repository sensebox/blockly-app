import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { BlocklyPage } from './blockly';

@NgModule({
  declarations: [
    BlocklyPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(BlocklyPage)
  ],
})
export class BlocklyPageModule {}
