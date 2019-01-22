import { element, by, ElementFinder } from 'protractor';

export class ChatMessageComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-chat-message div table .btn-danger'));
    title = element.all(by.css('jhi-chat-message div h2#page-heading span')).first();

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

export class ChatMessageUpdatePage {
    pageTitle = element(by.id('jhi-chat-message-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    textInput = element(by.id('field_text'));
    createdAtInput = element(by.id('field_createdAt'));
    senderSelect = element(by.id('field_sender'));
    recipientSelect = element(by.id('field_recipient'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setTextInput(text) {
        await this.textInput.sendKeys(text);
    }

    async getTextInput() {
        return this.textInput.getAttribute('value');
    }

    async setCreatedAtInput(createdAt) {
        await this.createdAtInput.sendKeys(createdAt);
    }

    async getCreatedAtInput() {
        return this.createdAtInput.getAttribute('value');
    }

    async senderSelectLastOption() {
        await this.senderSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async senderSelectOption(option) {
        await this.senderSelect.sendKeys(option);
    }

    getSenderSelect(): ElementFinder {
        return this.senderSelect;
    }

    async getSenderSelectedOption() {
        return this.senderSelect.element(by.css('option:checked')).getText();
    }

    async recipientSelectLastOption() {
        await this.recipientSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async recipientSelectOption(option) {
        await this.recipientSelect.sendKeys(option);
    }

    getRecipientSelect(): ElementFinder {
        return this.recipientSelect;
    }

    async getRecipientSelectedOption() {
        return this.recipientSelect.element(by.css('option:checked')).getText();
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

export class ChatMessageDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-chatMessage-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-chatMessage'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
