document.addEventListener('DOMContentLoaded', async () => {
  const targetLangOption = document.getElementById('targetLang');
  const sourceLangOption = document.getElementById('sourceLang');
  const exportBtn = document.getElementById('exportBtn');

  // Storage helpers: prefer chrome.storage.sync -> chrome.storage.local -> localStorage
  async function storageGet(keys) {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        if (chrome.storage.sync && chrome.storage.sync.get) return await chrome.storage.sync.get(keys);
        if (chrome.storage.local && chrome.storage.local.get) return await chrome.storage.local.get(keys);
      }
    } catch (e) {
      // fallthrough to localStorage
    }
    const ks = Array.isArray(keys) ? keys : [keys];
    const res = {};
    ks.forEach(k => {
      try { res[k] = JSON.parse(localStorage.getItem(k)); } catch (e) { res[k] = localStorage.getItem(k); }
    });
    return res;
  }

  async function storageSet(obj) {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        if (chrome.storage.sync && chrome.storage.sync.set) return await chrome.storage.sync.set(obj);
        if (chrome.storage.local && chrome.storage.local.set) return await chrome.storage.local.set(obj);
      }
    } catch (e) {
      // fallthrough
    }
    Object.keys(obj).forEach(k => {
      try { localStorage.setItem(k, JSON.stringify(obj[k])); } catch (e) { localStorage.setItem(k, String(obj[k])); }
    });
  }

  // Load current target & source languages
  const tRes = await storageGet('targetLang');
  const targetLang = tRes?.targetLang || 'en';
  targetLangOption.value = targetLang;

  const sRes = await storageGet('sourceLang');
  const sourceLang = sRes?.sourceLang || 'autodetect';
  sourceLangOption.value = sourceLang;

  targetLangOption.addEventListener('change', () => storageSet({ targetLang: targetLangOption.value }));
  sourceLangOption.addEventListener('change', () => storageSet({ sourceLang: sourceLangOption.value }));

  exportBtn.addEventListener('click', async () => {
    const { bookmarks = [] } = await storageGet('bookmarks');
    if (bookmarks.length === 0) {
      alert('No bookmarks to export yet!');
      return;
    }

    let csv = 'Word,Translation,Source Lang,Date\n';
    bookmarks.forEach(b => { csv += `"${b.w}","${b.t}","${b.sl}","${b.d}"\n`; });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    window.open(url);
  });
});