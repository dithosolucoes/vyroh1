import { expect, test } from '@playwright/test';

/**
 * Marco 8 do roadmap — testes de sanidade que não dependem de banco de dados.
 * Cobrem as páginas públicas do Vyroh: login e as páginas legais (Marco 9).
 * Fluxos que exigem Postgres real (criar projeto, comprar listagem, etc.) ficam
 * para quando houver DATABASE_URL configurada em CI.
 */

test.describe('Páginas públicas do Vyroh', () => {
  test('a tela de login renderiza com a marca e o formulário', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByText('vyroh')).toBeVisible();
    await expect(page.getByLabel('E-mail')).toBeVisible();
    await expect(page.getByLabel('Senha')).toBeVisible();
    await expect(page.getByRole('button', { name: /entrar no cofre/i })).toBeVisible();
  });

  test('a tela de cadastro alterna a partir do login', async ({ page }) => {
    await page.goto('/login');

    await page.getByRole('button', { name: /criar novo cofre/i }).click();

    await expect(page.getByRole('button', { name: /criar meu cofre/i })).toBeVisible();
  });

  test('os termos de uso estão publicados', async ({ page }) => {
    await page.goto('/termos-de-uso');

    await expect(page.getByRole('heading', { name: /termos de uso do vyroh/i })).toBeVisible();
  });

  test('a política de privacidade está publicada', async ({ page }) => {
    await page.goto('/politica-de-privacidade');

    await expect(page.getByRole('heading', { name: /política de privacidade do vyroh/i })).toBeVisible();
  });
});
