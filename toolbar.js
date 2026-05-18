document.addEventListener('DOMContentLoaded', async () => {
  const select = document.getElementById('targetLang');
  const exportBtn = document.getElementById('exportBtn');

  // Load current target language
  const { targetLang = 'en' } = await chrome.storage.local.get('targetLang');
  select.value = targetLang;

  select.addEventListener('change', () => {
    chrome.storage.local.set({ targetLang: select.value });
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