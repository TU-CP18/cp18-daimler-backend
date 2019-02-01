import { element, by, ElementFinder } from 'protractor';

export class CarIssueComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-car-issue div table .btn-danger'));
    title = element.all(by.css('jhi-car-issue div h2#page-heading span')).first();

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

export class CarIssueUpdatePage {
    pageTitle = element(by.id('jhi-car-issue-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    descriptionInput = element(by.id('field_description'));
    partInput = element(by.id('field_part'));
    posXInput = element(by.id('field_posX'));
    posYInput = element(by.id('field_posY'));
    carSelect = element(by.id('field_car'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setDescriptionInput(description) {
        await this.descriptionInput.sendKeys(description);
    }

    async getDescriptionInput() {
        return this.descriptionInput.getAttribute('value');
    }

    async setPartInput(part) {
        await this.partInput.sendKeys(part);
    }

    async getPartInput() {
        return this.partInput.getAttribute('value');
    }

    async setPosXInput(posX) {
        await this.posXInput.sendKeys(posX);
    }

    async getPosXInput() {
        return this.posXInput.getAttribute('value');
    }

    async setPosYInput(posY) {
        await this.posYInput.sendKeys(posY);
    }

    async getPosYInput() {
        return this.posYInput.getAttribute('value');
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

export class CarIssueDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-carIssue-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-carIssue'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
