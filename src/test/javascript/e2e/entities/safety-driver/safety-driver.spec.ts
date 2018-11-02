/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { SafetyDriverComponentsPage, SafetyDriverDeleteDialog, SafetyDriverUpdatePage } from './safety-driver.page-object';

const expect = chai.expect;

describe('SafetyDriver e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let safetyDriverUpdatePage: SafetyDriverUpdatePage;
    let safetyDriverComponentsPage: SafetyDriverComponentsPage;
    let safetyDriverDeleteDialog: SafetyDriverDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load SafetyDrivers', async () => {
        await navBarPage.goToEntity('safety-driver');
        safetyDriverComponentsPage = new SafetyDriverComponentsPage();
        expect(await safetyDriverComponentsPage.getTitle()).to.eq('cpdaimlerApp.safetyDriver.home.title');
    });

    it('should load create SafetyDriver page', async () => {
        await safetyDriverComponentsPage.clickOnCreateButton();
        safetyDriverUpdatePage = new SafetyDriverUpdatePage();
        expect(await safetyDriverUpdatePage.getPageTitle()).to.eq('cpdaimlerApp.safetyDriver.home.createOrEditLabel');
        await safetyDriverUpdatePage.cancel();
    });

    it('should create and save SafetyDrivers', async () => {
        const nbButtonsBeforeCreate = await safetyDriverComponentsPage.countDeleteButtons();

        await safetyDriverComponentsPage.clickOnCreateButton();
        await promise.all([
            safetyDriverUpdatePage.setLoginInput('login'),
            safetyDriverUpdatePage.userSelectLastOption()
            // safetyDriverUpdatePage.licencesSelectLastOption(),
        ]);
        expect(await safetyDriverUpdatePage.getLoginInput()).to.eq('login');
        await safetyDriverUpdatePage.save();
        expect(await safetyDriverUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await safetyDriverComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last SafetyDriver', async () => {
        const nbButtonsBeforeDelete = await safetyDriverComponentsPage.countDeleteButtons();
        await safetyDriverComponentsPage.clickOnLastDeleteButton();

        safetyDriverDeleteDialog = new SafetyDriverDeleteDialog();
        expect(await safetyDriverDeleteDialog.getDialogTitle()).to.eq('cpdaimlerApp.safetyDriver.delete.question');
        await safetyDriverDeleteDialog.clickOnConfirmButton();

        expect(await safetyDriverComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
