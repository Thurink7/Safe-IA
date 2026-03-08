document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('deepfake-form');
  const fileInput = document.getElementById('evidence');
  const resultCard = document.getElementById('analysis-result');
  const resultFile = document.getElementById('result-file');
  const resultHash = document.getElementById('result-hash');
  const resultLabel = document.getElementById('result-label');
  const resultStatus = document.querySelector('.si-result-status');
  const nextStepsContainer = document.getElementById('result-next-steps');
  const nextStepsList = document.getElementById('result-next-steps-list');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!fileInput.files || !fileInput.files[0]) {
      alert('Selecione um arquivo para análise.');
      return;
    }

    const file = fileInput.files[0];

    if (file.size > 10 * 1024 * 1024) {
      alert('O arquivo ultrapassa o limite de 10MB.');
      return;
    }

    const formData = new FormData();
    formData.append('evidence', file);

    resultCard.classList.remove('si-result-card-muted');
    resultFile.textContent = 'Analisando...';
    resultHash.textContent = '...';
    resultLabel.textContent = '...';
    SafeIA.setStatusBadge(resultStatus, null);
    nextStepsContainer.classList.add('hidden');
    nextStepsList.innerHTML = '';

    try {
      const res = await fetch(`${SafeIA.API_BASE}/deepfake-check`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Erro ao analisar o arquivo.');
      }

      const data = await res.json();
      const { analysis, hash, file: fileInfo } = data;

      resultFile.textContent = fileInfo?.name || file.name;
      resultHash.textContent = hash;
      resultLabel.textContent = analysis?.label || 'Análise simulada concluída.';
      SafeIA.setStatusBadge(resultStatus, analysis?.level);

      nextStepsContainer.classList.remove('hidden');
      nextStepsList.innerHTML = '';

      if (analysis?.level === 'low') {
        nextStepsList.innerHTML = `
          <li>Mesmo com baixa suspeita, mantenha o arquivo em local seguro.</li>
          <li>Se o conteúdo estiver sendo usado para ataques, considere registrar um caso.</li>
        `;
      } else if (analysis?.level === 'medium') {
        nextStepsList.innerHTML = `
          <li>Evite compartilhar o conteúdo publicamente.</li>
          <li>Registre o caso para documentar a ameaça e o contexto.</li>
          <li>Busque apoio de pessoas e serviços de confiança.</li>
        `;
      } else if (analysis?.level === 'high') {
        nextStepsList.innerHTML = `
          <li>Considere registrar um boletim de ocorrência, se for seguro.</li>
          <li>Registre o caso para gerar um relatório com hash e data.</li>
          <li>Evite negociar com a pessoa que ameaça você; procure apoio.</li>
        `;
      } else {
        nextStepsList.innerHTML = `
          <li>Use este resultado como ponto de partida, não como verdade absoluta.</li>
        `;
      }
    } catch (err) {
      alert(err.message || 'Erro inesperado durante a análise.');
    }
  });
});

