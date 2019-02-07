/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { CarCleanlinessComponentsPage, CarCleanlinessDeleteDialog, CarCleanlinessUpdatePage } from './car-cleanliness.page-object';

const expect = chai.expect;

describe('CarCleanliness e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let carCleanlinessUpdatePage: CarCleanlinessUpdatePage;
    let carCleanlinessComponentsPage: CarCleanlinessComponentsPage;
    let carCleanlinessDeleteDialog: CarCleanlinessDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load CarCleanlinesses', async () => {
        await navBarPage.goToEntity('car-cleanliness');
        carCleanlinessComponentsPage = new CarCleanlinessComponentsPage();
        expect(await carCleanlinessComponentsPage.getTitle()).to.eq('cpdaimlerApp.carCleanliness.home.title');
    });

    it('should load create CarCleanliness page', async () => {
        await carCleanlinessComponentsPage.clickOnCreateButton();
        carCleanlinessUpdatePage = new CarCleanlinessUpdatePage();
        expect(await carCleanlinessUpdatePage.getPageTitle()).to.eq('cpdaimlerApp.carCleanliness.home.createOrEditLabel');
        await carCleanlinessUpdatePage.cancel();
    });

    it('should create and save CarCleanlinesses', async () => {
        const nbButtonsBeforeCreate = await carCleanlinessComponentsPage.countDeleteButtons();

        await carCleanlinessComponentsPage.clickOnCreateButton();
        await promise.all([
            carCleanlinessUpdatePage.setRatingInput('5'),
            carCleanlinessUpdatePage.setEventInput('event'),
            carCleanlinessUpdatePage.setPartInput('part'),
            carCleanlinessUpdatePage.setCreatedAtInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            carCleanlinessUpdatePage.carSelectLastOption(),
            carCleanlinessUpdatePage.shiftSelectLastOption()
        ]);
        expect(await carCleanlinessUpdatePage.getRatingInput()).to.eq('5');
        expect(await carCleanlinessUpdatePage.getEventInput()).to.eq('event');
        expect(await carCleanlinessUpdatePage.getPartInput()).to.eq('part');
        expect(await carCleanlinessUpdatePage.getCreatedAtInput()).to.contain('2001-01-01T02:30');
        await carCleanlinessUpdatePage.save();
        expect(await carCleanlinessUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await carCleanlinessComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last CarCleanliness', async () => {
        const nbButtonsBeforeDelete = await carCleanlinessComponentsPage.countDeleteButtons();
        await carCleanlinessComponentsPage.clickOnLastDeleteButton();

        carCleanlinessDeleteDialog = new CarCleanlinessDeleteDialog();
        expect(await carCleanlinessDeleteDialog.getDialogTitle()).to.eq('cpdaimlerApp.carCleanliness.delete.question');
        await carCleanlinessDeleteDialog.clickOnConfirmButton();

        expect(await carCleanlinessComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
