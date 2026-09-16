(() => {
  const config = window.FW_SITE_CONFIG || {};
  const download = document.getElementById('dl-executor');
  if (config.executorUrl) download.href = config.executorUrl;
  document.getElementById('site-version').textContent = config.version || '';
  const command = document.getElementById('install-command');
  if (config.installCommand) command.textContent = config.installCommand;
  if (/^[A-Za-z0-9_-]{11}$/.test(config.tutorialVideoId || '')) {
    document.getElementById('tutorial-frame').src = 'https://www.youtube-nocookie.com/embed/' + config.tutorialVideoId;
    document.getElementById('tutorial-link').href = 'https://youtu.be/' + config.tutorialVideoId;
  }
  const button = document.getElementById('copy-command');
  const status = document.getElementById('copy-status');
  let clearStatus;
  button.addEventListener('click', async () => {
    clearTimeout(clearStatus);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('clipboard-unavailable');
      await navigator.clipboard.writeText(command.textContent.trim());
      status.textContent = 'Comando copiado. Cole no PowerShell.';
      button.setAttribute('aria-label', 'Comando copiado');
    } catch {
      const range = document.createRange();
      range.selectNodeContents(command);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      command.focus();
      status.textContent = 'Comando selecionado. Copie para continuar.';
    }
    clearStatus = setTimeout(() => {
      status.textContent = '';
      button.setAttribute('aria-label', 'Copiar comando PowerShell');
    }, 5000);
  });
})();
