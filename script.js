function scrollToSection(sectionId) {
  const allSections = document.querySelectorAll('.section-container');
  const allTitles = document.querySelectorAll('h2');

  allSections.forEach(section => {
    section.style.display = 'none'; // cacher toutes les sections
  });
  allTitles.forEach(title => {
    title.style.display = 'none'; // cacher tous les titres
  });

  const targetSection = document.getElementById(sectionId);
  const targetContainer = targetSection ? targetSection.nextElementSibling : null;

  if (targetSection && targetContainer) {
    targetSection.style.display = 'block';
    targetContainer.style.display = 'block';

    // Scroll vers la section (en tenant compte de l'en-tête fixe)
    const headerHeight = document.querySelector('.fixed-header')?.offsetHeight || 0;
    const sectionPosition = targetSection.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = sectionPosition - headerHeight - 10;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    // Mettre à jour les boutons actifs
    document.querySelectorAll('.section-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`.section-btn[href="#${sectionId}"]`)?.classList.add('active');

    // Mettre à jour l'URL
    history.pushState(null, null, `#${sectionId}`);
  }
}

// Afficher la première section au chargement
document.addEventListener('DOMContentLoaded', () => {
  const firstTitle = document.querySelector('h2');
  const firstContainer = firstTitle?.nextElementSibling;

  if (firstTitle && firstContainer) {
    firstTitle.style.display = 'block';
    firstContainer.style.display = 'block';
  }
});
