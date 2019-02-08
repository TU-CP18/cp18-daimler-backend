import { element, by, ElementFinder } from 'protractor';

export class CarCleanlinessComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-car-cleanliness div table .btn-danger'));
    title = element.all(by.css('jhi-car-cleanliness div h2#page-heading span')).first();

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

export class CarCleanlinessUpdatePage {
    pageTitle = element(by.id('jhi-car-cleanliness-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    ratingInput = element(by.id('field_rating'));
    eventInput = element(by.id('field_event'));
    partInput = element(by.id('field_part'));
    createdAtInput = element(by.id('field_createdAt'));
    carSelect = element(by.id('field_car'));
    shiftSelect = element(by.id('field_shift'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setRatingInput(rating) {
        await this.ratingInput.sendKeys(rating);
    }

    async getRatingInput() {
        return this.ratingInput.getAttribute('value');
    }

    async setEventInput(event) {
        await this.eventInput.sendKeys(event);
    }

    async getEventInput() {
        return this.eventInput.getAttribute('value');
    }

    async setPartInput(part) {
        await this.partInput.sendKeys(part);
    }

    async getPartInput() {
        return this.partInput.getAttribute('value');
    }

    async setCreatedAtInput(createdAt) {
        await this.createdAtInput.sendKeys(createdAt);
    }

    async getCreatedAtInput() {
        return this.createdAtInput.getAttribute('value');
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

    async shiftSelectLastOption() {
        await this.shiftSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async shiftSelectOption(option) {
        await this.shiftSelect.sendKeys(option);
    }

    getShiftSelect(): ElementFinder {
        return this.shiftSelect;
    }

    async getShiftSelectedOption() {
        return this.shiftSelect.element(by.css('option:checked')).getText();
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

export class CarCleanlinessDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-carCleanliness-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-carCleanliness'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
