/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { CarIssueComponentsPage, CarIssueDeleteDialog, CarIssueUpdatePage } from './car-issue.page-object';

const expect = chai.expect;

describe('CarIssue e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let carIssueUpdatePage: CarIssueUpdatePage;
    let carIssueComponentsPage: CarIssueComponentsPage;
    let carIssueDeleteDialog: CarIssueDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load CarIssues', async () => {
        await navBarPage.goToEntity('car-issue');
        carIssueComponentsPage = new CarIssueComponentsPage();
        expect(await carIssueComponentsPage.getTitle()).to.eq('cpdaimlerApp.carIssue.home.title');
    });

    it('should load create CarIssue page', async () => {
        await carIssueComponentsPage.clickOnCreateButton();
        carIssueUpdatePage = new CarIssueUpdatePage();
        expect(await carIssueUpdatePage.getPageTitle()).to.eq('cpdaimlerApp.carIssue.home.createOrEditLabel');
        await carIssueUpdatePage.cancel();
    });

    it('should create and save CarIssues', async () => {
        const nbButtonsBeforeCreate = await carIssueComponentsPage.countDeleteButtons();

        await carIssueComponentsPage.clickOnCreateButton();
        await promise.all([
            carIssueUpdatePage.setDescriptionInput('description'),
            carIssueUpdatePage.setPartInput('part'),
            carIssueUpdatePage.setPosXInput('5'),
            carIssueUpdatePage.setPosYInput('5'),
            carIssueUpdatePage.carSelectLastOption()
        ]);
        expect(await carIssueUpdatePage.getDescriptionInput()).to.eq('description');
        expect(await carIssueUpdatePage.getPartInput()).to.eq('part');
        expect(await carIssueUpdatePage.getPosXInput()).to.eq('5');
        expect(await carIssueUpdatePage.getPosYInput()).to.eq('5');
        await carIssueUpdatePage.save();
        expect(await carIssueUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await carIssueComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last CarIssue', async () => {
        const nbButtonsBeforeDelete = await carIssueComponentsPage.countDeleteButtons();
        await carIssueComponentsPage.clickOnLastDeleteButton();

        carIssueDeleteDialog = new CarIssueDeleteDialog();
        expect(await carIssueDeleteDialog.getDialogTitle()).to.eq('cpdaimlerApp.carIssue.delete.question');
        await carIssueDeleteDialog.clickOnConfirmButton();

        expect(await carIssueComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
