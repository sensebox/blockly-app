import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BlocklyPage } from './blockly';

@NgModule({
  declarations: [
    BlocklyPage,
  ],
  imports: [
    IonicPageModule.forChild(BlocklyPage)
  ],
})
export class BlocklyPageModule {}
