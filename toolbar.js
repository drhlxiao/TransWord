document.addEventListener('DOMContentLoaded', async () => {
  const targetLangOption = document.getElementById('targetLang');
  const sourceLangOption = document.getElementById('sourceLang');
  const exportBtn = document.getElementById('exportBtn');

  // Load current target language
  const { targetLang = 'en' } = await chrome.storage.local.get('targetLang');
  targetLangOption.value = targetLang;

  // Load current source language
  const { sourceLang = 'autodetect' } = await chrome.storage.local.get('sourceLang');
  sourceLangOption.value = sourceLang;

  targetLangOption.addEventListener('change', () => {
    chrome.storage.local.set({ targetLang: targetLangOption.value });
  });

  sourceLangOption.addEventListener('change', () => {
    chrome.storage.local.set({ sourceLang: sourceLangOption.value });
  });

  exportBtn.addEventListener('click', async () => {
    const { bookmarks = [] } = await chrome.storage.local.get('bookmarks');
    if (bookmarks.length === 0) {
      alert('No bookmarks to export yet!');
      return;
    }

    let csv = 'Word,Translation,Source Lang,Date\n';
    bookmarks.forEach(b => {
      csv += `"${b.w}","${b.t}","${b.sl}","${b.d}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    window.open(url);
  });
});