window.deferredPrompt = null;

document.addEventListener('DOMContentLoaded', () => {
  const installBtn = document.getElementById('installBtn');
  if (!installBtn) return;

  // Masquer le bouton par défaut
  installBtn.style.display = 'none';

  // Vérifie si l'application est déjà installée
  if (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  ) {
    console.log("✅ Déjà installé");
    installBtn.style.display = 'none';
    return;
  }

  // Gérer l'événement beforeinstallprompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredPrompt = e;

    // Affiche le bouton d'installation
    installBtn.style.display = 'block';

    installBtn.addEventListener('click', () => {
      if (window.deferredPrompt) {
        window.deferredPrompt.prompt();

        window.deferredPrompt.userChoice.then((choiceResult) => {
          console.log("Résultat:", choiceResult.outcome);
          window.deferredPrompt = null;
        });
      } else {
        // Fallback si prompt déjà utilisé ou indisponible
        alert("ℹ️ Utilisez le menu du navigateur pour ajouter à l'écran d'accueil.");
      }
    });
  });

  // Cacher le bouton si l'app est installée pendant la session
  window.addEventListener('appinstalled', () => {
    console.log("📲 App installée avec succès");
    installBtn.style.display = 'none';
  });
});
