# Chakkani Chitralu — Updated Website

## 1. You control every image
Replace these files with your own photographs:
- assets/uploads/home-hero.jpg
- assets/lippan/image-01.jpg to image-04.jpg
- assets/pichwai/image-01.jpg to image-04.jpg
- assets/kalpakosha/image-01.jpg to image-04.jpg
- assets/artist/artist.jpg
- assets/gallery/image-01.jpg to image-12.jpg

image-01 in each craft folder is the main featured photo (used on the
Home and Craft pages). image-02 to image-04 are the extra pieces shown
in the "More from each collection" side-scrolling strip on craft.html
and on the homepage's "Fresh From the Studio" strip.

You can add even more gallery images by editing `gallery.html` and
adding another `<div class="gallery-item">` block, or more strip items
by copying a `.side-card` block in `craft.html` / `index.html`.

## Logo
The studio logo lives at assets/logo/chakkani-chitralu-logo.png and is
used in the site header (with an animated glow ring) and as the
favicon (assets/logo/favicon-32.png, favicon-64.png, favicon-180.png).
Replace these files to change the logo everywhere at once.

## 2. Short Home + separate pages
- index.html — short Home
- craft.html — Art Types
- process.html — Process
- artist.html — Artist
- gallery.html — Gallery
- enquiry.html — Enquiry

## 3. Separate upload folders
The folders are already separated under `assets/`. On GitHub, upload your images into the matching folder.

## 4. Enquiry Art Types
The enquiry dropdown is limited to:
1. Lippan Mirror Cluster
2. Pichwai Art
3. Kalpakosha Art

## 5. Google Sheets connection
Create a Google Sheet with headers:
Timestamp | Name | Phone | Art Type | Details | Source

Then open Extensions → Apps Script and use:

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([new Date(), data.name || '', data.phone || '', data.artType || '', data.details || '', data.source || 'Website']);
  return ContentService.createTextOutput(JSON.stringify({ok:true}))
    .setMimeType(ContentService.MimeType.JSON);
}

Deploy → New deployment → Web app
- Execute as: Me
- Who has access: Anyone
Copy the Web App URL and paste it into `enquiry.html` where it says:
PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE

A GitHub Pages website cannot directly write to a local Excel file or Google Sheet; Google Apps Script is the bridge.
