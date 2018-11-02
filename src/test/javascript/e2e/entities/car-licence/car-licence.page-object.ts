import { element, by, ElementFinder } from 'protractor';

export class CarLicenceComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-car-licence div table .btn-danger'));
    title = element.all(by.css('jhi-car-licence div h2#page-heading span')).first();

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

export class CarLicenceUpdatePage {
    pageTitle = element(by.id('jhi-car-licence-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    carLicenceSelect = element(by.id('field_carLicence'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setCarLicenceSelect(carLicence) {
        await this.carLicenceSelect.sendKeys(carLicence);
    }

    async getCarLicenceSelect() {
        return this.carLicenceSelect.element(by.css('option:checked')).getText();
    }

    async carLicenceSelectLastOption() {
        await this.carLicenceSelect
            .all(by.tagName('option'))
            .last()
            .click();
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

export class CarLicenceDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-carLicence-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-carLicence'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
