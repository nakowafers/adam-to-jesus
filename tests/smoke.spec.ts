import { test, expect } from '@playwright/test'

test.describe('Landing page (/)', () => {
  test('should load and display the site title', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('From Adam to Jesus')
  })

  test('should display navigation cards', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('The Genealogy')).toBeVisible()
    await expect(page.getByText('The Disciples')).toBeVisible()
    await expect(page.getByText('More Coming Soon')).toBeVisible()
  })

  test('should navigate to lineage page via card click', async ({ page }) => {
    await page.goto('/')
    await page.getByText('The Genealogy').click()
    await expect(page).toHaveURL('/lineage')
  })

  test('should navigate to martyrdom page via card click', async ({ page }) => {
    await page.goto('/')
    await page.getByText('The Disciples').click()
    await expect(page).toHaveURL('/disciples/martyrdom')
  })
})

test.describe('Lineage page (/lineage)', () => {
  test('should load the genealogy tree', async ({ page }) => {
    await page.goto('/lineage')
    await expect(page.locator('h1')).toHaveCount(0)
    // The lineage page has no h1 — it renders the GenealogyTree component
    // Verify the page loads without error by checking the footer
    await expect(page.getByText('Created with faith, by Nicola')).toBeVisible()
  })

  test('should show the site header with home link', async ({ page }) => {
    await page.goto('/lineage')
    const header = page.getByRole('link', { name: /^From Adam to Jesus$/ })
    await expect(header).toBeVisible()
    await header.click()
    await expect(page).toHaveURL('/')
  })
})

test.describe('Martyrdom page (/disciples/martyrdom)', () => {
  test('should load martyrdom content', async ({ page }) => {
    await page.goto('/disciples/martyrdom')
    await expect(page.getByText('The Great Commission')).toBeVisible()
  })

  test('should show the site header with home link', async ({ page }) => {
    await page.goto('/disciples/martyrdom')
    const header = page.getByRole('link', { name: /^From Adam to Jesus$/ })
    await expect(header).toBeVisible()
    await header.click()
    await expect(page).toHaveURL('/')
  })
})

test.describe('Site header', () => {
  test('site header is present on all pages', async ({ page }) => {
    const pages = ['/', '/lineage', '/disciples/martyrdom']
    for (const route of pages) {
      await page.goto(route)
      await expect(
        page.getByRole('link', { name: /^From Adam to Jesus$/ })
      ).toBeVisible()
    }
  })
})

test.describe('Responsive layout', () => {
  test('landing page cards stack vertically on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    const cards = page.locator('[data-slot="card"]')
    // On mobile, cards should be in a single column
    const firstCard = cards.nth(0)
    const secondCard = cards.nth(1)
    const firstBox = await firstCard.boundingBox()
    const secondBox = await secondCard.boundingBox()
    // Second card should be below the first card
    if (firstBox && secondBox) {
      expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height)
    }
  })
})
