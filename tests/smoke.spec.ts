import { test, expect } from '@playwright/test'

test.describe('Landing page (/)', () => {
  test('should load and display the site title', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('From Adam to Jesus')
  })

  test('should display navigation cards including Bible TUI Reader', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('The Genealogy')).toBeVisible()
    await expect(page.getByText('The Disciples')).toBeVisible()
    await expect(page.getByText('Bible TUI Reader')).toBeVisible()
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

  test('should navigate to bible tui page via card click', async ({ page }) => {
    await page.goto('/')
    await page.getByText('Bible TUI Reader').click()
    await expect(page).toHaveURL('/bible')
  })
})

test.describe('Bible TUI page (/bible)', () => {
  test('should load production Bible TUI page', async ({ page }) => {
    await page.goto('/bible')
    await expect(page.getByText('BIBLE TUI')).toBeVisible()
    await expect(page.getByPlaceholder(/Type :read/)).toBeVisible()
  })

  test('should toggle verse bookmarking via b key and persist in localStorage', async ({ page }) => {
    await page.goto('/bible')
    // Click verse 16 to select it
    await page.getByText('For God so loved the world').click()
    // Press 'b' to bookmark selected verse
    await page.keyboard.press('b')
    // Console log output should report bookmark addition
    await expect(page.getByText('[BOOKMARK] Saved John 3:1')).toBeVisible()

    // Verify localStorage persistence under key bible_tui_bookmarks
    const saved = await page.evaluate(() => localStorage.getItem('bible_tui_bookmarks'))
    expect(saved).toBeTruthy()
    expect(saved).toContain('JOHN.3:1')

    // Press 'b' again to un-bookmark
    await page.keyboard.press('b')
    await expect(page.getByText('[BOOKMARK] Removed John 3:1')).toBeVisible()
  })

  test('should list bookmarks and support shortcuts via :bookmarks command', async ({ page }) => {
    await page.goto('/bible')
    // Click bookmark button for John 3:16
    await page.getByLabel('Bookmark John 3:16').click()

    // Focus CLI prompt by pressing '/'
    await page.keyboard.press('/')
    const promptInput = page.getByPlaceholder(/Type :read/)
    await expect(promptInput).toBeFocused()
    await promptInput.fill(':bookmarks')
    await page.keyboard.press('Enter')

    // Console output buffer should display saved bookmarks
    await expect(page.getByText('=== SAVED BIBLE VERSE BOOKMARKS')).toBeVisible()
    await expect(page.getByText('[John 3:16]')).toBeVisible()
  })
})

test.describe('Lineage page (/lineage)', () => {
  test('should load the genealogy tree', async ({ page }) => {
    await page.goto('/lineage')
    await expect(page.locator('h1')).toHaveCount(0)
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
    const pages = ['/', '/lineage', '/disciples/martyrdom', '/bible']
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
    const firstCard = cards.nth(0)
    const secondCard = cards.nth(1)
    const firstBox = await firstCard.boundingBox()
    const secondBox = await secondCard.boundingBox()
    if (firstBox && secondBox) {
      expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height)
    }
  })
})
