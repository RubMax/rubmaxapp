document.addEventListener('DOMContentLoaded', () => {
  loadData(); // ou google.script.run.getData(renderSections);
});

function renderSections(data) {
  const container = document.getElementById('main-content');
  const nav = document.getElementById('section-nav');
  container.innerHTML = '';
  nav.innerHTML = '';

  const sectionsMap = new Map(); // Regroupe les services par section

  // Grouper les données par section
  data.forEach(item => {
    const section = item.type || 'Autres'; // item.TYPES/PAGE
    if (!sectionsMap.has(section)) {
      sectionsMap.set(section, []);
    }
    sectionsMap.get(section).push(item);
  });

  // Pour chaque section, créer les éléments
  sectionsMap.forEach((items, sectionName, index) => {
    const sectionId = generateSectionId(sectionName);

    // ----- Bouton dans le menu latéral -----
    const btn = document.createElement('a');
    btn.href = `#${sectionId}`;
    btn.textContent = sectionName;
    btn.className = 'section-btn';
    btn.addEventListener('click', e => {
      e.preventDefault();
      scrollToSection(sectionId);
    });
    nav.appendChild(btn);

    // ----- Titre de la section -----
    const h2 = document.createElement('h2');
    h2.textContent = sectionName;
    h2.id = sectionId;
    h2.style.display = 'none'; // masqué initialement
    container.appendChild(h2);

    // ----- Conteneur des cartes -----
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'section-container';
    sectionDiv.style.display = 'none'; // masqué initialement

    // ----- Création des cartes de service -----
    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'product-card';

      const img = document.createElement('img');
      img.src = item.img;
      img.alt = item.nom || 'Image service';

      const name = document.createElement('h3');
      name.textContent = item.nom;

      const desc = document.createElement('p');
      desc.textContent = item.description;

      const price = document.createElement('p');
      price.textContent = item.prix;
      price.className = 'price';

      card.appendChild(img);
      card.appendChild(name);
      card.appendChild(desc);
      card.appendChild(price);
      sectionDiv.appendChild(card);
    });

    container.appendChild(sectionDiv);
  });

  // ✅ Affiche la première section uniquement
  initializeSectionDisplay();
}

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

function initializeSectionDisplay() {
  const firstTitle = document.querySelector('h2');
  const firstContainer = firstTitle?.nextElementSibling;

  if (firstTitle && firstContainer) {
    firstTitle.style.display = 'block';
    firstContainer.style.display = 'block';
  }
}
