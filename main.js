const SafeIA = (() => {
  const API_BASE = '/api';

  function formatDate(isoString) {
    if (!isoString) return '—';
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return isoString;
    return date.toLocaleString('pt-BR');
  }

  function setStatusBadge(container, level) {
    if (!container) return;
    let badgeClass = 'si-badge-neutral';
    let label = 'Aguardando análise';

    if (level === 'low') {
      badgeClass = 'si-badge-safe';
      label = 'Seguro (simulado)';
    } else if (level === 'medium') {
      badgeClass = 'si-badge-warning';
      label = 'Suspeito (simulado)';
    } else if (level === 'high') {
      badgeClass = 'si-badge-risk';
      label = 'Possível manipulação (simulado)';
    }

    container.innerHTML = '';
    const span = document.createElement('span');
    span.className = `si-badge ${badgeClass}`;
    span.textContent = label;
    container.appendChild(span);
  }

  return {
    API_BASE,
    formatDate,
    setStatusBadge
  };
})();
document.addEventListener("DOMContentLoaded", () => {

  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav-links");

  if(toggle && nav){
    toggle.addEventListener("click", () => {
      nav.classList.toggle("active");
    });
  }

});
