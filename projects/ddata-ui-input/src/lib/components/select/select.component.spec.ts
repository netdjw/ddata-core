// tslint:disable: ban-types
// tslint:disable: max-line-length
import 'zone.js/dist/zone-testing';
import { Injector, ComponentFactoryResolver, Type, ComponentFactory, ViewContainerRef, ElementRef, ViewRef, EmbeddedViewRef, ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { AppModule } from 'src/app/app.module';
import { Subscription, Observable, of } from 'rxjs';

interface OptionsInterface {
  saveModel?: Observable<any>;
  select?: Observable<any>;
  isModal?: boolean;
  multipleSelectEnabled?: boolean;
  isSelectionList?: boolean;
  selectedElements?: any[];
  models?: any[];
  loadData?: boolean;
  filter?: any;
  datasArrived?: number;
}

class FakeHideClass {
  hideModal(models): any {
    return models;
  }
}

class FakeComponentFactoryResolver extends ComponentFactoryResolver {
  resolveComponentFactory<T>(component: Type<T>): ComponentFactory<T> {
    return {} as unknown as ComponentFactory<T>;
  }
}

class FakeDialogSettings implements DialogContentWithOptionsInterface {
  createEditComponent: Type<any>;
  createEditOptions?: OptionsInterface;
  listComponent: Type<any>;
  listOptions?: OptionsInterface;
}

class FakeViewContainerRef extends ViewContainerRef {
  get element(): ElementRef<any> {
    throw new Error('Method not implemented.');
  }
  get injector(): Injector {
    throw new Error('Method not implemented.');
  }
  get parentInjector(): Injector {
    throw new Error('Method not implemented.');
  }
  clear(): void {
  }
  get(): ViewRef {
    throw new Error('Method not implemented.');
  }
  get length(): number {
    throw new Error('Method not implemented.');
  }
  createEmbeddedView<C>(): EmbeddedViewRef<C> {
    throw new Error('Method not implemented.');
  }
  createComponent<C>(): ComponentRef<C> {

    const final = { instance: {
      isModal: false,
      saveModel: of('something for this function'),
      select: of(['An array for this function'])
    } as DialogContentInterface
  };

    return final as unknown as ComponentRef<C>;
  }
  insert(): ViewRef {
    throw new Error('Method not implemented.');
  }
  move(): ViewRef {
    throw new Error('Method not implemented.');
  }
  indexOf(): number {
    throw new Error('Method not implemented.');
  }
  remove(): void {
    throw new Error('Method not implemented.');
  }
  detach(): ViewRef {
    throw new Error('Method not implemented.');
  }

}

describe('SelectBoxComponent', () => {
  let component: SelectBoxComponent;
  let fixture: ComponentFixture<SelectBoxComponent>;
  let debugElement;
  let element;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectBoxComponent],
      providers: [
        Injector,
        BaseModel,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    AppModule.InjectorInstance = TestBed;
    fixture = TestBed.createComponent(SelectBoxComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    element = debugElement.nativeElement;
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('model property should set _model to be null or a model or the given value', () => {
    component.model = null;
    expect(component._model).toBeInstanceOf(BaseModel);
    component.model = new Tag().init();
    expect(component._model).toBeInstanceOf(Tag);
  });

  it('dialogTitle property should set _dialogTitle to be \'kiválasztható elem\' or the chosen value', () => {
    expect(component._dialogTitle).toBe('Not set');
    component.dialogTitle = null;
    expect(component._dialogTitle).toBe('kiválasztható elem');
    component.dialogTitle = 'Ez egy új elem';
    expect(component._dialogTitle).toBe('Ez egy új elem');
  });

  it('ngOnInit() method should set _dialogTitle, _selectedModel and _selectedModelName', () => {
    expect(component._dialogTitle).toBe('Not set');
    expect(component._selectedModel).toBeUndefined();
    expect(component._selectedModelName).toBe('');

    component._model = new Tag().init();
    component.items = null;
    component.items = [new Tag().init(), new Tag().init(), new Tag().init()];
    component.ngOnInit();
    expect(component._dialogTitle).toBe('kiválasztható elem');
    expect(component._selectedModel).toBeInstanceOf(Tag);

    component.fakeSingleSelect = true;
    (component._model as any).id = [{
      name: 'something'
    }];
    component.ngOnInit();
    expect(component._selectedModelName).toBe('something');
  });

  it('selectItem() should call setSelected() with the Value.target.value', () => {
    const fakeValue = {
      target: {
        value: 69 as ID,
      }
    };
    component._model = new Tag().init();
    spyOn<any>(component, 'setSelected');
    component.selectItem(fakeValue);
    expect((component as any).setSelected).toHaveBeenCalledWith(69);
  });

  it('setSelected() method should do things', () => {
    component.disableAdditionalModelUpdate = true;
    const fakeForItem = new Tag().init();
    fakeForItem.id = 69 as ID;
    component.items = [fakeForItem];
    component._model = new Tag().init();
    const fakeSpy = spyOn((component as any).changeDetector, 'detectChanges');
    const fakeSpy2 = spyOn(component.selected, 'emit');
    const fakeSpy3 = spyOn(component.selectModel, 'emit');
    (component as any).setSelected(69, true, 42);
    expect(component._model.id).toBe(69 as ID);
    expect(fakeSpy).toHaveBeenCalled();
    expect(component._selectedModel).toBe(fakeForItem);
    expect(fakeSpy2).toHaveBeenCalledWith(69);
    expect(fakeSpy3).toHaveBeenCalledWith(fakeForItem);

    component.disableAdditionalModelUpdate = false;
    const fakeForItem2 = new Tag().init();
    fakeForItem2.id = 42 as ID;
    const fakeSpy4 = spyOn((component as any), 'getObjectFieldName');
    (component as any).setSelected(69, true);
    expect(fakeSpy4).toHaveBeenCalled();
    expect(fakeSpy).toHaveBeenCalled();
    expect(component._selectedModel).toBe(fakeForItem);
    expect(fakeSpy2).toHaveBeenCalledWith(69);
    expect(fakeSpy3).toHaveBeenCalledWith(fakeForItem);
  });

  it('getObjectFieldName() method should give back "id" ', () => {
    expect((component as any).getObjectFieldName()).toBe('id');
  });

  it('hideModal() method should change isModalVisible to be true/false and unsubscribe', () => {
    component.componentSubscription = new Subscription();
    const fakeSpy = spyOn(component.componentSubscription, 'unsubscribe');
    expect(component.isModalVisible).toBe(false);
    component.hideModal();
    expect(fakeSpy).toHaveBeenCalled();
    expect(component.isModalVisible).toBe(true);
    component.hideModal();
    expect(fakeSpy).toHaveBeenCalled();
    expect(component.isModalVisible).toBe(false);
  });

  it('showModal() method should change isModalVisible to be true/false and call renderComponent', () => {
    spyOn(component, 'renderComponent');
    expect(component.isModalVisible).toBe(false);
    component.showModal();
    expect(component.renderComponent).toHaveBeenCalled();
    expect(component.isModalVisible).toBe(true);
  });

  it('changeModalStatus() method should change isModalVisible to be true/false', () => {
    const fakeSpy2 = spyOn((component as any).changeDetector, 'detectChanges');
    expect(component.isModalVisible).toBe(false);
    (component as any).changeModalStatus();
    expect(component.isModalVisible).toBe(true);
    expect(fakeSpy2).toHaveBeenCalled();
  });

  it('renderComponent() method should do things', () => {
    const fakeSpy = spyOn(component, 'setModel');
    (component as any).componentFactoryResolver = new FakeComponentFactoryResolver();
    component.dialogSettings = new FakeDialogSettings();
    component.dialogHost = new FakeViewContainerRef();

    component.renderComponent();
    expect(component.componentRef.instance.isModal).toBe(true);
    expect(fakeSpy).toHaveBeenCalled();
  });

  it('setModel() method should change things', () => {
    const fakeSpy = spyOn(component.selectModel, 'emit');
    const fakeModel = new Tag().init();
    fakeModel.id = 3 as ID;
    ((component as any).hideModal as Function) = new FakeHideClass().hideModal;
    component.setModel(fakeModel);
    expect(component._model.id).toBe(3 as ID);
    expect(component.items.length).toBe(1);
    expect(component.items[0]).toEqual(fakeModel);
    expect(component._selectedModel).toEqual(fakeModel);
    expect(fakeSpy).toHaveBeenCalledWith(fakeModel);
  });

  it('changeEditModalStatus() method should change isEditModalVisible to be true/false', () => {
    expect(component.isEditModalVisible).toBe(false);
    (component as any).changeEditModalStatus();
    expect(component.isEditModalVisible).toBe(true);
  });

  it('hideEditModal() method should change isEditModalVisible to be true/false and unsubscribe', () => {
    component.componentSubscription = new Subscription();
    const fakeSpy = spyOn(component.componentSubscription, 'unsubscribe');
    expect(component.isEditModalVisible).toBe(false);
    component.hideEditModal();
    expect(fakeSpy).toHaveBeenCalled();
    expect(component.isEditModalVisible).toBe(true);
    component.hideEditModal();
    expect(fakeSpy).toHaveBeenCalled();
    expect(component.isEditModalVisible).toBe(false);
  });

  it('showEditModal() method should change isEditModalVisible to be true/false and unsubscribe and call renderEditComponent()', () => {
    const fakeSpy = spyOn(component, 'renderEditComponent');
    const fakeSpy2 = spyOn((component as any).changeDetector, 'detectChanges');

    expect(component.isEditModalVisible).toBe(false);
    component.showEditModal();
    expect(fakeSpy).toHaveBeenCalled();
    expect(fakeSpy2).toHaveBeenCalled();
    expect(component.isEditModalVisible).toBe(true);
  });

  it('setEditModel() method should change things', () => {
    const fakeSpy = spyOn(component, 'hideEditModal');
    component.setEditModel(null, null);
    expect(fakeSpy).toHaveBeenCalled();

    const fakeSpy2 = spyOn(component.selectModel, 'emit');
    const fakeSpy3 = spyOn(component.selected, 'emit');
    const fakeModel = new Tag().init();
    fakeModel.id = 3 as ID;
    ((component as any).hideModal as Function) = new FakeHideClass().hideModal;
    component.setEditModel(fakeModel, 5 as ID);
    expect(component._selectedModel).toEqual(fakeModel);
    expect(component._selectedModel.id).toBe(5 as ID);
    expect(component._model.id).toBe(5 as ID);
    expect(fakeSpy3).toHaveBeenCalledWith(fakeModel.id);
    expect(fakeSpy2).toHaveBeenCalledWith(fakeModel);
  });

  it('renderEditComponent() method should do things', () => {
    const fakeSpy = spyOn(component, 'setEditModel');
    const fakeModel = new Tag().init();
    fakeModel.id = 3 as ID;
    component._selectedModel = fakeModel;
    (component as any).componentFactoryResolver = new FakeComponentFactoryResolver();
    component.dialogSettings = new FakeDialogSettings();
    component.dialogEditHost = new FakeViewContainerRef();
    const dialogEditContent: DialogContentItem = new DialogContentItem(component.dialogSettings.createEditComponent, {
      model: component._selectedModel,
    });

    component.renderEditComponent();
    expect(component.componentRef.instance.isModal).toBe(true);
    expect(component.componentRef.instance.model).toBe(dialogEditContent.data.model);
    expect(fakeSpy).toHaveBeenCalledWith('something for this function', component._selectedModel.id);
  });

  it('changeListModalStatus() method should change isListModalVisible to be true/false', () => {
    const fakeSpy2 = spyOn((component as any).changeDetector, 'detectChanges');
    expect(component.isListModalVisible).toBe(false);
    (component as any).changeListModalStatus();
    expect(component.isListModalVisible).toBe(true);
    expect(fakeSpy2).toHaveBeenCalled();
    (component as any).changeListModalStatus();
    expect(component.isListModalVisible).toBe(false);
    expect(fakeSpy2).toHaveBeenCalled();
  });

  it('hideListModal() method should call changeListModalStatus() method', () => {
    const fakeSpy2 = spyOn((component as any), 'changeListModalStatus');
    (component as any).changeListModalStatus();
    expect(fakeSpy2).toHaveBeenCalled();
  });

  it('showListModal() method should call changeListModalStatus() and renderListComponent() method', () => {
    component.disabled = true;
    const fakeSpy2 = spyOn((component as any), 'changeListModalStatus');
    const fakeSpy = spyOn(component, 'renderListComponent');
    component.showListModal();
    expect(fakeSpy2).not.toHaveBeenCalled();
    expect(fakeSpy).not.toHaveBeenCalled();

    component.disabled = false;
    component.showListModal();
    expect(fakeSpy2).toHaveBeenCalled();
    expect(fakeSpy).toHaveBeenCalled();
  });

  it('setListModel() method should call hideListModal() method', () => {
    const fakeSpy2 = spyOn(component, 'hideListModal');
    component.setListModel();
    expect(fakeSpy2).toHaveBeenCalled();
  });

  it('renderListComponent() method should do things', () => {
    expect(component.renderListComponent()).toEqual(undefined);

    const fakeSpy = spyOn(component, 'hideListModal');
    const fakeSpy2 = spyOn(component.selectModel, 'emit');
    const fakeSpy3 = spyOn((component as any), 'setSelected');
    const fakeSpy4 = spyOn(component.selected, 'emit');

    const fakeModel = new Tag().init();
    fakeModel.id = 3 as ID;
    component._selectedModel = fakeModel;
    component._model = fakeModel;
    (component as any).componentFactoryResolver = new FakeComponentFactoryResolver();
    const fakeParameterDialog = {} as unknown as Type<any>;
    component.dialogListContent = new DialogContentItem(fakeParameterDialog, component._selectedModel);
    component.dialogSettings = new FakeDialogSettings();
    component.dialogListHost = new FakeViewContainerRef();

    component.renderListComponent();
    expect(component.componentRef.instance.isModal).toBe(true);
    expect(component.componentRef.instance.multipleSelectEnabled).toBe(component.dialogListContent.data.multipleSelectEnabled);
    expect(component.componentRef.instance.isSelectionList).toBe(component.dialogListContent.data.isSelectionList);
    expect(component.componentRef.instance.loadData).toBe(component.dialogListContent.data.loadData);
    expect(component.componentRef.instance.filter).toEqual({});
    expect(component.componentRef.instance.models).toBe(component.dialogListContent.data.models);
    expect(component.componentRef.instance.datasArrived).toBe(undefined);
    expect(component.componentRef.instance.selectedElements).toEqual([3]);

    expect(fakeSpy).toHaveBeenCalled();
    expect(fakeSpy2).toHaveBeenCalledWith('An array for this function');
    expect(fakeSpy3).toHaveBeenCalled();
    expect(fakeSpy4).toHaveBeenCalled();

    (component._model as any).id = [3 as ID, 5 as ID];
    component.multipleSelect = true;

    component.renderListComponent();
    expect(component.componentRef.instance.selectedElements).toEqual([3, 5]);
    expect((component._model as any).id).toEqual(['An array for this function']);
  });

  it('deleteFromMultipleSelectedList() method should delete the item in the parameter from the items Array', () => {
    const fakemodel = new Tag().init();
    (fakemodel as any).id = [3 as ID, 5 as ID, 10 as ID];
    component._model = fakemodel;
    expect(component._model[component.field][0]).toBe(3 as ID);
    component.deleteFromMultipleSelectedList(5 as ID);
    expect(component._model[component.field]).toEqual([3 as ID, 10 as ID]);
  });

  it('modelField() method should give \'\' or the model name', () => {
    const fakemodel = new Tag().init({name: 'TagName'});
    fakemodel.id = 3 as ID;
    component._model = fakemodel;
    expect(component.modelField()).toBe('');
    component.items = [new Tag().init(), new Tag().init(), fakemodel, new Tag().init()];
    expect(component.modelField()).toBe('TagName');
  });

});
