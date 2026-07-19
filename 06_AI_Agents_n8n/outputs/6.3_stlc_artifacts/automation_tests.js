const { test, expect } = require('@playwright/test');
const { Page } = require('./Page');

class LoginPage extends Page {
  constructor(page) {
    super(page);
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

class ExperimentationPage extends Page {
  constructor(page) {
    super(page);
    this.createTestButton = page.getByRole('button', { name: 'Create Test' });
    this.testTypeSelect = page.getByRole('combobox', { name: 'Test Type' });
    this.testSettingsInput = page.getByRole('textbox', { name: 'Test Settings' });
    this.saveTestButton = page.getByRole('button', { name: 'Save Test' });
  }

  async createABTest() {
    await this.createTestButton.click();
    await this.testTypeSelect.selectOption('A/B Test');
    await this.testSettingsInput.fill('Test Settings');
    await this.saveTestButton.click();
  }

  async createMultivariateTest() {
    await this.createTestButton.click();
    await this.testTypeSelect.selectOption('Multivariate Test');
    await this.testSettingsInput.fill('Test Settings');
    await this.saveTestButton.click();
  }
}

class BehavioralInsightsPage extends Page {
  constructor(page) {
    super(page);
    this.insightsPageLink = page.getByRole('link', { name: 'Insights' });
    this.heatmapSelect = page.getByRole('combobox', { name: 'Heatmap' });
    this.heatmapSettingsInput = page.getByRole('textbox', { name: 'Heatmap Settings' });
  }

  async viewHeatmap() {
    await this.insightsPageLink.click();
    await this.heatmapSelect.selectOption('Heatmap');
    await this.heatmapSettingsInput.fill('Heatmap Settings');
  }

  async watchSessionRecording() {
    await this.insightsPageLink.click();
    await page.getByRole('link', { name: 'Session Recording' }).click();
    await page.getByRole('textbox', { name: 'Recording Settings' }).fill('Recording Settings');
  }
}

class PersonalizationPage extends Page {
  constructor(page) {
    super(page);
    this.createCampaignButton = page.getByRole('button', { name: 'Create Campaign' });
    this.campaignTypeSelect = page.getByRole('combobox', { name: 'Campaign Type' });
    this.campaignSettingsInput = page.getByRole('textbox', { name: 'Campaign Settings' });
    this.saveCampaignButton = page.getByRole('button', { name: 'Save Campaign' });
  }

  async createPersonalizationCampaign() {
    await this.createCampaignButton.click();
    await this.campaignTypeSelect.selectOption('Personalization Campaign');
    await this.campaignSettingsInput.fill('Campaign Settings');
    await this.saveCampaignButton.click();
  }
}

class ProgramPage extends Page {
  constructor(page) {
    super(page);
    this.createProgramButton = page.getByRole('button', { name: 'Create Program' });
    this.programSettingsInput = page.getByRole('textbox', { name: 'Program Settings' });
    this.saveProgramButton = page.getByRole('button', { name: 'Save Program' });
  }

  async createProgram() {
    await this.createProgramButton.click();
    await this.programSettingsInput.fill('Program Settings');
    await this.saveProgramButton.click();
  }
}

class IntegrationsPage extends Page {
  constructor(page) {
    super(page);
    this.integrationsPageLink = page.getByRole('link', { name: 'Integrations' });
    this.externalPlatformSelect = page.getByRole('combobox', { name: 'External Platform' });
    this.integrationSettingsInput = page.getByRole('textbox', { name: 'Integration Settings' });
  }

  async integrateWithExternalPlatform() {
    await this.integrationsPageLink.click();
    await this.externalPlatformSelect.selectOption('External Platform');
    await this.integrationSettingsInput.fill('Integration Settings');
  }
}

test('VWO-001: Create a new A/B test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const experimentationPage = new ExperimentationPage(page);
  await loginPage.login('username', 'password');
  await experimentationPage.createABTest();
  await expect(page.getByRole('alert', { name: 'Test created successfully' })).toContainText('Test created successfully');
}, { timeout: 30000 });

test('VWO-002: Run a multivariate test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const experimentationPage = new ExperimentationPage(page);
  await loginPage.login('username', 'password');
  await experimentationPage.createMultivariateTest();
  await expect(page.getByRole('alert', { name: 'Test created successfully' })).toContainText('Test created successfully');
}, { timeout: 30000 });

test('VWO-003: View a heatmap', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const behavioralInsightsPage = new BehavioralInsightsPage(page);
  await loginPage.login('username', 'password');
  await behavioralInsightsPage.viewHeatmap();
  await expect(page.getByRole('img', { name: 'Heatmap' })).toBeVisible();
}, { timeout: 30000 });

test('VWO-004: Watch a session recording', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const behavioralInsightsPage = new BehavioralInsightsPage(page);
  await loginPage.login('username', 'password');
  await behavioralInsightsPage.watchSessionRecording();
  await expect(page.getByRole('video', { name: 'Session Recording' })).toBeVisible();
}, { timeout: 30000 });

test('VWO-005: Create a new personalization campaign', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const personalizationPage = new PersonalizationPage(page);
  await loginPage.login('username', 'password');
  await personalizationPage.createPersonalizationCampaign();
  await expect(page.getByRole('alert', { name: 'Campaign created successfully' })).toContainText('Campaign created successfully');
}, { timeout: 30000 });

test('VWO-006: Create a new program', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const programPage = new ProgramPage(page);
  await loginPage.login('username', 'password');
  await programPage.createProgram();
  await expect(page.getByRole('alert', { name: 'Program created successfully' })).toContainText('Program created successfully');
}, { timeout: 30000 });

test('VWO-007: Integrate with an external platform', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const integrationsPage = new IntegrationsPage(page);
  await loginPage.login('username', 'password');
  await integrationsPage.integrateWithExternalPlatform();
  await expect(page.getByRole('alert', { name: 'Integration successful' })).toContainText('Integration successful');
}, { timeout: 30000 });