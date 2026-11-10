/**
 * Adsflux contact form → Google Sheet.
 *
 * Setup (once):
 *   1. Create a Google Sheet, then Extensions → Apps Script. Replace Code.gs with this file and save.
 *   2. Optional: set NOTIFY_EMAIL below to get an email for every new lead.
 *   3. Deploy → New deployment → type "Web app".
 *        Execute as: Me   ·   Who has access: Anyone
 *      Authorise when asked, then copy the Web app URL (ends in /exec).
 *   4. In Vercel → Project → Settings → Environment Variables, set
 *        VITE_CONTACT_ENDPOINT = <the /exec URL>
 *      and redeploy (Vite bakes env vars in at build time). For local dev, put it in .env.local.
 *
 * After editing this script: Deploy → Manage deployments → edit (pencil) → Version: New version.
 * That keeps the same /exec URL. "New deployment" would give you a new URL.
 */

const SHEET_NAME = 'Leads'
const NOTIFY_EMAIL = '' // e.g. 'hello@adsflux.in'; leave empty for no email

const COLUMNS = [
  { key: 'submittedAt', header: 'Submitted at' },
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Work email' },
  { key: 'company', header: 'Company' },
  { key: 'service', header: 'Service' },
  { key: 'budget', header: 'Monthly budget' },
  { key: 'message', header: 'Message' },
  { key: 'page', header: 'Page' },
]

const MAX_FIELD_LENGTH = 5000
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function doPost(e) {
  const lock = LockService.getScriptLock()
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}')

    const lead = { submittedAt: new Date() }
    COLUMNS.forEach(function (column) {
      if (column.key !== 'submittedAt') lead[column.key] = clean(data[column.key])
    })

    if (!lead.name || !EMAIL_PATTERN.test(lead.email) || !lead.message) {
      return reply({ ok: false, error: 'Missing name, email or message.' })
    }

    lock.waitLock(10000) // serialise writes so simultaneous leads never overwrite each other
    const sheet = getSheet()
    sheet.appendRow(COLUMNS.map(function (column) { return lead[column.key] }))
    lock.releaseLock()

    if (NOTIFY_EMAIL) notify(lead)
    return reply({ ok: true })
  } catch (error) {
    console.error(error)
    return reply({ ok: false, error: 'Could not save the lead.' })
  }
}

/** Lets you open the /exec URL in a browser to check the deployment is live. */
function doGet() {
  return reply({ ok: true, status: 'Adsflux leads endpoint is running.' })
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = spreadsheet.getSheetByName(SHEET_NAME)
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME)

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS.map(function (column) { return column.header }))
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold')
    sheet.setFrozenRows(1)
    sheet.getRange('A:A').setNumberFormat('dd mmm yyyy, hh:mm')
  }
  return sheet
}

/** Trims, caps length, and stops spreadsheet formula injection (values starting with = + - @). */
function clean(value) {
  let text = String(value == null ? '' : value).trim().slice(0, MAX_FIELD_LENGTH)
  if (/^[=+\-@]/.test(text)) text = "'" + text
  return text
}

function notify(lead) {
  const body = COLUMNS.map(function (column) {
    return column.header + ': ' + (lead[column.key] || '—')
  }).join('\n')

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    replyTo: lead.email,
    subject: 'New Adsflux lead: ' + lead.name + (lead.company ? ' (' + lead.company + ')' : ''),
    body: body,
  })
}

function reply(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON)
}
