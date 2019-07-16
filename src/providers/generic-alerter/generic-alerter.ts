import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { BaseModel } from '../../models/base-model';

export interface Alerter {
  present(title: string, message: string, buttons);
  presentError(message: string);
}

@Injectable()
export class GenericAlerter implements Alerter {

  constructor(private alertController: AlertController) {
    console.log('Hello GenericAlerter');
  }

  presentCreate(title: string, onConfirm: (any) => void): void {
    this
      .alertController
      .create({
        title,
        message: '',
        inputs: [{ name: 'name'}],
        buttons: [
          {
            text: 'Cancel'
          },
          {
            text: 'Save',
            handler: (inputs) => onConfirm(inputs.name.trim())
          }
        ]
      })
      .present();
  }

  presentRename<T extends BaseModel>(entity: T, onRename: (entity: T, newName: string) => void): void {
    this
      .alertController
      .create({
        title: 'Rename',
        message: 'Enter the new name',
        inputs: [{
          name: 'name',
          value: entity.name
        }],
        buttons: [
          {
            text: 'Cancel'
          },
          {
            text: 'Save',
            handler: inputs => {
              const { name } = inputs;
              entity.name = name.trim();

              onRename(entity, entity.name);
            }
          }
        ]
      })
      .present();
  }

  presentConfirmation(message: string) {
    this.present('Confirm', message);
  }

  presentError(message: string) {
    this.present('Woops', message);
  }

  present(title: string = '', message: string = '', buttons = [{ text: 'Ok' }]) {
    this
      .alertController
      .create({
        title,
        message,
        buttons
    })
    .present();
  }
}
