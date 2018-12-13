/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ShiftComponentsPage, ShiftDeleteDialog, ShiftUpdatePage } from './shift.page-object';

const expect = chai.expect;

describe('Shift e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let shiftUpdatePage: ShiftUpdatePage;
    let shiftComponentsPage: ShiftComponentsPage;
    let shiftDeleteDialog: ShiftDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Shifts', async () => {
        await navBarPage.goToEntity('shift');
        shiftComponentsPage = new ShiftComponentsPage();
        expect(await shiftComponentsPage.getTitle()).to.eq('cpdaimlerApp.shift.home.title');
    });

    it('should load create Shift page', async () => {
        await shiftComponentsPage.clickOnCreateButton();
        shiftUpdatePage = new ShiftUpdatePage();
        expect(await shiftUpdatePage.getPageTitle()).to.eq('cpdaimlerApp.shift.home.createOrEditLabel');
        await shiftUpdatePage.cancel();
    });

    it('should create and save Shifts', async () => {
        const nbButtonsBeforeCreate = await shiftComponentsPage.countDeleteButtons();

        await shiftComponentsPage.clickOnCreateButton();
        await promise.all([
            shiftUpdatePage.setStartInput('5'),
            shiftUpdatePage.setEndInput('5'),
            shiftUpdatePage.setLongStartInput('5'),
            shiftUpdatePage.setLatStartInput('5'),
            shiftUpdatePage.carSelectLastOption(),
            shiftUpdatePage.safetyDriverSelectLastOption()
        ]);
        expect(await shiftUpdatePage.getStartInput()).to.eq('5');
        expect(await shiftUpdatePage.getEndInput()).to.eq('5');
        expect(await shiftUpdatePage.getLongStartInput()).to.eq('5');
        expect(await shiftUpdatePage.getLatStartInput()).to.eq('5');
        await shiftUpdatePage.save();
        expect(await shiftUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await shiftComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last Shift', async () => {
        const nbButtonsBeforeDelete = await shiftComponentsPage.countDeleteButtons();
        await shiftComponentsPage.clickOnLastDeleteButton();

        shiftDeleteDialog = new ShiftDeleteDialog();
        expect(await shiftDeleteDialog.getDialogTitle()).to.eq('cpdaimlerApp.shift.delete.question');
        await shiftDeleteDialog.clickOnConfirmButton();

        expect(await shiftComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
