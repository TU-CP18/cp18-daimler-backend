/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ChatMessageComponentsPage, ChatMessageDeleteDialog, ChatMessageUpdatePage } from './chat-message.page-object';

const expect = chai.expect;

describe('ChatMessage e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let chatMessageUpdatePage: ChatMessageUpdatePage;
    let chatMessageComponentsPage: ChatMessageComponentsPage;
    let chatMessageDeleteDialog: ChatMessageDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load ChatMessages', async () => {
        await navBarPage.goToEntity('chat-message');
        chatMessageComponentsPage = new ChatMessageComponentsPage();
        expect(await chatMessageComponentsPage.getTitle()).to.eq('cpdaimlerApp.chatMessage.home.title');
    });

    it('should load create ChatMessage page', async () => {
        await chatMessageComponentsPage.clickOnCreateButton();
        chatMessageUpdatePage = new ChatMessageUpdatePage();
        expect(await chatMessageUpdatePage.getPageTitle()).to.eq('cpdaimlerApp.chatMessage.home.createOrEditLabel');
        await chatMessageUpdatePage.cancel();
    });

    it('should create and save ChatMessages', async () => {
        const nbButtonsBeforeCreate = await chatMessageComponentsPage.countDeleteButtons();

        await chatMessageComponentsPage.clickOnCreateButton();
        await promise.all([
            chatMessageUpdatePage.setTextInput('text'),
            chatMessageUpdatePage.setCreatedAtInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            chatMessageUpdatePage.senderSelectLastOption(),
            chatMessageUpdatePage.recipientSelectLastOption()
        ]);
        expect(await chatMessageUpdatePage.getTextInput()).to.eq('text');
        expect(await chatMessageUpdatePage.getCreatedAtInput()).to.contain('2001-01-01T02:30');
        await chatMessageUpdatePage.save();
        expect(await chatMessageUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await chatMessageComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last ChatMessage', async () => {
        const nbButtonsBeforeDelete = await chatMessageComponentsPage.countDeleteButtons();
        await chatMessageComponentsPage.clickOnLastDeleteButton();

        chatMessageDeleteDialog = new ChatMessageDeleteDialog();
        expect(await chatMessageDeleteDialog.getDialogTitle()).to.eq('cpdaimlerApp.chatMessage.delete.question');
        await chatMessageDeleteDialog.clickOnConfirmButton();

        expect(await chatMessageComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
