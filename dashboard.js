document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('cases-tbody');
  const refreshBtn = document.getElementById('refresh-btn');

  async function loadCases() {
    if (!tbody) return;
    tbody.innerHTML = `
      <tr>
        <td colspan="5">Carregando casos...</td>
      </tr>
    `;

    try {
      const res = await fetch(`${SafeIA.API_BASE}/cases`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao carregar casos.');
      }

      const cases = data.cases || [];

      if (!cases.length) {
        tbody.innerHTML = `
          <tr>
            <td colspan="5">Nenhum caso registrado até o momento.</td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = '';
      for (const c of cases) {
        const tr = document.createElement('tr');
        const mime = c.file_mime_type || '';
        let tipo = 'Outro';
        if (mime.startsWith('image/')) tipo = 'Imagem';
        else if (mime.startsWith('video/')) tipo = 'Vídeo';
        else if (mime === 'application/pdf') tipo = 'PDF';

        tr.innerHTML = `
          <td>${c.id}</td>
          <td>${SafeIA.formatDate(c.created_at)}</td>
          <td>${tipo}</td>
          <td>${c.file_original_name || '—'}</td>
          <td>${c.source || '—'}</td>
        `;
        tbody.appendChild(tr);
      }
    } catch (err) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5">${err.message || 'Erro ao carregar casos.'}</td>
        </tr>
      `;
    }
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      loadCases();
    });
  }

  loadCases();
});

