import { element, by, ElementFinder } from 'protractor';

export class ShiftComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-shift div table .btn-danger'));
    title = element.all(by.css('jhi-shift div h2#page-heading span')).first();

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

export class ShiftUpdatePage {
    pageTitle = element(by.id('jhi-shift-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    startInput = element(by.id('field_start'));
    endInput = element(by.id('field_end'));
    longStartInput = element(by.id('field_longStart'));
    latStartInput = element(by.id('field_latStart'));
    carSelect = element(by.id('field_car'));
    safetyDriverSelect = element(by.id('field_safetyDriver'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setStartInput(start) {
        await this.startInput.sendKeys(start);
    }

    async getStartInput() {
        return this.startInput.getAttribute('value');
    }

    async setEndInput(end) {
        await this.endInput.sendKeys(end);
    }

    async getEndInput() {
        return this.endInput.getAttribute('value');
    }

    async setLongStartInput(longStart) {
        await this.longStartInput.sendKeys(longStart);
    }

    async getLongStartInput() {
        return this.longStartInput.getAttribute('value');
    }

    async setLatStartInput(latStart) {
        await this.latStartInput.sendKeys(latStart);
    }

    async getLatStartInput() {
        return this.latStartInput.getAttribute('value');
    }

    async carSelectLastOption() {
        await this.carSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async carSelectOption(option) {
        await this.carSelect.sendKeys(option);
    }

    getCarSelect(): ElementFinder {
        return this.carSelect;
    }

    async getCarSelectedOption() {
        return this.carSelect.element(by.css('option:checked')).getText();
    }

    async safetyDriverSelectLastOption() {
        await this.safetyDriverSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async safetyDriverSelectOption(option) {
        await this.safetyDriverSelect.sendKeys(option);
    }

    getSafetyDriverSelect(): ElementFinder {
        return this.safetyDriverSelect;
    }

    async getSafetyDriverSelectedOption() {
        return this.safetyDriverSelect.element(by.css('option:checked')).getText();
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

export class ShiftDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-shift-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-shift'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
