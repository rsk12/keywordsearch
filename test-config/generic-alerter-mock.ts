import { Alerter } from "../src/providers/generic-alerter/generic-alerter";
import { BaseModel } from "../src/models/base-model";

export class GenericAlerterMock implements Alerter {
  public static title: String = null;
  public static message: String = null;

  present(title: string, message: string, buttons) {
    console.log('PRESENT', title, message);

    GenericAlerterMock.title = title;
    GenericAlerterMock.message = message;
  }

  presentError(message: string) {
    console.log('PRESENT ERROR', message);
  }

  presentCreate(title: string, onConfirm: (any) => void): void {
    onConfirm('foo');
  }

  presentRename<T extends BaseModel>(entity: T, onRename: (entity: T, newName: string) => void): void {
    entity.name = "edited";
    onRename(entity, entity.name);
  }
}
