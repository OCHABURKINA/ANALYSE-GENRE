'use strict';

const DATA_URL = '../data/documents.json';
const grid = document.getElementById('documents-grid');
const status = document.getElementById('documents-status');
const count = document.getElementById('documents-count');

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function loadDocuments() {
  const response = await fetch(`${DATA_URL}?v=${Date.now()}`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`Impossible de charger la bibliothèque — HTTP ${response.status}`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('documents.json doit contenir un tableau.');
  }

  return data;
}

function render(documents) {
  count.textContent = documents.length;
  status.textContent = `${documents.length} document(s) disponible(s).`;

  grid.innerHTML = documents.map((document) => `
    <article class="document-card">
      <div class="document-card-top">
        <span class="document-format">${esc(document.format || 'Document')}</span>
        <span class="document-category">${esc(document.category || '')}</span>
      </div>

      <div class="document-icon" aria-hidden="true">PDF</div>

      <div class="document-card-content">
        <p class="document-date">${esc(document.date || '')}</p>
        <h3>${esc(document.title)}</h3>
        <p class="document-subtitle">${esc(document.subtitle || '')}</p>
        <p class="document-description">${esc(document.description || '')}</p>

        <div class="document-meta">
          <span>${esc(document.format || '')}</span>
          <span>${esc(document.pages || '')} pages</span>
        </div>
      </div>

      <div class="document-actions">
        <a
          class="document-button document-button-primary"
          href="${esc(document.file)}"
          target="_blank"
          rel="noopener"
        >
          Consulter
        </a>

        <a
          class="document-button document-button-secondary"
          href="${esc(document.file)}"
          download
        >
          Télécharger
        </a>
      </div>
    </article>
  `).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    render(await loadDocuments());
  } catch (error) {
    console.error('[Documents]', error);
    status.textContent = error.message;
    status.dataset.status = 'error';
    grid.innerHTML = `
      <div class="documents-error">
        <h2>Bibliothèque indisponible</h2>
        <p>${esc(error.message)}</p>
      </div>
    `;
  }
});
