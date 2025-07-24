document.addEventListener('DOMContentLoaded', () => {
  // Afficher la première section au démarrage
  const firstTitle = document.querySelector('h2');
  const firstContainer = firstTitle?.nextElementSibling;

  if (firstTitle && firstContainer) {
    firstTitle.style.display = 'block';
    firstContainer.style.display = 'block';
  }
});

function scrollToSection(sectionId) {
  const allSections = document.querySelectorAll('.section-container');
  const allTitles = document.querySelectorAll('h2');

  const firstTitle = allTitles[0];
  const firstContainer = firstTitle?.nextElementSibling;
  const firstSectionId = firstTitle?.id;

  if (sectionId === firstSectionId) {
    // Si on clique sur la première section, afficher tout
    allTitles.forEach(title => title.style.display = 'block');
    allSections.forEach(section => section.style.display = 'block');
  } else {
    allTitles.forEach((title, i) => {
      if (i === 0) {
        title.style.display = 'block'; // garder la première visible
      } else {
        title.style.display = (title.id === sectionId) ? 'block' : 'none';
      }
    });

    allSections.forEach((section, i) => {
      if (i === 0) {
        section.style.display = 'block'; // garder le premier contenu visible
      } else {
        const sectionTitle = allTitles[i];
        section.style.display = (sectionTitle?.id === sectionId) ? 'block' : 'none';
      }
    });
  }

  // Scroll vers la section cible
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    const headerHeight = document.querySelector('.fixed-header')?.offsetHeight || 0;
    const sectionPosition = targetSection.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = sectionPosition - headerHeight - 10;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  // Mise à jour des boutons
  document.querySelectorAll('.section-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`.section-btn[href="#${sectionId}"]`)?.classList.add('active');

  // Mise à jour de l’URL
  history.pushState(null, null, `#${sectionId}`);
}
