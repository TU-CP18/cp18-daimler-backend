/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { CarLicenceComponentsPage, CarLicenceDeleteDialog, CarLicenceUpdatePage } from './car-licence.page-object';

const expect = chai.expect;

describe('CarLicence e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let carLicenceUpdatePage: CarLicenceUpdatePage;
    let carLicenceComponentsPage: CarLicenceComponentsPage;
    let carLicenceDeleteDialog: CarLicenceDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load CarLicences', async () => {
        await navBarPage.goToEntity('car-licence');
        carLicenceComponentsPage = new CarLicenceComponentsPage();
        expect(await carLicenceComponentsPage.getTitle()).to.eq('cpdaimlerApp.carLicence.home.title');
    });

    it('should load create CarLicence page', async () => {
        await carLicenceComponentsPage.clickOnCreateButton();
        carLicenceUpdatePage = new CarLicenceUpdatePage();
        expect(await carLicenceUpdatePage.getPageTitle()).to.eq('cpdaimlerApp.carLicence.home.createOrEditLabel');
        await carLicenceUpdatePage.cancel();
    });

    it('should create and save CarLicences', async () => {
        const nbButtonsBeforeCreate = await carLicenceComponentsPage.countDeleteButtons();

        await carLicenceComponentsPage.clickOnCreateButton();
        await promise.all([carLicenceUpdatePage.carLicenceSelectLastOption()]);
        await carLicenceUpdatePage.save();
        expect(await carLicenceUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await carLicenceComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last CarLicence', async () => {
        const nbButtonsBeforeDelete = await carLicenceComponentsPage.countDeleteButtons();
        await carLicenceComponentsPage.clickOnLastDeleteButton();

        carLicenceDeleteDialog = new CarLicenceDeleteDialog();
        expect(await carLicenceDeleteDialog.getDialogTitle()).to.eq('cpdaimlerApp.carLicence.delete.question');
        await carLicenceDeleteDialog.clickOnConfirmButton();

        expect(await carLicenceComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
