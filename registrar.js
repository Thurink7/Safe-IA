document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('case-form');
  const fileInput = document.getElementById('evidence');
  const reportId = document.getElementById('report-id');
  const reportDate = document.getElementById('report-date');
  const reportHash = document.getElementById('report-hash');
  const reportFile = document.getElementById('report-file');
  const reportCard = document.getElementById('report-card');
  const reportActions = document.getElementById('report-actions');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!fileInput.files || !fileInput.files[0]) {
      alert('Envie um arquivo de evidência.');
      return;
    }

    const file = fileInput.files[0];

    if (file.size > 10 * 1024 * 1024) {
      alert('O arquivo ultrapassa o limite de 10MB.');
      return;
    }

    const formData = new FormData(form);
    formData.append('evidence', file);

    reportId.textContent = 'Gerando...';
    reportDate.textContent = 'Gerando...';
    reportHash.textContent = 'Gerando...';
    reportFile.textContent = file.name;
    reportActions.classList.add('hidden');

    try {
      const res = await fetch(`${SafeIA.API_BASE}/cases`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          data?.errors?.map((e) => e.msg).join('\\n') ||
          data.error ||
          'Erro ao registrar o caso. Verifique os campos e tente novamente.';
        throw new Error(msg);
      }

      const { report } = data;

      reportCard.classList.remove('si-result-card-muted');
      reportId.textContent = report.caseId;
      reportDate.textContent = SafeIA.formatDate(report.createdAt);
      reportHash.textContent = report.hash;
      reportFile.textContent = report.fileName || file.name;
      reportActions.classList.remove('hidden');
    } catch (err) {
      alert(err.message || 'Erro inesperado ao registrar o caso.');
      reportId.textContent = '—';
      reportDate.textContent = '—';
      reportHash.textContent = '—';
      reportFile.textContent = '—';
    }
  });
});

