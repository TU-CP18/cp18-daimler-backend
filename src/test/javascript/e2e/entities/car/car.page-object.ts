import { element, by, ElementFinder } from 'protractor';

export class CarComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-car div table .btn-danger'));
    title = element.all(by.css('jhi-car div h2#page-heading span')).first();

    async clickOnCreateButton() {
        await this.createButton.click();
    }

    async clickOnLastDeleteButton() {
        await this.deleteButtons.last().click();
    }

    async countDeleteButtons() {
        return this.deleteButtons.count();
    }

    async getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class CarUpdatePage {
    pageTitle = element(by.id('jhi-car-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    modelInput = element(by.id('field_model'));
    statusSelect = element(by.id('field_status'));
    licenceSelect = element(by.id('field_licence'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setModelInput(model) {
        await this.modelInput.sendKeys(model);
    }

    async getModelInput() {
        return this.modelInput.getAttribute('value');
    }

    async setStatusSelect(status) {
        await this.statusSelect.sendKeys(status);
    }

    async getStatusSelect() {
        return this.statusSelect.element(by.css('option:checked')).getText();
    }

    async statusSelectLastOption() {
        await this.statusSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async licenceSelectLastOption() {
        await this.licenceSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async licenceSelectOption(option) {
        await this.licenceSelect.sendKeys(option);
    }

    getLicenceSelect(): ElementFinder {
        return this.licenceSelect;
    }

    async getLicenceSelectedOption() {
        return this.licenceSelect.element(by.css('option:checked')).getText();
    }

    async save() {
        await this.saveButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }

    getSaveButton(): ElementFinder {
        return this.saveButton;
    }
}

export class CarDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-car-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-car'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
