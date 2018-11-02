import { element, by, ElementFinder } from 'protractor';

export class SafetyDriverComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-safety-driver div table .btn-danger'));
    title = element.all(by.css('jhi-safety-driver div h2#page-heading span')).first();

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

export class SafetyDriverUpdatePage {
    pageTitle = element(by.id('jhi-safety-driver-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    loginInput = element(by.id('field_login'));
    userSelect = element(by.id('field_user'));
    licencesSelect = element(by.id('field_licences'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setLoginInput(login) {
        await this.loginInput.sendKeys(login);
    }

    async getLoginInput() {
        return this.loginInput.getAttribute('value');
    }

    async userSelectLastOption() {
        await this.userSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async userSelectOption(option) {
        await this.userSelect.sendKeys(option);
    }

    getUserSelect(): ElementFinder {
        return this.userSelect;
    }

    async getUserSelectedOption() {
        return this.userSelect.element(by.css('option:checked')).getText();
    }

    async licencesSelectLastOption() {
        await this.licencesSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async licencesSelectOption(option) {
        await this.licencesSelect.sendKeys(option);
    }

    getLicencesSelect(): ElementFinder {
        return this.licencesSelect;
    }

    async getLicencesSelectedOption() {
        return this.licencesSelect.element(by.css('option:checked')).getText();
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

export class SafetyDriverDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-safetyDriver-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-safetyDriver'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
